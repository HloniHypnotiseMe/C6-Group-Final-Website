import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();

const REMOTEPAY_API_URL = (process.env.REMOTEPAY_API_URL || 'https://api.remotepay.co.za/v1').replace(/\/$/, '');
const REMOTEPAY_API_KEY = process.env.REMOTEPAY_API_KEY || '';
const REMOTEPAY_MERCHANT_ID = process.env.REMOTEPAY_MERCHANT_ID || '';
const REMOTEPAY_BRAND_ID = process.env.REMOTEPAY_BRAND_ID || 'c6-group';

interface RemotePayPaymentLink {
  payment_id: string;
  transaction_id: string;
  status: string;
  payment_url: string;
  currency: string;
  amount_minor: number;
  merchant_id: string;
  brand_id: string;
}

function requireRemotePayConfiguration() {
  if (!REMOTEPAY_API_KEY || !REMOTEPAY_MERCHANT_ID) {
    throw createError('RemotePay payment service is not configured. Please contact support.', 503, 'REMOTEPAY_NOT_CONFIGURED');
  }
}

async function createRemotePayPaymentLink(params: {
  amountMinor: number;
  currency: string;
  description: string;
  packageId?: string;
  userId: string;
  paymentId: string;
  billingCycle?: string;
}) {
  requireRemotePayConfiguration();
  const response = await axios.post<RemotePayPaymentLink>(
    `${REMOTEPAY_API_URL}/payment-links`,
    {
      merchant_id: REMOTEPAY_MERCHANT_ID,
      brand_id: REMOTEPAY_BRAND_ID,
      source_system: 'c6-group-website',
      customer_reference: params.userId,
      product_id: params.packageId,
      description: params.description,
      amount_minor: params.amountMinor,
      currency: params.currency,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?paymentId=${params.paymentId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/packages`,
      idempotency_key: `c6-payment-${params.paymentId}`,
      metadata: {
        payment_id: params.paymentId,
        user_id: params.userId,
        package_id: params.packageId || '',
        billing_cycle: params.billingCycle || '',
      },
    },
    { headers: { Authorization: `Bearer ${REMOTEPAY_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 15000 }
  );
  return response.data;
}

router.get('/methods', authenticate, async (_req, res, next) => {
  try {
    res.json({ success: true, data: [{ id: 'remote-pay', name: 'RemotePay', description: 'Secure payment checkout through RemotePay Fintech Services', icon: 'credit-card', enabled: true }], meta: { timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { amount, currency = 'ZAR', description, paymentMethod = 'remote-pay', metadata = {} } = req.body;
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !description) throw createError('A positive amount and description are required', 400, 'MISSING_FIELDS');

    const packageId = metadata.packageId || metadata.package_id;
    const subscriptionId = metadata.subscriptionId || metadata.subscription_id;
    let resolvedSubscriptionId = subscriptionId;

    if (!resolvedSubscriptionId && packageId) {
      const subscription = await prisma.subscription.create({ data: {
        userId: req.user!.userId,
        packageId,
        status: 'PENDING',
        billingCycle: metadata.billingCycle === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      } });
      resolvedSubscriptionId = subscription.id;
    }
    if (!resolvedSubscriptionId) throw createError('A subscription or packageId is required', 400, 'SUBSCRIPTION_REQUIRED');

    const payment = await prisma.payment.create({ data: {
      subscriptionId: resolvedSubscriptionId,
      amount: Number(amount),
      currency,
      status: 'PENDING',
      paymentMethod,
    } });

    try {
      const remotePay = await createRemotePayPaymentLink({ amountMinor: Math.round(Number(amount) * 100), currency, description, packageId, userId: req.user!.userId, paymentId: payment.id, billingCycle: metadata.billingCycle });
      await prisma.payment.update({ where: { id: payment.id }, data: { transactionId: remotePay.transaction_id } });
      res.status(201).json({ success: true, data: {
        paymentId: payment.id,
        transactionId: remotePay.transaction_id,
        status: remotePay.status,
        amount: payment.amount,
        currency: payment.currency,
        paymentUrl: remotePay.payment_url,
        checkoutUrl: remotePay.payment_url,
        provider: 'remotepay',
        merchantId: remotePay.merchant_id,
        brandId: remotePay.brand_id,
      }, meta: { timestamp: new Date().toISOString() } });
    } catch (remotePayError: any) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
      logger.error('RemotePay payment-link creation failed', remotePayError?.response?.data || remotePayError?.message);
      throw createError('RemotePay could not create the payment link. Please try again.', 502, 'REMOTEPAY_PAYMENT_LINK_FAILED');
    }
  } catch (error) { next(error); }
});

router.get('/:id/status', authenticate, async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!payment) throw createError('Payment not found', 404, 'NOT_FOUND');
    res.json({ success: true, data: { paymentId: payment.id, status: payment.status, amount: payment.amount, currency: payment.currency, paymentMethod: payment.paymentMethod, paidAt: payment.paidAt, createdAt: payment.createdAt }, meta: { timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

router.get('/history', authenticate, async (req, res, next) => {
  try {
    const pageNum = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
    const skip = (pageNum - 1) * limitNum;
    const subscriptions = await prisma.subscription.findMany({ where: { userId: req.user!.userId }, select: { id: true } });
    const subscriptionIds = subscriptions.map((s) => s.id);
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where: { subscriptionId: { in: subscriptionIds } }, orderBy: { createdAt: 'desc' }, skip, take: limitNum }),
      prisma.payment.count({ where: { subscriptionId: { in: subscriptionIds } } }),
    ]);
    res.json({ success: true, data: payments, meta: { page: pageNum, limit: limitNum, total, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

router.post('/simplyblu/initiate', authenticate, async (req, res, next) => {
  try {
    const { amount, currency = 'ZAR', description, packageId, metadata = {} } = req.body;
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !description || !packageId) throw createError('Amount, description, and packageId are required', 400, 'MISSING_FIELDS');
    const subscription = await prisma.subscription.create({ data: {
      userId: req.user!.userId,
      packageId,
      status: 'PENDING',
      billingCycle: metadata.billingCycle === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    } });
    const payment = await prisma.payment.create({ data: { subscriptionId: subscription.id, amount: Number(amount) / 100, currency, status: 'PENDING', paymentMethod: 'remotepay' } });
    try {
      const remotePay = await createRemotePayPaymentLink({ amountMinor: Number(amount), currency, description, packageId, userId: req.user!.userId, paymentId: payment.id, billingCycle: metadata.billingCycle });
      await prisma.payment.update({ where: { id: payment.id }, data: { transactionId: remotePay.transaction_id } });
      res.status(201).json({ success: true, data: { paymentId: payment.id, transactionId: remotePay.transaction_id, status: remotePay.status, amount: payment.amount, currency, checkoutUrl: remotePay.payment_url, paymentUrl: remotePay.payment_url, provider: 'remotepay' }, meta: { timestamp: new Date().toISOString() } });
    } catch (remotePayError: any) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
      logger.error('RemotePay legacy payment-link creation failed', remotePayError?.response?.data || remotePayError?.message);
      throw createError('RemotePay could not create the payment link. Please try again.', 502, 'REMOTEPAY_PAYMENT_LINK_FAILED');
    }
  } catch (error) { next(error); }
});

export { router as paymentRouter };
