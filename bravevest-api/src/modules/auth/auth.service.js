const crypto = require('crypto');
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signAccess, signRefresh, verifyRefresh } = require('../../utils/jwt');

const publicUser = (u) => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, status: u.status, createdAt: u.createdAt });

async function issueTokens(user) {
  const accessToken = signAccess({ sub: user.id, role: user.role });
  const refreshToken = signRefresh({ sub: user.id });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId: user.id, token: crypto.createHash('sha256').update(refreshToken).digest('hex'), expiresAt } });
  return { accessToken, refreshToken };
}

async function register({ firstName, lastName, email, phone, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ApiError.conflict('Email already registered');
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { firstName, lastName, email, phone: phone || null, passwordHash, role: 'INVESTOR', status: 'ACTIVE', kyc: { create: {} } } });
  return { user: publicUser(user), ...(await issueTokens(user)) };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');
  if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') throw ApiError.forbidden('Account inactive');
  return { user: publicUser(user), ...(await issueTokens(user)) };
}

async function refresh(refreshToken) {
  let payload;
  try { payload = verifyRefresh(refreshToken); } catch { throw ApiError.unauthorized('Invalid refresh token'); }
  const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const stored = await prisma.refreshToken.findUnique({ where: { token: hashed } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) throw ApiError.unauthorized('Refresh token invalid');
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

async function forgotPassword(email) { return { sent: true }; }
async function resetPassword(token, newPassword) { throw ApiError.badRequest('Not implemented'); }

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
