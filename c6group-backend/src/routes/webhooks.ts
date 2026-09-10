import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

const router = Router();

const verifyPayFastSignature = (payload: any, signature: string): boolean => {
  const passphrase = process.env.PAYFAST_PASSPHRASE || '';
  const dataString = Object.keys(payload).sort().map(key => `${key}=${encodeURIComponent(payload[key]).replace(/%20/g, '+')}`).join('&');
  const hash = crypto.createHash('md5').update(dataString + passphrase).digest('hex');
  return hash === signature;
};

router.post('/payfast', async (req, res, next) => {
  try {
    const signature = req.headers['signature'] as string;
    const payload = req.body;
    if (!verifyPayFastSignature(payload, signature)) throw createError('Invalid signature', 401, 'INVALID_SIGNATURE');
    await prisma.webhookEvent.create({ data: { eventType: `payfast.${payload.payment_status}`, payload } });
    if (payload.payment_status === 'COMPLETE') {
      const subscription = await prisma.subscription.findFirst({ where: { userId: payload.merchant_reference, status: 'PENDING' } });
      if (subscription) {
        await prisma.subscription.update({ where: { id: subscription.id }, data: { status: 'ACTIVE', nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
        await prisma.payment.create({ data: { subscriptionId: subscription.id, amount: parseFloat(payload.amount_gross), currency: 'ZAR', status: 'COMPLETED', paymentMethod: 'payfast', transactionId: payload.pf_payment_id, paidAt: new Date() } });
        logger.info(`Payment completed for subscription: ${subscription.id}`);
      }
    }
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.post('/remotepay', async (req, res, next) => {
  try {
    const payload = req.body;
    const eventId = String(req.headers['x-remotepay-event-id'] || payload.event_id || '').trim();
    if (!eventId) throw createError('RemotePay event ID is required', 400, 'MISSING_EVENT_ID');

    logger.info(`RemotePay webhook received: ${JSON.stringify(payload)}`);
    const status = String(payload.status || '').toLowerCase();
    const transactionId = String(payload.transaction_id || payload.reference || '').trim();
    if (!transactionId) throw createError('RemotePay transaction ID is required', 400, 'MISSING_TRANSACTION_ID');

    const existingEvent = await prisma.webhookEvent.findFirst({ where: { eventType: `remotepay.event.${eventId}` } });
    if (existingEvent) return res.json({ success: true, duplicate: true });

    await prisma.webhookEvent.create({ data: { eventType: `remotepay.event.${eventId}`, payload } });

    const payment = await prisma.payment.findFirst({ where: { transactionId } });
    if (!payment) {
      logger.warn(`RemotePay webhook: payment not found for transaction ${transactionId}`);
      return res.status(202).json({ success: true, accepted: true, matched: false });
    }

    if (['paid', 'completed', 'success'].includes(status)) {
      if (payment.status !== 'COMPLETED') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'COMPLETED', paidAt: new Date() } });
        await prisma.subscription.update({ where: { id: payment.subscriptionId }, data: { status: 'ACTIVE', nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
      }
      logger.info(`RemotePay payment completed: ${payment.id}`);
    } else if (['failed', 'cancelled', 'expired'].includes(status)) {
      if (payment.status === 'PENDING') await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
      logger.warn(`RemotePay payment failed/cancelled: ${payment.id}`);
    }

    res.json({ success: true, matched: true, paymentId: payment.id, status });
  } catch (error) { next(error); }
});

router.post('/simplyblu', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.info(`SimplyBlu webhook received: ${JSON.stringify(payload)}`);
    await prisma.webhookEvent.create({ data: { eventType: `simplyblu.${payload.status || 'unknown'}`, payload } });
    const status = payload.status?.toLowerCase() || payload.paymentStatus?.toLowerCase() || '';
    const references = [payload.reference, payload.id, payload.transactionId, payload.transaction_id].filter(Boolean).map(String);
    if (['approved', 'completed', 'success'].includes(status)) {
      const payment = await prisma.payment.findFirst({ where: { transactionId: { in: references } } });
      if (payment) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'COMPLETED', paidAt: new Date() } });
        await prisma.subscription.update({ where: { id: payment.subscriptionId }, data: { status: 'ACTIVE', nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
        logger.info(`SimplyBlu payment completed: ${payment.id}`);
      }
    } else if (['declined', 'failed'].includes(status)) {
      const payment = await prisma.payment.findFirst({ where: { transactionId: { in: references } } });
      if (payment && payment.status === 'PENDING') await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
    }
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.post('/stripe', async (req, res, next) => {
  try {
    const payload = req.body;
    await prisma.webhookEvent.create({ data: { eventType: payload.type, payload } });
    switch (payload.type) {
      case 'invoice.payment_succeeded': logger.info(`Stripe payment succeeded: ${payload.data.object.id}`); break;
      case 'invoice.payment_failed': logger.warn(`Stripe payment failed: ${payload.data.object.id}`); break;
      case 'customer.subscription.deleted': logger.info(`Subscription cancelled: ${payload.data.object.id}`); break;
    }
    res.json({ received: true });
  } catch (error) { next(error); }
});

router.post('/:provider', async (req, res, next) => {
  try {
    const { provider } = req.params;
    await prisma.webhookEvent.create({ data: { eventType: `${provider}.unknown`, payload: req.body } });
    logger.info(`Received webhook from ${provider}`);
    res.json({ success: true });
  } catch (error) { next(error); }
});

export { router as webhookRouter };
