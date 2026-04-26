import SuperAdminService from '../services/superAdminService.js';

export const getUsers = async (req, res) => {
  try {
    const users = await SuperAdminService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    // Ensure you are using .userId (the integer we put in the token)
    const adminId = req.user.userId; 
    const targetId = req.params.id;

    if (!adminId) {
      return res.status(401).json({ error: "Admin identity not found in token" });
    }

    const user = await SuperAdminService.suspendUser(targetId, adminId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await SuperAdminService.deleteUser(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingApprovals = async (req, res) => {
  try {
    const approvals = await SuperAdminService.getPendingApprovals();
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveAdmin = async (req, res) => {
  try {
    const user = await SuperAdminService.approveAdmin(req.params.id, req.user.id);
    res.json({ message: 'Admin approved and email sent', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    // Change req.user.id to req.user.userId
    const user = await SuperAdminService.createUser(req.body, req.user.userId); 
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

 export const updateUser = async (req, res) => {
  try {
    const user = await SuperAdminService.updateUser(req.params.id, req.body, req.user.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const adminId = req.user.userId; // The integer from the fresh token
    const targetId = req.params.id;  // The integer 'userId' from the URL

    const user = await SuperAdminService.activateUser(targetId, adminId);
    res.json({
      message: "User activated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
