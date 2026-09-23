// src/modules/groups/groups.routes.js
const router = require('express').Router();
const ctrl = require('./groups.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.get('/', asyncHandler(ctrl.listMine));
router.post('/', asyncHandler(ctrl.create));
router.post('/join', asyncHandler(ctrl.joinByCode));
router.get('/:id', asyncHandler(ctrl.getDetail));
router.post('/:id/contribute', asyncHandler(ctrl.contribute));

module.exports = router;
