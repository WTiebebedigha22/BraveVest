import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN = '15m',
  JWT_REFRESH_EXPIRES_IN = '7d',
  JWT_ISSUER = 'bravevest',
  JWT_AUDIENCE = 'bravevest-web',
} = process.env;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set');
}
if (JWT_SECRET === JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must differ');
}

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export function isAdmin(user) {
  return Array.isArray(user?.roles) && user.roles.some((r) => ADMIN_ROLES.includes(r));
}

export function signAccess(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      roles: user.roles,
      isAdmin: isAdmin(user),
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
  );
}

export function signRefresh(user) {
  return jwt.sign(
    { sub: String(user.id), jti: crypto.randomUUID() },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN, issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
  );
}

export function verifyAccess(token) {
  return jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
}

export function verifyRefresh(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
}
