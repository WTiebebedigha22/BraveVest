// src/modules/investments/investments.controller.js
const service = require('./investments.service');
const { success, created } = require('../../utils/apiResponse');

const create = async (req, res) => created(res, await service.create(req.user.id, req.body), 'Investment created — awaiting payment');
const listMine = async (req, res) => {
  const { items, meta } = await service.listMine(req.user.id, req.query);
  return success(res, items, 'My investments', 200, meta);
};
const getMine = async (req, res) => success(res, await service.getMine(req.user.id, req.params.id));
const portfolio = async (req, res) => success(res, await service.portfolioSummary(req.user.id));
const series = async (req, res) => success(res, await service.portfolioSeries(req.user.id, 6));
const listAll = async (req, res) => {
  const { items, meta } = await service.listAll(req.query);
  return success(res, items, 'All investments', 200, meta);
};

module.exports = { create, listMine, getMine, portfolio, series, listAll };
