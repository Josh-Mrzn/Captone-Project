import express from 'express';
// 1. Import the class (no curly braces needed now)
import SuperAdminController from '../controllers/superAdminController.js';
import SuperAdminService from '../services/superAdminService.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// 2. Initialize the Service and Controller
// (If your Service is also a class, use 'new'. If it's an object, just pass it)
const superAdminController = new SuperAdminController(SuperAdminService);

router.use(protect, authorizeRoles('superadmin'));

// 3. Update the route calls to use the instance
router.get('/users', superAdminController.getUsers);
router.put('/users/:id/suspend', superAdminController.suspendUser);
router.delete('/users/:id', superAdminController.deleteUser);
router.post('/users', superAdminController.createUser);
router.get('/approvals/pending', superAdminController.getPendingApprovals);
router.put('/approvals/:id/approve', superAdminController.approveAdmin);
router.put('/users/:id', superAdminController.updateUser);
router.put('/users/:id/activate', superAdminController.activateUser);

export default router;