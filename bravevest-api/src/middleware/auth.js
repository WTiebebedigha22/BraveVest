// src/middleware/auth.js — JWT OR Firebase ID token
const ApiError = require('../utils/apiError');
const { verifyAccess } = require('../utils/jwt');
const { prisma } = require('../config/database');
const firebaseAdmin = require('../services/firebaseAdmin.service');

async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or invalid Authorization header');
    }
    const token = header.slice(7).trim();
    if (!token) throw ApiError.unauthorized('Missing token');

    let payload = null;

    // 1) Try Firebase Admin (works if the service-account file exists)
    const fbDecoded = await firebaseAdmin.verifyIdToken(token);
    if (fbDecoded) {
      // Look up or auto-provision the user in Postgres
      let user = await prisma.user.findUnique({
        where: { email: fbDecoded.email },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, status: true, emailVerified: true, createdAt: true,
        },
      });

      if (!user && fbDecoded.email) {
        user = await prisma.user.create({
          data: {
            email: fbDecoded.email,
            firstName: fbDecoded.name?.split(' ')[0] || 'User',
            lastName: fbDecoded.name?.split(' ').slice(1).join(' ') || '',
            passwordHash: 'firebase-managed', // placeholder — no local password
            role: 'INVESTOR',
            status: 'ACTIVE',
            emailVerified: new Date(),
            kyc: { create: {} },
          },
          select: {
            id: true, email: true, firstName: true, lastName: true,
            role: true, status: true, emailVerified: true, createdAt: true,
          },
        });
      }

      if (!user) throw ApiError.unauthorized('User not found');
      if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
        throw ApiError.forbidden('Account is not active');
      }

      req.user = { ...user, _auth: 'firebase', firebaseUid: fbDecoded.uid };
      return next();
    }

    // 2) Fall back to legacy JWT
    try {
      payload = verifyAccess(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Access token expired');
      throw ApiError.unauthorized('Invalid access token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, status: true, emailVerified: true, createdAt: true,
      },
    });

    if (!user) throw ApiError.unauthorized('User not found');
    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      throw ApiError.forbidden('Account is not active');
    }

    req.user = { ...user, _auth: 'jwt' };
    next();
  } catch (err) {
    next(err);
  }
}

async function authOptional(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();
  try { await authRequired(req, res, () => next()); } catch { next(); }
}

module.exports = { authRequired, authOptional };
