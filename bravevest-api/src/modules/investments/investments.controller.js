const service = require('./investments.service');
const { success, created } = require('../../utils/apiResponse');

async function create(req, res) { return created(res, await service.create(req.user.id, req.body), 'Investment created'); }
async function listMine(req, res) { const { items, meta } = await service.listMine(req.user.id, req.query); return success(res, items, 'Investments', 200, meta); }
async function getMine(req, res) { return success(res, await service.getMine(req.user.id, req.params.id)); }
async function portfolio(req, res) { return success(res, await service.portfolioSummary(req.user.id)); }
async function series(req, res) { return success(res, await service.portfolioSeries(req.user.id)); }

module.exports = { create, listMine, getMine, portfolio, series };
