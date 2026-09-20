// src/utils/jwt.js — access + refresh tokens
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAccess = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const signRefresh = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

const verifyAccess = (token) => jwt.verify(token, env.jwt.secret);
const verifyRefresh = (token) => jwt.verify(token, env.jwt.refreshSecret);

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
