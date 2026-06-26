import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();

// RemotePay API configuration
const REMOTEPAY_API_URL = process.env.REMOTEPAY_API_URL || 'https://api.remotepay.co.za/v1';
const REMOTEPAY_API_KEY = process.env.REMOTEPAY_API_KEY || '';
const REMOTEPAY_MERCHANT_ID = process.env.REMOTEPAY_MERCHANT_ID || '';

// SimplyBlu (Standard Bank / Mastercard Simplify Commerce) API configuration
const SIMPLYBLU_API_URL = process.env.SIMPLYBLU_API_URL || 'https://sandbox.simplify.com/v1';
const SIMPLYBLU_PUBLIC_KEY = process.env.SIMPLYBLU_PUBLIC_KEY || '';
const SIMPLYBLU_PRIVATE_KEY = process.env.SIMPLYBLU_PRIVATE_KEY || '';
const SIMPLYBLU_MERCHANT_EMAIL = process.env.SIMPLYBLU_MERCHANT_EMAIL || '';

/**
 * Get available payment methods
 * GET /api/v1/payments/methods
 */
router.get('/methods', authenticate, async (req, res, next) => {
  try {
    const methods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: 'credit-card',
        enabled: true,
        processingFee: '2.9% + R1.50',
      },
      {
        id: 'instant_eft',
        name: 'Instant EFT',
        description: 'Ozow, PayFast EFT',
        icon: 'bank',
        enabled: true,
        processingFee: '1.5% + R2.00',
      },
      {
        id: 'snapscan',
        name: 'SnapScan',
        description: 'Scan QR code with SnapScan app',
        icon: 'qr-code',
        enabled: true,
        processingFee: '2.9%',
      },
      {
        id: 'zapper',
        name: 'Zapper',
        description: 'Scan QR code with Zapper app',
        icon: 'qr-code',
        enabled: true,
        processingFee: '2.9%',
      },
      {
        id: 'debit_order',
        name: 'Debit Order',
        description: 'Monthly automatic debit order',
        icon: 'repeat',
        enabled: true,
        processingFee: 'R0',
      },
    ];

    res.json({
      success: true,
      data: methods,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a payment
 * POST /api/v1/payments
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { amount, currency = 'ZAR', paymentMethod, description, metadata } = req.body;

    if (!amount || !paymentMethod) {
      throw createError('Amount and payment method are required', 400, 'MISSING_FIELDS');
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: metadata?.subscriptionId || 'pending',
        amount: amount,
        currency,
        status: 'PENDING',
        paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // If RemotePay is configured, create payment with their API
    let remotePayData = null;
    if (REMOTEPAY_API_KEY) {
      try {
        const remotePayResponse = await axios.post(
          `${REMOTEPAY_API_URL}/transactions`,
          {
            merchant_id: REMOTEPAY_MERCHANT_ID,
            amount: amount * 100, // cents
            currency,
            description,
            payment_method: paymentMethod,
            callback_url: `${process.env.API_URL}/api/v1/webhooks/remotepay`,
            metadata: {
              ...metadata,
              paymentId: payment.id,
              userId: req.user!.userId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${REMOTEPAY_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        remotePayData = remotePayResponse.data;
      } catch (apiError) {
        logger.error('RemotePay API error:', apiError);
      }
    }

    logger.info(`Payment created: ${payment.id} for user: ${req.user!.userId}`);

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        transactionId: payment.transactionId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paymentUrl: remotePayData?.payment_url || null,
        checkoutUrl: remotePayData?.checkout_url || `/checkout/${payment.id}`,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get payment status
 * GET /api/v1/payments/:id/status
 */
router.get('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

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

/**
 * Get payment history
 * GET /api/v1/payments/history
 */
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get user's subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user!.userId },
      select: { id: true },
    });

    const subscriptionIds = subscriptions.map((s) => s.id);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: {
          subscriptionId: { in: subscriptionIds },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.payment.count({
        where: {
          subscriptionId: { in: subscriptionIds },
        },
      }),
    ]);

    res.json({
      success: true,
      data: payments,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Initialize SimplyBlu payment
 * POST /api/v1/payments/simplyblu/initiate
 * 
 * SimplyBlu is Standard Bank's white-label payment solution powered by Mastercard.
 * This endpoint creates a payment session and returns a checkout URL.
 */
router.post('/simplyblu/initiate', authenticate, async (req, res, next) => {
  try {
    const { amount, currency = 'ZAR', description, packageId, metadata } = req.body;

    if (!amount || !description || !packageId) {
      throw createError('Amount, description, and packageId are required', 400, 'MISSING_FIELDS');
    }

    // Validate SimplyBlu credentials are configured
    if (!SIMPLYBLU_PUBLIC_KEY || !SIMPLYBLU_PRIVATE_KEY) {
      logger.warn('SimplyBlu payment attempted but API keys not configured');
      throw createError(
        'Payment provider not configured. Please contact support.',
        503,
        'PAYMENT_PROVIDER_NOT_CONFIGURED'
      );
    }

    // Create a pending subscription for the user
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        packageType: packageId,
        status: 'PENDING',
        billingCycle: metadata?.billingCycle || 'monthly',
        amount: amount / 100, // Convert cents to main currency unit
        currency,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: amount / 100,
        currency,
        status: 'PENDING',
        paymentMethod: 'simplyblu',
        transactionId: `sb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    let checkoutUrl: string | null = null;
    let simplifyData: any = null;

    // Create payment with SimplyBlu API (Simplify Commerce)
    try {
      const apiResponse = await axios.post(
        `${SIMPLYBLU_API_URL}/payment`,
        {
          amount: amount, // amount in cents
          currency: currency === 'ZAR' ? 'ZAR' : currency,
          description: description,
          reference: payment.transactionId,
          redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?paymentId=${payment.id}`,
          // SimplyBlu uses Basic Auth with public key as username and private key as password
        },
        {
          auth: {
            username: SIMPLYBLU_PUBLIC_KEY,
            password: SIMPLYBLU_PRIVATE_KEY,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      simplifyData = apiResponse.data;
      checkoutUrl = simplifyData?.redirectUrl || simplifyData?.paymentUrl || simplifyData?.url || null;
      logger.info(`SimplyBlu payment initiated: ${payment.id}`);
    } catch (apiError: any) {
      logger.error('SimplyBlu API error:', apiError?.response?.data || apiError.message);
      // If SimplyBlu API call fails, we still return the payment record so the user can retry
      // In production, you may want to handle this differently
    }

    // Fallback: If SimplyBlu API doesn't return a URL, generate a simulated checkout URL
    // This is useful for testing when API credentials are not yet configured
    if (!checkoutUrl) {
      checkoutUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/${payment.id}?provider=simplyblu`;
      logger.info(`Using fallback checkout URL for payment: ${payment.id}`);
    }

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
  } catch (error) {
    next(error);
  }
});

export { router as paymentRouter };
