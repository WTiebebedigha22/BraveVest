const ApiError = require('../utils/apiError');
const { verifyAccess } = require('../utils/jwt');
const { prisma } = require('../config/database');

async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) throw ApiError.unauthorized('Missing token');
    const token = header.slice(7).trim();
    let payload;
    try { payload = verifyAccess(token); }
    catch (err) {
      if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Token expired');
      throw ApiError.unauthorized('Invalid token');
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true, createdAt: true },
    });
    if (!user) throw ApiError.unauthorized('User not found');
    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') throw ApiError.forbidden('Account inactive');
    req.user = user;
    next();
  } catch (err) { next(err); }
}
module.exports = { authRequired };
