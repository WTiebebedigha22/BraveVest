const { PAGINATION } = require('../config/constants');
function getPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT));
  return { page, limit, skip: (page - 1) * limit };
}
function paginatedMeta(total, page, limit) { return { total, page, limit, pages: Math.ceil(total / limit) || 1 }; }
module.exports = { getPagination, paginatedMeta };
