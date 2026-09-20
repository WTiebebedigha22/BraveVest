// src/modules/investments/investments.routes.js
const router = require('express').Router();
const ctrl = require('./investments.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { validate } = require('../../middleware/validate');
const { authRequired } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/role');
const { createSchema, listQuerySchema } = require('./investments.validator');

router.use(authRequired);

router.post('/', validate({ body: createSchema }), asyncHandler(ctrl.create));
router.get('/', validate({ query: listQuerySchema }), asyncHandler(ctrl.listMine));
router.get('/portfolio', asyncHandler(ctrl.portfolio));
router.get('/portfolio/series', asyncHandler(ctrl.series));
router.get('/admin/all', requireRole('ADMIN', 'SUPER_ADMIN'), asyncHandler(ctrl.listAll));
router.get('/:id', asyncHandler(ctrl.getMine));

module.exports = router;
