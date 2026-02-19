
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

import { registerForEvent, cancelRegistration, getMyEventRegistrations } from '../controllers/communityController';
router.post('/events/register', authenticate, registerForEvent);
router.post('/events/cancel-registration', authenticate, cancelRegistration);
router.get('/events/my-registrations', authenticate, getMyEventRegistrations);

// Achievements
router.get('/achievements/all', getAllAchievements);


// Stats
import { getCommunityStats } from '../controllers/communityController';
router.get('/stats', getCommunityStats);

// Donations
import { recordDonation } from '../controllers/donationController';
import { optionalAuthenticate } from '../middleware/auth';
router.post('/donations/record', optionalAuthenticate, recordDonation);

// Scholarships
import { getAllScholarships, applyForScholarship } from '../controllers/scholarshipController';
router.get('/scholarships', getAllScholarships);
router.post('/scholarships/apply', authenticate, applyForScholarship);

import { getMyScholarshipApplications } from '../controllers/scholarshipController';
router.get('/scholarships/my-applications', authenticate, getMyScholarshipApplications);

export default router;
