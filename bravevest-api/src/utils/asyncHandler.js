module.exports = function asyncHandler(handler) {
  if (typeof handler !== 'function') throw new TypeError('asyncHandler requires a function');
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
