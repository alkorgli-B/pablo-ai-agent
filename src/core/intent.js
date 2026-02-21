'use strict';

// ─────────────────────────────────────────────────────────
//  Intent Router — detects user intent and dispatches
//  the right skill, then generates Pablo's response
// ─────────────────────────────────────────────────────────
const logger  = require('../utils/logger');
const ai      = require('./ai');
const { PROMPTS } = require('../config/personality');

const { detectIntent, extractParam } = require('../skills/registry');
const search    = require('../skills/search');
const news      = require('../skills/news');
const weather   = require('../skills/weather');
const github    = require('../skills/github');
const code      = require('../skills/code');
const summarize = require('../skills/summarize');
const translate = require('../skills/translate');
const facts     = require('../skills/facts');
const { calculate, formatCalcResult } = require('../skills/calculator');
const crypto    = require('../skills/crypto');
const aimodels  = require('../skills/aimodels');

// ── Skill executor ────────────────────────────────────────

/**
 * Execute the appropriate skill and return context string.
 * @param {string} intent
 * @param {string} text   - original user message
 * @returns {{ context: string, systemOverride: string|null }}
 */
async function executeSkill(intent, text) {
  switch (intent) {

    case 'search': {
      const query   = extractParam(text, 'search');
      const results = await search.search(query);
      return {
        context:        search.formatResults(results, query),
        systemOverride: PROMPTS.skillResponse,
      };
    }

    case 'news': {
      const topic    = extractParam(text, 'news');
      const articles = await news.getNews(topic);
      return {
        context:        news.formatNews(articles),
        systemOverride: PROMPTS.skillResponse,
      };
    }

    case 'weather': {
      const city = extractParam(text, 'weather');
      const data  = await weather.getWeather(city);
      return {
        context:        weather.formatWeather(data),
        systemOverride: PROMPTS.skillResponse,
      };
    }

    case 'github': {
      const topic = extractParam(text, 'github');
      const repos  = topic
        ? await github.searchRepos(topic)
        : await github.getTrending();
      return {
        context:        github.formatRepos(repos, topic ? `GitHub: ${topic}` : 'Trending Repos'),
        systemOverride: PROMPTS.skillResponse,
      };
    }

    case 'code': {
      const task = code.prepareCodeTask(text);
      return {
        context:        null,           // No external data needed
        systemOverride: task.systemOverride,
        promptOverride: task.prompt,
      };
    }

    case 'summarize': {
      const task = await summarize.prepareSummarizeTask(text);
      return {
        context:        null,
        systemOverride: task.systemOverride,
        promptOverride: task.prompt,
      };
    }

    case 'translate': {
      const task = translate.prepareTranslateTask(text);
      return {
        context:        null,
        systemOverride: task.systemOverride,
        promptOverride: task.prompt,
      };
    }

    case 'facts': {
      const task = facts.prepareFactsTask();
      return {
        context:        null,
        systemOverride: task.systemOverride,
        promptOverride: task.prompt,
      };
    }

    case 'calculate': {
      const result = calculate(text);
      if (result) {
        // Direct answer — no AI needed
        return {
          context:        null,
          directResponse: formatCalcResult(result),
        };
      }
      // Fall through to chat if we couldn't parse the expression
      return { context: null, systemOverride: null };
    }

    case 'crypto': {
      const coinParam = extractParam(text, 'crypto');
      if (coinParam === 'top') {
        const coins = await crypto.getTopCoins(10);
        return {
          context:        crypto.formatTopCoins(coins),
          systemOverride: PROMPTS.skillResponse,
        };
      }
      const coin = await crypto.getCryptoPrice(coinParam);
      return {
        context:        crypto.formatForAI(coin),
        systemOverride: PROMPTS.skillResponse,
      };
    }

    case 'aimodels': {
      const task = aimodels.prepareAIModelsTask(text);
      return {
        context:        null,
        systemOverride: task.systemOverride,
        promptOverride: task.prompt,
      };
    }

    default:
      return { context: null, systemOverride: null };
  }
}

// ── Main: process message ─────────────────────────────────

/**
 * Process a user message:
 * 1. Detect intent
 * 2. Execute skill (if any)
 * 3. Generate Pablo's response via AI
 *
 * @param {string} text         - user message
 * @param {Array}  history      - conversation history [{ role, content }]
 * @param {string} userContext  - extra user info for AI
 * @returns {Promise<string>}   - Pablo's reply
 */
async function processMessage(text, history = [], userContext = '') {
  const intent = detectIntent(text);
  logger.debug('intent', `Message: "${text.substring(0, 60)}" → ${intent}`);

  const skill = await executeSkill(intent, text);

  // Direct response (e.g. calculator) — no AI call
  if (skill.directResponse) {
    return skill.directResponse;
  }

  // Build messages array for AI
  const systemContent = [
    skill.systemOverride || PROMPTS.telegramChat,
    userContext,
  ].filter(Boolean).join('\n\n');

  const messages = [
    { role: 'system', content: systemContent },
    ...history,
  ];

  // If skill returned external data, inject it before the user message
  const userMessage = skill.promptOverride || (
    skill.context
      ? `${skill.context}\n\nالمستخدم سأل: ${text}`
      : text
  );

  messages.push({ role: 'user', content: userMessage });

  const response = await ai.chat(messages, {
    maxTokens:   intent === 'code' ? 800 : 500,
    temperature: intent === 'chat' ? 0.85 : 0.75,
  });

  return response;
}

module.exports = { processMessage, detectIntent, executeSkill };
