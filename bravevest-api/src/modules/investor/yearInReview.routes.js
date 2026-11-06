const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../../middleware/auth.middleware');

const router = Router();
const prisma = new PrismaClient();

// GET /api/investor/year-in-review?year=2026
router.get('/', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const [investments, transactions, wallet, user] = await Promise.all([
      prisma.investment.findMany({
        where: { userId, createdAt: { gte: start, lt: end } },
        include: { project: true },
        orderBy: { amount: 'desc' },
      }).catch(() => []),
      prisma.transaction.findMany({
        where: { userId, createdAt: { gte: start, lt: end } },
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
      prisma.wallet.findUnique({ where: { userId } }).catch(() => null),
      prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true, createdAt: true } }).catch(() => null),
    ]);

    const totalInvested = investments.reduce((s, i) => s + Number(i.amount || 0), 0);

    // Returns: sum of all PAYOUT transactions
    const totalReturns = transactions
      .filter((t) => t.type === 'PAYOUT')
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    // Wallet volume: sum of all transaction amounts
    const walletVolume = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);

    // Best deal: highest invested amount
    const bestDeal = investments.length > 0 ? investments[0] : null;

    // Monthly breakdown (12 months)
    const monthlyInvestments = Array.from({ length: 12 }, (_, m) => {
      const monthStart = new Date(year, m, 1);
      const monthEnd = new Date(year, m + 1, 1);
      const monthAmount = investments
        .filter((i) => {
          const d = new Date(i.createdAt);
          return d >= monthStart && d < monthEnd;
        })
        .reduce((s, i) => s + Number(i.amount || 0), 0);
      return { month: m + 1, amount: monthAmount };
    });

    // Investment categories breakdown
    const categoryMap = {};
    investments.forEach((i) => {
      const cat = i.project?.category || 'OTHER';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(i.amount || 0);
    });
    const byCategory = Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Deposits vs withdrawals this year
    const totalDeposits = transactions
      .filter((t) => t.type === 'DEPOSIT')
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalWithdrawals = transactions
      .filter((t) => t.type === 'WITHDRAWAL')
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    res.json({
      year,
      user: {
        firstName: user?.firstName || 'Investor',
        lastName: user?.lastName || '',
        memberSince: user?.createdAt,
      },
      totalInvested,
      totalReturns,
      walletVolume,
      totalDeposits,
      totalWithdrawals,
      investmentsCount: investments.length,
      bestDeal: bestDeal ? {
        title: bestDeal.project?.title || bestDeal.project?.name || 'Investment',
        amount: Number(bestDeal.amount || 0),
        yield: Number(bestDeal.project?.expectedReturnPct || 0),
        category: bestDeal.project?.category || 'OTHER',
      } : null,
      monthlyInvestments,
      byCategory,
      currentBalance: Number(wallet?.balance || 0),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
