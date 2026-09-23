// src/modules/referrals/referrals.controller.js
const service = require('./referrals.service');
const { success } = require('../../utils/apiResponse');

const me = async (req, res) => success(res, await service.getMyStats(req.user.id));

module.exports = { me };
