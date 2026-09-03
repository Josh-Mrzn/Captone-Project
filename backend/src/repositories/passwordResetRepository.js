import PasswordResetOtp from '../models/PasswordResetOtp.js';

export const passwordResetRepository = {
  /**
   * A new code retires every earlier one for that address, so a user who taps
   * "Resend" three times still ends up with exactly one code that works.
   */
  async consumeAllFor(email) {
    return PasswordResetOtp.updateMany(
      { email, consumedAt: null },
      { consumedAt: new Date() }
    );
  },

  async create({ email, codeHash, expiresAt }) {
    return PasswordResetOtp.create({ email, codeHash, expiresAt });
  },

  async findActive(email) {
    return PasswordResetOtp.findOne({
      email,
      consumedAt: null,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });
  },

  async countRecent(email, since) {
    return PasswordResetOtp.countDocuments({ email, createdAt: { $gte: since } });
  },

  async recordAttempt(id) {
    return PasswordResetOtp.findByIdAndUpdate(
      id,
      { $inc: { attempts: 1 } },
      { new: true }
    );
  },

  async markConsumed(id) {
    return PasswordResetOtp.findByIdAndUpdate(
      id,
      { consumedAt: new Date() },
      { new: true }
    );
  }
};
