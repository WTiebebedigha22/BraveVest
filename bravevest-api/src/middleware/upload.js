// src/middleware/upload.js — multer disk storage
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

const ROOT_UPLOAD = path.join(process.cwd(), env.uploads.dir);

function ensureSubDir(sub) {
  const dir = path.join(ROOT_UPLOAD, sub);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function storage(sub) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, ensureSubDir(sub)),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  });
}

function fileFilter(allowed) {
  return (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  };
}

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const DOC_MIMES = ['application/pdf', 'image/jpeg', 'image/png'];
const maxSize = (env.uploads.maxFileSizeMb || 10) * 1024 * 1024;

const kycUpload = multer({
  storage: storage('kyc'),
  fileFilter: fileFilter(DOC_MIMES),
  limits: { fileSize: maxSize },
}).single('file');

const projectUpload = multer({
  storage: storage('projects'),
  fileFilter: fileFilter([...IMAGE_MIMES, ...DOC_MIMES]),
  limits: { fileSize: maxSize },
}).single('file');

module.exports = { kycUpload, projectUpload, ROOT_UPLOAD };
