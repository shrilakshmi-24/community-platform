import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getStats, getUsers, verifyUser, deactivateUser, deleteUser, getContent, approveContent, getPendingMembers, approveMembers, rejectMembers, getDonationSummary, getDonationTransactions, getAnalytics } from '../controllers/adminController';

const router = Router();

// All routes require ADMIN role
router.use(authenticate, authorize(['ADMIN']));

// Overview & Stats
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);

// User Management
router.get('/users', getUsers);
router.post('/users/verify', verifyUser);
router.post('/users/:userId/deactivate', deactivateUser);
router.delete('/users/:userId', deleteUser);

// Member Application
router.get('/pending-members', getPendingMembers);
router.post('/members/approve', approveMembers);
router.post('/members/reject', rejectMembers);

// Content Moderation
router.get('/content', getContent);
router.post('/content/approve', approveContent);

// Donation Management
router.get('/donations/summary', getDonationSummary);
router.get('/donations/transactions', getDonationTransactions);

import { upload } from '../utils/cloudinary';
// Achievement Management
import { createAchievement, getAllAchievements, deleteAchievement } from '../controllers/achievementController';
router.post('/achievements', upload.single('proof'), createAchievement);
router.get('/achievements', getAllAchievements);
router.delete('/achievements/:id', deleteAchievement);

// Scholarship Management
import { createScholarship, getApplications, updateApplicationStatus } from '../controllers/scholarshipController';
router.post('/scholarships', createScholarship);
router.get('/scholarships/:scholarshipId/applications', getApplications);
router.post('/scholarships/applications/:applicationId/status', updateApplicationStatus);

export default router;
