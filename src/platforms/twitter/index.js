'use strict';

// ─────────────────────────────────────────────────────────
//  Twitter Platform Entry Point
//  Manages tweet loop + mention monitoring
// ─────────────────────────────────────────────────────────
const { TwitterApi } = require('twitter-api-v2');
const { env, requireVars } = require('../../config/env');
const logger   = require('../../utils/logger');
const poster   = require('./poster');
const mentions = require('./mentions');

// ── Validate ──────────────────────────────────────────────

requireVars(
  'TWITTER_API_KEY',
  'TWITTER_API_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET'
);

// ── Build Twitter client ──────────────────────────────────

const twitterClient = new TwitterApi({
  appKey:       env.TWITTER_API_KEY,
  appSecret:    env.TWITTER_API_SECRET,
  accessToken:  env.TWITTER_ACCESS_TOKEN,
  accessSecret: env.TWITTER_ACCESS_SECRET,
});

const twitter = twitterClient.readWrite;

// ── State ─────────────────────────────────────────────────

let botUserId      = null;
let _tweetTimer    = null;
let _mentionTimer  = null;

// ── Initialize ────────────────────────────────────────────

async function init() {
  try {
    const me = await twitter.v2.me();
    botUserId = me.data.id;
    logger.info('twitter', `✓ Authenticated as @${me.data.username} (ID: ${botUserId})`);
    return me.data;
  } catch (err) {
    if (err?.code === 401) {
      logger.error('twitter', 'Authentication failed — check your API credentials');
    } else if (err?.code === 403) {
      logger.error('twitter', 'Permission denied — enable Read+Write on your Twitter App');
    }
    throw err;
  }
}

// ── Tweet loop ────────────────────────────────────────────

async function runTweetLoop() {
  logger.info('twitter', 'Tweet loop started');

  // Post immediately on startup
  try {
    await poster.postTweet(twitter);
  } catch (err) {
    logger.error('twitter', `Startup tweet failed: ${err.message}`);
  }

  // Post every N hours
  const intervalMs = env.TWEET_INTERVAL_HOURS * 60 * 60 * 1000;
  _tweetTimer = setInterval(async () => {
    try {
      await poster.postTweet(twitter);
    } catch (err) {
      if (err?.code === 429) {
        logger.warn('twitter', 'Tweet rate limited — skipping this cycle');
      } else {
        logger.error('twitter', `Scheduled tweet failed: ${err.message}`);
      }
    }
  }, intervalMs);

  logger.info('twitter', `Tweeting every ${env.TWEET_INTERVAL_HOURS}h`);
}

// ── Mention loop ──────────────────────────────────────────

async function runMentionLoop() {
  // Check mentions every 15 minutes
  const CHECK_INTERVAL = 15 * 60 * 1000;

  _mentionTimer = setInterval(async () => {
    await mentions.checkAndReply(twitter, botUserId);
  }, CHECK_INTERVAL);

  logger.info('twitter', 'Mention monitor started (checking every 15min)');
}

// ── Main start ────────────────────────────────────────────

async function start() {
  logger.info('twitter', 'Starting Pablo on Twitter/X...');

  await init();
  await runTweetLoop();

  // Mention reading requires Basic or higher Twitter API tier
  // Only start if explicitly enabled or if not on Free tier
  if (process.env.TWITTER_ENABLE_MENTIONS === 'true') {
    await runMentionLoop();
  } else {
    logger.info('twitter', 'Mention monitor: disabled (set TWITTER_ENABLE_MENTIONS=true to enable)');
  }

  logger.info('twitter', '✓ Pablo is live on Twitter/X!');

  // Graceful shutdown
  process.once('SIGINT',  stop);
  process.once('SIGTERM', stop);
}

function stop() {
  if (_tweetTimer)   clearInterval(_tweetTimer);
  if (_mentionTimer) clearInterval(_mentionTimer);
  logger.info('twitter', 'Twitter bot stopped.');
}

module.exports = { start, stop, twitter, poster };
