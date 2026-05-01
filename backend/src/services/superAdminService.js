import * as SuperAdminRepo from '../repositories/superAdminRepository.js';

export const getAllUsers = async () => {
  return await SuperAdminRepo.findAllUsers();
};

// --- SUSPEND USER ---
export const suspendUser = async (idFromUrl, adminId) => {
  const user = await SuperAdminRepo.updateUser(idFromUrl, { status: 'suspended' });
  if (!user) throw new Error("User not found");

  await SuperAdminRepo.createAuditLog({
    adminId, 
    action: 'SUSPEND_USER',
    targetId: user.userId, 
    details: `User ${user.email} (ID: ${user.userId}) suspended`
  });
  return user;
};

// --- ACTIVATE / UNSUSPEND USER ---
export const activateUser = async (idFromUrl, adminId) => {
  const user = await SuperAdminRepo.updateUser(idFromUrl, { status: 'active' });
  if (!user) throw new Error("User not found");

  await SuperAdminRepo.createAuditLog({
    adminId,
    action: 'ACTIVATE_USER',
    targetId: user.userId, 
    details: `User ${user.email} (ID: ${user.userId}) activated`
  });
  return user;
};

// --- DELETE USER ---
export const deleteUser = async (idFromUrl, adminId) => {
  const user = await SuperAdminRepo.findUserById(idFromUrl);
  if (!user) throw new Error("User not found");

  await SuperAdminRepo.deleteUser(idFromUrl);

  await SuperAdminRepo.createAuditLog({
    adminId,
    action: 'DELETE_USER',
    targetId: user.userId, 
    details: `User ${user.email} (ID: ${user.userId}) deleted`
  });
  return { message: 'User deleted successfully' };
};

// --- CREATE USER ---
export const createUser = async (userData, adminId) => {
  const users = await SuperAdminRepo.findAllUsers();
  const lastUser = users
    .filter(u => typeof u.userId === 'number')
    .sort((a, b) => b.userId - a.userId)[0];
  
  const nextId = lastUser ? lastUser.userId + 1 : 1;

  const newUser = await SuperAdminRepo.createUser({
    ...userData,
    userId: nextId,
    status: 'active' 
  });
  
  await SuperAdminRepo.createAuditLog({
    adminId, 
    action: 'CREATE_USER',
    targetId: newUser.userId, 
    details: `User ${newUser.email} created with ID ${nextId}`
  });

  return newUser;
};

// --- UPDATE USER ---
export const updateUser = async (idFromUrl, updateData, adminId) => {
  const user = await SuperAdminRepo.updateUser(idFromUrl, updateData);
  if (!user) throw new Error("User not found");

  await SuperAdminRepo.createAuditLog({
    adminId, 
    action: 'UPDATE_USER',
    targetId: user.userId, 
    details: `Updated details for ${user.email}`
  });

  return user;
};

// --- ADMIN APPROVALS ---
export const approveAdmin = async (idFromUrl, superAdminId) => {
  const user = await SuperAdminRepo.updateUser(idFromUrl, { status: 'active' });
  if (!user) throw new Error("User not found");

  await SuperAdminRepo.createAuditLog({
    adminId: superAdminId,
    action: 'ACTIVATE_USER',
    targetId: user.userId,
    details: `User ${user.email} moved from pending → active`
  });

  return user;
};

export const getPendingApprovals = async () => {
  return await SuperAdminRepo.findPendingApprovals();
};