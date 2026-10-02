const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const { getPagination, paginatedMeta } = require('../../utils/pagination');
const { decorate: decorateProject } = require('../projects/projects.service');

function serialize(i) { return { ...i, amount: Number(i.amount), expectedReturn: Number(i.expectedReturn), actualReturn: Number(i.actualReturn) }; }

async function create(userId, { projectId, amount }) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw ApiError.notFound('Project not found');
  if (project.status !== 'OPEN') throw ApiError.badRequest('Project not open');
  const min = Number(project.minInvestment);
  if (amount < min) throw ApiError.badRequest('Minimum is ' + min);
  const kyc = await prisma.kycProfile.findUnique({ where: { userId } });
  if (!kyc || kyc.status !== 'APPROVED') throw ApiError.forbidden('KYC approval required');
  const expectedReturn = (amount * Number(project.expectedReturnPct)) / 100;
  const inv = await prisma.investment.create({ data: { userId, projectId, amount, expectedReturn, status: 'PENDING' } });
  return serialize(inv);
}

async function listMine(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const where = { userId };
  if (query.status) where.status = query.status;
  const [items, total] = await Promise.all([
    prisma.investment.findMany({ where, include: { project: { select: { id: true, slug: true, title: true, category: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.investment.count({ where }),
  ]);
  return { items: items.map(serialize), meta: paginatedMeta(total, page, limit) };
}

async function getMine(userId, id) {
  const inv = await prisma.investment.findFirst({ where: { id, userId }, include: { project: true, transactions: { orderBy: { createdAt: 'desc' } } } });
  if (!inv) throw ApiError.notFound('Not found');
  return { ...serialize(inv), project: decorateProject(inv.project) };
}

async function portfolioSummary(userId) {
  const investments = await prisma.investment.findMany({ where: { userId } });
  return {
    totalInvested: investments.reduce((s, i) => s + Number(i.amount), 0),
    totalExpected: investments.reduce((s, i) => s + Number(i.expectedReturn), 0),
    totalActual: investments.reduce((s, i) => s + Number(i.actualReturn), 0),
    activeCount: investments.filter((i) => ['CONFIRMED', 'ACTIVE'].includes(i.status)).length,
    pendingCount: investments.filter((i) => i.status === 'PENDING').length,
    totalCount: investments.length,
  };
}

async function portfolioSeries(userId, months = 6) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const invs = await prisma.investment.findMany({ where: { userId, status: { in: ['CONFIRMED', 'ACTIVE', 'MATURED'] }, investedAt: { gte: start } } });
  const buckets = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    buckets.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), label: d.toLocaleString('en-NG', { month: 'short' }), invested: 0, cumulative: 0 });
  }
  for (const inv of invs) {
    const d = new Date(inv.investedAt);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const b = buckets.find((x) => x.key === key);
    if (b) b.invested += Number(inv.amount);
  }
  let running = 0;
  for (const b of buckets) { running += b.invested; b.cumulative = running; }
  return buckets;
}

async function confirm(investmentId) {
  const inv = await prisma.investment.findUnique({ where: { id: investmentId }, include: { project: true } });
  if (!inv) throw ApiError.notFound('Investment not found');
  if (inv.status !== 'PENDING') return inv;
  const [updated] = await prisma.$transaction([
    prisma.investment.update({ where: { id: investmentId }, data: { status: 'CONFIRMED', investedAt: new Date(), maturesAt: new Date(Date.now() + inv.project.tenorMonths * 30 * 24 * 60 * 60 * 1000) } }),
    prisma.project.update({ where: { id: inv.projectId }, data: { raisedAmount: { increment: inv.amount } } }),
  ]);
  return updated;
}

module.exports = { create, listMine, getMine, portfolioSummary, portfolioSeries, confirm, serialize };
