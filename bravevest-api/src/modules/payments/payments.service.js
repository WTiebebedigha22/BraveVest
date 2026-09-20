// src/modules/payments/payments.service.js
const { prisma } = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');
const env = require('../../config/env');
const { makeReference } = require('../../utils/reference');
const { PAYMENT_FEE_PERCENT } = require('../../config/constants');
const investmentsService = require('../investments/investments.service');
const paystack = require('./paystack.service');
const flutterwave = require('./flutterwave.service');

function providerClient(name) {
  return name === 'flutterwave' ? flutterwave : paystack;
}

async function initializeForInvestment(userId, investmentId) {
  const investment = await prisma.investment.findUnique({
    where: { id: investmentId },
    include: { project: true, user: true },
  });
  if (!investment) throw ApiError.notFound('Investment not found');
  if (investment.userId !== userId) throw ApiError.forbidden('Not your investment');
  if (investment.status !== 'PENDING') throw ApiError.conflict('Investment is ' + investment.status);

  const reference = makeReference('BV');
  const amount = Number(investment.amount);
  const fee = Math.round(((amount * PAYMENT_FEE_PERCENT) / 100) * 100) / 100;
  const netAmount = amount - fee;

  const tx = await prisma.transaction.create({
    data: {
      reference,
      userId,
      investmentId: investment.id,
      type: 'INVESTMENT',
      status: 'PENDING',
      provider: env.payments.provider === 'flutterwave' ? 'FLUTTERWAVE' : 'PAYSTACK',
      amount, fee, netAmount, currency: 'NGN',
    },
  });

  const provider = providerClient(env.payments.provider);
  let init;
  try {
    init = await provider.initialize({
      email: investment.user.email,
      amount, reference,
      callbackUrl: env.payments.callbackUrl,
      metadata: { investmentId: investment.id, userId, projectId: investment.projectId },
    });
  } catch (err) {
    await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: 'FAILED', failureReason: err.message },
    });
    throw err;
  }

  const providerRef = init.access_code || init.tx_ref || init.reference || null;
  await prisma.transaction.update({ where: { id: tx.id }, data: { providerRef, providerMeta: init } });

  await prisma.auditLog.create({
    data: { userId, action: 'PAYMENT_INITIALIZED', entity: 'Transaction', entityId: tx.id, meta: { reference } },
  }).catch(() => {});

  logger.info('Payment initialized: ' + reference + ' (NGN ' + amount + ')');

  return {
    reference,
    authorizationUrl: init.authorization_url || init.link || null,
    accessCode: init.access_code || null,
    amount, fee, netAmount,
    provider: env.payments.provider,
  };
}

async function verifyAndConfirm(reference) {
  const tx = await prisma.transaction.findUnique({ where: { reference } });
  if (!tx) throw ApiError.notFound('Transaction not found');
  if (tx.status === 'SUCCESS') return { transaction: tx, alreadyVerified: true };

  const provider = providerClient(tx.provider === 'FLUTTERWAVE' ? 'flutterwave' : 'paystack');
  const result = await provider.verify(tx.providerRef || reference);

  const ok = result.status === 'success' || result.status === 'successful';
  if (!ok) {
    const failed = await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: 'FAILED', failureReason: result.gateway_response || 'Payment not successful', providerMeta: result },
    });
    return { transaction: failed, success: false };
  }

  const paidAmount = (result.amount || 0) / 100 || result.amount;
  if (paidAmount && Math.abs(paidAmount - Number(tx.amount)) > 0.5) {
    const mismatch = await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: 'FAILED', failureReason: 'Amount mismatch', providerMeta: result },
    });
    return { transaction: mismatch, success: false };
  }

  const updated = await prisma.transaction.update({
    where: { id: tx.id },
    data: { status: 'SUCCESS', paidAt: new Date(), providerRef: result.reference || result.tx_ref || tx.providerRef, providerMeta: result },
  });

  if (updated.investmentId) {
    try { await investmentsService.confirm(updated.investmentId, { txReference: updated.reference }); }
    catch (err) { logger.warn('Investment confirm failed: ' + err.message); }
  }

  await prisma.auditLog.create({
    data: { userId: updated.userId, action: 'PAYMENT_VERIFIED', entity: 'Transaction', entityId: updated.id, meta: { reference: updated.reference } },
  }).catch(() => {});

  logger.info('Payment verified: ' + updated.reference);
  return { transaction: updated, success: true };
}

async function handleWebhook(providerName, event) {
  if (providerName === 'paystack') {
    if (event.event !== 'charge.success') return { ignored: true };
    const ref = event.data && event.data.reference;
    if (!ref) return { ignored: true };
    const tx = await prisma.transaction.findUnique({ where: { reference: ref } });
    if (!tx || tx.status === 'SUCCESS') return { ignored: true };
    return verifyAndConfirm(ref);
  }
  if (providerName === 'flutterwave') {
    if (event.event !== 'charge.completed') return { ignored: true };
    if (!event.data || event.data.status !== 'successful') return { ignored: true };
    return verifyAndConfirm(event.data.tx_ref);
  }
  return { ignored: true };
}

async function listMine(userId, query = {}) {
  const where = { userId };
  if (query.status) where.status = query.status;
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { investment: { include: { project: { select: { id: true, slug: true, title: true } } } } },
      orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);
  return {
    items: items.map((t) => ({ ...t, amount: Number(t.amount), fee: Number(t.fee), netAmount: Number(t.netAmount) })),
    meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
  };
}

async function walletSummary(userId) {
  const [deposits, investments] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: 'DEPOSIT', status: 'SUCCESS' }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: 'INVESTMENT', status: 'SUCCESS' }, _sum: { amount: true } }),
  ]);
  const dep = Number((deposits._sum && deposits._sum.amount) || 0);
  const inv = Number((investments._sum && investments._sum.amount) || 0);
  return { totalDeposited: dep, totalInvested: inv, balance: dep - inv };
}

module.exports = { initializeForInvestment, verifyAndConfirm, handleWebhook, listMine, walletSummary };
