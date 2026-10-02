const service = require('./referrals.service');
const { success } = require('../../utils/apiResponse');
async function me(req, res) { return success(res, await service.stats(req.user.id)); }
module.exports = { me };
