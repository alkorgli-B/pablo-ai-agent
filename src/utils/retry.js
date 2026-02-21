'use strict';

// ─────────────────────────────────────────────────────────
//  Retry with exponential backoff
// ─────────────────────────────────────────────────────────
const logger = require('./logger');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Retry an async function with exponential backoff.
 * @param {Function} fn          - async function to retry
 * @param {Object}   opts
 * @param {number}   opts.tries  - max attempts (default 3)
 * @param {number}   opts.base   - base delay ms (default 1000)
 * @param {string}   opts.tag    - log tag
 * @param {Function} opts.isRetryable - (err) => bool, default true always
 */
async function withRetry(fn, { tries = 3, base = 1000, tag = 'retry', isRetryable = () => true } = {}) {
  let lastErr;

  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      if (attempt === tries || !isRetryable(err)) {
        throw err;
      }

      const delay = base * Math.pow(2, attempt - 1);
      logger.warn(tag, `Attempt ${attempt}/${tries} failed: ${err.message} — retrying in ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastErr;
}

module.exports = { withRetry, sleep };
