// src/controllers/authController.js
import { authService } from '../services/authService.js';
import { getIO } from '../sockets/adminSocket.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
    });
  }catch (err) {
    return res.status(401).json({
      message: err.message || 'Registration failed'
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    // === WebSocket Real-time Feed ===
    const io = getIO();
    if (io) {
      io.emit('new-login', {
        userId: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      ...result
    });

  } catch (err) {
    return res.status(401).json({
      message: err.message || 'Login failed'
    });
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