// src/utils/password.js
const bcrypt = require('bcryptjs');

const ROUNDS = 12;

const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);
const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { hashPassword, comparePassword };
