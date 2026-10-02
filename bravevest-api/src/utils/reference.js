const crypto = require('crypto');
function makeReference(prefix = 'BV') {
  return prefix + '-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}
module.exports = { makeReference };
