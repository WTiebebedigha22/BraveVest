// src/modules/uploads/uploads.controller.js
const { success, created } = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');

const upload = async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  return created(res, {
    fileName: req.file.originalname,
    url: '/uploads/' + (req.file.destination.includes('kyc') ? 'kyc/' : 'projects/') + req.file.filename,
    size: req.file.size,
    mime: req.file.mimetype,
  }, 'File uploaded');
};

module.exports = { upload };
