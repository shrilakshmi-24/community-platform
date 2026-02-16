
import { Router } from 'express';
import { createListing, getAllListings, getMyListings, updateListing, deleteListing } from '../controllers/businessController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public
router.get('/all', getAllListings);

// Protected
router.post('/create', authenticate, createListing);
router.get('/my-listings', authenticate, getMyListings);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);

export default router;
