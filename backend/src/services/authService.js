// src/services/authService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authRepository } from '../repositories/authRepository.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in .env");
}

export const authService = {

  // ====================== REGISTER ======================
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user (password will be hashed by model pre-save hook)
    const newUser = await authRepository.createUser({ name, email, password });

    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
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

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
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