

import { Router } from 'express';
import { getProfile, updateProfile, requestVerification, updateAboutMe, updateFamily, updateBusiness } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/update', authenticate, updateProfile);
router.post('/verify', authenticate, requestVerification);

// New profile section routes
router.put('/about-me', authenticate, updateAboutMe);
router.put('/family', authenticate, updateFamily);
router.put('/business', authenticate, updateBusiness);

export default router;
