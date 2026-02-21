'use strict';

// ─────────────────────────────────────────────────────────
//  AI Engine — multi-provider with auto-fallback
//  Priority: Groq (fast+free) → Gemini → Anthropic
// ─────────────────────────────────────────────────────────
const logger = require('../utils/logger');
const { env } = require('../config/env');

// Lazy-loaded clients
let _groq = null;
let _gemini = null;
let _anthropic = null;

function groqClient() {
  if (!_groq) {
    const Groq = require('groq-sdk');
    _groq = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return _groq;
}

function geminiClient() {
  if (!_gemini) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    _gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return _gemini;
}

// ── Provider implementations ──────────────────────────────

async function callGroq(messages, opts = {}) {
  const client = groqClient();
  const res = await client.chat.completions.create({
    model:       opts.model      || 'llama-3.3-70b-versatile',
    messages,
    max_tokens:  opts.maxTokens  || 500,
    temperature: opts.temperature || 0.85,
  });
  return res.choices[0].message.content.trim();
}

async function callGemini(messages, opts = {}) {
  const client = geminiClient();
  const model  = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Convert OpenAI-style messages to Gemini format
  const systemMsg = messages.find(m => m.role === 'system');
  const history   = messages.filter(m => m.role !== 'system');

  const parts = [];
  if (systemMsg) parts.push({ text: systemMsg.content });
  history.forEach(m => parts.push({ text: `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}` }));

  const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
  return result.response.text().trim();
}

// ── Main chat function ────────────────────────────────────

/**
 * Generate a response from the AI.
 *
 * @param {Array}  messages   - [{ role, content }, ...]
 * @param {Object} opts
 * @param {string} opts.model        - override model name
 * @param {number} opts.maxTokens    - max output tokens
 * @param {number} opts.temperature  - 0-1
 * @param {string} opts.provider     - force a specific provider
 * @returns {Promise<string>}
 */
async function chat(messages, opts = {}) {
  // Determine provider order
  const providers = [];

  if (opts.provider) {
    providers.push(opts.provider);
  } else {
    if (env.GROQ_API_KEY)      providers.push('groq');
    if (env.GEMINI_API_KEY)    providers.push('gemini');
    if (env.ANTHROPIC_API_KEY) providers.push('anthropic');
  }

  if (!providers.length) {
    throw new Error('No AI provider configured. Set GROQ_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY.');
  }

  for (const provider of providers) {
    try {
      logger.debug('ai', `Calling ${provider}...`);

      if (provider === 'groq')      return await callGroq(messages, opts);
      if (provider === 'gemini')    return await callGemini(messages, opts);

    } catch (err) {
      logger.warn('ai', `${provider} failed: ${err.message}`);
      if (provider === providers[providers.length - 1]) throw err;
      logger.info('ai', `Falling back to next provider...`);
    }
  }

  throw new Error('All AI providers failed.');
}

/**
 * Convenience: single system + user message.
 */
async function ask(systemPrompt, userMessage, opts = {}) {
  return chat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage },
    ],
    opts
  );
}

/**
 * Fast call using smaller/cheaper model (for simple tasks).
 */
async function quickAsk(systemPrompt, userMessage) {
  return chat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage },
    ],
    { model: 'llama-3.1-8b-instant', maxTokens: 200, temperature: 0.7 }
  );
}

module.exports = { chat, ask, quickAsk };
