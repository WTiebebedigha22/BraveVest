// src/utils/reference.js — short human-readable references
const crypto = require('crypto');
function makeReference(prefix = 'BV') {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${ts}-${rnd}`;
}
module.exports = { makeReference };
