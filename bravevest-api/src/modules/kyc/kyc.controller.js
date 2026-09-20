// src/modules/kyc/kyc.controller.js
const service = require('./kyc.service');
const { success, created } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');

const getMine = async (req, res) => {
  const result = await service.getMine(req.user.id);
  return success(res, result);
};

const getStatus = async (req, res) => {
  const result = await service.getStatus(req.user.id);
  return success(res, result);
};

const saveStep = async (req, res) => {
  const step = parseInt(req.params.step, 10);
  if (![1, 2, 3, 4].includes(step)) throw ApiError.badRequest('Step must be 1–4');
  const result = await service.saveStep(req.user.id, step, req.body);
  return success(res, result, `Step ${step} saved`);
};

const uploadDocument = async (req, res) => {
  const result = await service.attachDocument(req.user.id, { type: req.body.type }, req.file);
  return created(res, result, 'Document uploaded');
};

const submit = async (req, res) => {
  const result = await service.submit(req.user.id);
  return success(res, result, 'KYC submitted for review');
};

module.exports = { getMine, getStatus, saveStep, uploadDocument, submit };
