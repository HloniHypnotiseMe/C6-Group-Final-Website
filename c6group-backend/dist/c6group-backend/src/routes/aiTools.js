"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiToolsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
exports.aiToolsRouter = router;
/**
 * Get all AI Tools
 * GET /api/v1/ai-tools
 */
router.get('/', async (req, res, next) => {
    try {
        const { category, search, page = '1', limit = '50' } = req.query;
        const where = {};
        if (category && category !== 'all') {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search.toLowerCase() } }
            ];
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [tools, total] = await Promise.all([
            prisma_1.prisma.aITool.findMany({
                where,
                orderBy: [{ popular: 'desc' }, { name: 'asc' }],
                skip,
                take: limitNum,
            }),
            prisma_1.prisma.aITool.count({ where })
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
    }
    catch (error) {
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
        const tool = await prisma_1.prisma.aITool.findUnique({
            where: { id },
        });
        if (!tool) {
            throw (0, errorHandler_1.createError)('AI Tool not found', 404, 'NOT_FOUND');
        }
        res.json({
            success: true,
            data: tool,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Get AI Tool categories
 * GET /api/v1/ai-tools/categories
 */
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await prisma_1.prisma.aITool.groupBy({
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
    }
    catch (error) {
        next(error);
    }
});
/**
 * Get featured AI Tools
 * GET /api/v1/ai-tools/featured
 */
router.get('/featured', async (req, res, next) => {
    try {
        const tools = await prisma_1.prisma.aITool.findMany({
            where: { featured: true },
            orderBy: { name: 'asc' },
            take: 10,
        });
        res.json({
            success: true,
            data: tools,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Get popular AI Tools
 * GET /api/v1/ai-tools/popular
 */
router.get('/popular', async (req, res, next) => {
    try {
        const tools = await prisma_1.prisma.aITool.findMany({
            where: { popular: true },
            orderBy: { usageCount: 'desc' },
            take: 10,
        });
        res.json({
            success: true,
            data: tools,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Use an AI Tool (increment usage)
 * POST /api/v1/ai-tools/:id/use
 */
router.post('/:id/use', auth_1.authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const tool = await prisma_1.prisma.aITool.update({
            where: { id },
            data: {
                usageCount: { increment: 1 },
                lastUsedAt: new Date(),
            },
        });
        logger_1.logger.info(`AI Tool used: ${tool.name} by user: ${req.user.userId}`);
        res.json({
            success: true,
            data: { message: `Tool ${tool.name} activated` },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=aiTools.js.map