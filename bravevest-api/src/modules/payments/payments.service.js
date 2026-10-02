const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const { makeReference } = require('../../utils/reference');
const paystack = require('./paystack.service');
const investmentsService = require('../investments/investments.service');

async function initializeForInvestment(userId, investmentId) {
  const inv = await prisma.investment.findUnique({ where: { id: investmentId }, include: { user: true } });
  if (!inv) throw ApiError.notFound('Investment not found');
  if (inv.userId !== userId) throw ApiError.forbidden('Not your investment');
  if (inv.status !== 'PENDING') throw ApiError.conflict('Already ' + inv.status);

  const reference = makeReference('BV');
  const amount = Number(inv.amount);
  const fee = Math.round(amount * 0.015 * 100) / 100;
  const tx = await prisma.transaction.create({ data: { reference, userId, investmentId: inv.id, type: 'INVESTMENT', status: 'PENDING', provider: 'PAYSTACK', amount, fee, netAmount: amount - fee, currency: 'NGN' } });

  const init = await paystack.initialize({ email: inv.user.email, amount, reference });
  await prisma.transaction.update({ where: { id: tx.id }, data: { providerRef: init.access_code || null } });

  return { reference, authorizationUrl: init.authorization_url, amount, fee, netAmount: amount - fee };
}

async function verifyAndConfirm(reference) {
  const tx = await prisma.transaction.findUnique({ where: { reference } });
  if (!tx) throw ApiError.notFound('Transaction not found');
  if (tx.status === 'SUCCESS') return { transaction: tx, success: true, alreadyVerified: true };

  const result = await paystack.verify(reference);
  if (result.status !== 'success') {
    const failed = await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'FAILED', failureReason: 'Not successful' } });
    return { transaction: failed, success: false };
  }
  const updated = await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'SUCCESS', paidAt: new Date() } });
  if (updated.investmentId) await investmentsService.confirm(updated.investmentId).catch(() => {});
  return { transaction: updated, success: true };
}

async function listMine(userId, query = {}) {
  const where = { userId };
  if (query.status) where.status = query.status;
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, parseInt(query.limit, 10) || 20);
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.transaction.count({ where }),
  ]);
  return { items: items.map((t) => ({ ...t, amount: Number(t.amount), fee: Number(t.fee), netAmount: Number(t.netAmount) })), meta: { total, page, limit } };
}

async function walletSummary(userId) {
  const [d, i] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: 'DEPOSIT', status: 'SUCCESS' }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'INVESTMENT', status: 'SUCCESS' }, _sum: { amount: true } }),
  ]);
  const dep = Number(d._sum.amount || 0), inv = Number(i._sum.amount || 0);
  return { totalDeposited: dep, totalInvested: inv, balance: dep - inv };
}

module.exports = { initializeForInvestment, verifyAndConfirm, listMine, walletSummary };
