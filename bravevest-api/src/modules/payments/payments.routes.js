const router = require('express').Router();
const ctrl = require('./payments.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.post('/initialize', asyncHandler(ctrl.initialize));
router.get('/verify/:reference', asyncHandler(ctrl.verify));
router.get('/transactions', asyncHandler(ctrl.listMine));
router.get('/wallet', asyncHandler(ctrl.wallet));

module.exports = router;
