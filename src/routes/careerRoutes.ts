import { Router } from 'express';
import { createCareerListing, getAllCareerListings, getMyCareerListings, deleteCareerListing } from '../controllers/careerController';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/cloudinary';

const router = Router();

// Public
router.get('/all', getAllCareerListings);

// Create new listing
router.post('/create', authenticate, upload.single('companyLogo'), createCareerListing);
router.get('/my-listings', authenticate, getMyCareerListings);
router.delete('/:id', authenticate, deleteCareerListing);

export default router;
