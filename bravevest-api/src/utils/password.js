const bcrypt = require('bcryptjs');
module.exports = {
  hashPassword: (plain) => bcrypt.hash(plain, 12),
  comparePassword: (plain, hash) => bcrypt.compare(plain, hash),
};
