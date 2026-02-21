'use strict';

// ─────────────────────────────────────────────────────────
//  Pablo Logger — timestamped, leveled, clean
// ─────────────────────────────────────────────────────────

const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const MIN_LEVEL = LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LEVELS.INFO;

function ts() {
  return new Date().toISOString();
}

function format(level, tag, msg) {
  const prefix = `[${ts()}] [${level}]`;
  return tag ? `${prefix} [${tag}] ${msg}` : `${prefix} ${msg}`;
}

function log(level, tag, ...args) {
  if (LEVELS[level] < MIN_LEVEL) return;
  const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
  const line = format(level, tag, msg);
  if (level === 'ERROR') {
    console.error(line);
  } else {
    console.log(line);
  }
}

const logger = {
  debug: (tag, ...a) => log('DEBUG', tag, ...a),
  info:  (tag, ...a) => log('INFO',  tag, ...a),
  warn:  (tag, ...a) => log('WARN',  tag, ...a),
  error: (tag, ...a) => log('ERROR', tag, ...a),

  // Shorthand without tag
  d: (...a) => log('DEBUG', null, ...a),
  i: (...a) => log('INFO',  null, ...a),
  w: (...a) => log('WARN',  null, ...a),
  e: (...a) => log('ERROR', null, ...a),
};

module.exports = logger;
