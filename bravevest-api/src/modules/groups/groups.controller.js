const service = require('./groups.service');
const { success, created } = require('../../utils/apiResponse');
async function create(req, res) { return created(res, await service.create(req.user.id, req.body), 'Created'); }
async function listMine(req, res) { return success(res, await service.listMine(req.user.id)); }
async function getDetail(req, res) { return success(res, await service.getDetail(req.user.id, req.params.id)); }
async function joinByCode(req, res) { return success(res, await service.joinByCode(req.user.id, req.body.inviteCode), 'Joined'); }
async function contribute(req, res) { return created(res, await service.contribute(req.user.id, req.params.id, Number(req.body.amount)), 'Contributed'); }
module.exports = { create, listMine, getDetail, joinByCode, contribute };
