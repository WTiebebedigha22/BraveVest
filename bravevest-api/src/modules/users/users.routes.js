const router = require('express').Router();
const ctrl = require('./users.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.get('/me', asyncHandler(ctrl.me));
router.patch('/me', asyncHandler(ctrl.updateMe));
router.post('/me/change-password', asyncHandler(ctrl.changePassword));

module.exports = router;
