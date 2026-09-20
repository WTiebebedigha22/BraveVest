// src/modules/projects/projects.controller.js
const service = require('./projects.service');
const { success, created, noContent } = require('../../utils/apiResponse');

const list = async (req, res) => {
  const { items, meta } = await service.list(req.query);
  return success(res, items, 'Projects', 200, meta);
};
const listAdmin = async (req, res) => {
  const { items, meta } = await service.listAdmin(req.query);
  return success(res, items, 'Projects (admin)', 200, meta);
};
const getBySlug = async (req, res) => success(res, await service.getBySlug(req.params.slug));
const create = async (req, res) => created(res, await service.create(req.user.id, req.body), 'Project created');
const update = async (req, res) => success(res, await service.update(req.params.id, req.body), 'Project updated');
const updateStatus = async (req, res) => success(res, await service.updateStatus(req.params.id, req.body.status), 'Status updated');
const remove = async (req, res) => { await service.remove(req.params.id); return noContent(res); };

module.exports = { list, listAdmin, getBySlug, create, update, updateStatus, remove };
