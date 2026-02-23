
import { Router } from 'express';
import { recordDonation, getDonations } from '../controllers/donationController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Get all active donation campaigns
router.get('/all', getDonations);

// Record a donation
router.post('/record', optionalAuthenticate, recordDonation);

export default router;
