
import { Router } from 'express';
import {
    createHelpRequest,
    getAllHelpRequests,
    getMyHelpRequests,
    updateHelpRequestStatus,
    bulkUpdateHelpRequests,
    getHelpDeskStats
} from '../controllers/helpRequestController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public / Common
router.get('/all', authenticate, getAllHelpRequests); // Authenticated to see help requests

// User
router.post('/create', authenticate, createHelpRequest);
router.get('/my-requests', authenticate, getMyHelpRequests);
router.put('/:id/status', authenticate, updateHelpRequestStatus); // User can also update status (e.g. resolve)

// Admin (Should have admin middleware in production, but relying on controller check for now or assuming authenticate is enough for role checking at controller level)
router.get('/stats', authenticate, getHelpDeskStats);
router.post('/bulk-update', authenticate, bulkUpdateHelpRequests);

export default router;
