// src/modules/insights/insights.controller.js
const service = require('./insights.service');
const { success, created, noContent } = require('../../utils/apiResponse');

const list = async (req, res) => success(res, await service.list(req.query));
const get = async (req, res) => success(res, await service.getByIdOrSlug(req.params.id));

/* Admin */
const adminList = async (req, res) => {
  const result = await service.adminList(req.query);
  return success(res, result.items, 'Insights', 200, { total: result.total, page: result.page, limit: result.limit });
};
const adminGet = async (req, res) => success(res, await service.getByIdOrSlug(req.params.id, { allowDraft: true }));
const create = async (req, res) => created(res, await service.create(req.user.id, req.body), 'Insight created');
const update = async (req, res) => success(res, await service.update(req.params.id, req.body), 'Insight updated');
const remove = async (req, res) => { await service.remove(req.params.id); return noContent(res); };
const toggle = async (req, res) => success(res, await service.togglePublish(req.params.id), 'Publish toggled');

module.exports = { list, get, adminList, adminGet, create, update, remove, toggle };
