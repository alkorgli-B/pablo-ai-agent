'use strict';

// ─────────────────────────────────────────────────────────
//  Lightweight HTTP client (wraps axios)
// ─────────────────────────────────────────────────────────
const axios = require('axios');
const logger = require('./logger');

const DEFAULT_TIMEOUT = 10_000; // 10 seconds

const client = axios.create({
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'User-Agent': 'PabloAgent/3.0 (AI bot; +https://github.com/pablo-ai-agent)',
    'Accept-Language': 'ar,en;q=0.9',
  },
});

/**
 * GET JSON response
 */
async function get(url, params = {}) {
  try {
    const res = await client.get(url, { params });
    return res.data;
  } catch (err) {
    logger.warn('http', `GET ${url} failed: ${err.message}`);
    throw err;
  }
}

/**
 * GET raw text/xml response
 */
async function getRaw(url, params = {}) {
  try {
    const res = await client.get(url, { params, responseType: 'text' });
    return res.data;
  } catch (err) {
    logger.warn('http', `GET_RAW ${url} failed: ${err.message}`);
    throw err;
  }
}

/**
 * POST JSON
 */
async function post(url, body = {}, headers = {}) {
  try {
    const res = await client.post(url, body, { headers });
    return res.data;
  } catch (err) {
    logger.warn('http', `POST ${url} failed: ${err.message}`);
    throw err;
  }
}

module.exports = { get, getRaw, post };
