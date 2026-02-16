import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import './config/env'; // Validate environment variables
import logger from './config/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import businessRoutes from './routes/businessRoutes';
import careerRoutes from './routes/careerRoutes';
import helpRequestRoutes from './routes/helpRequestRoutes';
import communityRoutes from './routes/communityRoutes';
import supportRoutes from './routes/supportRoutes';
import adminRoutes from './routes/adminRoutes';

import notificationRoutes from './routes/notificationRoutes';
import scholarshipRoutes from './routes/scholarshipRoutes';
import announcementRoutes from './routes/announcementRoutes';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow configured frontend or all (for dev)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
    stream: {
        write: (message: string) => logger.info(message.trim())
    }
}));

// Apply rate limiting to all routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/help-request', helpRequestRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Arya Vyshya Community Platform API', status: 'running' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
