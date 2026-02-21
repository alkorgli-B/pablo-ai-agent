'use strict';

// ─────────────────────────────────────────────────────────
//  Telegram Channel Auto-Poster
//  Posts to channel on a scheduled interval
// ─────────────────────────────────────────────────────────
const ai     = require('../../core/ai');
const { PROMPTS } = require('../../config/personality');
const { randomTopic } = require('../../config/topics');
const { cleanPost }   = require('../../utils/formatter');
const logger = require('../../utils/logger');
const { env } = require('../../config/env');

let _bot = null;

function setBot(bot) {
  _bot = bot;
}

// ── Generate post ─────────────────────────────────────────

async function generateChannelPost() {
  const topic = randomTopic('ar');

  const content = await ai.ask(
    PROMPTS.telegramChannel,
    `الموضوع: ${topic}\n\nاكتب المنشور الآن:`,
    { maxTokens: 350, temperature: 0.92 }
  );

  const post = cleanPost(content, 600);
  return { post, topic };
}

// ── Post to channel ───────────────────────────────────────

async function postToChannel() {
  const channelId = env.TELEGRAM_CHANNEL_ID;
  if (!channelId) {
    logger.warn('channel', 'No TELEGRAM_CHANNEL_ID set — skipping channel post');
    return null;
  }
  if (!_bot) throw new Error('Bot not initialized');

  const { post, topic } = await generateChannelPost();

  logger.info('channel', `Posting to ${channelId}...`);
  logger.info('channel', `Topic: ${topic}`);
  logger.debug('channel', `Content (${post.length} chars): ${post}`);

  const msg = await _bot.telegram.sendMessage(channelId, post);

  logger.info('channel', `✓ Posted — Message ID: ${msg.message_id}`);
  return msg;
}

// ── Scheduler ─────────────────────────────────────────────

let _timer = null;

/**
 * Start the channel posting scheduler.
 * @param {number} intervalHours
 */
function startScheduler(intervalHours = 2) {
  if (!env.TELEGRAM_CHANNEL_ID) {
    logger.info('channel', 'Channel scheduler disabled (no TELEGRAM_CHANNEL_ID)');
    return;
  }

  const intervalMs = intervalHours * 60 * 60 * 1000;

  // Post immediately on startup
  postToChannel().catch(err =>
    logger.error('channel', `First post failed: ${err.message}`)
  );

  // Then post on interval
  _timer = setInterval(() => {
    postToChannel().catch(err =>
      logger.error('channel', `Scheduled post failed: ${err.message}`)
    );
  }, intervalMs);

  logger.info('channel', `Scheduler started — posting every ${intervalHours}h`);
}

function stopScheduler() {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
}

module.exports = { setBot, postToChannel, generateChannelPost, startScheduler, stopScheduler };
