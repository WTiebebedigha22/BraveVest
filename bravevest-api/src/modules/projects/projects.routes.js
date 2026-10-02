const router = require('express').Router();
const ctrl = require('./projects.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/role');

router.get('/', asyncHandler(ctrl.list));
router.get('/admin/list', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.listAdmin));
router.get('/:slug', asyncHandler(ctrl.getBySlug));
router.post('/', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.create));
router.patch('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.update));
router.patch('/:id/status', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.updateStatus));
router.delete('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.remove));

module.exports = router;
