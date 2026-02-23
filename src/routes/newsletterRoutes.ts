import express from 'express';
import {
    createNewsletter,
    getNewsletters,
    getNewsletterById,
    updateNewsletter,
    publishNewsletter,
    deleteNewsletter
} from '../controllers/newsletterController';
// Add authentication middleware if needed, e.g., authenticateUser, authorizeAdmin
// import { authenticateToken, authorizeAdmin } from '../middleware/auth'; 

const router = express.Router();

// Public Routes (Visible to all members)
// In a real app, public routes would only show approved newsletters
router.get('/all', getNewsletters);
router.get('/:id', getNewsletterById);

// Admin Routes (Should be protected in production)
router.post('/create', createNewsletter);
router.put('/update/:id', updateNewsletter);
router.post('/publish/:id', publishNewsletter);
router.delete('/:id', deleteNewsletter);

export default router;
