import mongoose from 'mongoose';

export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;

const passwordResetOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    /**
     * Only the hash is stored. A leaked database read must not hand anyone a
     * working reset code, the same reason the password itself is hashed.
     */
    codeHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    consumedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Mongo drops the document itself once expiresAt passes, so abandoned requests
// clean up without a cron job.
passwordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetOtp = mongoose.model('PasswordResetOtp', passwordResetOtpSchema);

export default PasswordResetOtp;
