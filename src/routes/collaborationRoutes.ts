import { Router } from 'express';
import { createCollaborationRequest, getAllCollaborationRequests } from '../controllers/collaborationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create a collaboration request (Business Owners only)
router.post('/create', authenticate, createCollaborationRequest);

// Get all requests
router.get('/all', getAllCollaborationRequests);

export default router;
