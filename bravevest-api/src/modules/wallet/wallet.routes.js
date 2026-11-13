const express = require('express');
const crypto = require('crypto');
const { z } = require('zod');
const svc = require('./wallet.service');
const { success } = require('../../utils/apiResponse');
const { audit } = require('../../middleware/audit');
const { authRequired } = require('../../middleware/auth.middleware');
const { prisma } = require('../../config/database');

const router = express.Router();

// ── GET /api/wallet — current balance ──────────────────────
router.get('/', authRequired, async (req, res, next) => {
  try {
    const wallet = await svc.getWallet(req.user.id);
    return success(res, {
      balance: Number(wallet.balance),
      held: Number(wallet.held),
      currency: wallet.currency,
    });
  } catch (e) { next(e); }
});

// ── GET /api/wallet/ledger — recent ledger entries ─────────
router.get('/ledger', authRequired, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const entries = await svc.getRecentLedger(req.user.id, limit);
    return success(res, entries.map((e) => ({
      id: e.id,
      reference: e.reference,
      type: e.type,
      direction: e.direction,
      amount: Number(e.amount),
      balanceAfter: e.balanceAfter != null ? Number(e.balanceAfter) : null,
      description: e.description,
      createdAt: e.createdAt,
    })));
  } catch (e) { next(e); }
});

// ── GET /api/wallet/statement — full transaction history ───
router.get('/statement', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { from, to, type, limit = 100, offset = 0 } = req.query;

    const where = { userId };

    if (from || to) {
      where.createdAt = {};
      if (from) {
        const d = new Date(from);
        if (!isNaN(d.getTime())) where.createdAt.gte = d;
      }
      if (to) {
        const d = new Date(to);
        if (!isNaN(d.getTime())) {
          d.setHours(23, 59, 59, 999);
          where.createdAt.lte = d;
        }
      }
      if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
    }

    if (type) {
      const valid = ['DEPOSIT', 'INVESTMENT', 'RETURN', 'WITHDRAWAL', 'REFUND', 'FEE'];
      if (valid.includes(type)) where.type = type;
    }

    const take = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const skip = Math.max(parseInt(offset, 10) || 0, 0);

    const [transactions, total, wallet] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        select: {
          id: true,
          reference: true,
          type: true,
          status: true,
          amount: true,
          fee: true,
          netAmount: true,
          currency: true,
          description: true,
          provider: true,
          paidAt: true,
          createdAt: true,
          investmentId: true,
        },
      }),
      prisma.transaction.count({ where }),
      prisma.wallet.findUnique({ where: { userId } }),
    ]);

    const successWhere = { ...where, status: 'SUCCESS' };
    const [credits, debits] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...successWhere, type: { in: ['DEPOSIT', 'RETURN', 'REFUND'] } },
        _sum: { netAmount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...successWhere, type: { in: ['INVESTMENT', 'WITHDRAWAL', 'FEE'] } },
        _sum: { netAmount: true },
      }),
    ]);

    const totalCredits = Number(credits._sum.netAmount ?? 0);
    const totalDebits = Number(debits._sum.netAmount ?? 0);

    return success(res, {
      transactions: transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        fee: Number(t.fee),
        netAmount: Number(t.netAmount),
      })),
      summary: {
        totalCredits,
        totalDebits,
        netBalance: totalCredits - totalDebits,
        currentBalance: Number(wallet?.balance ?? 0),
        transactionCount: total,
        currency: wallet?.currency ?? 'NGN',
      },
      meta: {
        total,
        limit: take,
        offset: skip,
        hasMore: skip + take < total,
      },
    }, 'Statement retrieved');
  } catch (e) { next(e); }
});

// ── POST /api/wallet/credit — admin manual credit ──────────
const creditSchema = z.object({
  amount: z.number().positive(),
  type: z.string().default('manual'),
  description: z.string().max(200).optional(),
  userId: z.string().optional(),
});

router.post('/credit', authRequired, async (req, res, next) => {
  try {
    const roles = req.user.roles || (req.user.role ? [req.user.role] : []);
    if (!roles.includes('ADMIN') && !roles.includes('SUPER_ADMIN')) {
      return res.status(403).json({ success: false, message: 'Admin only', code: 'FORBIDDEN' });
    }
    const parsed = creditSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid payload', issues: parsed.error.issues });
    }
    const target = parsed.data.userId || req.user.id;
    const result = await svc.credit(target, parsed.data.amount, {
      type: parsed.data.type,
      description: parsed.data.description,
    });
    await audit(req, 'wallet_credit', 'Wallet', target, { amount: parsed.data.amount, type: parsed.data.type });
    return success(res, {
      balance: Number(result.wallet.balance),
      entry: { id: result.entry.id, reference: result.entry.reference },
    });
  } catch (e) { next(e); }
});

// ── POST /api/wallet/withdraw — debit + queue payout ───────
router.post('/withdraw', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, bankId } = req.body || {};

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount.' });
    }
    if (!bankId) {
      return res.status(400).json({ success: false, message: 'Bank account required.' });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }
    if (Number(wallet.balance) < amt) {
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    const reference = 'WDR-' + crypto.randomBytes(8).toString('hex').toUpperCase();

    const [updatedWallet, txn] = await prisma.$transaction([
      prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: amt } },
      }),
      prisma.transaction.create({
        data: {
          reference,
          userId,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          provider: 'BANK_TRANSFER',
          amount: amt,
          fee: 0,
          netAmount: amt,
          currency: wallet.currency || 'NGN',
          description: 'Withdrawal to bank account',
        },
      }),
    ]);

    return success(res, {
      message: 'Withdrawal queued. Funds arrive within 1 business day.',
      transactionId: txn.id,
      reference,
      newBalance: Number(updatedWallet.balance),
    }, 'Withdrawal queued');
  } catch (err) {
    next(err);
  }
});

// ── GET /api/wallet/banks — linked banks (from KYC profile) ─
router.get('/banks', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const kyc = await prisma.kycProfile.findUnique({
      where: { userId },
      select: {
        bankName: true,
        bankCode: true,
        accountName: true,
        accountNumber: true,
      },
    });

    if (kyc && kyc.accountNumber) {
      return res.json([
        {
          id: 'kyc-primary',
          bankName: kyc.bankName || 'Linked Bank',
          bankCode: kyc.bankCode || '',
          accountName: kyc.accountName || 'Your Account',
          last4: String(kyc.accountNumber).slice(-4),
        },
      ]);
    }

    return res.json([]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
