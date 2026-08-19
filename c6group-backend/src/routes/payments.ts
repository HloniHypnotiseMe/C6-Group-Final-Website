import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();

const SIMPLYBLU_API_URL = process.env.SIMPLYBLU_API_URL || '';
const SIMPLYBLU_PUBLIC_KEY = process.env.SIMPLYBLU_PUBLIC_KEY || '';
const SIMPLYBLU_PRIVATE_KEY = process.env.SIMPLYBLU_PRIVATE_KEY || '';

const simplyBluConfigured = Boolean(
  SIMPLYBLU_API_URL && SIMPLYBLU_PUBLIC_KEY && SIMPLYBLU_PRIVATE_KEY
);

/**
 * Get payment methods that are actually configured for this deployment.
 * Unsupported/demo methods must never be advertised as live payment options.
 */
router.get('/methods', authenticate, async (_req, res, next) => {
  try {
    const methods = simplyBluConfigured
      ? [
          {
            id: 'simplyblu',
            name: 'Card / SimplyBlu',
            description: 'Secure card payment through the configured SimplyBlu account.',
            icon: 'credit-card',
            enabled: true,
          },
        ]
      : [];

    res.json({
      success: true,
      data: methods,
      meta: {
        timestamp: new Date().toISOString(),
        paymentProviderConfigured: simplyBluConfigured,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a generic payment record.
 * Provider execution is intentionally limited to configured providers.
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { amount, currency = 'ZAR', paymentMethod, description, metadata } = req.body;

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !paymentMethod) {
      throw createError('A positive amount and payment method are required', 400, 'MISSING_FIELDS');
    }

    if (paymentMethod !== 'simplyblu') {
      throw createError('Payment method is not enabled for this deployment', 400, 'PAYMENT_METHOD_DISABLED');
    }

    if (!simplyBluConfigured) {
      throw createError('Payment provider is not configured', 503, 'PAYMENT_PROVIDER_NOT_CONFIGURED');
    }

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: metadata?.subscriptionId || 'pending',
        amount: Number(amount),
        currency,
        status: 'PENDING',
        paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      },
    });

    logger.info(`Payment created: ${payment.id} for user: ${req.user!.userId}`);

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        transactionId: payment.transactionId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/status', authenticate, async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });

    if (!payment) {
      throw createError('Payment not found', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticate, async (req, res, next) => {
  try {
    const pageNum = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10));
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || '20'), 10)));
    const skip = (pageNum - 1) * limitNum;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user!.userId },
      select: { id: true },
    });
    const subscriptionIds = subscriptions.map((s) => s.id);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { subscriptionId: { in: subscriptionIds } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.payment.count({ where: { subscriptionId: { in: subscriptionIds } } }),
    ]);

    res.json({
      success: true,
      data: payments,
      meta: { page: pageNum, limit: limitNum, total, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Initialize a real SimplyBlu payment.
 * Never returns a simulated checkout URL.
 */
router.post('/simplyblu/initiate', authenticate, async (req, res, next) => {
  try {
    const { amount, currency = 'ZAR', description, packageId, metadata } = req.body;

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !description || !packageId) {
      throw createError('Amount, description, and packageId are required', 400, 'MISSING_FIELDS');
    }

    if (!simplyBluConfigured) {
      throw createError(
        'SimplyBlu is not configured for this deployment. No payment has been created.',
        503,
        'PAYMENT_PROVIDER_NOT_CONFIGURED'
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        packageType: packageId,
        status: 'PENDING',
        billingCycle: metadata?.billingCycle || 'monthly',
        amount: Number(amount),
        currency,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: Number(amount),
        currency,
        status: 'PENDING',
        paymentMethod: 'simplyblu',
        transactionId: `sb_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      },
    });

    try {
      const apiResponse = await axios.post(
        `${SIMPLYBLU_API_URL.replace(/\/$/, '')}/payment`,
        {
          amount: amountInCents,
          currency,
          description,
          reference: payment.transactionId,
          redirectUrl: `${process.env.FRONTEND_URL || ''}/payment/success?paymentId=${payment.id}`,
        },
        {
          auth: {
            username: SIMPLYBLU_PUBLIC_KEY,
            password: SIMPLYBLU_PRIVATE_KEY,
          },
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      );

      const checkoutUrl =
        apiResponse.data?.redirectUrl ||
        apiResponse.data?.paymentUrl ||
        apiResponse.data?.url;

      if (typeof checkoutUrl !== 'string' || !checkoutUrl.startsWith('https://')) {
        logger.error(`SimplyBlu returned no valid checkout URL for payment ${payment.id}`);
        throw createError('Payment provider returned no valid checkout URL', 502, 'INVALID_PROVIDER_RESPONSE');
      }

      logger.info(`SimplyBlu payment initiated: ${payment.id}`);

      res.json({
        success: true,
        data: {
          paymentId: payment.id,
          transactionId: payment.transactionId,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          checkoutUrl,
          provider: 'simplyblu',
        },
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (providerError: any) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'CANCELLED' },
      });

      logger.error('SimplyBlu payment initiation failed', providerError?.response?.data || providerError?.message);

      if (providerError?.statusCode) {
        throw providerError;
      }

      throw createError('Payment provider could not initialize the payment', 502, 'PAYMENT_PROVIDER_ERROR');
    }
  } catch (error) {
    next(error);
  }
});

export { router as paymentRouter };
