import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getAllScholarships, applyForScholarship } from '../controllers/scholarshipController';

const router = Router();

// Retrieve all active scholarships
router.get('/', getAllScholarships);

import { upload } from '../utils/cloudinary';

// Apply for a scholarship (requires authentication & file upload)
router.post('/apply', authenticate, upload.single('markSheet'), applyForScholarship);

export default router;
