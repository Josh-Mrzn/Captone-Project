import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
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

    // ── Auto-increment userId ────────────────────────────────
    // Query all userId values, ignore any that aren't valid numbers
    // (guards against legacy documents seeded without the field).
    const allUsers = await User.find({}, 'userId').lean();
    const validIds = allUsers
      .map(u => u.userId)
      .filter(id => typeof id === 'number' && Number.isFinite(id));
    const nextId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;

    const newUser = await authRepository.createUser({
      userId: nextId,
      name,
      email,
      password,
      role: 'admin',
    });

    return {
      id:    newUser.userId,
      name:  newUser.name,
      email: newUser.email,
      role:  newUser.role,
    };
  },

  // ====================== LOGIN ======================
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Internal Server Error');

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      secret,
      { expiresIn: '8h' }   // bumped from 15m — avoids constant re-login during dev
    );

    return {
      token,
      user: {
        id:    user.userId,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    };
  },

  // ====================== LOGOUT ======================
  getLogoutCookieOptions() {
    return {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   0,
      path:     '/',
    };
  },
};
