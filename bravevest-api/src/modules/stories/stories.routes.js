const router = require('express').Router();
const ctrl = require('./stories.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role');

// ── PUBLIC (must be above /:id) ────────────────────────
router.get('/published', asyncHandler(ctrl.listPublished));

// ── ADMIN ──────────────────────────────────────────────
router.get('/admin/list', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.adminList));
router.get('/admin/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.adminGet));
router.post('/', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.create));
router.patch('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.update));
router.delete('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.remove));

// ── PUBLIC detail (MUST be last) ───────────────────────
router.get('/:id', asyncHandler(ctrl.getPublished));

module.exports = router;
