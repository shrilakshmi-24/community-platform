
import { Router } from 'express';
import {
    createGroup, getAllGroups, joinGroup,
    createEvent, getAllEvents, getEventById,
    registerForEvent, cancelRegistration, getMyEventRegistrations,
    volunteerForEvent, cancelVolunteer, getMyVolunteerSignups,
    getVolunteersForEvent, updateVolunteerStatus,
    getCommunityStats
} from '../controllers/communityController';
import { getAllAchievements } from '../controllers/achievementController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { upload } from '../utils/cloudinary';
import { recordDonation } from '../controllers/donationController';
import { getAllScholarships, applyForScholarship, getMyScholarshipApplications } from '../controllers/scholarshipController';

const router = Router();

// Groups
router.post('/groups/create', authenticate, createGroup);
router.get('/groups/all', getAllGroups);
router.post('/groups/join', authenticate, joinGroup);

// Events
router.post('/events/create', authenticate, upload.array('images', 5), createEvent);
router.get('/events/all', getAllEvents);
router.get('/events/:id', getEventById);

// Event Registration
router.post('/events/register', authenticate, registerForEvent);
router.post('/events/cancel-registration', authenticate, cancelRegistration);
router.get('/events/my-registrations', authenticate, getMyEventRegistrations);

// Volunteer Routes
router.post('/events/volunteer', authenticate, volunteerForEvent);
router.post('/events/volunteer/cancel', authenticate, cancelVolunteer);
router.get('/events/my-volunteer-signups', authenticate, getMyVolunteerSignups);
// Admin-accessible volunteer routes (auth check done at higher level or by requireMinRole in adminRoutes)
router.get('/events/:eventId/volunteers', authenticate, getVolunteersForEvent);
router.patch('/events/volunteers/:signupId/status', authenticate, updateVolunteerStatus);

// Achievements
router.get('/achievements/all', getAllAchievements);

// Stats
router.get('/stats', getCommunityStats);

// Donations
router.post('/donations/record', optionalAuthenticate, recordDonation);

// Scholarships
router.get('/scholarships', getAllScholarships);
router.post('/scholarships/apply', authenticate, upload.single('markSheet'), applyForScholarship);
router.get('/scholarships/my-applications', authenticate, getMyScholarshipApplications);

export default router;
