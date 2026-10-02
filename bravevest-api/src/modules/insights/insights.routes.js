const router = require('express').Router();
const ctrl = require('./insights.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/role');

router.get('/', asyncHandler(ctrl.list));
router.get('/admin/list', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.adminList));
router.post('/', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.create));
router.patch('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.update));
router.patch('/:id/toggle', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.toggle));
router.delete('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.remove));
router.get('/:id', asyncHandler(ctrl.get));

module.exports = router;
