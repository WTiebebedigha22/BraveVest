// src/modules/auth/auth.controller.js
const service = require('./auth.service');
const { success, created } = require('../../utils/apiResponse');

async function register(req, res) {
  return created(res, await service.register(req.body), 'Account created');
}

async function login(req, res) {
  return success(res, await service.login(req.body), 'Logged in');
}

async function refresh(req, res) {
  return success(res, await service.refresh(req.body.refreshToken), 'Token refreshed');
}

async function logout(req, res) {
  await service.logout(req.body?.refreshToken);
  return success(res, null, 'Logged out');
}

async function me(req, res) {
  return success(res, await service.me(req.user.id));
}

async function forgotPassword(req, res) {
  return success(res, await service.forgotPassword(req.body.email), 'If the email exists, a reset link was sent');
}

async function resetPassword(req, res) {
  return success(res, await service.resetPassword(req.body.token, req.body.password), 'Password reset successful');
}

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
