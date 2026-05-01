import Product from '../models/Product.js';

export const addProduct = async (productData, adminId) => {
  // Find the last product to determine the next custom integer ID
  const lastProduct = await Product.findOne().sort({ id: -1 });
  const nextId = lastProduct ? lastProduct.id + 1 : 1;

  return await Product.create({
    ...productData,
    id: nextId,
    createdBy: adminId
  });
};

export const getProductsByAdmin = async (adminId) => {
  return await Product.find({ createdBy: adminId });
};

export const getProductById = async (id) => {
  return await Product.findOne({ id: parseInt(id) });
};

export const updateProduct = async (id, updatedFields) => {
  return await Product.findOneAndUpdate(
    { id: parseInt(id) },
    updatedFields,
    { new: true }
  );
};

export const deleteProduct = async (id) => {
  const result = await Product.deleteOne({ id: parseInt(id) });
  return result.deletedCount > 0;
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const getOrders = async () => {
  // Logic for orders will go here
  return [];
};