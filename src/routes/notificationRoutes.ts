import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getNotifications, markAsRead, createNotification } from '../controllers/notificationController';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

// Only admin can create arbitrary notifications via API for now
router.post('/', authorize(['ADMIN']), createNotification);

export default router;
