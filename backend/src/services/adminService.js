import AdminRepository from '../repositories/adminRepository.js';

class AdminService {
  // ✅ Change: Receive the repository instance as a parameter
  constructor(adminRepository) {
    // If for some reason one isn't passed, we can fall back to a new one
    this.adminRepository = adminRepository || new AdminRepository();
  }

async addProduct(productData, adminId) {
    if (!productData?.name || !productData?.price) {
      throw new Error('Product name and price are required.');
    }
    return this.adminRepository.addProduct(productData, adminId);
  }

  async getMyProducts(adminId) {
    if (!adminId) throw new Error('Admin ID is required.');
    return this.adminRepository.getProductsByAdmin(adminId);
  }

  async editProduct(id, productData) {
    // Note: Use parseInt here if your route doesn't do it, to match integer IDs
    const productId = typeof id === 'string' ? parseInt(id) : id;
    const existingProduct = await this.adminRepository.getProductById(productId);
    
    if (!existingProduct) {
      throw new Error('Product not found.');
    }
    return this.adminRepository.updateProduct(productId, productData);
  }

  async deleteProduct(id) {
    const productId = typeof id === 'string' ? parseInt(id) : id;
    const deleted = await this.adminRepository.deleteProduct(productId);
    
    if (!deleted) {
      throw new Error('Product not found.');
    }
    return { message: 'Product deleted successfully.' };
  }

  async viewOrders() {
    return this.adminRepository.getOrders();
  }
}

export default AdminService;