import express from 'express';
// ✅ Import specific functions instead of the whole class
import { 
  addProduct, 
  editProduct, 
  deleteProduct, 
  viewOrders, 
  getMyProducts 
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(protect, authorizeRoles('admin'));

router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', viewOrders);
router.get('/products', getMyProducts);

export default router;