import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, generateToken, generateRefreshToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Register new user
 * POST /api/v1/auth/register
 */
router.post('/register', async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    
    if (existingUser) {
      throw createError('Email already registered', 409, 'EMAIL_EXISTS');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12);
    
    // Create user
    const user = await prisma.user.create({
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
    await prisma.subscription.create({
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
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      packageType: 'lead',
    });
    
    const refreshToken = generateRefreshToken(user.id);
    
    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    
    logger.info(`New user registered: ${user.email}`);
    
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    } else {
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
    const user = await prisma.user.findUnique({
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
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    
    // Verify password
    const isValid = await bcrypt.compare(validated.password, user.passwordHash);
    
    if (!isValid) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    
    if (user.status !== 'ACTIVE') {
      throw createError('Account is not active', 401, 'ACCOUNT_INACTIVE');
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    
    // Generate tokens
    const packageType = user.subscriptions[0]?.packageId || 'lead';
    
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      packageType: packageType as any,
    });
    
    const refreshToken = generateRefreshToken(user.id);
    
    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    
    logger.info(`User logged in: ${user.email}`);
    
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
});

/**
 * Get current user
 * GET /api/v1/auth/me
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
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
  } catch (error) {
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
      throw createError('Refresh token required', 400, 'MISSING_TOKEN');
    }
    
    // Find token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw createError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
    }
    
    // Generate new tokens
    const user = tokenRecord.user;
    
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    
    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      packageType: subscription?.packageId as any || 'lead',
    });
    
    const newRefreshToken = generateRefreshToken(user.id);
    
    // Delete old token and store new one
    await prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });
    
    await prisma.refreshToken.create({
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
  } catch (error) {
    next(error);
  }
});

/**
 * Logout
 * POST /api/v1/auth/logout
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);
    
    // TODO: Add token to blacklist (Redis recommended)
    
    logger.info(`User logged out: ${req.user!.email}`);
    
    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
