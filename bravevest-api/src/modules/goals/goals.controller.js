// src/modules/goals/goals.controller.js
const service = require('./goals.service');
const { success, created, noContent } = require('../../utils/apiResponse');

const create = async (req, res) => created(res, await service.create(req.user.id, req.body), 'Goal created');
const listMine = async (req, res) => success(res, await service.listMine(req.user.id));
const update = async (req, res) => success(res, await service.update(req.user.id, req.params.id, req.body), 'Goal updated');
const remove = async (req, res) => { await service.remove(req.user.id, req.params.id); return noContent(res); };
const recommend = async (req, res) => success(res, await service.recommendProjects(req.user.id, req.params.id));

module.exports = { create, listMine, update, remove, recommend };
