import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

// Role hierarchy: higher index = more permissions
export const ROLE_HIERARCHY: Record<string, number> = {
    GUEST: 0,
    MEMBER: 1,
    MENTOR: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
};

interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }

    req.user = decoded;
    next();
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (decoded) {
        req.user = decoded;
    }
    next();
};

/**
 * authorize(roles) — user must have one of the listed roles (exact match).
 * SUPER_ADMIN always passes (implicit superuser).
 */
export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // SUPER_ADMIN bypasses all role checks
        if (req.user.role === 'SUPER_ADMIN') {
            next();
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            return;
        }

        next();
    };
};

/**
 * requireMinRole(role) — user must have at least the given role level.
 * E.g. requireMinRole('ADMIN') allows ADMIN + SUPER_ADMIN.
 */
export const requireMinRole = (minRole: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const userLevel = ROLE_HIERARCHY[req.user.role] ?? 0;
        const requiredLevel = ROLE_HIERARCHY[minRole] ?? 0;

        if (userLevel < requiredLevel) {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            return;
        }

        next();
    };
};
