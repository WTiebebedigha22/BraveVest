const env = require('./env');
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env.isDev ? LEVELS.debug : LEVELS.info;
function log(level, ...args) {
  if (LEVELS[level] > currentLevel) return;
  console.log('[' + new Date().toISOString() + '] ' + level.toUpperCase().padEnd(5), ...args);
}
module.exports = {
  error: (...a) => log('error', ...a),
  warn: (...a) => log('warn', ...a),
  info: (...a) => log('info', ...a),
  debug: (...a) => log('debug', ...a),
};
