const service = require('./insights.service');
const { success, created, noContent } = require('../../utils/apiResponse');
async function list(req, res) { return success(res, await service.list(req.query)); }
async function get(req, res) { return success(res, await service.getByIdOrSlug(req.params.id)); }
async function adminList(req, res) { const r = await service.adminList(req.query); return success(res, r.items, 'Insights', 200, { total: r.total }); }
async function adminGet(req, res) { return success(res, await service.adminGet(req.params.id)); }
async function create(req, res) { return created(res, await service.create(req.user.id, req.body), 'Created'); }
async function update(req, res) { return success(res, await service.update(req.params.id, req.body), 'Updated'); }
async function remove(req, res) { await service.remove(req.params.id); return noContent(res); }
async function toggle(req, res) { return success(res, await service.togglePublish(req.params.id), 'Toggled'); }
module.exports = { list, get, adminList, adminGet, create, update, remove, toggle };
