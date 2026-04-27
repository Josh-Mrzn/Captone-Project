import SuperAdminRepository from '../repositories/superAdminRepository.js';

class SuperAdminService {
  async getAllUsers() {
    return SuperAdminRepository.findAllUsers();
  }

  // NOTE: 'dbId' is the MongoDB _id string from the URL
  // 'adminId' is the req.user.userId from your JWT
  async suspendUser(dbId, adminId) {
    const user = await SuperAdminRepository.updateUser(dbId, { status: 'suspended' });
    await SuperAdminRepository.createAuditLog({
      adminId, 
      action: 'SUSPEND_USER',
      targetId: dbId,
      details: `User ${user.email} (ID: ${user.userId}) suspended`
    });
    return user;
  }

  async activateUser(dbId, adminId) {
    const user = await SuperAdminRepository.updateUser(dbId, { status: 'active' });
    await SuperAdminRepository.createAuditLog({
      adminId,
      action: 'ACTIVATE_USER',
      targetId: dbId,
      details: `User ${user.email} (ID: ${user.userId}) activated`
    });
    return user;
  }

  async deleteUser(dbId, adminId) {
    const user = await SuperAdminRepository.findUserById(dbId);
    await SuperAdminRepository.deleteUser(dbId);
    await SuperAdminRepository.createAuditLog({
      adminId,
      action: 'DELETE_USER',
      targetId: dbId,
      details: `User ${user.email} (ID: ${user.userId}) deleted`
    });
    return { message: 'User deleted' };
  }

async approveAdmin(userId, superAdminId) {
  const user = await SuperAdminRepository.updateUser(userId, {
    status: 'active'
  });

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

  async createUser(userData, adminId) {
    // 1. Get all users to find the highest integer ID
    const users = await SuperAdminRepository.findAllUsers();
    
    // 2. Calculate next integer ID
    const lastUser = users
      .filter(u => typeof u.userId === 'number')
      .sort((a, b) => b.userId - a.userId)[0];
    
    const nextId = lastUser ? lastUser.userId + 1 : 1;

    // 3. Create user with integer userId and active status
    const newUser = await SuperAdminRepository.createUser({
      ...userData,
      userId: nextId,
      status: 'active' 
    });
    
    await SuperAdminRepository.createAuditLog({
      adminId, 
      action: 'CREATE_USER',
      targetId: newUser._id,
      details: `User ${newUser.email} created with ID ${nextId}`
    });

    return newUser;
  }

async updateUser(idFromUrl, updateData, adminId) {
  // 1. Update the user via the repository
  const user = await SuperAdminRepository.updateUser(idFromUrl, updateData);
  
  if (!user) throw new Error("User not found");

  // 2. Log using the simple ID
  await SuperAdminRepository.createAuditLog({
    adminId: adminId, 
    action: 'UPDATE_USER',
    targetId: user.userId, // <--- Use the integer ID here
    details: `Updated details for ${user.email}`
  });

  return user;
}
async activateUser(idFromUrl, adminId) {
  // Find and update the user back to active status
  const user = await SuperAdminRepository.updateUser(idFromUrl, { status: 'active' });

  if (!user) throw new Error("User not found");

  // Log the activation
  await SuperAdminRepository.createAuditLog({
    adminId: adminId,      // This is the Number from your JWT
    action: 'ACTIVATE_USER',
    targetId: user.userId, // This is the Number of the target user
    details: `User ${user.email} was activated (unsuspended) by admin ${adminId}`
  });

  return user;
}
}



export default new SuperAdminService();