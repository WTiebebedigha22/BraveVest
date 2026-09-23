// src/modules/referrals/referrals.routes.js
const router = require('express').Router();
const ctrl = require('./referrals.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.get('/me', asyncHandler(ctrl.me));

module.exports = router;
