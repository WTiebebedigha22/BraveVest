const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../../middleware/auth.middleware');

const router = Router();
const prisma = new PrismaClient();

router.get('/', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [investments, wallet, recentTx, pendingLedger] = await Promise.all([
      prisma.investment.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { project: true },
      }).catch(() => []),
      prisma.wallet.findUnique({ where: { userId } }).catch(() => null),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }).catch(() => []),
      prisma.ledgerEntry.findMany({
        where: { wallet: { userId }, status: 'PENDING' },
        orderBy: { createdAt: 'asc' },
        take: 1,
      }).catch(() => []),
    ]);

    const portfolioValue = investments.reduce(
      (s, i) => s + Number(i.amount || 0),
      0
    );
    const monthlyDelta = investments.reduce(
      (s, i) =>
        s + (Number(i.amount || 0) * Number(i.project?.interestRate || 0)) / 1200,
      0
    );
    const nextPayout = pendingLedger[0]
      ? { amount: Number(pendingLedger[0].amount || 0), date: pendingLedger[0].createdAt }
      : null;

    res.json({
      portfolioValue,
      monthlyDelta,
      deltaPercent: portfolioValue > 0 ? (monthlyDelta / portfolioValue) * 100 : 0,
      activeInvestments: investments.length,
      walletBalance: Number(wallet?.balance || 0),
      nextPayout,
      recentActivity: recentTx.map((tx) => ({
        id: tx.id,
        title: tx.description || tx.type || 'Transaction',
        amount: Number(tx.amount || 0),
        positive:
          String(tx.type).includes('DEPOSIT') || String(tx.type).includes('PAYOUT'),
        date: tx.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
