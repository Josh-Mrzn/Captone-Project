import rateLimit from 'express-rate-limit';

export const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password attempts. Try again later.'
});