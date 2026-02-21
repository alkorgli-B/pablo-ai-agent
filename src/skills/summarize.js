'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Summarize text or URLs
// ─────────────────────────────────────────────────────────
const http = require('../utils/http');
const { stripHtml, truncate } = require('../utils/formatter');
const logger = require('../utils/logger');

const SUMMARIZE_SYSTEM = `أنت بابلو، تلخّص المحتوى بشكل ذكي.
قواعد التلخيص:
- ملخص واضح في 3-5 نقاط رئيسية
- استخدم bullet points (•)
- ابدأ بأهم نقطة
- الأسلوب: عربي دارج واضح
- في النهاية: جملة رأي/تحليل شخصي من بابلو`;

/**
 * Fetch and extract readable text from a URL.
 */
async function fetchPageText(url) {
  try {
    const html = await http.getRaw(url);

    // Remove scripts, styles, nav, footer
    let clean = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '');

    // Extract paragraphs
    const paragraphs = [];
    const pRx = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = pRx.exec(clean)) !== null) {
      const text = stripHtml(m[1]).trim();
      if (text.length > 50) paragraphs.push(text);
    }

    // Fallback: strip all tags
    if (!paragraphs.length) {
      return truncate(stripHtml(clean).replace(/\s+/g, ' '), 2000);
    }

    return truncate(paragraphs.join('\n\n'), 3000);
  } catch (err) {
    logger.error('summarize', `Fetch failed for ${url}: ${err.message}`);
    return null;
  }
}

/**
 * Prepare summarize task for AI.
 * @param {string} text - raw text or URL
 * @returns {{ systemOverride, prompt, isUrl }}
 */
async function prepareSummarizeTask(text) {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  let content = text;
  let isUrl = false;
  let sourceUrl = null;

  if (urlMatch) {
    isUrl = true;
    sourceUrl = urlMatch[0];
    logger.debug('summarize', `Fetching URL: ${sourceUrl}`);
    const pageText = await fetchPageText(sourceUrl);
    if (pageText) {
      content = `المقال من: ${sourceUrl}\n\nالمحتوى:\n${pageText}`;
    } else {
      content = `لخّص الرابط التالي (ما قدرت أجيب المحتوى): ${sourceUrl}`;
    }
  }

  return {
    systemOverride: SUMMARIZE_SYSTEM,
    prompt: `لخّص هذا المحتوى:\n\n${content}`,
    isUrl,
    sourceUrl,
  };
}

module.exports = { prepareSummarizeTask, fetchPageText };
