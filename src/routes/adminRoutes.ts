import { Router } from 'express';
import { authenticate, authorize, requireMinRole } from '../middleware/auth';
import {
    getStats, getUsers, verifyUser, deactivateUser, deleteUser,
    getContent, approveContent, getPendingMembers, approveMembers, rejectMembers,
    getDonationSummary, getDonationTransactions, getAnalytics
} from '../controllers/adminController';
import { upload } from '../utils/cloudinary';
import { createAchievement, getAllAchievements, deleteAchievement } from '../controllers/achievementController';
import { createScholarship, getAllScholarshipsAdmin, getApplications, updateApplicationStatus } from '../controllers/scholarshipController';

const router = Router();

// ─── All admin routes require authentication ───────────────────────────────
router.use(authenticate);

// ─── SHARED: Both ADMIN and SUPER_ADMIN ────────────────────────────────────
// Overview stats (ADMIN sees limited stats, SUPER_ADMIN sees all — same endpoint, frontend filters)
router.get('/stats', requireMinRole('ADMIN'), getStats);
router.get('/analytics', requireMinRole('ADMIN'), getAnalytics);

// Content Moderation (ADMIN + SUPER_ADMIN)
router.get('/content', requireMinRole('ADMIN'), getContent);
router.post('/content/approve', requireMinRole('ADMIN'), approveContent);

// Pending member approvals (ADMIN + SUPER_ADMIN)
router.get('/pending-members', requireMinRole('ADMIN'), getPendingMembers);
router.post('/members/approve', requireMinRole('ADMIN'), approveMembers);
router.post('/members/reject', requireMinRole('ADMIN'), rejectMembers);

// Achievements (ADMIN + SUPER_ADMIN can create/view/delete)
router.post('/achievements', requireMinRole('ADMIN'), upload.single('proof'), createAchievement);
router.get('/achievements', requireMinRole('ADMIN'), getAllAchievements);
router.delete('/achievements/:id', requireMinRole('ADMIN'), deleteAchievement);

// Scholarships (ADMIN + SUPER_ADMIN)
router.post('/scholarships', requireMinRole('ADMIN'), upload.single('media'), createScholarship);
router.get('/scholarships', requireMinRole('ADMIN'), getAllScholarshipsAdmin);
router.get('/scholarships/:scholarshipId/applications', requireMinRole('ADMIN'), getApplications);
router.post('/scholarships/applications/:applicationId/status', requireMinRole('ADMIN'), updateApplicationStatus);

// Donations (ADMIN + SUPER_ADMIN)
router.get('/donations/summary', requireMinRole('ADMIN'), getDonationSummary);
router.get('/donations/transactions', requireMinRole('ADMIN'), getDonationTransactions);

// ─── SUPER_ADMIN ONLY ─────────────────────────────────────────────────────
// User Management — SUPER_ADMIN only (ADMIN cannot access user personal details)
router.get('/users', authorize(['SUPER_ADMIN']), getUsers);
router.post('/users/verify', authorize(['SUPER_ADMIN']), verifyUser);
router.post('/users/:userId/deactivate', authorize(['SUPER_ADMIN']), deactivateUser);
router.delete('/users/:userId', authorize(['SUPER_ADMIN']), deleteUser);

export default router;
