import bcrypt from 'bcryptjs';
import {
  findUserByUserId,
  updateUserByUserId,
  updatePasswordByUserId
} from '../repositories/userRepository.js';

// ====================== UPDATE PROFILE ======================
export const updateProfileService = async (userId, updateData) => {
  const allowedFields = ['name', 'email'];

  const filteredData = {};
  for (const key of allowedFields) {
    if (updateData[key]) {
      filteredData[key] = updateData[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new Error('No valid fields to update');
  }

  const user = await updateUserByUserId(userId, filteredData);

  if (!user) throw new Error('User not found');

  return {
    userId: user.userId,
    name: user.name,
    email: user.email
  };
};

// ====================== UPDATE PASSWORD ======================
export const updatePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  if (!currentPassword || !newPassword) {
    throw new Error('Both passwords are required');
  }

  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const user = await findUserByUserId(userId);

  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  if (currentPassword === newPassword) {
    throw new Error('New password must be different');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await updatePasswordByUserId(userId, hashedPassword);

  return { message: 'Password updated successfully' };
};