'use strict';

// ─────────────────────────────────────────────────────────
//  Twitter Poster — generates and posts tweets
// ─────────────────────────────────────────────────────────
const ai     = require('../../core/ai');
const { PROMPTS } = require('../../config/personality');
const { randomTopic } = require('../../config/topics');
const { cleanPost }   = require('../../utils/formatter');
const logger = require('../../utils/logger');

// ── Generate tweet ────────────────────────────────────────

async function generateTweet() {
  const topic = randomTopic('en');

  const content = await ai.ask(
    PROMPTS.tweet,
    `Topic: ${topic}\n\nWrite the tweet now:`,
    { maxTokens: 120, temperature: 0.92 }
  );

  const tweet = cleanPost(content, 280);
  return { tweet, topic };
}

// ── Post tweet ────────────────────────────────────────────

/**
 * Generate and post a tweet.
 * @param {Object} twitter - twitter-api-v2 readWrite client
 * @returns {{ id, tweet }}
 */
async function postTweet(twitter) {
  const { tweet, topic } = await generateTweet();

  logger.info('poster', `Topic: ${topic}`);
  logger.info('poster', `Tweet (${tweet.length} chars): ${tweet}`);

  const res = await twitter.v2.tweet(tweet);
  const id  = res.data.id;

  logger.info('poster', `✓ Posted — https://x.com/pablo26agent/status/${id}`);
  return { id, tweet };
}

// ── Post thread ───────────────────────────────────────────

/**
 * Post a multi-tweet thread on a topic.
 * @param {Object} twitter
 * @param {string} topic
 */
async function postThread(twitter, topic) {
  const threadPrompt = PROMPTS.tweet + `

Additional rules for THREAD:
- Write exactly 3 tweets that flow together
- Separate each tweet with [TWEET]
- First tweet should hook attention
- Second tweet develops the idea
- Third tweet lands with insight or question
- Each tweet under 270 chars`;

  const content = await ai.ask(
    threadPrompt,
    `Topic for thread: ${topic}\n\nWrite the 3 tweets now:`,
    { maxTokens: 400, temperature: 0.88 }
  );

  const tweets = content
    .split('[TWEET]')
    .map(t => cleanPost(t, 275))
    .filter(t => t.length > 10);

  if (!tweets.length) throw new Error('Thread generation failed');

  let replyTo = null;
  const posted = [];

  for (const tweet of tweets.slice(0, 3)) {
    const params = { text: tweet };
    if (replyTo) params.reply = { in_reply_to_tweet_id: replyTo };

    const res = await twitter.v2.tweet(params);
    replyTo = res.data.id;
    posted.push(res.data.id);
    logger.info('poster', `Thread tweet posted: ${replyTo}`);

    // Small delay between thread tweets
    await new Promise(r => setTimeout(r, 2000));
  }

  return posted;
}

module.exports = { generateTweet, postTweet, postThread };
