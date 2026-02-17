
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Auth Failure: No Bearer token');
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        console.log('Auth Failure: Invalid/Expired token');
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
    // Proceed even if token invalid? Better strict if token provided.
    // If token is invalid (expired), client should probably refresh, but here we can just treat as guest
    // to avoid erroring out a donation page.
    next();
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            return;
        }

        next();
    };
};
