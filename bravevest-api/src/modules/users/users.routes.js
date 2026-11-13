const router = require('express').Router();
const ctrl = require('./users.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth.middleware');
const { prisma } = require('../../config/database');

router.use(authRequired);
router.get('/me', asyncHandler(ctrl.me));
router.patch('/me', asyncHandler(ctrl.updateMe));
router.post('/me/change-password', asyncHandler(ctrl.changePassword));

/**
 * GET /api/users/me/documents
 * Returns statements, tax notes, and certificates for the user.
 */
router.get('/me/documents', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const docs = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    res.json(
      docs.map((d) => ({
        id: d.id,
        name: d.fileName || 'Document',
        type: d.type || 'Statement',
        date: d.createdAt,
        size: d.fileSize ? `${Math.round(d.fileSize / 1024)} KB` : '—',
        url: d.fileUrl || null,
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
router.get('/me/documents/:id/download', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    if (doc.fileUrl) {
      return res.redirect(doc.fileUrl);
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
router.post('/me/gift', async (req, res, next) => {
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

    // Check sender's balance
    const senderWallet = await prisma.wallet.findUnique({
      where: { userId: senderId },
    });
    if (!senderWallet || Number(senderWallet.balance) < amt) {
      return res
        .status(400)
        .json({ message: 'Insufficient balance for this gift.' });
    }

    // Find recipient by email or phone
    const recipientUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: recipient }, { phone: recipient }],
      },
    });
    if (!recipientUser) {
      return res
        .status(404)
        .json({ message: 'Recipient not found. Enter a valid email or phone.' });
    }
    if (recipientUser.id === senderId) {
      return res
        .status(400)
        .json({ message: 'You cannot gift yourself.' });
    }

    // Create the gift transaction + debit sender + credit recipient
    const reference = 'GIFT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Sender — debit wallet
      const updatedSender = await tx.wallet.update({
        where: { userId: senderId },
        data: { balance: { decrement: amt } },
      });

      // 2. Sender — record the outgoing transaction
      const giftTxn = await tx.transaction.create({
        data: {
          reference,
          userId: senderId,
          type: 'REFUND',      // schema has no GIFT/TRANSFER — REFUND is the closest
          status: 'SUCCESS',
          provider: 'MANUAL',
          amount: amt,
          fee: 0,
          netAmount: amt,
          currency: 'NGN',
          description: `Gift to ${recipientUser.email}${message ? ' — ' + message : ''}`,
          paidAt: new Date(),
        },
      });

      // 3. Sender — ledger entry (debit)
      await tx.ledgerEntry.create({
        data: {
          reference: `LEDGER-${reference}-OUT`,
          userId: senderId,
          type: 'gift',
          direction: 'debit',
          amount: amt,
          currency: 'NGN',
          balanceAfter: Number(updatedSender.balance),
          description: `Gift to ${recipientUser.email}`,
          transactionId: giftTxn.id,
        },
      });

      // 4. Recipient — credit wallet
      const recipientWallet = await tx.wallet.upsert({
        where: { userId: recipientUser.id },
        update: { balance: { increment: amt } },
        create: { userId: recipientUser.id, balance: amt, currency: 'NGN' },
      });

      // 5. Recipient — record the incoming transaction
      await tx.transaction.create({
        data: {
          reference: `${reference}-IN`,
          userId: recipientUser.id,
          type: 'DEPOSIT',
          status: 'SUCCESS',
          provider: 'MANUAL',
          amount: amt,
          fee: 0,
          netAmount: amt,
          currency: 'NGN',
          description: `Gift received${message ? ' — ' + message : ''}`,
          paidAt: new Date(),
        },
      });

      // 6. Recipient — ledger entry (credit)
      await tx.ledgerEntry.create({
        data: {
          reference: `LEDGER-${reference}-IN`,
          userId: recipientUser.id,
          type: 'gift',
          direction: 'credit',
          amount: amt,
          currency: 'NGN',
          balanceAfter: Number(recipientWallet.balance),
          description: `Gift received`,
          transactionId: giftTxn.id,
        },
      });

      // 7. Notify recipient
      try {
        await tx.notification.create({
          data: {
            userId: recipientUser.id,
            type: 'GIFT_RECEIVED',
            title: 'Gift received',
            message: `You received a ₦${amt.toLocaleString()} gift${message ? ': ' + message : '.'}`,
            metadata: { senderId, amount: amt, reference },
          },
        });
      } catch (e) {
        // notifications optional
      }

      return { giftTxn, updatedSender };
    });

    res.status(201).json({
      success: true,
      message: `Gift of ₦${amt.toLocaleString()} sent to ${recipientUser.email}.`,
      data: {
        reference,
        amount: amt,
        recipient: recipientUser.email,
        newBalance: Number(result.updatedSender.balance),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/me/year-in-review?year=YYYY
 * Aggregates the user's yearly stats.
 */
router.get('/me/year-in-review', async (req, res, next) => {
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
      (s, i) => s + Number(i.expectedReturn || 0) - Number(i.amount || 0),
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
          ).project?.title || '—'
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

module.exports = router;