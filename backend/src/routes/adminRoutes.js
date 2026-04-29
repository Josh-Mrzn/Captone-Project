import express from 'express';
import AdminRepository from '../repositories/adminRepository.js';
import AdminService from '../services/adminService.js';
import AdminController from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect, authorizeRoles('admin'));

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.post('/products', (req, res) => adminController.addProduct(req, res));
router.put('/products/:id', (req, res) => adminController.editProduct(req, res));
router.delete('/products/:id', (req, res) => adminController.deleteProduct(req, res));
router.get('/orders', (req, res) => adminController.viewOrders(req, res));
router.get('/products', (req, res) => adminController.getMyProducts(req, res));
export default router;