const ApiError = require('../utils/apiError');
const prisma = require('../config/database').prisma;

/**
 * requireAdmin — passes if user has ADMIN or SUPER_ADMIN role.
 * Re-reads roles from DB so a demoted admin loses access immediately,
 * without waiting for their JWT to expire.
 *
 * Use AFTER authRequired.
 */
async function requireAdmin(req, res, next) {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) return next(ApiError.unauthorized('Not authenticated'));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      return next(ApiError.forbidden('Account not active'));
    }

    const isAdmin = (user.roles || []).some(
      (r) => r === 'ADMIN' || r === 'SUPER_ADMIN'
    );
    if (!isAdmin) return next(ApiError.forbidden('Admin access required'));

    req.user.roles = user.roles;
    next();
  } catch (e) {
    next(e);
  }
}

/**
 * requireSuperAdmin — stricter, for destructive operations
 * (role changes, deletions, platform settings).
 */
async function requireSuperAdmin(req, res, next) {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) return next(ApiError.unauthorized('Not authenticated'));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      return next(ApiError.forbidden('Account not active'));
    }

    if (!(user.roles || []).includes('SUPER_ADMIN')) {
      return next(ApiError.forbidden('Super admin access required'));
    }

    req.user.roles = user.roles;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { requireAdmin, requireSuperAdmin };
