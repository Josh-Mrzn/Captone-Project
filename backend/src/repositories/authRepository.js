// src/repositories/authRepository.js
import User from '../models/User.js';

export const authRepository = {

  // Find user by email (include password for login)
  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  },

  // Create new user
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  },

  // Find user by ID (without password - for profile etc.)
  async findById(id) {
    return await User.findById(id).select('-password');
  }
};