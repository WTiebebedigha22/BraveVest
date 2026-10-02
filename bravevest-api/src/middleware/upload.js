const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

const ROOT = path.join(process.cwd(), env.uploads.dir);
function ensureSub(sub) { const d = path.join(ROOT, sub); fs.mkdirSync(d, { recursive: true }); return d; }
function storage(sub) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, ensureSub(sub)),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
    },
  });
}
function filter(allowed) {
  return (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) return cb(ApiError.badRequest('Unsupported file type'));
    cb(null, true);
  };
}
const IMG = ['image/jpeg', 'image/png', 'image/webp'];
const DOC = ['application/pdf', 'image/jpeg', 'image/png'];
const max = (env.uploads.maxFileSizeMb || 10) * 1024 * 1024;
module.exports = {
  kycUpload: multer({ storage: storage('kyc'), fileFilter: filter(DOC), limits: { fileSize: max } }).single('file'),
  projectUpload: multer({ storage: storage('projects'), fileFilter: filter([...IMG, ...DOC]), limits: { fileSize: max } }).single('file'),
};
