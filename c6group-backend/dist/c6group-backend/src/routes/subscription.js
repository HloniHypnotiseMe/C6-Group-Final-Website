"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma_1 = require("../utils/prisma");
const packages_1 = require("../config/packages");
const types_1 = require("../types");
const logger_1 = require("../utils/logger");
const commercialCatalog_1 = require("../config/commercialCatalog");
const commercialContract_1 = require("../../../shared/commercialContract");
const router = (0, express_1.Router)();
exports.subscriptionRouter = router;
function resolvePackage(packageId) {
    const sku = (0, commercialContract_1.resolveCommercialSku)(packageId);
    const config = packages_1.packageConfigs[sku.toLowerCase()];
    const commercial = (0, commercialCatalog_1.getCommercialPackage)(sku);
    if (!config)
        throw (0, errorHandler_1.createError)('Invalid package', 400, 'INVALID_PACKAGE');
    return { sku, config, commercial, packageType: sku.toLowerCase() };
}
function resolveAmount(sku, billingCycle) {
    const commercial = (0, commercialCatalog_1.getCommercialPackage)(sku);
    if (!commercial.selfServe) {
        throw (0, errorHandler_1.createError)('Enterprise packages require a custom quote. Please contact C6.', 400, 'CUSTOM_PACKAGE');
    }
    const amount = billingCycle.toUpperCase() === 'ANNUAL'
        ? commercial.annualPriceZar
        : commercial.monthlyPriceZar;
    if (amount === null)
        throw (0, errorHandler_1.createError)('Package pricing is not available for self-service checkout', 400, 'PRICE_UNAVAILABLE');
    return amount;
}
router.get('/packages', async (_req, res, next) => {
    try {
        const packages = commercialContract_1.C6_COMMERCIAL_CATALOG.map(commercial => {
            const config = packages_1.packageConfigs[commercial.sku.toLowerCase()];
            const annualSavings = commercial.monthlyPriceZar !== null && commercial.annualPriceZar !== null
                ? Math.max(0, commercial.monthlyPriceZar * 12 - commercial.annualPriceZar)
                : null;
            return {
                id: commercial.sku.toLowerCase(),
                sku: commercial.sku,
                name: commercial.name,
                monthlyPrice: commercial.monthlyPriceZar,
                annualPrice: commercial.annualPriceZar,
                annualSavings,
                features: config?.features || [],
                aiLimits: config?.aiLimits || {},
                supportLevel: config?.supportLevel,
                maxUsers: config?.maxUsers,
                selfServe: commercial.selfServe,
            };
        });
        res.json({ success: true, data: packages, meta: { timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
router.get('/current', auth_1.authenticate, async (req, res, next) => {
    try {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { userId: req.user.userId, status: { in: ['ACTIVE', 'TRIAL', 'PENDING'] } },
            orderBy: { createdAt: 'desc' },
            include: { payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
        if (!subscription)
            return res.json({ success: true, data: null, meta: { timestamp: new Date().toISOString() } });
        const resolved = resolvePackage(subscription.packageId);
        res.json({
            success: true,
            data: {
                ...subscription,
                package: {
                    id: resolved.packageType,
                    sku: resolved.sku,
                    name: resolved.commercial.name,
                    monthlyPrice: resolved.commercial.monthlyPriceZar,
                    annualPrice: resolved.commercial.annualPriceZar,
                    features: resolved.config.features,
                    aiLimits: resolved.config.aiLimits,
                    supportLevel: resolved.config.supportLevel,
                    maxUsers: resolved.config.maxUsers,
                    selfServe: resolved.commercial.selfServe,
                },
            },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', auth_1.authenticate, async (req, res, next) => {
    try {
        const { packageId, billingCycle, paymentMethod } = req.body;
        if (!packageId || !billingCycle)
            throw (0, errorHandler_1.createError)('Package ID and billing cycle are required', 400, 'MISSING_FIELDS');
        const resolved = resolvePackage(packageId);
        const normalizedCycle = billingCycle.toUpperCase();
        if (!['MONTHLY', 'ANNUAL'].includes(normalizedCycle))
            throw (0, errorHandler_1.createError)('Billing cycle must be MONTHLY or ANNUAL', 400, 'INVALID_BILLING_CYCLE');
        const amount = resolveAmount(resolved.sku, normalizedCycle);
        const existingSub = await prisma_1.prisma.subscription.findFirst({ where: { userId: req.user.userId, status: 'ACTIVE' } });
        if (existingSub)
            await prisma_1.prisma.subscription.update({ where: { id: existingSub.id }, data: { status: 'CANCELLED', endDate: new Date() } });
        const aiUsageLimit = Object.values(resolved.config.aiLimits).reduce((sum, limit) => sum + (limit === -1 ? 999999 : limit), 0);
        const subscription = await prisma_1.prisma.subscription.create({
            data: {
                userId: req.user.userId,
                packageId: resolved.packageType,
                status: amount === 0 ? 'ACTIVE' : 'PENDING',
                billingCycle: normalizedCycle,
                aiUsageLimit,
                aiUsageUsed: 0,
                startDate: new Date(),
                nextBillingDate: normalizedCycle === 'ANNUAL' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        let payment = null;
        if (amount > 0 && paymentMethod) {
            payment = await prisma_1.prisma.payment.create({
                data: { subscriptionId: subscription.id, amount, currency: 'ZAR', status: 'PENDING', paymentMethod },
            });
        }
        logger_1.logger.info(`Subscription created: ${subscription.id} for user: ${req.user.userId}`);
        res.json({
            success: true,
            data: {
                subscription,
                payment: payment ? { paymentId: payment.id, amount: payment.amount, status: payment.status } : null,
                message: amount === 0 ? 'Free subscription activated' : 'Payment required to activate',
            },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/upgrade', auth_1.authenticate, async (req, res, next) => {
    try {
        const { packageId, billingCycle } = req.body;
        if (!packageId)
            throw (0, errorHandler_1.createError)('Package ID is required', 400, 'MISSING_FIELDS');
        const resolved = resolvePackage(packageId);
        const normalizedCycle = billingCycle?.toUpperCase() || 'MONTHLY';
        if (!['MONTHLY', 'ANNUAL'].includes(normalizedCycle))
            throw (0, errorHandler_1.createError)('Billing cycle must be MONTHLY or ANNUAL', 400, 'INVALID_BILLING_CYCLE');
        const amount = resolveAmount(resolved.sku, normalizedCycle);
        const currentSub = await prisma_1.prisma.subscription.findFirst({ where: { userId: req.user.userId, status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
        if (!currentSub)
            throw (0, errorHandler_1.createError)('No active subscription found', 400, 'NO_SUBSCRIPTION');
        const aiUsageLimit = Object.values(resolved.config.aiLimits).reduce((sum, limit) => sum + (limit === -1 ? 999999 : limit), 0);
        const updated = await prisma_1.prisma.subscription.update({
            where: { id: currentSub.id },
            data: {
                packageId: resolved.packageType,
                billingCycle: normalizedCycle,
                aiUsageLimit,
                status: amount === 0 ? 'ACTIVE' : 'PENDING',
                nextBillingDate: normalizedCycle === 'ANNUAL' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        logger_1.logger.info(`Subscription upgraded: ${updated.id} to ${resolved.packageType} for user: ${req.user.userId}`);
        res.json({ success: true, data: { subscription: updated, message: `Successfully selected ${resolved.commercial.name} package` }, meta: { timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
router.post('/cancel', auth_1.authenticate, async (req, res, next) => {
    try {
        const subscription = await prisma_1.prisma.subscription.findFirst({ where: { userId: req.user.userId, status: 'ACTIVE' } });
        if (!subscription)
            throw (0, errorHandler_1.createError)('No active subscription found', 404, 'NO_SUBSCRIPTION');
        await prisma_1.prisma.subscription.update({ where: { id: subscription.id }, data: { status: 'CANCELLED', endDate: new Date() } });
        logger_1.logger.info(`Subscription cancelled: ${subscription.id} for user: ${req.user.userId}`);
        res.json({ success: true, data: { message: 'Subscription cancelled. You can continue using features until the end of your billing period.' }, meta: { timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
router.get('/history', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const { userId, page = '1', limit = '20' } = req.query;
        const where = userId ? { userId: userId } : {};
        const [subscriptions, total] = await Promise.all([
            prisma_1.prisma.subscription.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (Number(page) - 1) * Number(limit), take: Number(limit), include: { user: { select: { email: true, firstName: true, lastName: true } } } }),
            prisma_1.prisma.subscription.count({ where }),
        ]);
        res.json({ success: true, data: subscriptions, meta: { page: Number(page), limit: Number(limit), total, timestamp: new Date().toISOString() } });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=subscription.js.map