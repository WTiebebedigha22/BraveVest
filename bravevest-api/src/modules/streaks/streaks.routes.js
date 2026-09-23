// src/modules/streaks/streaks.routes.js
const router = require('express').Router();
const ctrl = require('./streaks.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.get('/me', asyncHandler(ctrl.me));

module.exports = router;
