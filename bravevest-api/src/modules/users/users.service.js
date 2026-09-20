// src/modules/users/users.service.js
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const { hashPassword, comparePassword } = require('../../utils/password');

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, phone: true, firstName: true, lastName: true,
      image: true, role: true, status: true, emailVerified: true, createdAt: true,
      kyc: { select: { status: true } },
    },
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

async function updateProfile(userId, payload) {
  const data = {};

  if (payload.firstName !== undefined) {
    const v = String(payload.firstName).trim();
    if (v.length < 1 || v.length > 60) throw ApiError.badRequest('First name must be 1–60 characters');
    data.firstName = v;
  }
  if (payload.lastName !== undefined) {
    const v = String(payload.lastName).trim();
    if (v.length < 1 || v.length > 60) throw ApiError.badRequest('Last name must be 1–60 characters');
    data.lastName = v;
  }
  if (payload.phone !== undefined) {
    const v = String(payload.phone || '').trim();
    if (v === '') {
      data.phone = null;
    } else {
      if (!/^(\+?234|0)[789][01]\d{8}$/.test(v) && !/^\+[1-9]\d{6,14}$/.test(v)) {
        throw ApiError.badRequest('Enter a valid phone number');
      }
      // Check uniqueness
      const existing = await prisma.user.findFirst({ where: { phone: v, NOT: { id: userId } } });
      if (existing) throw ApiError.conflict('Phone already in use');
      data.phone = v;
    }
  }
  if (payload.image !== undefined) {
    const v = String(payload.image || '').trim();
    if (v && !/^https?:\/\//.test(v)) throw ApiError.badRequest('Image URL must start with http:// or https://');
    data.image = v || null;
  }

  if (Object.keys(data).length === 0) {
    throw ApiError.badRequest('No fields to update');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true, email: true, phone: true, firstName: true, lastName: true,
      image: true, role: true, status: true, emailVerified: true, createdAt: true,
      kyc: { select: { status: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: 'ADMIN_ACTION',
      entity: 'User',
      entityId: userId,
      meta: { event: 'PROFILE_UPDATED', fields: Object.keys(data) },
    },
  }).catch(() => {});

  return updated;
}

async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Current password and new password are required');
  }
  if (newPassword.length < 8) {
    throw ApiError.badRequest('New password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(newPassword)) throw ApiError.badRequest('New password must contain an uppercase letter');
  if (!/[a-z]/.test(newPassword)) throw ApiError.badRequest('New password must contain a lowercase letter');
  if (!/[0-9]/.test(newPassword)) throw ApiError.badRequest('New password must contain a number');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  const ok = await comparePassword(currentPassword, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Current password is incorrect');

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  // Revoke all refresh tokens (force re-login on other devices)
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });

  return { changed: true };
}

module.exports = { getProfile, updateProfile, changePassword };
