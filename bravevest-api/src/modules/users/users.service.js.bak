const { prisma } = require('../../config/database');
const { hashPassword, comparePassword } = require('../../utils/password');
const ApiError = require('../../utils/apiError');

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, phone: true, firstName: true, lastName: true, image: true, role: true, status: true, createdAt: true, kyc: { select: { status: true } } } });
  if (!user) throw ApiError.notFound('Not found');
  return user;
}
async function updateProfile(userId, payload) {
  const data = {};
  if (payload.firstName !== undefined) data.firstName = String(payload.firstName).trim();
  if (payload.lastName !== undefined) data.lastName = String(payload.lastName).trim();
  if (payload.phone !== undefined) data.phone = payload.phone || null;
  if (payload.image !== undefined) data.image = payload.image || null;
  return prisma.user.update({ where: { id: userId }, data, select: { id: true, email: true, firstName: true, lastName: true, phone: true, image: true } });
}
async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) throw ApiError.badRequest('Both passwords required');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const ok = await comparePassword(currentPassword, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Current password incorrect');
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await prisma.refreshToken.updateMany({ where: { userId, revoked: false }, data: { revoked: true } });
  return { changed: true };
}
module.exports = { getProfile, updateProfile, changePassword };
