import express from 'express';
import {
    createNewsletter,
    getNewsletters,
    getNewsletterById,
    updateNewsletter,
    publishNewsletter,
    deleteNewsletter,
    uploadNewsletterFile
} from '../controllers/newsletterController';
import { upload } from '../utils/cloudinary';

const router = express.Router();

// File upload endpoint (image or PDF → Cloudinary)
router.post('/upload', upload.single('file'), uploadNewsletterFile);

// Public Routes (Visible to all members) - only show APPROVED
router.get('/all', getNewsletters);
router.get('/:id', getNewsletterById);

// Admin Routes (Should be protected in production)
router.post('/create', createNewsletter);
router.put('/update/:id', updateNewsletter);
router.post('/publish/:id', publishNewsletter);
router.delete('/:id', deleteNewsletter);

export default router;
