import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { passwordLimiter } from '../middleware/rateLimiter.js';
import {
  updateProfile,
  updatePassword
} from '../controllers/userController.js';

const router = express.Router();

router.put('/edit', protect, updateProfile);
router.put('/reset-password', protect, passwordLimiter, updatePassword);

export default router;