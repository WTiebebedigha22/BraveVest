// src/modules/investments/investments.service.js
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');
const { getPagination, paginatedMeta } = require('../../utils/pagination');
const { decorate: decorateProject } = require('../projects/projects.service');

async function create(userId, { projectId, amount }) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw ApiError.notFound('Project not found');
  if (project.status !== 'OPEN') throw ApiError.badRequest('Project is not open for investment');

  const min = Number(project.minInvestment);
  if (amount < min) throw ApiError.badRequest(`Minimum investment is ${min}`);

  const remaining = Number(project.targetAmount) - Number(project.raisedAmount);
  if (amount > remaining) throw ApiError.badRequest(`Only ₦${remaining.toLocaleString()} left to fund`);

  const kyc = await prisma.kycProfile.findUnique({ where: { userId } });
  if (!kyc || kyc.status !== 'APPROVED') throw ApiError.forbidden('KYC approval required before investing');

  const expectedReturn = (amount * Number(project.expectedReturnPct)) / 100;

  const investment = await prisma.investment.create({
    data: { userId, projectId, amount, expectedReturn, status: 'PENDING', units: 1 },
  });

  await prisma.auditLog.create({
    data: { userId, action: 'INVESTMENT_CREATED', entity: 'Investment', entityId: investment.id, meta: { projectId, amount } },
  }).catch(() => {});

  return serialize(investment);
}

function serialize(i) {
  return { ...i, amount: Number(i.amount), expectedReturn: Number(i.expectedReturn), actualReturn: Number(i.actualReturn) };
}

async function listMine(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const where = { userId };
  if (query.status) where.status = query.status;
  const [items, total] = await Promise.all([
    prisma.investment.findMany({
      where,
      include: { project: { select: { id: true, slug: true, title: true, category: true, coverImage: true } } },
      orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.investment.count({ where }),
  ]);
  return { items: items.map(serialize), meta: paginatedMeta(total, page, limit) };
}

async function getMine(userId, id) {
  const inv = await prisma.investment.findFirst({
    where: { id, userId },
    include: { project: true, transactions: { orderBy: { createdAt: 'desc' } } },
  });
  if (!inv) throw ApiError.notFound('Investment not found');
  return { ...serialize(inv), project: decorateProject(inv.project) };
}

async function portfolioSummary(userId) {
  const investments = await prisma.investment.findMany({ where: { userId } });
  const totalInvested = investments.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpected = investments.reduce((s, i) => s + Number(i.expectedReturn), 0);
  const totalActual = investments.reduce((s, i) => s + Number(i.actualReturn), 0);
  const activeCount = investments.filter((i) => ['CONFIRMED', 'ACTIVE'].includes(i.status)).length;
  const pendingCount = investments.filter((i) => i.status === 'PENDING').length;
  return { totalInvested, totalExpected, totalActual, activeCount, pendingCount, totalCount: investments.length };
}

// NEW: monthly series for portfolio chart
async function portfolioSeries(userId, months = 6) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));

  const investments = await prisma.investment.findMany({
    where: { userId, status: { in: ['CONFIRMED', 'ACTIVE', 'MATURED'] }, investedAt: { gte: start } },
    select: { amount: true, investedAt: true },
  });

  // Build buckets
  const buckets = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1) + i, 1));
    buckets.push({
      key: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-NG', { month: 'short' }),
      invested: 0,
      cumulative: 0,
    });
  }

  for (const inv of investments) {
    const d = new Date(inv.investedAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const b = buckets.find((x) => x.key === key);
    if (b) b.invested += Number(inv.amount);
  }

  let running = 0;
  for (const b of buckets) { running += b.invested; b.cumulative = running; }

  return buckets;
}

// Admin: monthly investment volume across all users
async function adminSeries(months = 6) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));

  const investments = await prisma.investment.findMany({
    where: { status: { in: ['CONFIRMED', 'ACTIVE', 'MATURED'] }, investedAt: { gte: start } },
    select: { amount: true, investedAt: true },
  });

  const buckets = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1) + i, 1));
    buckets.push({
      key: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-NG', { month: 'short' }),
      invested: 0,
    });
  }
  for (const inv of investments) {
    const d = new Date(inv.investedAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const b = buckets.find((x) => x.key === key);
    if (b) b.invested += Number(inv.amount);
  }
  return buckets;
}

async function listAll(query) {
  const { page, limit, skip } = getPagination(query);
  const where = {};
  if (query.status) where.status = query.status;
  const [items, total] = await Promise.all([
    prisma.investment.findMany({
      where,
      include: {
        project: { select: { id: true, slug: true, title: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.investment.count({ where }),
  ]);
  return { items: items.map(serialize), meta: paginatedMeta(total, page, limit) };
}

async function confirm(investmentId, { txReference } = {}) {
  const inv = await prisma.investment.findUnique({ where: { id: investmentId }, include: { project: true } });
  if (!inv) throw ApiError.notFound('Investment not found');
  if (inv.status !== 'PENDING') throw ApiError.conflict(`Investment already ${inv.status}`);

  const [updated] = await prisma.$transaction([
    prisma.investment.update({
      where: { id: investmentId },
      data: {
        status: 'CONFIRMED',
        investedAt: new Date(),
        maturesAt: new Date(Date.now() + inv.project.tenorMonths * 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.project.update({
      where: { id: inv.projectId },
      data: { raisedAmount: { increment: inv.amount } },
    }),
  ]);

  const freshProject = await prisma.project.findUnique({ where: { id: inv.projectId } });
  if (Number(freshProject.raisedAmount) >= Number(freshProject.targetAmount) && freshProject.status === 'OPEN') {
    await prisma.project.update({ where: { id: freshProject.id }, data: { status: 'FUNDED' } });
  }

  await prisma.auditLog.create({
    data: { userId: inv.userId, action: 'INVESTMENT_CONFIRMED', entity: 'Investment', entityId: investmentId, meta: { txReference: txReference || null } },
  }).catch(() => {});

  logger.info(`Investment confirmed: ${investmentId}`);
  return updated;
}

module.exports = { create, listMine, getMine, portfolioSummary, portfolioSeries, adminSeries, listAll, confirm, serialize };
