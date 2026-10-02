const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');

async function create(userId, p) { return prisma.investmentGoal.create({ data: { userId, name: p.name, type: p.type || 'CUSTOM', targetAmount: p.targetAmount, targetDate: new Date(p.targetDate) } }); }
async function listMine(userId) { return prisma.investmentGoal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
async function update(userId, id, p) {
  const g = await prisma.investmentGoal.findUnique({ where: { id } });
  if (!g || g.userId !== userId) throw ApiError.notFound();
  return prisma.investmentGoal.update({ where: { id }, data: p });
}
async function remove(userId, id) { await prisma.investmentGoal.deleteMany({ where: { id, userId } }); }
async function recommend(userId, goalId) {
  const g = await prisma.investmentGoal.findUnique({ where: { id: goalId } });
  if (!g || g.userId !== userId) throw ApiError.notFound();
  const months = Math.max(1, Math.ceil((new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
  let risks = ['low', 'medium', 'high'];
  if (months <= 6) risks = ['low'];
  else if (months <= 18) risks = ['low', 'medium'];
  return prisma.project.findMany({ where: { status: 'OPEN', riskLevel: { in: risks }, tenorMonths: { lte: months } }, orderBy: { expectedReturnPct: 'desc' }, take: 6 });
}
module.exports = { create, listMine, update, remove, recommend };
