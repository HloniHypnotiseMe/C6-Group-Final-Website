"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../utils/prisma");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
exports.webhookRouter = router;
/**
 * Verify PayFast webhook signature
 */
const verifyPayFastSignature = (payload, signature) => {
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    const dataString = Object.keys(payload)
        .sort()
        .map(key => `${key}=${encodeURIComponent(payload[key]).replace(/%20/g, '+')}`)
        .join('&');
    const hash = crypto_1.default.createHash('md5').update(dataString + passphrase).digest('hex');
    return hash === signature;
};
/**
 * PayFast payment webhook
 * POST /api/v1/webhooks/payfast
 */
router.post('/payfast', async (req, res, next) => {
    try {
        const signature = req.headers['signature'];
        const payload = req.body;
        // Verify signature
        if (!verifyPayFastSignature(payload, signature)) {
            throw (0, errorHandler_1.createError)('Invalid signature', 401, 'INVALID_SIGNATURE');
        }
        // Store webhook event
        await prisma_1.prisma.webhookEvent.create({
            data: {
                eventType: `payfast.${payload.payment_status}`,
                payload: payload,
            },
        });
        // Process payment
        if (payload.payment_status === 'COMPLETE') {
            // Find subscription by merchant reference
            const subscription = await prisma_1.prisma.subscription.findFirst({
                where: {
                    userId: payload.merchant_reference,
                    status: 'PENDING',
                },
            });
            if (subscription) {
                // Update subscription to active
                await prisma_1.prisma.subscription.update({
                    where: { id: subscription.id },
                    data: {
                        status: 'ACTIVE',
                        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                });
                // Create payment record
                await prisma_1.prisma.payment.create({
                    data: {
                        subscriptionId: subscription.id,
                        amount: parseFloat(payload.amount_gross),
                        currency: 'ZAR',
                        status: 'COMPLETED',
                        paymentMethod: 'payfast',
                        transactionId: payload.pf_payment_id,
                        paidAt: new Date(),
                    },
                });
                logger_1.logger.info(`Payment completed for subscription: ${subscription.id}`);
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * RemotePay webhook
 * POST /api/v1/webhooks/remotepay
 */
router.post('/remotepay', async (req, res, next) => {
    try {
        const payload = req.body;
        logger_1.logger.info(`RemotePay webhook received: ${JSON.stringify(payload)}`);
        // Store webhook event
        await prisma_1.prisma.webhookEvent.create({
            data: {
                eventType: `remotepay.${payload.status || 'unknown'}`,
                payload: payload,
            },
        });
        // Handle payment status
        if (payload.status === 'completed' || payload.status === 'success') {
            // Find payment by transaction ID
            const payment = await prisma_1.prisma.payment.findFirst({
                where: { transactionId: payload.transaction_id || payload.reference },
            });
            if (payment) {
                // Update payment to completed
                await prisma_1.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'COMPLETED',
                        paidAt: new Date(),
                    },
                });
                // Activate subscription
                await prisma_1.prisma.subscription.update({
                    where: { id: payment.subscriptionId },
                    data: {
                        status: 'ACTIVE',
                        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                });
                logger_1.logger.info(`RemotePay payment completed: ${payment.id}`);
            }
        }
        else if (payload.status === 'failed') {
            const payment = await prisma_1.prisma.payment.findFirst({
                where: { transactionId: payload.transaction_id || payload.reference },
            });
            if (payment) {
                await prisma_1.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' },
                });
                logger_1.logger.warn(`RemotePay payment failed: ${payment.id}`);
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * SimplyBlu webhook
 * POST /api/v1/webhooks/simplyblu
 */
router.post('/simplyblu', async (req, res, next) => {
    try {
        const payload = req.body;
        logger_1.logger.info(`SimplyBlu webhook received: ${JSON.stringify(payload)}`);
        // Store webhook event
        await prisma_1.prisma.webhookEvent.create({
            data: {
                eventType: `simplyblu.${payload.status || 'unknown'}`,
                payload: payload,
            },
        });
        // Handle payment status
        // SimplyBlu (Simplify Commerce) typically sends: APPROVED, DECLINED, or PENDING
        const status = payload.status?.toLowerCase() || payload.paymentStatus?.toLowerCase() || '';
        if (status === 'approved' || status === 'completed' || status === 'success') {
            // Find payment by transaction ID or reference
            const payment = await prisma_1.prisma.payment.findFirst({
                where: {
                    OR: [
                        { transactionId: payload.reference || payload.id },
                        { transactionId: payload.transactionId || payload.transaction_id },
                    ],
                },
            });
            if (payment) {
                // Update payment to completed
                await prisma_1.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'COMPLETED',
                        paidAt: new Date(),
                    },
                });
                // Activate subscription
                await prisma_1.prisma.subscription.update({
                    where: { id: payment.subscriptionId },
                    data: {
                        status: 'ACTIVE',
                        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                });
                logger_1.logger.info(`SimplyBlu payment completed: ${payment.id}`);
            }
            else {
                logger_1.logger.warn(`SimplyBlu webhook: Payment not found for reference ${payload.reference}`);
            }
        }
        else if (status === 'declined' || status === 'failed') {
            const payment = await prisma_1.prisma.payment.findFirst({
                where: {
                    OR: [
                        { transactionId: payload.reference || payload.id },
                        { transactionId: payload.transactionId || payload.transaction_id },
                    ],
                },
            });
            if (payment) {
                await prisma_1.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' },
                });
                logger_1.logger.warn(`SimplyBlu payment failed: ${payment.id}`);
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Stripe webhook
 * POST /api/v1/webhooks/stripe
 */
router.post('/stripe', async (req, res, next) => {
    try {
        const sig = req.headers['stripe-signature'];
        const payload = req.body;
        // Store webhook event
        await prisma_1.prisma.webhookEvent.create({
            data: {
                eventType: payload.type,
                payload: payload,
            },
        });
        // Handle different event types
        switch (payload.type) {
            case 'invoice.payment_succeeded':
                // Handle successful payment
                logger_1.logger.info(`Stripe payment succeeded: ${payload.data.object.id}`);
                break;
            case 'invoice.payment_failed':
                // Handle failed payment
                logger_1.logger.warn(`Stripe payment failed: ${payload.data.object.id}`);
                break;
            case 'customer.subscription.deleted':
                // Handle subscription cancellation
                logger_1.logger.info(`Subscription cancelled: ${payload.data.object.id}`);
                break;
        }
        res.json({ received: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Generic webhook handler
 * POST /api/v1/webhooks/:provider
 */
router.post('/:provider', async (req, res, next) => {
    try {
        const { provider } = req.params;
        const payload = req.body;
        // Store webhook event for processing
        await prisma_1.prisma.webhookEvent.create({
            data: {
                eventType: `${provider}.unknown`,
                payload: payload,
            },
        });
        logger_1.logger.info(`Received webhook from ${provider}`);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=webhooks.js.map