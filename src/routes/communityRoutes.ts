
import { Router } from 'express';
import { createGroup, getAllGroups, joinGroup, createEvent, getAllEvents } from '../controllers/communityController';
import { getAllAchievements } from '../controllers/achievementController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Groups
router.post('/groups/create', authenticate, createGroup);
router.get('/groups/all', getAllGroups);
router.post('/groups/join', authenticate, joinGroup);

import { upload } from '../utils/cloudinary';

// Events
router.post('/events/create', authenticate, upload.array('images', 5), createEvent);
router.get('/events/all', getAllEvents);

// Achievements
router.get('/achievements/all', getAllAchievements);

// Donations
import { recordDonation } from '../controllers/donationController';
import { optionalAuthenticate } from '../middleware/auth';
router.post('/donations/record', optionalAuthenticate, recordDonation);

// Scholarships
import { getAllScholarships, applyForScholarship } from '../controllers/scholarshipController';
router.get('/scholarships', getAllScholarships);
router.post('/scholarships/apply', authenticate, applyForScholarship);

export default router;
