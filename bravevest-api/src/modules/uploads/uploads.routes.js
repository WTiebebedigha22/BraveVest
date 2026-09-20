// src/modules/uploads/uploads.routes.js
const router = require('express').Router();
const ctrl = require('./uploads.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');
const { kycUpload } = require('../../middleware/upload');

router.use(authRequired);
router.post('/', kycUpload, asyncHandler(ctrl.upload));

module.exports = router;
