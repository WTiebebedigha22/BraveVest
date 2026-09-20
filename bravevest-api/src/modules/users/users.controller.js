// src/modules/users/users.controller.js
const service = require('./users.service');
const { success } = require('../../utils/apiResponse');

const me = async (req, res) => {
  return success(res, await service.getProfile(req.user.id));
};

const updateMe = async (req, res) => {
  const updated = await service.updateProfile(req.user.id, req.body);
  return success(res, updated, 'Profile updated');
};

const changePassword = async (req, res) => {
  const result = await service.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  return success(res, result, 'Password changed');
};

module.exports = { me, updateMe, changePassword };
