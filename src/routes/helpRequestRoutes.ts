
import { Router } from 'express';
import { createHelpRequest, getAllHelpRequests, getMyHelpRequests, markRequestAsResolved } from '../controllers/helpRequestController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public (to view approved requests)
router.get('/all', getAllHelpRequests);

// Protected
router.post('/create', authenticate, createHelpRequest);
router.get('/my-requests', authenticate, getMyHelpRequests);
router.put('/:id/resolve', authenticate, markRequestAsResolved);

export default router;
