// src/modules/auth/auth.routes.js
const router = require('express').Router();
const ctrl = require('./auth.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { validate } = require('../../middleware/validate');
const { authRequired } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimit');
const {
  registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema,
} = require('./auth.validator');

router.post('/register', authLimiter, validate({ body: registerSchema }), asyncHandler(ctrl.register));
router.post('/login', authLimiter, validate({ body: loginSchema }), asyncHandler(ctrl.login));
router.post('/refresh', validate({ body: refreshSchema }), asyncHandler(ctrl.refresh));
router.post('/logout', asyncHandler(ctrl.logout));
router.get('/me', authRequired, asyncHandler(ctrl.me));
router.post('/forgot-password', authLimiter, validate({ body: forgotSchema }), asyncHandler(ctrl.forgotPassword));
router.post('/reset-password', authLimiter, validate({ body: resetSchema }), asyncHandler(ctrl.resetPassword));

module.exports = router;
