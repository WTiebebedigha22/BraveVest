const { prisma } = require('../config/database');
const logger = require('../config/logger');

// Friendly action -> AuditAction enum value where one exists.
// Anything not in this map is stored as-is (still valid — entity is a String).
const ACTION_MAP = {
  create_funding_request: 'FUNDING_REQUEST_CREATED',
  submit_funding_request: 'FUNDING_REQUEST_SUBMITTED',
  approve_funding_request: 'FUNDING_REQUEST_APPROVED',
  reject_funding_request: 'FUNDING_REQUEST_REJECTED',
  publish_funding_request: 'FUNDING_REQUEST_PUBLISHED',
  cancel_funding_request: 'FUNDING_REQUEST_CANCELLED',
  create_commitment: 'COMMITMENT_CREATED',
  record_repayment: 'REPAYMENT_RECORDED',
  login: 'USER_LOGIN',
  register: 'USER_REGISTERED',
  admin_action: 'ADMIN_ACTION',
};

// Fire-and-forget audit writer. Never blocks the response.
async function audit(req, action, entity, entityId = null, meta = null) {
  try {
    const mapped = ACTION_MAP[action] ?? action;
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id ?? null,
        action: mapped,
        entity,
        entityId,
        meta: meta ? { ...meta, ip: req.ip, ua: req.get('user-agent') } : { ip: req.ip },
      },
    });
  } catch (e) {
    logger.error('audit write failed', { action, entity, entityId, error: e.message });
  }
}

// Express middleware — auto-logs non-GET requests when req.user exists.
function auditMiddleware(entity, actionOverride) {
  return (req, res, next) => {
    if (['GET', 'OPTIONS', 'HEAD'].includes(req.method)) return next();
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode < 400 && req.user) {
        const action = actionOverride
          || (req.method === 'POST' ? 'create'
             : req.method === 'PATCH' || req.method === 'PUT' ? 'update'
             : req.method === 'DELETE' ? 'delete' : 'other');
        const id = body?.data?.id ?? req.params?.id ?? null;
        audit(req, action, entity, id, { path: req.originalUrl }).catch(() => {});
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { audit, auditMiddleware };
