"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma_1 = require("../utils/prisma");
const types_1 = require("../types");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.userRouter = router;
const updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().optional(),
    companyName: zod_1.z.string().optional(),
    industry: zod_1.z.string().optional(),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8),
});
/**
 * Get user profile
 * GET /api/v1/users/profile
 */
router.get('/profile', auth_1.authenticate, async (req, res, next) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                companyName: true,
                industry: true,
                isEmailVerified: true,
                createdAt: true,
                role: true,
            },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 404, 'USER_NOT_FOUND');
        }
        res.json({
            success: true,
            data: user,
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Update user profile
 * PUT /api/v1/users/profile
 */
router.put('/profile', auth_1.authenticate, async (req, res, next) => {
    try {
        const validated = updateProfileSchema.parse(req.body);
        const user = await prisma_1.prisma.user.update({
            where: { id: req.user.userId },
            data: validated,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                companyName: true,
                industry: true,
                updatedAt: true,
            },
        });
        res.json({
            success: true,
            data: user,
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            next((0, errorHandler_1.createError)(error.errors[0].message, 400, 'VALIDATION_ERROR'));
        }
        else {
            next(error);
        }
    }
});
/**
 * Change password
 * POST /api/v1/users/change-password
 */
router.post('/change-password', auth_1.authenticate, async (req, res, next) => {
    try {
        const validated = changePasswordSchema.parse(req.body);
        // Get user with password
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 404, 'USER_NOT_FOUND');
        }
        // Verify current password
        const isValid = await bcryptjs_1.default.compare(validated.currentPassword, user.passwordHash);
        if (!isValid) {
            throw (0, errorHandler_1.createError)('Current password is incorrect', 401, 'INVALID_PASSWORD');
        }
        // Hash new password
        const newPasswordHash = await bcryptjs_1.default.hash(validated.newPassword, 12);
        // Update password
        await prisma_1.prisma.user.update({
            where: { id: req.user.userId },
            data: { passwordHash: newPasswordHash },
        });
        res.json({
            success: true,
            data: { message: 'Password changed successfully' },
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            next((0, errorHandler_1.createError)(error.errors[0].message, 400, 'VALIDATION_ERROR'));
        }
        else {
            next(error);
        }
    }
});
/**
 * Get all users (Admin only)
 * GET /api/v1/users
 */
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, status } = req.query;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        const [users, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    companyName: true,
                    industry: true,
                    status: true,
                    role: true,
                    createdAt: true,
                    lastLoginAt: true,
                    subscriptions: {
                        where: { status: 'ACTIVE' },
                        select: {
                            packageId: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.user.count({ where }),
        ]);
        res.json({
            success: true,
            data: users,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Update user status (Admin only)
 * PUT /api/v1/users/:id/status
 */
router.put('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                email: true,
                status: true,
                updatedAt: true,
            },
        });
        res.json({
            success: true,
            data: user,
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=user.js.map