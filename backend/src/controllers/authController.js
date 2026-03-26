// src/controllers/authController.js
import { authService } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
    });
  } catch (err) {
    next(err);                    // ← Pass error to error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/'
    });

    res.json({
      success: true,
      message: 'Login successful',
      user
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};