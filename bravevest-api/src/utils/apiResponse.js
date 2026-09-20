// src/utils/apiResponse.js — consistent success shape
function success(res, data = null, message = 'OK', statusCode = 200, meta = null) {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

function created(res, data = null, message = 'Created') {
  return success(res, data, message, 201);
}

function noContent(res) {
  return res.status(204).send();
}

module.exports = { success, created, noContent };
