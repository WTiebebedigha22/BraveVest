// src/modules/kyc/kyc.routes.js
const router = require('express').Router();
const ctrl = require('./kyc.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { validate } = require('../../middleware/validate');
const { authRequired } = require('../../middleware/auth');
const { kycUpload } = require('../../middleware/upload');
const { STEP_SCHEMAS, uploadTypeSchema } = require('./kyc.validator');
const ApiError = require('../../utils/apiError');

router.use(authRequired);

router.get('/', asyncHandler(ctrl.getMine));
router.get('/status', asyncHandler(ctrl.getStatus));

router.patch(
  '/step/:step',
  (req, res, next) => {
    const step = parseInt(req.params.step, 10);
    const schema = STEP_SCHEMAS[step];
    if (!schema) return next(ApiError.badRequest('Step must be 1–4'));
    validate({ body: schema })(req, res, next);
  },
  asyncHandler(ctrl.saveStep)
);

router.post(
  '/documents',
  kycUpload,
  validate({ body: uploadTypeSchema }),
  asyncHandler(ctrl.uploadDocument)
);

router.post('/submit', asyncHandler(ctrl.submit));

module.exports = router;
