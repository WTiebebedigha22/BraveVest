const router = require('express').Router();
const ctrl = require('./investments.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth.middleware');

router.use(authRequired);
router.post('/', asyncHandler(ctrl.create));
router.get('/', asyncHandler(ctrl.listMine));
router.get('/portfolio', asyncHandler(ctrl.portfolio));
router.get('/portfolio/series', asyncHandler(ctrl.series));
router.get('/:id', asyncHandler(ctrl.getMine));


router.get('/:id/log', authRequired, async (req, res, next) => {
  try {
    const inv = await prisma.investment.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { project: true } });
    if (!inv) return res.status(404).json({ message: 'Not found.' });
    const events = [{ id: 'created', type: 'Investment', title: 'Investment created', description: 'Invested in ' + ((inv.project && inv.project.title) || 'project'), amount: Number(inv.amount || 0), status: 'completed', date: inv.createdAt }];
    res.json({ investment: inv, events });
  } catch (err) { next(err); }
});

module.exports = router;