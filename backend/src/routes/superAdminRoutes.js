import express from 'express';
import { getUsers, updateUser, suspendUser, deleteUser, getPendingApprovals, approveAdmin, createUser, activateUser } from '../controllers/SuperAdminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require superadmin role
router.use(protect, authorizeRoles('superadmin'));

router.get('/users', getUsers);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);
router.post('/users', createUser);
router.get('/approvals/pending', getPendingApprovals);
router.put('/approvals/:id/approve', approveAdmin);
router.put('/users/:id', updateUser);
router.put('/users/:id/activate', activateUser);
export default router;
