import express from 'express';
import { passwordLimiter } from '../middleware/rateLimiter.js';
import {
  register,
  login,
  logout,
  resendVerification,
  forgotPassword,
  verifyResetOtp,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-verification', resendVerification);

// Guessing a 6-digit code is cheap without a limiter, so every step of the
// reset flow sits behind the same one the change-password route uses.
router.post('/forgot-password', passwordLimiter, forgotPassword);
router.post('/verify-reset-otp', passwordLimiter, verifyResetOtp);
router.post('/reset-password', passwordLimiter, resetPassword);

export default router;
