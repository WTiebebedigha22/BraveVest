const service = require('./users.service');
const { success } = require('../../utils/apiResponse');
async function me(req, res) { return success(res, await service.getProfile(req.user.id)); }
async function updateMe(req, res) { return success(res, await service.updateProfile(req.user.id, req.body), 'Profile updated'); }
async function changePassword(req, res) { return success(res, await service.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword), 'Password changed'); }
module.exports = { me, updateMe, changePassword };
