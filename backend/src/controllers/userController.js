import {
  updateProfileService,
  updatePasswordService
} from '../services/userService.js';

// ====================== UPDATE PROFILE ======================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await updateProfileService(userId, req.body);

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ====================== UPDATE PASSWORD ======================
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    const result = await updatePasswordService(
      userId,
      currentPassword,
      newPassword
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};