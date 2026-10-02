const service = require('./kyc.service');
const { success, created } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');

async function getMine(req, res) { return success(res, await service.getMine(req.user.id)); }
async function getStatus(req, res) { return success(res, await service.getStatus(req.user.id)); }
async function saveStep(req, res) {
  const step = parseInt(req.params.step, 10);
  if (![1, 2, 3, 4].includes(step)) throw ApiError.badRequest('Step must be 1–4');
  return success(res, await service.saveStep(req.user.id, step, req.body), 'Step saved');
}
async function uploadDocument(req, res) { return created(res, await service.attachDocument(req.user.id, { type: req.body.type }, req.file), 'Document uploaded'); }
async function submit(req, res) { return success(res, await service.submit(req.user.id), 'Submitted'); }

module.exports = { getMine, getStatus, saveStep, uploadDocument, submit };
