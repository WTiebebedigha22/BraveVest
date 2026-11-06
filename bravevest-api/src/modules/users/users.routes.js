const router = require('express').Router();
const ctrl = require('./users.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth.middleware');

router.use(authRequired);
router.get('/me', asyncHandler(ctrl.me));
router.patch('/me', asyncHandler(ctrl.updateMe));
router.post('/me/change-password', asyncHandler(ctrl.changePassword));

module.exports = router;

/**
 * GET /api/users/me/documents
 * Returns statements, tax notes, and certificates for the user.
 */
router.get('/me/documents', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const docs = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    res.json(
      docs.map((d) => ({
        id: d.id,
        name: d.name || 'Document',
        type: d.type || 'Statement',
        date: d.createdAt,
        size: d.size || '—',
      }))
    );
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/me/documents/:id/download
 * Streams a document file.
 */
router.get('/me/documents/:id/download', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    if (doc.url) {
      return res.redirect(doc.url);
    }
    if (doc.content) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${doc.name || 'document.pdf'}"`
      );
      return res.send(doc.content);
    }
    res.status(404).json({ message: 'No file attached to this document.' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/users/me/gift
 * Sends a gift (investment credit) to another user.
 * Body: { recipient: string, amount: number, message?: string }
 */
router.post('/me/gift', authRequired, async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { recipient, amount, message } = req.body || {};

    if (!recipient || !amount) {
      return res
        .status(400)
        .json({ message: 'Recipient and amount are required.' });
    }
    const amt = Number(amount);
    if (!amt || amt < 1000) {
      return res
        .status(400)
        .json({ message: 'Minimum gift is ₦1,000.' });
    }

    const senderWallet = await prisma.wallet.findUnique({
      where: { userId: senderId },
    });
    if (!senderWallet || Number(senderWallet.balance) < amt) {
      return res
        .status(400)
        .json({ message: 'Insufficient balance for this gift.' });
    }

    // Record the gift intent (full redemption requires backend expansion)
    const gift = await prisma.transaction.create({
      data: {
        userId: senderId,
        type: 'GIFT',
        direction: 'DEBIT',
        amount: amt,
        description: `Gift to ${recipient}${message ? ': ' + message : ''}`,
        status: 'COMPLETED',
      },
    });

    await prisma.wallet.update({
      where: { userId: senderId },
      data: { balance: { decrement: amt } },
    });

    res.json({ ok: true, transactionId: gift.id });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/me/year-in-review?year=YYYY
 * Aggregates the user's yearly stats.
 */
router.get('/me/year-in-review', authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const [investments, transactions] = await Promise.all([
      prisma.investment.findMany({
        where: {
          userId,
          createdAt: { gte: start, lt: end },
        },
        include: { project: true },
      }).catch(() => []),
      prisma.transaction.findMany({
        where: { userId, createdAt: { gte: start, lt: end } },
      }).catch(() => []),
    ]);

    const totalInvested = investments.reduce(
      (s, i) => s + Number(i.amount || 0),
      0
    );
    const totalReturns = investments.reduce(
      (s, i) => s + Number(i.monthlyReturn || 0) * 12,
      0
    );
    const walletVolume = transactions.reduce(
      (s, t) => s + Number(t.amount || 0),
      0
    );

    const bestDeal =
      investments.length > 0
        ? investments.reduce((best, i) =>
            Number(i.amount) > Number(best.amount) ? i : best
          ).project?.name || '—'
        : '—';

    res.json({
      year,
      totalInvested,
      totalReturns,
      investmentsCount: investments.length,
      bestDeal,
      walletVolume,
    });
  } catch (err) {
    next(err);
  }
});

