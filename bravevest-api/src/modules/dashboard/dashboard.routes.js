const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../../middleware/auth.middleware');

const router = Router();
const prisma = new PrismaClient();

router.get('/', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [investments, wallet, recentTx, pendingPayouts] = await Promise.all([
      prisma.investment.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { project: true },
      }).catch(() => []),
      prisma.wallet.findUnique({ where: { userId } }).catch(() => null),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }).catch(() => []),
      prisma.transaction.findMany({
        where: { userId, type: 'RETURN', status: 'PENDING' },
        orderBy: { createdAt: 'asc' },
        take: 1,
      }).catch(() => []),
    ]);

    const portfolioValue = investments.reduce((s, i) => s + Number(i.amount || 0), 0);
    const monthlyDelta = investments.reduce((s, i) => {
      const rate = Number(i.project?.expectedReturnPct || 0);
      return s + (Number(i.amount || 0) * rate) / 1200;
    }, 0);

    res.json({
      portfolioValue,
      monthlyDelta,
      deltaPercent: portfolioValue > 0 ? (monthlyDelta / portfolioValue) * 100 : 0,
      activeInvestments: investments.length,
      walletBalance: Number(wallet?.balance || 0),
      nextPayout: pendingPayouts[0]
        ? { amount: Number(pendingPayouts[0].amount), date: pendingPayouts[0].createdAt }
        : null,
      recentActivity: recentTx.map((t) => ({
        id: t.id,
        title: t.description || t.type || 'Transaction',
        amount: Number(t.amount || 0),
        positive: t.type === 'DEPOSIT' || t.type === 'PAYOUT' || t.type === 'REFUND',
        date: t.createdAt,
      })),
    });
  } catch (err) { next(err); }
});

module.exports = router;
