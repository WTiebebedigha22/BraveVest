// src/utils/asyncHandler.js
// Wraps async route handlers so thrown errors go to Express's error handler.
// Without this, an `await` rejection inside a route would crash the server.

module.exports = function asyncHandler(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('asyncHandler requires a function');
  }
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
