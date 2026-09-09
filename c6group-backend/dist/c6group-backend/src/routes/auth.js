"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma_1 = require("../utils/prisma");
const logger_1 = require("../utils/logger");
const zod_1 = require("zod");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.authRouter = router;
const toPackageType = (value) => {
    switch (value) {
        case types_1.PackageType.DIAMOND:
            return types_1.PackageType.DIAMOND;
        case types_1.PackageType.GOLD:
            return types_1.PackageType.GOLD;
        case types_1.PackageType.PLATINUM:
            return types_1.PackageType.PLATINUM;
        case types_1.PackageType.ENTERPRISE:
            return types_1.PackageType.ENTERPRISE;
        case types_1.PackageType.LEAD:
        default:
            return types_1.PackageType.LEAD;
    }
};
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    phone: zod_1.z.string().optional(),
    companyName: zod_1.z.string().optional(),
    industry: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
/**
 * Register new user
 * POST /api/v1/auth/register
 */
router.post('/register', async (req, res, next) => {
    try {
        const validated = registerSchema.parse(req.body);
        // Check if user already exists
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: validated.email },
        });
        if (existingUser) {
            throw (0, errorHandler_1.createError)('Email already registered', 409, 'EMAIL_EXISTS');
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(validated.password, 12);
        // Create user
        const user = await prisma_1.prisma.user.create({
            data: {
                email: validated.email,
                passwordHash,
                firstName: validated.firstName,
                lastName: validated.lastName,
                phone: validated.phone,
                companyName: validated.companyName,
                industry: validated.industry,
            },
        });
        // Create free subscription
        await prisma_1.prisma.subscription.create({
            data: {
                userId: user.id,
                packageId: 'lead',
                status: 'ACTIVE',
                billingCycle: 'MONTHLY',
                aiUsageLimit: 1,
                aiUsageUsed: 0,
            },
        });
        // Generate tokens
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
            packageType: 'lead',
        });
        const refreshToken = (0, auth_1.generateRefreshToken)(user.id);
        // Store refresh token
        await prisma_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        logger_1.logger.info(`New user registered: ${user.email}`);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    companyName: user.companyName,
                },
                token,
                refreshToken,
            },
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
 * Login user
 * POST /api/v1/auth/login
 */
router.post('/login', async (req, res, next) => {
    try {
        const validated = loginSchema.parse(req.body);
        // Find user
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: validated.email },
            include: {
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)('Invalid credentials', 401, 'INVALID_CREDENTIALS');
        }
        // Verify password
        const isValid = await bcryptjs_1.default.compare(validated.password, user.passwordHash);
        if (!isValid) {
            throw (0, errorHandler_1.createError)('Invalid credentials', 401, 'INVALID_CREDENTIALS');
        }
        if (user.status !== 'ACTIVE') {
            throw (0, errorHandler_1.createError)('Account is not active', 401, 'ACCOUNT_INACTIVE');
        }
        // Update last login
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        // Generate tokens
        const packageType = user.subscriptions[0]?.packageId || 'lead';
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
            packageType: toPackageType(packageType),
        });
        const refreshToken = (0, auth_1.generateRefreshToken)(user.id);
        // Store refresh token
        await prisma_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        logger_1.logger.info(`User logged in: ${user.email}`);
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    companyName: user.companyName,
                    role: user.role,
                    packageType,
                },
                token,
                refreshToken,
            },
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
 * Get current user
 * GET /api/v1/auth/me
 */
router.get('/me', auth_1.authenticate, async (req, res, next) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.userId },
            include: {
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 404, 'USER_NOT_FOUND');
        }
        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                companyName: user.companyName,
                industry: user.industry,
                role: user.role,
                packageType: user.subscriptions[0]?.packageId || 'lead',
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
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
 * Refresh token
 * POST /api/v1/auth/refresh
 */
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw (0, errorHandler_1.createError)('Refresh token required', 400, 'MISSING_TOKEN');
        }
        // Find token in database
        const tokenRecord = await prisma_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw (0, errorHandler_1.createError)('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
        }
        // Generate new tokens
        const user = tokenRecord.user;
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { userId: user.id, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
        });
        const newToken = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
            packageType: toPackageType(subscription?.packageId),
        });
        const newRefreshToken = (0, auth_1.generateRefreshToken)(user.id);
        // Delete old token and store new one
        await prisma_1.prisma.refreshToken.delete({
            where: { id: tokenRecord.id },
        });
        await prisma_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        res.json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
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
 * Logout
 * POST /api/v1/auth/logout
 */
router.post('/logout', auth_1.authenticate, async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.substring(7);
        // TODO: Add token to blacklist (Redis recommended)
        logger_1.logger.info(`User logged out: ${req.user.email}`);
        res.json({
            success: true,
            data: { message: 'Logged out successfully' },
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=auth.js.map