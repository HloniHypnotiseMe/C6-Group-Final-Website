import { Request, Response, NextFunction } from 'express';
import { JWTPayload, UserRole } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
/**
 * Generate JWT token
 */
export declare const generateToken: (payload: Omit<JWTPayload, "iat" | "exp">) => string;
/**
 * Generate refresh token
 */
export declare const generateRefreshToken: (userId: string) => string;
/**
 * Verify JWT token
 */
export declare const verifyToken: (token: string) => JWTPayload;
/**
 * Authentication middleware
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Authorization middleware - check role
 */
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Optional authentication - doesn't fail if no token
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map