import { Router } from 'express';
import { authenticate, requireMinRole } from '../middleware/auth';
import { upload } from '../utils/cloudinary';
import {
    followBusiness, getFollowStatus,
    getBusinessFeed,
    getBusinessPosts, createBusinessPost, updateBusinessPost, deleteBusinessPost,
    toggleLike,
    getComments, addComment, deleteComment,
} from '../controllers/businessEngagementController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Feed ─────────────────────────────────────────────────────────────────
router.get('/feed', getBusinessFeed);

// ── Follow ────────────────────────────────────────────────────────────────
router.post('/follow/:businessId', followBusiness);
router.get('/follow/:businessId/status', getFollowStatus);

// ── Posts (per business) ─────────────────────────────────────────────────
router.get('/:businessId/posts', getBusinessPosts);
router.post('/:businessId/posts', upload.single('image'), createBusinessPost);
router.put('/posts/:postId', updateBusinessPost);
router.delete('/posts/:postId', deleteBusinessPost);

// ── Likes ─────────────────────────────────────────────────────────────────
router.post('/posts/:postId/like', toggleLike);

// ── Comments ──────────────────────────────────────────────────────────────
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', addComment);
router.delete('/comments/:commentId', deleteComment);

export default router;
