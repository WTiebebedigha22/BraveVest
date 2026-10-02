const service = require('./projects.service');
const { success, created, noContent } = require('../../utils/apiResponse');

async function list(req, res) { const { items, meta } = await service.list(req.query); return success(res, items, 'Projects', 200, meta); }
async function listAdmin(req, res) { const { items, meta } = await service.listAdmin(req.query); return success(res, items, 'Projects', 200, meta); }
async function getBySlug(req, res) { return success(res, await service.getBySlug(req.params.slug)); }
async function create(req, res) { return created(res, await service.create(req.user.id, req.body), 'Created'); }
async function update(req, res) { return success(res, await service.update(req.params.id, req.body), 'Updated'); }
async function updateStatus(req, res) { return success(res, await service.updateStatus(req.params.id, req.body.status), 'Status updated'); }
async function remove(req, res) { await service.remove(req.params.id); return noContent(res); }

module.exports = { list, listAdmin, getBySlug, create, update, updateStatus, remove };
