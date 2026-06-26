import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Get all AI Tools
 * GET /api/v1/ai-tools
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = '1', limit = '50' } = req.query;
    
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category as string;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: (search as string).toLowerCase() } }
      ];
    }
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const [tools, total] = await Promise.all([
      prisma.aITool.findMany({
        where,
        orderBy: [{ popular: 'desc' }, { name: 'asc' }],
        skip,
        take: limitNum,
      }),
      prisma.aITool.count({ where })
    ]);
    
    res.json({
      success: true,
      data: tools,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get AI Tool by ID
 * GET /api/v1/ai-tools/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tool = await prisma.aITool.findUnique({
      where: { id },
    });
    
    if (!tool) {
      throw createError('AI Tool not found', 404, 'NOT_FOUND');
    }
    
    res.json({
      success: true,
      data: tool,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get AI Tool categories
 * GET /api/v1/ai-tools/categories
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.aITool.groupBy({
      by: ['category'],
      _count: { category: true },
    });
    
    const categoryList = categories.map((c) => ({
      name: c.category,
      count: c._count.category,
    }));
    
    res.json({
      success: true,
      data: categoryList,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get featured AI Tools
 * GET /api/v1/ai-tools/featured
 */
router.get('/featured', async (req, res, next) => {
  try {
    const tools = await prisma.aITool.findMany({
      where: { featured: true },
      orderBy: { name: 'asc' },
      take: 10,
    });
    
    res.json({
      success: true,
      data: tools,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get popular AI Tools
 * GET /api/v1/ai-tools/popular
 */
router.get('/popular', async (req, res, next) => {
  try {
    const tools = await prisma.aITool.findMany({
      where: { popular: true },
      orderBy: { usageCount: 'desc' },
      take: 10,
    });
    
    res.json({
      success: true,
      data: tools,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Use an AI Tool (increment usage)
 * POST /api/v1/ai-tools/:id/use
 */
router.post('/:id/use', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tool = await prisma.aITool.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });
    
    logger.info(`AI Tool used: ${tool.name} by user: ${req.user!.userId}`);
    
    res.json({
      success: true,
      data: { message: `Tool ${tool.name} activated` },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

export { router as aiToolsRouter };
