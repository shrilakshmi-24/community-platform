import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { createAnnouncement, getAllAnnouncements, deleteAnnouncement } from '../controllers/announcementController';
import { upload } from '../utils/cloudinary';

const router = Router();

// Public route to view announcements
router.get('/', getAllAnnouncements);

// Protected routes (Admin only for creation/deletion)
router.post('/', authenticate, authorize(['ADMIN']), upload.single('media'), createAnnouncement);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteAnnouncement);

export default router;
