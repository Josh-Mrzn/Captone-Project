import * as AdminService from '../services/adminService.js';

export const addProduct = async (req, res) => {
  try {
    const adminId = req.user.userId; 
    const product = await adminService.addProduct(req.body, adminId);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const products = await adminService.getMyProducts(adminId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await adminService.editProduct(parseInt(id), req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteProduct(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const viewOrders = async (req, res) => {
  try {
    const orders = await adminService.viewOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};