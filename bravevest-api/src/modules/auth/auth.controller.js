const service = require('./auth.service');
const { success, created } = require('../../utils/apiResponse');

async function register(req, res) { return created(res, await service.register(req.body), 'Account created'); }
async function login(req, res) { return success(res, await service.login(req.body), 'Logged in'); }
async function refresh(req, res) { return success(res, await service.refresh(req.body.refreshToken), 'Token refreshed'); }
async function logout(req, res) { await service.logout(req.body?.refreshToken); return success(res, null, 'Logged out'); }
async function me(req, res) { return success(res, await service.me(req.user.id)); }
async function forgotPassword(req, res) { return success(res, await service.forgotPassword(req.body.email), 'Email sent'); }
async function resetPassword(req, res) { return success(res, await service.resetPassword(req.body.token, req.body.password), 'Password reset'); }

// ── Session & password management ──────────────────────────────
async function changePassword(req, res) {
  await service.changePassword(
    req.user.id,
    req.body.oldPassword,
    req.body.newPassword,
    req.body.refreshToken || null
  );
  return success(res, null, 'Password updated');
}

async function listSessions(req, res) {
  const currentToken = req.body?.refreshToken || req.headers['x-refresh-token'] || null;
  const sessions = await service.listSessions(req.user.id, currentToken);
  return success(res, sessions, 'Sessions retrieved');
}

async function logoutOthers(req, res) {
  const currentToken = req.body?.refreshToken || req.headers['x-refresh-token'] || null;
  const revoked = await service.revokeOtherSessions(req.user.id, currentToken);
  return success(res, { revoked }, 'Other sessions logged out');
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
  changePassword,
  listSessions,
  logoutOthers,
};