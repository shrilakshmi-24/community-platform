
import { Router } from 'express';
import { createCareerListing, getAllCareerListings, getMyCareerListings, deleteCareerListing } from '../controllers/careerController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public
router.get('/all', getAllCareerListings);

// Protected
router.post('/create', authenticate, createCareerListing);
router.get('/my-listings', authenticate, getMyCareerListings);
router.delete('/:id', authenticate, deleteCareerListing);

export default router;
