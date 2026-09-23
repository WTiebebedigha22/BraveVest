// src/modules/goals/goals.service.js
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');

async function create(userId, payload) {
  return prisma.investmentGoal.create({
    data: {
      userId,
      name: payload.name,
      type: payload.type || 'CUSTOM',
      targetAmount: payload.targetAmount,
      targetDate: new Date(payload.targetDate),
    },
  });
}

async function listMine(userId) {
  return prisma.investmentGoal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

async function update(userId, id, payload) {
  const goal = await prisma.investmentGoal.findUnique({ where: { id } });
  if (!goal) throw ApiError.notFound('Goal not found');
  if (goal.userId !== userId) throw ApiError.forbidden();

  return prisma.investmentGoal.update({ where: { id }, data: payload });
}

async function remove(userId, id) {
  const goal = await prisma.investmentGoal.findUnique({ where: { id } });
  if (!goal || goal.userId !== userId) throw ApiError.notFound();
  return prisma.investmentGoal.delete({ where: { id } });
}

/** Given a target amount and date, recommend matching projects */
async function recommendProjects(userId, goalId) {
  const goal = await prisma.investmentGoal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== userId) throw ApiError.notFound();

  const monthsToGoal = Math.max(1, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30)));

  // Risk preference based on timeline
  let riskLevels = ['low', 'medium', 'high'];
  if (monthsToGoal <= 6) riskLevels = ['low'];
  else if (monthsToGoal <= 18) riskLevels = ['low', 'medium'];

  return prisma.project.findMany({
    where: { status: 'OPEN', riskLevel: { in: riskLevels }, tenorMonths: { lte: monthsToGoal } },
    orderBy: [{ isFeatured: 'desc' }, { expectedReturnPct: 'desc' }],
    take: 6,
  });
}

module.exports = { create, listMine, update, remove, recommendProjects };
