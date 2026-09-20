// src/modules/payments/payments.routes.js
const router = require('express').Router();
const ctrl = require('./payments.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { validate } = require('../../middleware/validate');
const { authRequired } = require('../../middleware/auth');
const { paymentLimiter } = require('../../middleware/rateLimit');
const {
  initializeSchema, verifyParamsSchema, listQuerySchema,
} = require('./payments.validator');

// Webhooks (mounted before auth — signalled by req.rawBody from app.js)
router.post('/webhook/paystack', asyncHandler(ctrl.webhookPaystack));
router.post('/webhook/flutterwave', asyncHandler(ctrl.webhookFlutterwave));

// Authed
router.use(authRequired);
router.post('/initialize', paymentLimiter, validate({ body: initializeSchema }), asyncHandler(ctrl.initialize));
router.get('/verify/:reference', validate({ params: verifyParamsSchema }), asyncHandler(ctrl.verify));
router.get('/transactions', validate({ query: listQuerySchema }), asyncHandler(ctrl.listMine));
router.get('/wallet', asyncHandler(ctrl.wallet));

module.exports = router;
