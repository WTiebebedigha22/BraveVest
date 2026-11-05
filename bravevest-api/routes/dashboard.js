import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/summary', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [investments, wallet, recentTx, projects] = await Promise.all([
      prisma.investment.findMany({ where: { userId, status: 'ACTIVE' } }),
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.project.count({ where: { status: 'OPEN' } }),
    ]);
    const totalValue = investments.reduce((s, i) => s + (i.currentValue || i.amount), 0);
    const monthlyDelta = investments.reduce((s, i) => s + (i.monthlyReturn || 0), 0);
    res.json({
      portfolio: { totalValue, monthlyDelta, deltaPercent: totalValue ? (monthlyDelta / totalValue) * 100 : 0 },
      investments,
      wallet,
      recentTx,
      stats: { activeInvestments: investments.length, openProjects: projects },
    });
  } catch (e) { next(e); }
});

export default router;
