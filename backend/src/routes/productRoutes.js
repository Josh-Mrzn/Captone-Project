// src/routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getLowStockProducts,
  getOutOfStockProducts,
  updateStock,
  searchProducts
} from '../controllers/productController.js';

const router = express.Router();

// Product Routes
router.get('/', getAllProducts);                           // GET /api/products
router.get('/search', searchProducts);                     // GET /api/products/search?q=term
router.get('/category/:category', getProductsByCategory); // GET /api/products/category/:category
router.get('/stock/low', getLowStockProducts);             // GET /api/products/stock/low
router.get('/stock/out', getOutOfStockProducts);           // GET /api/products/stock/out
router.get('/:id', getProductById);                        // GET /api/products/:id
router.post('/', createProduct);                           // POST /api/products
router.put('/:id', updateProduct);                         // PUT /api/products/:id
router.delete('/:id', deleteProduct);                      // DELETE /api/products/:id
router.patch('/:id/stock', updateStock);                   // PATCH /api/products/:id/stock

export default router;
