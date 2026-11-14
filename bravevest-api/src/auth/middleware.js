import { verifyAccess } from './jwt.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing_token' });

  try {
    const p = verifyAccess(token);
    req.user = { id: p.sub, email: p.email, roles: p.roles, isAdmin: p.isAdmin };
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid_token', reason: err.name });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  if (!req.user.isAdmin) return res.status(403).json({ error: 'forbidden' });
  next();
}
