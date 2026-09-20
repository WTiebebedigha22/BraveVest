// src/modules/admin/admin.routes.js
const router = require('express').Router();
const ctrl = require('./admin.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/role');
const { validate } = require('../../middleware/validate');
const { rejectSchema } = require('../kyc/kyc.validator');

router.use(authRequired, requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', asyncHandler(ctrl.dashboard));

router.get('/kyc', asyncHandler(ctrl.listKyc));
router.get('/kyc/:id', asyncHandler(ctrl.getKyc));
router.patch('/kyc/:id/approve', asyncHandler(ctrl.approveKyc));
router.patch('/kyc/:id/reject', validate({ body: rejectSchema }), asyncHandler(ctrl.rejectKyc));

router.get('/investors', asyncHandler(ctrl.listInvestors));
router.get('/investors/:id', asyncHandler(ctrl.getInvestor));
router.get('/investments', asyncHandler(ctrl.listInvestments));
router.get('/transactions', asyncHandler(ctrl.listTransactions));

module.exports = router;
