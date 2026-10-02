const service = require('./streaks.service');
const { success } = require('../../utils/apiResponse');
async function me(req, res) { return success(res, await service.getOrCreate(req.user.id)); }
module.exports = { me };
