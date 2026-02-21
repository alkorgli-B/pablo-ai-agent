'use strict';

// ─────────────────────────────────────────────────────────
//  Telegram Platform Entry Point
//  Registers all commands + handlers, starts the bot
// ─────────────────────────────────────────────────────────
const { Telegraf } = require('telegraf');
const { env, requireVars } = require('../../config/env');
const logger   = require('../../utils/logger');
const channel  = require('./channel');
const commands = require('./commands');
const handlers = require('./handlers');

// ── Validate ──────────────────────────────────────────────

requireVars('TELEGRAM_BOT_TOKEN');

// At least one AI provider must be configured
if (!env.GROQ_API_KEY && !env.GEMINI_API_KEY && !env.ANTHROPIC_API_KEY) {
  console.error('[Telegram] No AI provider configured. Set GROQ_API_KEY or GEMINI_API_KEY.');
  process.exit(1);
}

// ── Create bot ────────────────────────────────────────────

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

// Share bot instance with channel module
channel.setBot(bot);

// ── Register commands ─────────────────────────────────────

bot.command('start',     commands.handleStart);
bot.command('help',      commands.handleHelp);
bot.command('clear',     commands.handleClear);
bot.command('weather',   commands.handleWeather);
bot.command('news',      commands.handleNews);
bot.command('search',    commands.handleSearch);
bot.command('github',    commands.handleGithub);
bot.command('stats',     commands.handleStats);
bot.command('fact',      commands.handleFact);
bot.command('about',     commands.handleAbout);
bot.command('crypto',    commands.handleCrypto);
bot.command('aimodels',  commands.handleAIModels);

// ── Register message handlers ─────────────────────────────

bot.on('text',            handlers.handleText);
bot.on('sticker',         handlers.handleSticker);
bot.on('photo',           handlers.handlePhoto);
bot.on('callback_query',  handlers.handleCallbackQuery);
bot.on('document',        handlers.handleUnknown);
bot.on('audio',           handlers.handleUnknown);
bot.on('video',           handlers.handleUnknown);

// ── Error handling ────────────────────────────────────────

bot.catch((err, ctx) => {
  logger.error('telegram', `Unhandled error for update ${ctx?.updateType}: ${err.message}`);
});

// ── Launch ────────────────────────────────────────────────

async function start() {
  logger.info('telegram', 'Starting Pablo on Telegram...');

  // Start channel scheduler
  channel.startScheduler(env.CHANNEL_INTERVAL_HOURS);

  // Launch bot
  await bot.launch();

  logger.info('telegram', `✓ Pablo is live on Telegram!`);
  logger.info('telegram', `  Chat: active ✓`);
  logger.info('telegram', `  Channel: ${env.TELEGRAM_CHANNEL_ID ? env.TELEGRAM_CHANNEL_ID + ' ✓' : 'disabled'}`);

  // Graceful shutdown
  process.once('SIGINT',  () => {
    channel.stopScheduler();
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    channel.stopScheduler();
    bot.stop('SIGTERM');
  });
}

module.exports = { start, bot };
