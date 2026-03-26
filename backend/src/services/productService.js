// src/services/productService.js
import { productRepository } from '../repositories/productRepository.js';

export const productService = {

  // Get all products
  async getAllProducts(page = 1, limit = 10, filters = {}) {
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive numbers');
    }

    return await productRepository.getAllProducts(page, limit, filters);
  },

  // Get product by ID
  async getProductById(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },

  // Create new product
  async createProduct(productData) {
    const { name, category, price, stock } = productData;

    if (!name || !category || price === undefined || stock === undefined) {
      throw new Error('Name, category, price, and stock are required');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return await productRepository.createProduct(productData);
  },

  // Update product
  async updateProduct(id, updateData) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    // Validate price if provided
    if (updateData.price !== undefined && updateData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Validate stock if provided
    if (updateData.stock !== undefined && updateData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const product = await productRepository.updateProduct(id, updateData);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },

  // Delete product
  async deleteProduct(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    const product = await productRepository.deleteProduct(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },

  // Get products by category
  async getProductsByCategory(category) {
    if (!category) {
      throw new Error('Category is required');
    }

    return await productRepository.getProductsByCategory(category);
  },

  // Get low stock products
  async getLowStockProducts(threshold = 50) {
    return await productRepository.getLowStockProducts(threshold);
  },

  // Get out of stock products
  async getOutOfStockProducts() {
    return await productRepository.getOutOfStockProducts();
  },

  // Update product stock
  async updateStock(id, quantity) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    if (typeof quantity !== 'number') {
      throw new Error('Quantity must be a number');
    }

    return await productRepository.updateStock(id, quantity);
  },

  // Search products
  async searchProducts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new Error('Search term is required');
    }

    return await productRepository.searchProducts(searchTerm);
  }
};
