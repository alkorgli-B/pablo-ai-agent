'use strict';

// ─────────────────────────────────────────────────────────
//  Twitter Mentions Monitor — reads and replies to mentions
// ─────────────────────────────────────────────────────────
const ai     = require('../../core/ai');
const { PROMPTS } = require('../../config/personality');
const { cleanPost }   = require('../../utils/formatter');
const { sleep }  = require('../../utils/retry');
const logger = require('../../utils/logger');

let lastMentionId = null;

// ── Generate reply ────────────────────────────────────────

async function generateReply(mentionText, authorUsername) {
  const content = await ai.ask(
    PROMPTS.twitterReply,
    `@${authorUsername} mentioned you:\n"${mentionText}"\n\nWrite your reply (do NOT include @${authorUsername}):`,
    { maxTokens: 100, temperature: 0.85 }
  );

  let reply = cleanPost(content, 240);
  // Remove any self-mentions the model accidentally adds
  reply = reply.replace(/^@pablo\w*\s*/i, '').trim();

  return reply;
}

// ── Check and reply to mentions ───────────────────────────

/**
 * Check for new mentions and reply to them.
 * @param {Object} twitter    - readWrite client
 * @param {string} botUserId  - bot's own Twitter user ID
 */
async function checkAndReply(twitter, botUserId) {
  if (!botUserId) return;

  try {
    const params = {
      max_results:    10,
      'tweet.fields': ['author_id', 'text', 'created_at'],
      expansions:     ['author_id'],
      'user.fields':  ['username', 'name'],
    };
    if (lastMentionId) params.since_id = lastMentionId;

    const res      = await twitter.v2.userMentionTimeline(botUserId, params);
    const mentions = res.data?.data;

    if (!mentions?.length) {
      logger.debug('mentions', 'No new mentions');
      return;
    }

    // Advance cursor
    lastMentionId = mentions[0].id;

    // Build username lookup
    const userMap = {};
    for (const u of (res.data?.includes?.users || [])) {
      userMap[u.id] = u.username;
    }

    // Reply oldest → newest to maintain thread order
    for (const mention of [...mentions].reverse()) {
      const authorUsername = userMap[mention.author_id] || 'friend';
      const cleanText = mention.text.replace(/@\w+/g, '').trim();

      if (!cleanText) continue;

      logger.info('mentions', `Mention from @${authorUsername}: "${cleanText}"`);

      try {
        const reply = await generateReply(cleanText, authorUsername);
        logger.info('mentions', `Replying: "${reply}"`);

        await twitter.v2.tweet({
          text:  `@${authorUsername} ${reply}`,
          reply: { in_reply_to_tweet_id: mention.id },
        });

        logger.info('mentions', `✓ Replied to @${authorUsername}`);
        await sleep(3000); // avoid hammering API

      } catch (err) {
        logger.error('mentions', `Reply to @${authorUsername} failed: ${err.message}`);
      }
    }

  } catch (err) {
    if (err?.code === 429) {
      logger.warn('mentions', 'Rate limited — will retry next cycle');
    } else {
      logger.error('mentions', `Check failed: ${err.message}`);
    }
  }
}

module.exports = { checkAndReply, generateReply };
