import winston from 'winston';
import path from 'path';

const logDir = 'logs';

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

const isServerless = process.env.VERCEL === '1';
const transportsList: winston.transport[] = [];

// Do not write to the file system in serverless environments
if (!isServerless) {
    transportsList.push(
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

// Output to console in serverless (which Vercel captures) and in local non-prod envs
if (isServerless || process.env.NODE_ENV !== 'production') {
    transportsList.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
} else if (transportsList.length === 0) {
    transportsList.push(new winston.transports.Console());
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'community-platform' },
    transports: transportsList,
});

export default logger;
