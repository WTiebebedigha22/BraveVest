const service = require('./goals.service');
const { success, created, noContent } = require('../../utils/apiResponse');
async function create(req, res) { return created(res, await service.create(req.user.id, req.body), 'Created'); }
async function listMine(req, res) { return success(res, await service.listMine(req.user.id)); }
async function update(req, res) { return success(res, await service.update(req.user.id, req.params.id, req.body), 'Updated'); }
async function remove(req, res) { await service.remove(req.user.id, req.params.id); return noContent(res); }
async function recommend(req, res) { return success(res, await service.recommend(req.user.id, req.params.id)); }
module.exports = { create, listMine, update, remove, recommend };
