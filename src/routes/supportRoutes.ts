
import { Router } from 'express';
import { createSupportRequest, getMySupportRequests, getAllSupportRequests } from '../controllers/supportController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Protected
router.post('/create', authenticate, createSupportRequest);
router.get('/my-requests', authenticate, getMySupportRequests);

// Admin / Mentor (TODO: Refine RBAC)
router.get('/all', authenticate, authorize(['ADMIN', 'MENTOR']), getAllSupportRequests);

export default router;
