import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { packageConfigs } from '../config/packages';
import { PackageType, UserRole } from '../types';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Get available packages
 * GET /api/v1/subscriptions/packages
 */
router.get('/packages', async (req, res, next) => {
  try {
    const packages = Object.values(packageConfigs).map(config => ({
      id: config.id,
      name: config.name,
      monthlyPrice: config.monthlyPrice,
      annualPrice: config.annualPrice,
      annualSavings: config.monthlyPrice > 0
        ? Math.round((config.monthlyPrice - config.annualPrice) * 12)
        : 0,
      features: config.features,
      aiLimits: config.aiLimits,
      supportLevel: config.supportLevel,
      maxUsers: config.maxUsers,
    }));

    res.json({
      success: true,
      data: packages,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current user's subscription
 * GET /api/v1/subscriptions/current
 */
router.get('/current', authenticate, async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user!.userId,
        status: { in: ['ACTIVE', 'TRIAL', 'PENDING'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!subscription) {
      return res.json({
        success: true,
        data: null,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    const config = packageConfigs[subscription.packageId as PackageType];

    res.json({
      success: true,
      data: {
        ...subscription,
        package: {
          id: config.id,
          name: config.name,
          monthlyPrice: config.monthlyPrice,
          annualPrice: config.annualPrice,
          features: config.features,
          aiLimits: config.aiLimits,
          supportLevel: config.supportLevel,
          maxUsers: config.maxUsers,
        },
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create subscription
 * POST /api/v1/subscriptions
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { packageId, billingCycle, paymentMethod } = req.body;

    if (!packageId || !billingCycle) {
      throw createError('Package ID and billing cycle are required', 400, 'MISSING_FIELDS');
    }

    const config = packageConfigs[packageId as PackageType];
    if (!config) {
      throw createError('Invalid package', 400, 'INVALID_PACKAGE');
    }

    // Cancel existing active subscription
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId: req.user!.userId,
        status: 'ACTIVE',
      },
    });

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          status: 'CANCELLED',
          endDate: new Date(),
        },
      });
    }

    const amount = billingCycle === 'ANNUAL' ? config.annualPrice : config.monthlyPrice;
    const aiUsageLimit = Object.values(config.aiLimits).reduce((sum, limit) => {
      return sum + (limit === -1 ? 999999 : limit as number);
    }, 0);

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        packageId,
        status: amount === 0 ? 'ACTIVE' : 'PENDING',
        billingCycle: billingCycle.toUpperCase(),
        aiUsageLimit,
        aiUsageUsed: 0,
        startDate: new Date(),
        nextBillingDate: billingCycle === 'ANNUAL'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Create payment for paid packages
    let payment = null;
    if (amount > 0 && paymentMethod) {
      payment = await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount,
          currency: 'ZAR',
          status: 'PENDING',
          paymentMethod,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
      });
    }

    logger.info(`Subscription created: ${subscription.id} for user: ${req.user!.userId}`);

    res.json({
      success: true,
      data: {
        subscription,
        payment: payment ? {
          paymentId: payment.id,
          amount: payment.amount,
          status: payment.status,
        } : null,
        message: amount === 0 ? 'Free subscription activated' : 'Payment required to activate',
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Upgrade subscription
 * POST /api/v1/subscriptions/upgrade
 */
router.post('/upgrade', authenticate, async (req, res, next) => {
  try {
    const { packageId, billingCycle } = req.body;

    if (!packageId) {
      throw createError('Package ID is required', 400, 'MISSING_FIELDS');
    }

    const config = packageConfigs[packageId as PackageType];
    if (!config) {
      throw createError('Invalid package', 400, 'INVALID_PACKAGE');
    }

    const currentSub = await prisma.subscription.findFirst({
      where: {
        userId: req.user!.userId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!currentSub) {
      throw createError('No active subscription found', 400, 'NO_SUBSCRIPTION');
    }

    const aiUsageLimit = Object.values(config.aiLimits).reduce((sum, limit) => {
      return sum + (limit === -1 ? 999999 : limit as number);
    }, 0);

    const updated = await prisma.subscription.update({
      where: { id: currentSub.id },
      data: {
        packageId,
        billingCycle: billingCycle?.toUpperCase() || currentSub.billingCycle,
        aiUsageLimit,
        status: 'ACTIVE',
        nextBillingDate: billingCycle === 'ANNUAL'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info(`Subscription upgraded: ${updated.id} to ${packageId} for user: ${req.user!.userId}`);

    res.json({
      success: true,
      data: {
        subscription: updated,
        message: `Successfully upgraded to ${config.name} package`,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Cancel subscription
 * POST /api/v1/subscriptions/cancel
 */
router.post('/cancel', authenticate, async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user!.userId,
        status: 'ACTIVE',
      },
    });

    if (!subscription) {
      throw createError('No active subscription found', 404, 'NO_SUBSCRIPTION');
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        endDate: new Date(),
      },
    });

    logger.info(`Subscription cancelled: ${subscription.id} for user: ${req.user!.userId}`);

    res.json({
      success: true,
      data: {
        message: 'Subscription cancelled. You can continue using features until the end of your billing period.',
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get subscription history (Admin only)
 * GET /api/v1/subscriptions/history
 */
router.get('/history', authenticate, authorize(UserRole.ADMIN), async (req, res, next) => {
  try {
    const { userId, page = '1', limit = '20' } = req.query;

    const where = userId ? { userId: userId as string } : {};

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.subscription.count({ where }),
    ]);

    res.json({
      success: true,
      data: subscriptions,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as subscriptionRouter };
