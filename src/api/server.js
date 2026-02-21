'use strict';

// ─────────────────────────────────────────────────────────
//  Pablo HTTP API Server
//  Exposes Pablo's skills as REST endpoints so OpenClaw
//  (and any external agent) can call them directly.
//
//  Default port: 3747  (configurable via PABLO_API_PORT)
//  Start: node src/api/server.js
// ─────────────────────────────────────────────────────────
require('dotenv').config();
const http   = require('http');
const url    = require('url');
const logger = require('../utils/logger');

// Skills
const crypto    = require('../skills/crypto');
const weather   = require('../skills/weather');
const news      = require('../skills/news');
const github    = require('../skills/github');
const search    = require('../skills/search');
const facts     = require('../skills/facts');
const aimodels  = require('../skills/aimodels');
const { calculate, formatCalcResult } = require('../skills/calculator');
const ai        = require('../core/ai');

const PORT = parseInt(process.env.PABLO_API_PORT || '3747', 10);

// ── Helpers ────────────────────────────────────────────────

function json(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
  });
}

// ── Route Handlers ─────────────────────────────────────────

const routes = {

  // GET /health
  'GET /health': async (_req, res) => {
    json(res, 200, {
      status: 'ok',
      agent:  'Pablo',
      version: '3.0.0',
      skills: ['crypto', 'weather', 'news', 'github', 'search', 'facts', 'aimodels', 'calculate', 'chat'],
    });
  },

  // GET /crypto?coin=bitcoin
  // GET /crypto?top=10
  'GET /crypto': async (req, res, query) => {
    if (query.top) {
      const n     = Math.min(parseInt(query.top) || 10, 25);
      const coins = await crypto.getTopCoins(n);
      return json(res, 200, { success: true, data: coins, formatted: crypto.formatTopCoins(coins) });
    }
    const coinParam = query.coin || query.symbol || 'bitcoin';
    const coin = await crypto.getCryptoPrice(coinParam);
    if (!coin) return json(res, 404, { success: false, error: `Coin not found: ${coinParam}` });
    json(res, 200, { success: true, data: coin, formatted: crypto.formatCryptoData(coin) });
  },

  // GET /weather?city=Riyadh
  'GET /weather': async (_req, res, query) => {
    const city = query.city || query.q || 'Riyadh';
    const data = await weather.getWeather(city);
    json(res, 200, { success: true, data, formatted: weather.formatWeather(data) });
  },

  // GET /news?topic=AI
  'GET /news': async (_req, res, query) => {
    const topic    = query.topic || query.q || 'artificial intelligence';
    const articles = await news.getNews(topic);
    json(res, 200, { success: true, data: articles, formatted: news.formatNews(articles) });
  },

  // GET /github?topic=ai&trending=1
  'GET /github': async (_req, res, query) => {
    const topic = query.topic || query.q || '';
    const repos = topic ? await github.searchRepos(topic) : await github.getTrending();
    const label = topic ? `GitHub: ${topic}` : 'Trending Repos';
    json(res, 200, { success: true, data: repos, formatted: github.formatRepos(repos, label) });
  },

  // GET /search?q=query
  'GET /search': async (_req, res, query) => {
    const q = query.q || query.query || '';
    if (!q) return json(res, 400, { success: false, error: 'Missing query param: q' });
    const results = await search.search(q);
    json(res, 200, { success: true, data: results, formatted: search.formatResults(results, q) });
  },

  // GET /fact
  'GET /fact': async (_req, res) => {
    const task   = facts.prepareFactsTask();
    const result = await ai.ask(task.systemOverride, task.prompt, { maxTokens: 200 });
    json(res, 200, { success: true, fact: result });
  },

  // GET /calculate?expr=2+2*5
  'GET /calculate': async (_req, res, query) => {
    const expr = query.expr || query.q || '';
    if (!expr) return json(res, 400, { success: false, error: 'Missing param: expr' });
    const result = calculate(expr);
    if (!result) return json(res, 422, { success: false, error: 'Could not parse expression' });
    json(res, 200, { success: true, result: result.value, formatted: formatCalcResult(result) });
  },

  // GET /aimodels?q=claude vs gpt
  'GET /aimodels': async (_req, res, query) => {
    const userQuery = query.q || query.query || 'قدمّ نظرة عامة على أحدث نماذج الذكاء الاصطناعي';
    const task   = aimodels.prepareAIModelsTask(userQuery);
    const result = await ai.ask(task.systemOverride, task.prompt, { maxTokens: 700 });
    json(res, 200, { success: true, answer: result });
  },

  // POST /chat   body: { message: "...", history: [...] }
  'POST /chat': async (req, res) => {
    let body;
    try { body = await parseBody(req); }
    catch { return json(res, 400, { success: false, error: 'Invalid JSON body' }); }

    const { message, history = [] } = body;
    if (!message) return json(res, 400, { success: false, error: 'Missing field: message' });

    const { processMessage } = require('../core/intent');
    const reply = await processMessage(message, history);
    json(res, 200, { success: true, reply });
  },
};

// ── Server ─────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname.replace(/\/$/, '') || '/';
  const routeKey = `${req.method} ${pathname}`;

  logger.debug('api', `${req.method} ${req.url}`);

  const handler = routes[routeKey];
  if (!handler) {
    return json(res, 404, {
      success: false,
      error: `Route not found: ${routeKey}`,
      available: Object.keys(routes),
    });
  }

  try {
    await handler(req, res, parsed.query);
  } catch (err) {
    logger.error('api', `Error handling ${routeKey}: ${err.message}`);
    json(res, 500, { success: false, error: err.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  logger.info('api', `Pablo API server running on http://127.0.0.1:${PORT}`);
  logger.info('api', `Endpoints: GET /health /crypto /weather /news /github /search /fact /calculate /aimodels  POST /chat`);
});

// Graceful shutdown
process.once('SIGINT',  () => server.close());
process.once('SIGTERM', () => server.close());

module.exports = { server };
