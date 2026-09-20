// src/modules/projects/projects.routes.js
const router = require('express').Router();
const ctrl = require('./projects.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { validate } = require('../../middleware/validate');
const { authRequired } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/role');
const {
  createSchema, updateSchema, listQuerySchema, statusSchema,
} = require('./projects.validator');

// Public
router.get('/', validate({ query: listQuerySchema }), asyncHandler(ctrl.list));
router.get('/admin/list', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), validate({ query: listQuerySchema }), asyncHandler(ctrl.listAdmin));
router.get('/:slug', asyncHandler(ctrl.getBySlug));

// Admin
router.post('/', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), validate({ body: createSchema }), asyncHandler(ctrl.create));
router.patch('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), validate({ body: updateSchema }), asyncHandler(ctrl.update));
router.patch('/:id/status', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), validate({ body: statusSchema }), asyncHandler(ctrl.updateStatus));
router.delete('/:id', authRequired, requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.remove));

module.exports = router;
