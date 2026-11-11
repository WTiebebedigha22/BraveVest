const prisma = require('../../config/database').prisma;

async function push({ userId, type, title, message, metadata = null }) {
  return prisma.notification.create({
    data: { userId, type, title, message, metadata },
  });
}

module.exports = { push };
