const router = require('express').Router();
const ctrl = require('./kyc.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');
const { kycUpload } = require('../../middleware/upload');

router.use(authRequired);
router.get('/', asyncHandler(ctrl.getMine));
router.get('/status', asyncHandler(ctrl.getStatus));
router.patch('/step/:step', asyncHandler(ctrl.saveStep));
router.post('/documents', kycUpload, asyncHandler(ctrl.uploadDocument));
router.post('/submit', asyncHandler(ctrl.submit));

module.exports = router;
