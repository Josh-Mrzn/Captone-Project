class SuperAdminController {
  constructor(superAdminService) {
    this.superAdminService = superAdminService;
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.superAdminService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  suspendUser = async (req, res) => {
    try {
      const adminId = req.user.userId;
      const targetId = req.params.id;

      if (!adminId) {
        return res.status(401).json({ error: "Admin identity not found in token" });
      }

      const user = await this.superAdminService.suspendUser(targetId, adminId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const result = await this.superAdminService.deleteUser(req.params.id, req.user.userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getPendingApprovals = async (req, res) => {
    try {
      const approvals = await this.superAdminService.getPendingApprovals();
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  approveAdmin = async (req, res) => {
    try {
      const user = await this.superAdminService.approveAdmin(
        req.params.id,
        req.user.userId
      );

      res.json({
        message: 'User activated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const user = await this.superAdminService.createUser(req.body, req.user.userId);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const user = await this.superAdminService.updateUser(req.params.id, req.body, req.user.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  activateUser = async (req, res) => {
    try {
      const adminId = req.user.userId;
      const targetId = req.params.id;

      const user = await this.superAdminService.activateUser(targetId, adminId);
      res.json({
        message: "User activated successfully",
        user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

// ✅ Now using export default just like AdminController
export default SuperAdminController;