'use strict';

// ─────────────────────────────────────────────────────────
//  Pablo AI Agent — Main Entry Point
//
//  Auto-detects available credentials and launches:
//    - Telegram bot (if TELEGRAM_BOT_TOKEN set)
//    - Twitter bot  (if TWITTER_API_KEY set)
//    - Both simultaneously if both are set
// ─────────────────────────────────────────────────────────
require('dotenv').config();

const { hasTwitter, hasTelegram, aiProvider } = require('./config/env');
const logger = require('./utils/logger');

async function main() {
  logger.info('pablo', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('pablo', '  Pablo AI Agent v3.0.0');
  logger.info('pablo', '  Libyan-born · Digitally in Saudi Arabia');
  logger.info('pablo', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const provider = aiProvider();
  if (!provider) {
    logger.error('pablo', 'No AI provider configured!');
    logger.error('pablo', '  Set one of: GROQ_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY');
    process.exit(1);
  }

  logger.info('pablo', `AI Provider: ${provider.toUpperCase()} ✓`);

  const tg = hasTelegram();
  const tw = hasTwitter();

  if (!tg && !tw) {
    logger.error('pablo', 'No platform credentials found!');
    logger.error('pablo', '  For Telegram: set TELEGRAM_BOT_TOKEN');
    logger.error('pablo', '  For Twitter:  set TWITTER_API_KEY + TWITTER_API_SECRET + TWITTER_ACCESS_TOKEN + TWITTER_ACCESS_SECRET');
    process.exit(1);
  }

  // Launch platforms
  const launches = [];

  if (tg) {
    logger.info('pablo', 'Launching Telegram platform...');
    const telegram = require('./platforms/telegram/index');
    launches.push(telegram.start());
  }

  if (tw) {
    logger.info('pablo', 'Launching Twitter/X platform...');
    const twitter = require('./platforms/twitter/index');
    launches.push(twitter.start());
  }

  // Wait for all platforms to initialize
  try {
    await Promise.all(launches);
    logger.info('pablo', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('pablo', `  ✓ Pablo is LIVE on ${[tg && 'Telegram', tw && 'Twitter'].filter(Boolean).join(' + ')}`);
    logger.info('pablo', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (err) {
    logger.error('pablo', `Fatal startup error: ${err.message}`);
    process.exit(1);
  }
}

main();
