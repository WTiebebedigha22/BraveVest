const router = require('express').Router();
const ctrl = require('./projects.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role');

router.get('/', asyncHandler(ctrl.list));
router.get('/admin/list', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.listAdmin));
router.get('/:slug', asyncHandler(ctrl.getBySlug));
router.post('/', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.create));
router.patch('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.update));
router.patch('/:id/status', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.updateStatus));
router.delete('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.remove));


/**
 * GET /api/projects/mine
 * Returns projects submitted by the logged-in user (any status).
 */
router.get('/mine', authRequired, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { createdById: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) { next(err); }
});


/**
 * POST /api/projects/submit
 * Any authenticated user can submit a new opportunity.
 * Creates as PENDING_REVIEW — admin must approve.
 * Body: { title, summary, description, category, targetAmount, minInvestment, expectedReturnPct, tenorMonths, riskLevel, location? }
 */
router.post('/submit', authRequired, async (req, res, next) => {
  try {
    const {
      title, summary, description, category,
      targetAmount, minInvestment, expectedReturnPct, tenorMonths,
      riskLevel, location,
    } = req.body || {};

    if (!title || !summary || !description || !category) {
      return res.status(400).json({ message: 'title, summary, description, category are required.' });
    }
    if (!targetAmount || !minInvestment || !expectedReturnPct || !tenorMonths) {
      return res.status(400).json({ message: 'targetAmount, minInvestment, expectedReturnPct, tenorMonths are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const project = await prisma.project.create({
      data: {
        slug,
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        category,
        targetAmount: Number(targetAmount),
        minInvestment: Number(minInvestment),
        expectedReturnPct: Number(expectedReturnPct),
        tenorMonths: Number(tenorMonths),
        riskLevel: riskLevel || null,
        location: location || null,
        status: 'PENDING_REVIEW',
        createdById: req.user.id,
      },
    });

    res.status(201).json(project);
  } catch (err) { next(err); }
});

module.exports = router;