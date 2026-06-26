import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { UserRole } from '../types';

const router = Router();

/**
 * Get dashboard analytics
 * GET /api/v1/analytics/dashboard
 */
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [aiUsage, totalAiCalls, auditResults, subscription] = await Promise.all([
      prisma.aIUsage.groupBy({
        by: ['agentType'],
        where: {
          userId,
          createdAt: { gte: startOfMonth },
        },
        _count: { id: true },
        _sum: { tokensUsed: true, cost: true },
      }),
      prisma.aIUsage.count({
        where: { userId },
      }),
      prisma.auditResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.subscription.findFirst({
        where: { userId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        aiUsage: {
          byAgent: aiUsage,
          totalCalls: totalAiCalls,
        },
        recentAudits: auditResults,
        subscription: subscription || null,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get revenue analytics
 * GET /api/v1/analytics/revenue
 */
router.get('/revenue', authenticate, async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = Number(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get payment history for revenue data
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user!.userId },
      select: { id: true },
    });

    const subscriptionIds = subscriptions.map((s) => s.id);

    const [payments, totalRevenue, completedPayments] = await Promise.all([
      prisma.payment.findMany({
        where: {
          subscriptionId: { in: subscriptionIds },
          createdAt: { gte: startDate },
          status: 'COMPLETED',
        },
        orderBy: { createdAt: 'asc' },
        select: {
          amount: true,
          createdAt: true,
          currency: true,
        },
      }),
      prisma.payment.aggregate({
        where: {
          subscriptionId: { in: subscriptionIds },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      prisma.payment.count({
        where: {
          subscriptionId: { in: subscriptionIds },
          status: 'COMPLETED',
        },
      }),
    ]);

    // Group by date
    const grouped = payments.reduce((acc: Record<string, { date: string; amount: number }>, item) => {
      const date = item.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }
      acc[date].amount += Number(item.amount);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        history: Object.values(grouped),
        totalRevenue: totalRevenue._sum.amount || 0,
        totalPayments: completedPayments,
        averageOrder: completedPayments > 0
          ? (Number(totalRevenue._sum.amount) / completedPayments).toFixed(2)
          : 0,
        period: { days, startDate: startDate.toISOString() },
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get customer analytics
 * GET /api/v1/analytics/customers
 */
router.get('/customers', authenticate, async (req, res, next) => {
  try {
    // Get audit results as customer/business insights
    const [auditResults, totalAudits, auditStats] = await Promise.all([
      prisma.auditResult.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          companyName: true,
          industry: true,
          monthlyRevenue: true,
          potentialRevenue: true,
          overallScore: true,
          createdAt: true,
        },
      }),
      prisma.auditResult.count({
        where: { userId: req.user!.userId },
      }),
      prisma.auditResult.aggregate({
        where: { userId: req.user!.userId },
        _avg: { overallScore: true },
        _sum: { monthlyRevenue: true },
      }),
    ]);

    // Get AI usage by customer patterns
    const aiUsageByAgent = await prisma.aIUsage.groupBy({
      by: ['agentType'],
      where: { userId: req.user!.userId },
      _count: { id: true },
    });

    res.json({
      success: true,
      data: {
        businesses: auditResults,
        totalBusinesses: totalAudits,
        averageScore: Math.round(auditStats._avg.overallScore || 0),
        totalRevenueTracked: auditStats._sum.monthlyRevenue || 0,
        topIndustries: getTopIndustries(auditResults),
        aiUsageByAgent,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get AI usage trends
 * GET /api/v1/analytics/ai-usage
 */
router.get('/ai-usage', authenticate, async (req, res, next) => {
  try {
    const { days = '30' } = req.query;
    const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const usage = await prisma.aIUsage.findMany({
      where: {
        userId: req.user!.userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        agentType: true,
        tokensUsed: true,
        cost: true,
        createdAt: true,
      },
    });

    // Group by date
    const grouped = usage.reduce((acc: Record<string, { date: string; calls: number; tokens: number; cost: number }>, item) => {
      const date = item.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, calls: 0, tokens: 0, cost: 0 };
      }
      acc[date].calls++;
      acc[date].tokens += item.tokensUsed;
      acc[date].cost += Number(item.cost);
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(grouped),
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get admin analytics (Admin only)
 * GET /api/v1/analytics/admin
 */
router.get('/admin', authenticate, authorize(UserRole.ADMIN), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const [
      totalUsers,
      newUsers,
      activeSubscriptions,
      totalAiCalls,
      totalAiCost,
      usersByPackage,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.aIUsage.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
      prisma.aIUsage.aggregate({
        where: { createdAt: { gte: start, lte: end } },
        _sum: { cost: true },
      }),
      prisma.subscription.groupBy({
        by: ['packageId'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          new: newUsers,
        },
        subscriptions: {
          active: activeSubscriptions,
          byPackage: usersByPackage,
        },
        ai: {
          totalCalls,
          totalCost: totalAiCost._sum.cost || 0,
        },
        period: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Helper function
function getTopIndustries(audits: Array<{ industry: string }>): Array<{ industry: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const audit of audits) {
    counts[audit.industry] = (counts[audit.industry] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export { router as analyticsRouter };
