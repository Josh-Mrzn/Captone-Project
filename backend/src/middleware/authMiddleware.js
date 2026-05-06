import jwt from 'jsonwebtoken';

/**
 * protect — verify JWT.
 *
 * Accepts the token from EITHER:
 *   1. Authorization: Bearer <token>  (sent by authApi.jsx interceptor)
 *   2. Cookie: accessToken=<token>    (set by older refresh-token flow)
 *
 * This dual-source approach means the frontend doesn't need to change
 * and the cookie flow still works if you add refresh tokens later.
 */
export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check Authorization header first (primary — matches authApi.jsx)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // 2. Fall back to cookie (legacy / refresh-token flow)
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id:     decoded.userId,
      userId: decoded.userId,
      email:  decoded.email,
      role:   decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — invalid or expired token' });
  }
};

/**
 * authorizeRoles — restrict access to specific role(s).
 * Usage: router.use(protect, authorizeRoles('superadmin'))
 *        router.use(protect, authorizeRoles('admin', 'superadmin'))
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — role '${req.user?.role}' is not permitted here`,
      });
    }
    next();
  };
};
