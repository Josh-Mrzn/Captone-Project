import SuperAdminRepository from '../repositories/superAdminRepository.js';

class SuperAdminService {
  async getAllUsers() {
    return SuperAdminRepository.findAllUsers();
  }

  // --- SUSPEND USER ---
  async suspendUser(idFromUrl, adminId) {
    const user = await SuperAdminRepository.updateUser(idFromUrl, { status: 'suspended' });
    if (!user) throw new Error("User not found");

    await SuperAdminRepository.createAuditLog({
      adminId, 
      action: 'SUSPEND_USER',
      targetId: user.userId, // ✅ Changed from dbId to integer userId
      details: `User ${user.email} (ID: ${user.userId}) suspended`
    });
    return user;
  }

  // --- ACTIVATE / UNSUSPEND USER ---
  async activateUser(idFromUrl, adminId) {
    const user = await SuperAdminRepository.updateUser(idFromUrl, { status: 'active' });
    if (!user) throw new Error("User not found");

    await SuperAdminRepository.createAuditLog({
      adminId,
      action: 'ACTIVATE_USER',
      targetId: user.userId, // ✅ Changed from dbId to integer userId
      details: `User ${user.email} (ID: ${user.userId}) activated`
    });
    return user;
  }

  // --- DELETE USER ---
  async deleteUser(idFromUrl, adminId) {
    // We find the user first to get their integer ID for the log before they are gone
    const user = await SuperAdminRepository.findUserById(idFromUrl);
    if (!user) throw new Error("User not found");

    await SuperAdminRepository.deleteUser(idFromUrl);

    await SuperAdminRepository.createAuditLog({
      adminId,
      action: 'DELETE_USER',
      targetId: user.userId, // ✅ Use integer userId
      details: `User ${user.email} (ID: ${user.userId}) deleted`
    });
    return { message: 'User deleted successfully' };
  }

  // --- CREATE USER ---
  async createUser(userData, adminId) {
    const users = await SuperAdminRepository.findAllUsers();
    const lastUser = users
      .filter(u => typeof u.userId === 'number')
      .sort((a, b) => b.userId - a.userId)[0];
    
    const nextId = lastUser ? lastUser.userId + 1 : 1;

    const newUser = await SuperAdminRepository.createUser({
      ...userData,
      userId: nextId,
      status: 'active' 
    });
    
    await SuperAdminRepository.createAuditLog({
      adminId, 
      action: 'CREATE_USER',
      targetId: newUser.userId, // ✅ Use the new integer ID
      details: `User ${newUser.email} created with ID ${nextId}`
    });

    return newUser;
  }

  // --- UPDATE USER ---
  async updateUser(idFromUrl, updateData, adminId) {
    const user = await SuperAdminRepository.updateUser(idFromUrl, updateData);
    if (!user) throw new Error("User not found");

    await SuperAdminRepository.createAuditLog({
      adminId, 
      action: 'UPDATE_USER',
      targetId: user.userId, // ✅ Use integer userId
      details: `Updated details for ${user.email}`
    });

    return user;
  }

  // --- ADMIN APPROVALS ---
  async approveAdmin(idFromUrl, superAdminId) {
    const user = await SuperAdminRepository.updateUser(idFromUrl, { status: 'active' });
    if (!user) throw new Error("User not found");

    await SuperAdminRepository.createAuditLog({
      adminId: superAdminId,
      action: 'ACTIVATE_USER',
      targetId: user.userId,
      details: `User ${user.email} moved from pending → active`
    });

    return user;
  }

  async getPendingApprovals() {
    return SuperAdminRepository.findPendingApprovals();
  }
}

export default new SuperAdminService();