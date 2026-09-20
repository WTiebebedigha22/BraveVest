// src/modules/auth/auth.service.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signAccess, signRefresh, verifyRefresh } = require('../../utils/jwt');
const env = require('../../config/env');
const logger = require('../../config/logger');
const email = require('../../services/email.service');

const publicUser = (u) => ({
  id: u.id, email: u.email, phone: u.phone,
  firstName: u.firstName, lastName: u.lastName,
  role: u.role, status: u.status, emailVerified: u.emailVerified, createdAt: u.createdAt,
});

async function issueTokens(user) {
  const accessToken = signAccess({ sub: user.id, role: user.role });
  const refreshToken = signRefresh({ sub: user.id });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { userId: user.id, token: crypto.createHash('sha256').update(refreshToken).digest('hex'), expiresAt },
  });
  return { accessToken, refreshToken };
}

async function register({ firstName, lastName, email: userEmail, phone, password }) {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email: userEmail }, ...(phone ? [{ phone }] : [])] } });
  if (existing) throw ApiError.conflict(existing.email === userEmail ? 'Email already registered' : 'Phone already registered');
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { firstName, lastName, email: userEmail, phone: phone || null, passwordHash, role: 'INVESTOR', status: 'ACTIVE', kyc: { create: {} } },
  });
  logger.info(`New user registered: ${user.email}`);
  return { user: publicUser(user), ...(await issueTokens(user)) };
}

async function login({ email: userEmail, password }) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');
  if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') throw ApiError.forbidden('Account is not active');
  return { user: publicUser(user), ...(await issueTokens(user)) };
}

async function refresh(refreshToken) {
  let payload;
  try { payload = verifyRefresh(refreshToken); } catch { throw ApiError.unauthorized('Invalid or expired refresh token'); }
  const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const stored = await prisma.refreshToken.findUnique({ where: { token: hashed } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) throw ApiError.unauthorized('Refresh token is no longer valid');
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw ApiError.unauthorized('User not found');
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
  return { user: publicUser(user), ...(await issueTokens(user)) };
}

async function logout(refreshToken) {
  if (!refreshToken) return;
  const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await prisma.refreshToken.updateMany({ where: { token: hashed, revoked: false }, data: { revoked: true } });
}

async function me(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { kyc: true } });
  if (!user) throw ApiError.notFound('User not found');
  return { ...publicUser(user), kycStatus: user.kyc?.status || 'NOT_STARTED' };
}

async function forgotPassword(userEmail) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  // Always respond as sent to avoid email enumeration
  if (!user) return { sent: true };

  const token = jwt.sign({ sub: user.id, purpose: 'pwd-reset' }, env.jwt.secret, { expiresIn: '15m' });
  const resetUrl = `${env.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const fs = require('fs');
  const path = require('path');
  const templatePath = path.join(__dirname, '../../emails/templates/reset-password.html');
  const html = fs.readFileSync(templatePath, 'utf8').replace(/{{resetUrl}}/g, resetUrl);

  await email.send({ to: user.email, subject: 'Reset your BraveVest password', html });
  logger.info(`Password reset link sent: ${user.email}`);
  return { sent: true };
}

async function resetPassword(token, newPassword) {
  let payload;
  try { payload = jwt.verify(token, env.jwt.secret); } catch { throw ApiError.badRequest('Invalid or expired reset token'); }
  if (payload.purpose !== 'pwd-reset') throw ApiError.badRequest('Invalid reset token');
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } });
  await prisma.refreshToken.updateMany({ where: { userId: payload.sub, revoked: false }, data: { revoked: true } });
  return { reset: true };
}

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };

