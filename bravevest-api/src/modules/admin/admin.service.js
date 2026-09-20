// src/modules/admin/admin.service.js
const kycService = require('../kyc/kyc.service');
const investmentsService = require('../investments/investments.service');
const { prisma } = require('../../config/database');
const { getPagination, paginatedMeta } = require('../../utils/pagination');
const ApiError = require('../../utils/apiError');

async function listKyc(query) {
  const { page, limit } = getPagination(query);
  const { items, total } = await kycService.adminList({ status: query.status, page, limit });
  return { items, meta: paginatedMeta(total, page, limit) };
}
async function getKyc(id) { return kycService.adminGet(id); }
async function approveKyc(id, reviewerId) { return kycService.adminApprove(id, reviewerId); }
async function rejectKyc(id, reviewerId, reason) { return kycService.adminReject(id, reviewerId, reason); }

async function dashboardStats() {
  const [totalInvestors, activeInvestments, pendingKyc, totalInvestedAgg, totalProcessedAgg, series] = await Promise.all([
    prisma.user.count({ where: { role: 'INVESTOR' } }),
    prisma.investment.count({ where: { status: { in: ['CONFIRMED', 'ACTIVE'] } } }),
    prisma.kycProfile.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.investment.aggregate({ _sum: { amount: true }, where: { status: { in: ['CONFIRMED', 'ACTIVE'] } } }),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'SUCCESS' } }),
    investmentsService.adminSeries(6),
  ]);
  return {
    totalInvestors,
    activeInvestments,
    pendingKyc,
    totalInvested: Number(totalInvestedAgg._sum.amount || 0),
    totalProcessed: Number(totalProcessedAgg._sum.amount || 0),
    series,
  };
}

async function listInvestors(query) {
  const { page, limit, skip } = getPagination(query);
  const where = { role: 'INVESTOR' };
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        status: true, createdAt: true,
        kyc: { select: { status: true } },
        _count: { select: { investments: true, transactions: true } },
      },
      orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.user.count({ where }),
  ]);
  return { items, meta: paginatedMeta(total, page, limit) };
}

async function getInvestor(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, phone: true, firstName: true, lastName: true,
      role: true, status: true, createdAt: true,
      kyc: true,
      investments: {
        include: { project: { select: { id: true, slug: true, title: true, category: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!user) throw ApiError.notFound('Investor not found');

  const totalInvested = user.investments
    .filter((i) => ['CONFIRMED', 'ACTIVE', 'MATURED'].includes(i.status))
    .reduce((s, i) => s + Number(i.amount), 0);

  return {
    ...user,
    investments: user.investments.map(investmentsService.serialize),
    transactions: user.transactions.map((t) => ({
      ...t, amount: Number(t.amount), fee: Number(t.fee), netAmount: Number(t.netAmount),
    })),
    totalInvested,
  };
}

async function listAllInvestments(query) { return investmentsService.listAll(query); }

async function listTransactions(query) {
  const { page, limit, skip } = getPagination(query);
  const where = {};
  if (query.status) where.status = query.status;
  if (query.type) where.type = query.type;
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        investment: { include: { project: { select: { id: true, slug: true, title: true } } } },
      },
      orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);
  return {
    items: items.map((t) => ({ ...t, amount: Number(t.amount), fee: Number(t.fee), netAmount: Number(t.netAmount) })),
    meta: paginatedMeta(total, page, limit),
  };
}

module.exports = { listKyc, getKyc, approveKyc, rejectKyc, dashboardStats, listInvestors, getInvestor, listAllInvestments, listTransactions };
