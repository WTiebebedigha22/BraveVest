const router = require('express').Router();
const ctrl = require('./investments.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authRequired } = require('../../middleware/auth');

router.use(authRequired);
router.post('/', asyncHandler(ctrl.create));
router.get('/', asyncHandler(ctrl.listMine));
router.get('/portfolio', asyncHandler(ctrl.portfolio));
router.get('/portfolio/series', asyncHandler(ctrl.series));
router.get('/:id', asyncHandler(ctrl.getMine));

module.exports = router;
