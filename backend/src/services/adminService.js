import * as adminRepo from '../repositories/adminRepository.js';

export const addProduct = async (productData, adminId) => {
  if (!productData?.name || !productData?.price) {
    throw new Error('Product name and price are required.');
  }
  // Call the functional repository directly
  return await adminRepo.addProduct(productData, adminId);
};

export const getMyProducts = async (adminId) => {
  if (!adminId) throw new Error('Admin ID is required.');
  return await adminRepo.getProductsByAdmin(adminId);
};

export const editProduct = async (id, productData) => {
  const productId = typeof id === 'string' ? parseInt(id) : id;
  const existingProduct = await adminRepo.getProductById(productId);
  
  if (!existingProduct) {
    throw new Error('Product not found.');
  }
  return await adminRepo.updateProduct(productId, productData);
};

export const deleteProduct = async (id) => {
  const productId = typeof id === 'string' ? parseInt(id) : id;
  const deleted = await adminRepo.deleteProduct(productId);
  
  if (!deleted) {
    throw new Error('Product not found.');
  }
  return { message: 'Product deleted successfully.' };
};

export const viewOrders = async () => {
  return await adminRepo.getOrders();
};