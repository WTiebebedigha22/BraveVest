// src/modules/streaks/streaks.controller.js
const service = require('./streaks.service');
const { success } = require('../../utils/apiResponse');

const me = async (req, res) => success(res, await service.getOrCreate(req.user.id));

module.exports = { me };
