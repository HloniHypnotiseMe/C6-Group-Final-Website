"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const axios_1 = __importDefault(require("axios"));
const commercialCatalog_1 = require("../config/commercialCatalog");
const commercialContract_1 = require("../../../shared/commercialContract");
const packages_1 = require("../config/packages");
const router = (0, express_1.Router)();
exports.paymentRouter = router;
const REMOTEPAY_API_URL = (process.env.REMOTEPAY_API_URL || 'https://api.remotepay.co.za/v1').replace(/\/$/, '');
const REMOTEPAY_API_KEY = process.env.REMOTEPAY_API_KEY || '';
const REMOTEPAY_MERCHANT_ID = process.env.REMOTEPAY_MERCHANT_ID || '';
const REMOTEPAY_BRAND_ID = process.env.REMOTEPAY_BRAND_ID || 'c6-group';
function requireRemotePayConfiguration() {
    if (!REMOTEPAY_API_KEY || !REMOTEPAY_MERCHANT_ID) {
        throw (0, errorHandler_1.createError)('RemotePay payment service is not configured. Please contact support.', 503, 'REMOTEPAY_NOT_CONFIGURED');
    }
}
function resolveCommercialCheckout(packageId, billingCycle) {
    const sku = (0, commercialContract_1.resolveCommercialSku)(packageId);
    const commercial = (0, commercialCatalog_1.getCommercialPackage)(sku);
    const packageType = sku.toLowerCase();
    const config = packages_1.packageConfigs[packageType];
    if (!config)
        throw (0, errorHandler_1.createError)('Invalid package', 400, 'INVALID_PACKAGE');
    if (!commercial.selfServe)
        throw (0, errorHandler_1.createError)('Enterprise packages require a custom quote. Please contact C6.', 400, 'CUSTOM_PACKAGE');
    const cycle = billingCycle.toUpperCase();
    if (cycle !== 'MONTHLY' && cycle !== 'ANNUAL')
        throw (0, errorHandler_1.createError)('Billing cycle must be MONTHLY or ANNUAL', 400, 'INVALID_BILLING_CYCLE');
    const expectedAmount = cycle === 'ANNUAL' ? commercial.annualPriceZar : commercial.monthlyPriceZar;
    if (expectedAmount === null)
        throw (0, errorHandler_1.createError)('Package pricing is unavailable for checkout', 400, 'PRICE_UNAVAILABLE');
    return { sku, packageType, config, commercial, billingCycle: cycle, expectedAmount };
}
async function createRemotePayPaymentLink(params) {
    requireRemotePayConfiguration();
    const response = await axios_1.default.post(`${REMOTEPAY_API_URL}/payment-links`, {
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
        metadata: { payment_id: params.paymentId, user_id: params.userId, package_id: params.packageId || '', billing_cycle: params.billingCycle || '' },
    }, { headers: { Authorization: `Bearer ${REMOTEPAY_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 15000 });
    return response.data;
}
router.get('/methods', auth_1.authenticate, async (_req, res, next) => {
    try {
        res.json({ success: true, data: [{ id: 'remote-pay', name: 'RemotePay', description: 'Secure payment checkout through RemotePay Fintech Services', icon: 'credit-card', enabled: true }], meta: { timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { currency = 'ZAR', description, paymentMethod = 'remote-pay', metadata = {} } = req.body;
        if (!description)
            throw (0, errorHandler_1.createError)('A description is required', 400, 'MISSING_FIELDS');
        const packageId = metadata.packageId || metadata.package_id;
        const subscriptionId = metadata.subscriptionId || metadata.subscription_id;
        const billingCycle = metadata.billingCycle === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
        if (!packageId && !subscriptionId)
            throw (0, errorHandler_1.createError)('A subscription or packageId is required', 400, 'SUBSCRIPTION_REQUIRED');
        let resolvedSubscriptionId = subscriptionId;
        let checkout = packageId ? resolveCommercialCheckout(String(packageId), billingCycle) : null;
        if (!resolvedSubscriptionId) {
            if (!checkout)
                throw (0, errorHandler_1.createError)('Package resolution failed', 400, 'INVALID_PACKAGE');
            const subscription = await prisma_1.prisma.subscription.create({ data: {
                    userId: req.user.userId,
                    packageId: checkout.packageType,
                    status: 'PENDING',
                    billingCycle: checkout.billingCycle,
                    nextBillingDate: new Date(Date.now() + (checkout.billingCycle === 'ANNUAL' ? 365 : 30) * 24 * 60 * 60 * 1000),
                } });
            resolvedSubscriptionId = subscription.id;
        }
        else {
            const subscription = await prisma_1.prisma.subscription.findFirst({ where: { id: resolvedSubscriptionId, userId: req.user.userId } });
            if (!subscription)
                throw (0, errorHandler_1.createError)('Subscription not found', 404, 'SUBSCRIPTION_NOT_FOUND');
            checkout = resolveCommercialCheckout(subscription.packageId, subscription.billingCycle === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY');
        }
        if (!checkout)
            throw (0, errorHandler_1.createError)('Commercial package could not be resolved', 400, 'INVALID_PACKAGE');
        const payment = await prisma_1.prisma.payment.create({ data: { subscriptionId: resolvedSubscriptionId, amount: checkout.expectedAmount, currency, status: 'PENDING', paymentMethod } });
        try {
            const remotePay = await createRemotePayPaymentLink({ amountMinor: Math.round(checkout.expectedAmount * 100), currency, description, packageId: checkout.packageType, userId: req.user.userId, paymentId: payment.id, billingCycle: checkout.billingCycle });
            await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { transactionId: remotePay.transaction_id } });
            res.status(201).json({ success: true, data: { paymentId: payment.id, transactionId: remotePay.transaction_id, status: remotePay.status, amount: payment.amount, currency: payment.currency, paymentUrl: remotePay.payment_url, checkoutUrl: remotePay.payment_url, provider: 'remotepay', merchantId: remotePay.merchant_id, brandId: remotePay.brand_id }, meta: { timestamp: new Date().toISOString() } });
        }
        catch (remotePayError) {
            await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
            logger_1.logger.error('RemotePay payment-link creation failed', remotePayError?.response?.data || remotePayError?.message);
            throw (0, errorHandler_1.createError)('RemotePay could not create the payment link. Please try again.', 502, 'REMOTEPAY_PAYMENT_LINK_FAILED');
        }
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id/status', auth_1.authenticate, async (req, res, next) => {
    try {
        const payment = await prisma_1.prisma.payment.findUnique({ where: { id: req.params.id } });
        if (!payment)
            throw (0, errorHandler_1.createError)('Payment not found', 404, 'NOT_FOUND');
        res.json({ success: true, data: { paymentId: payment.id, status: payment.status, amount: payment.amount, currency: payment.currency, paymentMethod: payment.paymentMethod, paidAt: payment.paidAt, createdAt: payment.createdAt }, meta: { timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
router.get('/history', auth_1.authenticate, async (req, res, next) => {
    try {
        const pageNum = Math.max(1, parseInt(String(req.query.page || '1'), 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
        const skip = (pageNum - 1) * limitNum;
        const subscriptions = await prisma_1.prisma.subscription.findMany({ where: { userId: req.user.userId }, select: { id: true } });
        const subscriptionIds = subscriptions.map((s) => s.id);
        const [payments, total] = await Promise.all([
            prisma_1.prisma.payment.findMany({ where: { subscriptionId: { in: subscriptionIds } }, orderBy: { createdAt: 'desc' }, skip, take: limitNum }),
            prisma_1.prisma.payment.count({ where: { subscriptionId: { in: subscriptionIds } } }),
        ]);
        res.json({ success: true, data: payments, meta: { page: pageNum, limit: limitNum, total, timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
router.post('/simplyblu/initiate', auth_1.authenticate, async (req, res, next) => {
    try {
        const { currency = 'ZAR', description, packageId, metadata = {} } = req.body;
        if (!description || !packageId)
            throw (0, errorHandler_1.createError)('Description and packageId are required', 400, 'MISSING_FIELDS');
        const billingCycle = metadata.billingCycle === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
        const checkout = resolveCommercialCheckout(packageId, billingCycle);
        const subscription = await prisma_1.prisma.subscription.create({ data: {
                userId: req.user.userId,
                packageId: checkout.packageType,
                status: 'PENDING',
                billingCycle: checkout.billingCycle,
                nextBillingDate: new Date(Date.now() + (checkout.billingCycle === 'ANNUAL' ? 365 : 30) * 24 * 60 * 60 * 1000),
            } });
        const payment = await prisma_1.prisma.payment.create({ data: { subscriptionId: subscription.id, amount: checkout.expectedAmount, currency, status: 'PENDING', paymentMethod: 'remotepay' } });
        try {
            const remotePay = await createRemotePayPaymentLink({ amountMinor: Math.round(checkout.expectedAmount * 100), currency, description, packageId: checkout.packageType, userId: req.user.userId, paymentId: payment.id, billingCycle: checkout.billingCycle });
            await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { transactionId: remotePay.transaction_id } });
            res.status(201).json({ success: true, data: { paymentId: payment.id, transactionId: remotePay.transaction_id, status: remotePay.status, amount: payment.amount, currency, checkoutUrl: remotePay.payment_url, paymentUrl: remotePay.payment_url, provider: 'remotepay' }, meta: { timestamp: new Date().toISOString() } });
        }
        catch (remotePayError) {
            await prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
            logger_1.logger.error('RemotePay legacy payment-link creation failed', remotePayError?.response?.data || remotePayError?.message);
            throw (0, errorHandler_1.createError)('RemotePay could not create the payment link. Please try again.', 502, 'REMOTEPAY_PAYMENT_LINK_FAILED');
        }
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=payments.js.map