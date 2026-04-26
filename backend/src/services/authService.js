import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authRepository } from '../repositories/authRepository.js';

export const authService = {

  // ====================== REGISTER ======================
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // NOTE: Ensure your authRepository.createUser logic 
    // also generates the next integer userId like your SuperAdminService does!
    const newUser = await authRepository.createUser({
      name,
      email,
      password,
      role: 'admin'
    });

    return {
      id: newUser.userId, // ✅ Return the simple integer ID
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
  },

  // ====================== LOGIN ======================
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('Internal Server Error');
    }

    // ✅ THE FIX: Use user.userId (Integer) instead of user._id (ObjectId)
    const token = jwt.sign(
      {
        userId: user.userId, 
        email: user.email,
        role: user.role 
      },
      secret,
      { expiresIn: '15m' }
    );

    const userResponse = {
      id: user.userId, // ✅ Return simple ID to frontend
      name: user.name,
      email: user.email,
      role: user.role 
    };

    return { token, user: userResponse };
  },

  // ====================== LOGOUT ======================
  getLogoutCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    };
  }
};