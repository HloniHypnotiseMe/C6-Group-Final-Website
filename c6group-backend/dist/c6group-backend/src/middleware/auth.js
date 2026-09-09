"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const prisma_1 = require("../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
/**
 * Generate JWT token
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '24h',
    });
};
exports.generateToken = generateToken;
/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId, type: 'refresh' }, JWT_SECRET, {
        expiresIn: '7d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
/**
 * Authentication middleware
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw (0, errorHandler_1.createError)('Authentication required', 401, 'UNAUTHORIZED');
        }
        const token = authHeader.substring(7);
        const decoded = (0, exports.verifyToken)(token);
        // Check if user still exists and is active
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)('User not found', 401, 'UNAUTHORIZED');
        }
        if (user.status !== 'ACTIVE') {
            throw (0, errorHandler_1.createError)('Account is not active', 401, 'ACCOUNT_INACTIVE');
        }
        // Add user to request
        req.user = {
            ...decoded,
            packageType: user.subscriptions[0]?.packageId || 'lead',
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next((0, errorHandler_1.createError)('Invalid token', 401, 'INVALID_TOKEN'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
/**
 * Authorization middleware - check role
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            next((0, errorHandler_1.createError)('Authentication required', 401, 'UNAUTHORIZED'));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next((0, errorHandler_1.createError)('Insufficient permissions', 403, 'FORBIDDEN'));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const decoded = (0, exports.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        // Don't fail, just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map