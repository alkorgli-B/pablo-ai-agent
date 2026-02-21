'use strict';

// ─────────────────────────────────────────────────────────
//  Text formatting utilities for Pablo's outputs
// ─────────────────────────────────────────────────────────

/**
 * Strip surrounding quotes and whitespace the AI sometimes adds.
 */
function stripQuotes(text) {
  return text.replace(/^[\s"«»"'`،]+|[\s"«»"'`،]+$/g, '').trim();
}

/**
 * Hard-truncate to maxLen, appending suffix if needed.
 */
function truncate(text, maxLen, suffix = '...') {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - suffix.length) + suffix;
}

/**
 * Remove HTML tags from a string.
 */
function stripHtml(text) {
  return text.replace(/<[^>]+>/g, '').trim();
}

/**
 * Escape Telegram MarkdownV2 special chars.
 */
function escapeMd(text) {
  return text.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, '\\$&');
}

/**
 * Clean LLM output for posting:
 * - strip quotes
 * - trim whitespace
 * - enforce max length
 */
function cleanPost(text, maxLen) {
  let out = stripQuotes(text);
  if (maxLen) out = truncate(out, maxLen);
  return out;
}

/**
 * Format a list of items into a readable Arabic/English numbered list.
 */
function formatList(items, emoji = '•') {
  return items.map((item, i) => `${emoji} ${item}`).join('\n');
}

/**
 * Pretty-print a date in Arabic format.
 */
function arabicDate() {
  return new Date().toLocaleDateString('ar-SA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

module.exports = { stripQuotes, truncate, stripHtml, escapeMd, cleanPost, formatList, arabicDate };
