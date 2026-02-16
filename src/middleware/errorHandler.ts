import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

interface ErrorWithStatus extends Error {
    status?: number;
    statusCode?: number;
}

export const errorHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        statusCode,
    });

    // Don't leak error details in production
    const response = {
        message: statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({ message: 'Route not found' });
};
