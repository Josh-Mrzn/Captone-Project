class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

async addProduct(req, res) {
  try {
    // Grab the ID of the logged-in admin from the request object
    const adminId = req.user.userId; 
    const product = await this.adminService.addProduct(req.body, adminId);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async getMyProducts(req, res) {
  try {
    const adminId = req.user.userId;
    const products = await this.adminService.getMyProducts(adminId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  async editProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await this.adminService.editProduct(parseInt(id), req.body);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await this.adminService.deleteProduct(parseInt(id));
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async viewOrders(req, res) {
    try {
      const orders = await this.adminService.viewOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AdminController;
