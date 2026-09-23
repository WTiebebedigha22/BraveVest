// src/modules/groups/groups.service.js
const crypto = require('crypto');
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

function generateInviteCode() {
  return 'BV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function create(userId, payload) {
  const group = await prisma.savingsGroup.create({
    data: {
      name: payload.name,
      description: payload.description || null,
      targetAmount: payload.targetAmount,
      targetDate: payload.targetDate ? new Date(payload.targetDate) : null,
      type: payload.type || 'CUSTOM',
      inviteCode: generateInviteCode(),
      createdById: userId,
      members: {
        create: { userId, role: 'ADMIN' },
      },
    },
    include: { members: true },
  });
  logger.info('Group created: ' + group.id + ' by ' + userId);
  return group;
}

async function listMine(userId) {
  return prisma.savingsGroup.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getDetail(userId, groupId) {
  const group = await prisma.savingsGroup.findUnique({
    where: { id: groupId },
    include: {
      members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, image: true } } } },
    },
  });
  if (!group) throw ApiError.notFound('Group not found');

  const isMember = group.members.some((m) => m.userId === userId);
  if (!isMember && group.createdById !== userId) throw ApiError.forbidden('Not a group member');

  const contributions = await prisma.groupContribution.findMany({
    where: { groupId, status: 'SUCCESS' },
    orderBy: { paidAt: 'desc' },
    take: 20,
  });

  const totalRaised = contributions.reduce((s, c) => s + Number(c.amount), 0);

  return { ...group, contributions, totalRaised };
}

async function joinByCode(userId, inviteCode) {
  const group = await prisma.savingsGroup.findUnique({ where: { inviteCode } });
  if (!group) throw ApiError.notFound('Invalid invite code');

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId } },
  });
  if (existing) throw ApiError.conflict('Already a member');

  await prisma.groupMember.create({ data: { groupId: group.id, userId, role: 'MEMBER' } });
  logger.info('User ' + userId + ' joined group ' + group.id);
  return group;
}

async function contribute(userId, groupId, amount) {
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) throw ApiError.forbidden('Not a group member');

  const reference = 'BV-GRP-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();

  const contribution = await prisma.groupContribution.create({
    data: { groupId, userId, amount, reference, status: 'SUCCESS', paidAt: new Date() },
  });

  await prisma.groupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { contributedAmount: { increment: amount } },
  });

  logger.info('Group contribution: ' + amount + ' by ' + userId + ' to ' + groupId);
  return contribution;
}

module.exports = { create, listMine, getDetail, joinByCode, contribute };
