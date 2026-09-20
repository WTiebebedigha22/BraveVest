// src/services/audit.service.js
const { prisma } = require('../config/database');
const logger = require('../config/logger');

async function log({ userId, action, entity, entityId, meta, ip, userAgent }) {
  try {
    return await prisma.auditLog.create({
      data: { userId: userId || null, action, entity: entity || null, entityId: entityId || null, meta: meta || null, ip: ip || null, userAgent: userAgent || null },
    });
  } catch (err) {
    logger.warn('Audit log failed: ' + err.message);
    return null;
  }
}

module.exports = { log };
