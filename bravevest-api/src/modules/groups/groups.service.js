const crypto = require('crypto');
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');

const code = () => 'BV-' + crypto.randomBytes(4).toString('hex').toUpperCase();

async function create(userId, payload) {
  return prisma.savingsGroup.create({ data: { name: payload.name, description: payload.description || null, targetAmount: payload.targetAmount, targetDate: payload.targetDate ? new Date(payload.targetDate) : null, type: payload.type || 'CUSTOM', inviteCode: code(), createdById: userId, members: { create: { userId, role: 'ADMIN' } } }, include: { members: true } });
}
async function listMine(userId) {
  return prisma.savingsGroup.findMany({ where: { members: { some: { userId } } }, include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } }, _count: { select: { members: true } } }, orderBy: { createdAt: 'desc' } });
}
async function getDetail(userId, groupId) {
  const g = await prisma.savingsGroup.findUnique({ where: { id: groupId }, include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } } });
  if (!g) throw ApiError.notFound('Group not found');
  if (!g.members.some((m) => m.userId === userId)) throw ApiError.forbidden('Not a member');
  return g;
}
async function joinByCode(userId, inviteCode) {
  const g = await prisma.savingsGroup.findUnique({ where: { inviteCode } });
  if (!g) throw ApiError.notFound('Invalid code');
  const existing = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId: g.id, userId } } });
  if (existing) throw ApiError.conflict('Already a member');
  await prisma.groupMember.create({ data: { groupId: g.id, userId } });
  return g;
}
async function contribute(userId, groupId, amount) {
  const m = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } });
  if (!m) throw ApiError.forbidden('Not a member');
  await prisma.groupMember.update({ where: { groupId_userId: { groupId, userId } }, data: { contributedAmount: { increment: amount } } });
  return { contributed: true, amount };
}
module.exports = { create, listMine, getDetail, joinByCode, contribute };
