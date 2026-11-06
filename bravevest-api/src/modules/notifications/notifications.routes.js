const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { authRequired } = require('../../middleware/auth.middleware');
const router = Router();
const prisma = new PrismaClient();
router.get('/', authRequired, async (req, res, next) => {
  try {
    const txs = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }).catch(() => []);
    const items = txs.map((t) => ({
      id: t.id,
      title: (t.type || 'Transaction') + ' received',
      body: t.description || t.type,
      kind: (t.type || '').toLowerCase().includes('invest') ? 'investment' : 'wallet',
      read: false,
      createdAt: t.createdAt,
    }));
    res.json(items);
  } catch (err) { next(err); }
});
router.post('/:id/read', authRequired, (req, res) => res.json({ ok: true }));
router.post('/read-all', authRequired, (req, res) => res.json({ ok: true }));
module.exports = router;
