import Product from '../models/Product.js';

export const addProduct = async (productData, adminId) => {
  return await Product.create({
    ...productData,
    createdBy: adminId,
  });
};

export const getProductsByAdmin = async (adminId) => {
  return await Product.find({ createdBy: adminId }).sort({ createdAt: -1 });
};

export const getProductById = async (id, sellerId) => {
  return await Product.findOne({ _id: id, createdBy: sellerId });
};

export const updateProduct = async (id, sellerId, updatedFields) => {
  return await Product.findOneAndUpdate(
    { _id: id, createdBy: sellerId },
    updatedFields,
    { new: true }
  );
};

export const deleteProduct = async (id, sellerId) => {
  const result = await Product.deleteOne({ _id: id, createdBy: sellerId });
  return result.deletedCount > 0;
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const decrementStock = async (productId, qty) => {
  return await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: qty } },
    { $inc: { stock: -qty } },
    { new: true }
  );
};

export const incrementStock = async (productId, qty) => {
  return await Product.findOneAndUpdate(
    { _id: productId },
    { $inc: { stock: qty } },
    { new: true }
  );
};