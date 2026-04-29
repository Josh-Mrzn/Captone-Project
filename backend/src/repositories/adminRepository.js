import Product from '../models/Product.js'; // Import your actual Mongoose model

class AdminRepository {
  // We no longer need the constructor with this.products = []
  
async addProduct(productData, adminId) {
  const lastProduct = await Product.findOne().sort({ id: -1 });
  const nextId = lastProduct ? lastProduct.id + 1 : 1;

  return await Product.create({
    ...productData,
    id: nextId,
    createdBy: adminId // Store who made it
  });
}

async getProductsByAdmin(adminId) {
  // Returns only products created by this specific admin
  return await Product.find({ createdBy: adminId });
}
  async getProductById(id) {
    // Search by your custom integer id
    return await Product.findOne({ id: parseInt(id) });
  }

  async updateProduct(id, updatedFields) {
    // Update in MongoDB
    return await Product.findOneAndUpdate(
      { id: parseInt(id) },
      updatedFields,
      { new: true }
    );
  }

  async deleteProduct(id) {
    const result = await Product.deleteOne({ id: parseInt(id) });
    return result.deletedCount > 0;
  }

  async getAllProducts() {
    return await Product.find();
  }

  async getOrders() {
    // You'll eventually import an Order model here
    return []; 
  }
}

export default AdminRepository;