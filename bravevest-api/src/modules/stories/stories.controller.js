const service = require('./stories.service');
const { success, created, noContent } = require('../../utils/apiResponse');

async function listPublished(req, res) { return success(res, await service.listPublished(req.query)); }
async function getPublished(req, res) { return success(res, await service.getPublishedById(req.params.id)); }
async function adminList(req, res) {
  const r = await service.adminList(req.query);
  return success(res, r.items, 'Stories', 200, { total: r.total });
}
async function adminGet(req, res) { return success(res, await service.adminGet(req.params.id)); }
async function create(req, res) { return created(res, await service.create(req.body), 'Created'); }
async function update(req, res) { return success(res, await service.update(req.params.id, req.body), 'Updated'); }
async function remove(req, res) { await service.remove(req.params.id); return noContent(res); }

module.exports = { listPublished, getPublished, adminList, adminGet, create, update, remove };
