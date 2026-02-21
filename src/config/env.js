'use strict';

// ─────────────────────────────────────────────────────────
//  Environment variable loader & validator
// ─────────────────────────────────────────────────────────
require('dotenv').config();

function sanitize(val) {
  if (!val) return val;
  return val.replace(/^[\s=]+/, '').replace(/[\s]+$/, '');
}

const env = {
  // ── AI Providers ──────────────────────────────────────
  GROQ_API_KEY:        sanitize(process.env.GROQ_API_KEY),
  ANTHROPIC_API_KEY:   sanitize(process.env.ANTHROPIC_API_KEY),
  GEMINI_API_KEY:      sanitize(process.env.GEMINI_API_KEY),

  // ── Twitter / X ───────────────────────────────────────
  TWITTER_API_KEY:     sanitize(process.env.TWITTER_API_KEY),
  TWITTER_API_SECRET:  sanitize(process.env.TWITTER_API_SECRET),
  TWITTER_ACCESS_TOKEN:  sanitize(process.env.TWITTER_ACCESS_TOKEN),
  TWITTER_ACCESS_SECRET: sanitize(process.env.TWITTER_ACCESS_SECRET),

  // ── Telegram ──────────────────────────────────────────
  TELEGRAM_BOT_TOKEN:  sanitize(process.env.TELEGRAM_BOT_TOKEN),
  TELEGRAM_CHANNEL_ID: sanitize(process.env.TELEGRAM_CHANNEL_ID),

  // ── Optional integrations ─────────────────────────────
  SERPER_API_KEY:      sanitize(process.env.SERPER_API_KEY),   // Google Search
  NEWSAPI_KEY:         sanitize(process.env.NEWSAPI_KEY),      // NewsAPI.org
  OPENWEATHER_KEY:     sanitize(process.env.OPENWEATHER_KEY),  // OpenWeatherMap
  STABILITY_API_KEY:   sanitize(process.env.STABILITY_API_KEY),// Stability AI

  // ── Runtime config ────────────────────────────────────
  TWEET_INTERVAL_HOURS: parseInt(process.env.TWEET_INTERVAL_HOURS || '2', 10),
  CHANNEL_INTERVAL_HOURS: parseInt(process.env.CHANNEL_INTERVAL_HOURS || '2', 10),
  LOG_LEVEL:           process.env.LOG_LEVEL || 'INFO',
  NODE_ENV:            process.env.NODE_ENV || 'production',
};

/**
 * Validate that required keys are present. Exits process if any missing.
 */
function requireVars(...keys) {
  const missing = keys.filter(k => !env[k]);
  if (missing.length) {
    console.error(`[ENV] Missing required variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

/**
 * Returns true if Twitter credentials are fully configured.
 */
function hasTwitter() {
  return !!(env.TWITTER_API_KEY && env.TWITTER_API_SECRET &&
            env.TWITTER_ACCESS_TOKEN && env.TWITTER_ACCESS_SECRET);
}

/**
 * Returns true if Telegram bot token is configured.
 */
function hasTelegram() {
  return !!env.TELEGRAM_BOT_TOKEN;
}

/**
 * Returns the primary AI provider key available.
 */
function aiProvider() {
  if (env.GROQ_API_KEY)      return 'groq';
  if (env.GEMINI_API_KEY)    return 'gemini';
  if (env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

module.exports = { env, requireVars, hasTwitter, hasTelegram, aiProvider };
