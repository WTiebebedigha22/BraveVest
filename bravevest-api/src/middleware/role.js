// src/middleware/role.js — RBAC gate
const ApiError = require('../utils/apiError');

/**
 * Usage:  router.get('/path', authRequired, requireRole('ADMIN'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized('Not signed in'));
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Requires role: ${roles.join(' or ')}`));
    }
    next();
  };
}

module.exports = { requireRole };
