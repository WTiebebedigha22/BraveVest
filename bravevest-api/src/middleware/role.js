// Phase 3a: user.roles is an array. Keep a fallback to user.role
// so existing sessions and any un-migrated code keep working.
function getUserRoles(user) {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length) return user.roles;
  if (user.role) return [user.role];
  return [];
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required', code: 'UNAUTHENTICATED' });
    }
    const userRoles = getUserRoles(req.user);
    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) {
      return res.status(403).json({
        success: false,
        message: `Requires one of: ${roles.join(', ')}`,
        code: 'FORBIDDEN',
      });
    }
    next();
  };
}

function attachRoleHelpers(req, _res, next) {
  req.hasRole = (...roles) => roles.some((r) => getUserRoles(req.user).includes(r));
  req.isAdmin = () => req.hasRole('ADMIN', 'SUPER_ADMIN');
  req.isBorrower = () => req.hasRole('BORROWER');
  req.isInvestor = () => req.hasRole('INVESTOR');
  next();
}

module.exports = { requireRole, getUserRoles, attachRoleHelpers };
