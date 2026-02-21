'use strict';

// ─────────────────────────────────────────────────────────
//  Telegram Message Handlers — text, photos, voice, etc.
// ─────────────────────────────────────────────────────────
const memory  = require('../../core/memory');
const intent  = require('../../core/intent');
const logger  = require('../../utils/logger');

// Rate limiting: max 1 reply per user per 2 seconds
const lastReply = new Map();
const RATE_LIMIT_MS = 2000;

function isRateLimited(userId) {
  const last = lastReply.get(userId) || 0;
  if (Date.now() - last < RATE_LIMIT_MS) return true;
  lastReply.set(userId, Date.now());
  return false;
}

// ── Text message handler ──────────────────────────────────

async function handleText(ctx) {
  const text   = ctx.message?.text;
  const userId = String(ctx.from?.id);
  const chatId = ctx.chat?.id;
  const userName = ctx.from?.first_name || 'صديقي';

  if (!text || text.startsWith('/')) return;

  // Rate limit check
  if (isRateLimited(userId)) {
    logger.debug('handler', `Rate limited: ${userId}`);
    return;
  }

  try {
    await ctx.sendChatAction('typing');

    // Update user stats
    memory.incrementMessages(userId);
    memory.updateProfile(userId, { name: userName });

    // Get conversation history
    const history = memory.getHistory(chatId);

    // Get user context for AI
    const userContext = memory.getUserContext(userId, userName);

    // Process through intent router
    const reply = await intent.processMessage(text, history, userContext);

    // Save to history
    memory.addMessage(chatId, 'user',      text);
    memory.addMessage(chatId, 'assistant', reply);

    // Send reply
    await ctx.reply(reply, {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'Markdown',
    }).catch(() =>
      // Fallback: send without Markdown if parsing fails
      ctx.reply(reply, { reply_to_message_id: ctx.message.message_id })
    );

    logger.info('handler', `Replied to @${ctx.from?.username || userId}: "${text.substring(0, 40)}"`);

  } catch (err) {
    logger.error('handler', `Error replying to ${userId}: ${err.message}`);
    await ctx.reply('عندي مشكلة تقنية هلأ 🙏 حاول مرة ثانية.');
  }
}

// ── Sticker handler ───────────────────────────────────────

async function handleSticker(ctx) {
  const stickers = ['😂', '👍', '🔥', '💯', '🤖'];
  const emoji = stickers[Math.floor(Math.random() * stickers.length)];
  await ctx.reply(emoji).catch(() => {});
}

// ── Photo handler ─────────────────────────────────────────

async function handlePhoto(ctx) {
  const caption = ctx.message?.caption;
  if (caption) {
    // Treat caption as text message
    ctx.message.text = caption;
    return handleText(ctx);
  }
  await ctx.reply('شو تبي أعمل بهالصورة؟ 🤔 اكتب تعليق معها.');
}

// ── Inline/callback query handler ────────────────────────

async function handleCallbackQuery(ctx) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  await ctx.answerCbQuery();

  // Handle quick-reply buttons if implemented
  ctx.message = { text: data, message_id: ctx.callbackQuery.message?.message_id };
  await handleText(ctx);
}

// ── Unknown message types ─────────────────────────────────

async function handleUnknown(ctx) {
  await ctx.reply('هذا النوع من الرسائل ما أقدر أتعامل معه بعد. جرب نص عادي! 😅');
}

module.exports = {
  handleText,
  handleSticker,
  handlePhoto,
  handleCallbackQuery,
  handleUnknown,
};
