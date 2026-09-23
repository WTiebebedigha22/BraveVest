// src/modules/goals/goals.routes.js
const router = require('express').Router();
const ctrl = require('./goals.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.get('/', asyncHandler(ctrl.listMine));
router.post('/', asyncHandler(ctrl.create));
router.patch('/:id', asyncHandler(ctrl.update));
router.delete('/:id', asyncHandler(ctrl.remove));
router.get('/:id/recommend', asyncHandler(ctrl.recommend));

module.exports = router;
