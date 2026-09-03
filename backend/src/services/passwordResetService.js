import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authRepository } from '../repositories/authRepository.js';
import { passwordResetRepository } from '../repositories/passwordResetRepository.js';
import { updatePasswordByUserId } from '../repositories/userRepository.js';
import { getFirebaseAuth } from '../config/firebase.js';
import { sendMail, isMailConfigured } from '../config/mailer.js';
import { OTP_TTL_MINUTES, OTP_MAX_ATTEMPTS } from '../models/PasswordResetOtp.js';

const RESET_TOKEN_TTL = '15m';
const RESET_TOKEN_PURPOSE = 'password-reset';
const RESEND_WINDOW_MS = 15 * 60 * 1000;
const MAX_CODES_PER_WINDOW = 5;

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

/**
 * crypto.randomInt, not Math.random — a reset code is a credential, and a
 * predictable one is the whole attack.
 */
function generateCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

function otpEmailHtml(name, code) {
  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#16211b">
      <h2 style="color:#3f6b4c;margin:0 0 8px">AgriFair password reset</h2>
      <p style="margin:0 0 20px;color:#4c5b51">
        Hi ${name || 'there'}, use this code to reset your password.
      </p>
      <div style="font-size:34px;font-weight:700;letter-spacing:10px;color:#16211b;
                  background:#edf2ea;padding:18px;text-align:center;border-radius:6px">
        ${code}
      </div>
      <p style="margin:20px 0 0;color:#4c5b51">
        The code expires in ${OTP_TTL_MINUTES} minutes and can be used once.
      </p>
      <p style="margin:8px 0 0;color:#7c8b81;font-size:13px">
        If you did not ask for this, you can ignore this email — your password stays as it is.
      </p>
    </div>
  `;
}

export const passwordResetService = {
  /**
   * Always resolves the same way whether or not the address exists. Telling a
   * caller "no such user" turns this endpoint into a way to harvest which
   * emails are registered.
   */
  async requestOtp({ email }) {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) throw new Error('Email is required');

    if (!isMailConfigured()) {
      throw new Error(
        'Email is not set up. Add SMTP_HOST, SMTP_USER and SMTP_PASS to backend/.env, then restart the server.'
      );
    }

    const user = await authRepository.findByEmail(cleanEmail);
    if (!user) return { sent: false };

    const recentCount = await passwordResetRepository.countRecent(
      cleanEmail,
      new Date(Date.now() - RESEND_WINDOW_MS)
    );
    if (recentCount >= MAX_CODES_PER_WINDOW) {
      throw new Error('Too many reset codes requested. Please try again later.');
    }

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await passwordResetRepository.consumeAllFor(cleanEmail);
    await passwordResetRepository.create({ email: cleanEmail, codeHash, expiresAt });

    await sendMail({
      to: cleanEmail,
      subject: `${code} is your AgriFair reset code`,
      html: otpEmailHtml(user.name, code)
    });

    return { sent: true };
  },

  /**
   * Trades a correct code for a short-lived token. The password change itself
   * is a separate call, so the code never has to travel with the new password.
   */
  async verifyOtp({ email, code }) {
    const cleanEmail = normalizeEmail(email);
    const cleanCode = typeof code === 'string' ? code.trim() : '';

    if (!cleanEmail || !cleanCode) {
      throw new Error('Email and code are required');
    }

    const record = await passwordResetRepository.findActive(cleanEmail);
    if (!record) {
      throw new Error('That code has expired. Request a new one.');
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await passwordResetRepository.markConsumed(record._id);
      throw new Error('Too many wrong attempts. Request a new code.');
    }

    const isMatch = await bcrypt.compare(cleanCode, record.codeHash);
    if (!isMatch) {
      const updated = await passwordResetRepository.recordAttempt(record._id);
      const left = Math.max(0, OTP_MAX_ATTEMPTS - (updated?.attempts ?? OTP_MAX_ATTEMPTS));
      throw new Error(
        left > 0
          ? `Incorrect code. ${left} ${left === 1 ? 'try' : 'tries'} left.`
          : 'Too many wrong attempts. Request a new code.'
      );
    }

    await passwordResetRepository.markConsumed(record._id);

    const resetToken = jwt.sign(
      { purpose: RESET_TOKEN_PURPOSE, email: cleanEmail },
      getJwtSecret(),
      { expiresIn: RESET_TOKEN_TTL }
    );

    return { resetToken };
  },

  /**
   * Firebase holds the password the login actually checks; the local bcrypt
   * hash is only the offline fallback. Writing one and not the other leaves the
   * account signing in with the old password, so both move together here.
   */
  async resetPassword({ resetToken, newPassword }) {
    if (!resetToken || !newPassword) {
      throw new Error('Reset token and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, getJwtSecret());
    } catch {
      throw new Error('This reset link has expired. Start again.');
    }

    if (payload.purpose !== RESET_TOKEN_PURPOSE) {
      throw new Error('Invalid reset token');
    }

    const user = await authRepository.findByEmail(payload.email);
    if (!user) throw new Error('User not found');

    if (user.firebaseUid) {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth is not configured, so the password cannot be changed right now.');
      }
      await auth.updateUser(user.firebaseUid, { password: newPassword });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await updatePasswordByUserId(user.userId, hashedPassword);

    return { message: 'Password updated. You can sign in with your new password.' };
  }
};
