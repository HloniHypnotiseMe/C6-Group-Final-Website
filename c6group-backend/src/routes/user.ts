import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { UserRole } from '../types';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

/**
 * Get user profile
 * GET /api/v1/users/profile
 */
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
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
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    res.json({
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user profile
 * PUT /api/v1/users/profile
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const validated = updateProfileSchema.parse(req.body);
    
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(createError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
});

/**
 * Change password
 * POST /api/v1/users/change-password
 */
router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const validated = changePasswordSchema.parse(req.body);
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });
    
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(validated.currentPassword, user.passwordHash);
    
    if (!isValid) {
      throw createError('Current password is incorrect', 401, 'INVALID_PASSWORD');
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(validated.newPassword, 12);
    
    // Update password
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { passwordHash: newPasswordHash },
    });
    
    res.json({
      success: true,
      data: { message: 'Password changed successfully' },
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
 * Get all users (Admin only)
 * GET /api/v1/users
 */
router.get('/', authenticate, authorize(UserRole.ADMIN), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { companyName: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
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
      prisma.user.count({ where }),
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
  } catch (error) {
    next(error);
  }
});

/**
 * Update user status (Admin only)
 * PUT /api/v1/users/:id/status
 */
router.put('/:id/status', authenticate, authorize(UserRole.ADMIN), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await prisma.user.update({
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
  } catch (error) {
    next(error);
  }
});

export { router as userRouter };
