const jwt = require('jsonwebtoken');
const env = require('../config/env');
module.exports = {
  signAccess: (p) => jwt.sign(p, env.jwt.secret, { expiresIn: env.jwt.expiresIn }),
  signRefresh: (p) => jwt.sign(p, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn }),
  verifyAccess: (t) => jwt.verify(t, env.jwt.secret),
  verifyRefresh: (t) => jwt.verify(t, env.jwt.refreshSecret),
};
