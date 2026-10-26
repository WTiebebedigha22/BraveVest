const kycService = require('../kyc/kyc.service');
const investmentsService = require('../investments/investments.service');
const { prisma } = require('../../config/database');
const { getPagination, paginatedMeta } = require('../../utils/pagination');

async function dashboardStats() {
  const [totalInvestors, activeInvestments, pendingKyc, investedAgg] = await Promise.all([
    prisma.user.count({ where: { role: 'INVESTOR' } }),
    prisma.investment.count({ where: { status: { in: ['CONFIRMED', 'ACTIVE'] } } }),
    prisma.kycProfile.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.investment.aggregate({ _sum: { amount: true }, where: { status: { in: ['CONFIRMED', 'ACTIVE'] } } }),
  ]);
  const now = new Date();
  const series = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    series.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), label: d.toLocaleString('en-NG', { month: 'short' }), invested: 0 });
  }
  return { totalInvestors, activeInvestments, pendingKyc, totalInvested: Number(investedAgg._sum.amount || 0), series };
}

async function listInvestors(query) {
  const { page, limit, skip } = getPagination(query);
  const where = { role: 'INVESTOR' };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: { id: true, email: true, firstName: true, lastName: true, phone: true, status: true, createdAt: true, kyc: { select: { status: true } }, _count: { select: { investments: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.user.count({ where }),
  ]);
  return { items, meta: paginatedMeta(total, page, limit) };
}

async function getInvestor(id) {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, phone: true, firstName: true, lastName: true, role: true, status: true, createdAt: true, kyc: true, investments: { include: { project: { select: { id: true, title: true, category: true } } }, take: 20 }, transactions: { take: 20 } } });
  if (!user) return null;
  return { ...user, investments: user.investments.map(investmentsService.serialize), totalInvested: user.investments.filter((i) => ['CONFIRMED', 'ACTIVE', 'MATURED'].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) };
}

async function listAllInvestments(query) { return investmentsService.listMine(query?.userId || '', query); }

async function listTransactions(query) {
  const { page, limit, skip } = getPagination(query);
  const where = {};
  if (query.status) where.status = query.status;
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({ where, include: { user: { select: { email: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.transaction.count({ where }),
  ]);
  return { items: items.map((t) => ({ ...t, amount: Number(t.amount) })), meta: paginatedMeta(total, page, limit) };
}

module.exports = { dashboardStats, listInvestors, getInvestor, listTransactions, listKyc: kycService.adminList, getKyc: kycService.adminGet, approveKyc: kycService.adminApprove, rejectKyc: kycService.adminReject };
