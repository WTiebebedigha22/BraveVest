// src/modules/groups/groups.controller.js
const service = require('./groups.service');
const { success, created } = require('../../utils/apiResponse');

const create = async (req, res) => created(res, await service.create(req.user.id, req.body), 'Group created');
const listMine = async (req, res) => success(res, await service.listMine(req.user.id));
const getDetail = async (req, res) => success(res, await service.getDetail(req.user.id, req.params.id));
const joinByCode = async (req, res) => success(res, await service.joinByCode(req.user.id, req.body.inviteCode), 'Joined group');
const contribute = async (req, res) => created(res, await service.contribute(req.user.id, req.params.id, Number(req.body.amount)), 'Contribution recorded');

module.exports = { create, listMine, getDetail, joinByCode, contribute };
