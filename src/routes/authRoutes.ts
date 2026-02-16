
import { Router } from 'express';
import { login, verifyOtp } from '../controllers/authController';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', otpLimiter, login);
router.post('/verify-otp', authLimiter, verifyOtp);

export default router;
