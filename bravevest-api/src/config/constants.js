// src/config/constants.js
module.exports = {
  API_VERSION: 'v1',
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  UPLOAD: {
    ALLOWED_IMAGE_MIMES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOC_MIMES: ['application/pdf', 'image/jpeg', 'image/png'],
  },
};
