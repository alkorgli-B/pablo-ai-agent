'use strict';

// ─────────────────────────────────────────────────────────
//  Skills Registry — central dispatcher
//  Detects user intent and routes to the right skill
// ─────────────────────────────────────────────────────────
const logger = require('../utils/logger');

// ── Intent patterns ───────────────────────────────────────

const INTENT_PATTERNS = {
  weather: [
    /\bطقس\b|\bجو\b|\bحرارة\b|\bمناخ\b|\bأمطار\b/i,
    /\bweather\b|\btemperature\b|\bforecast\b|\bclimate\b|\brain\b/i,
  ],
  news: [
    /\bأخبار\b|\bاخبار\b|\bالجديد\b|\bآخر\b|\bما حصل\b/i,
    /\bnews\b|\blatest\b|\bheadlines\b|\bwhat happened\b/i,
  ],
  search: [
    /\bابحث\b|\bبحث عن\b|\bعرّفني\b|\bعرفني\b|\bمن هو\b|\bما هو\b|\bما هي\b/i,
    /\bsearch\b|\bfind\b|\blook up\b|\bwho is\b|\bwhat is\b|\btell me about\b/i,
  ],
  github: [
    /\bgithub\b|\bمستودعات\b|\brepos\b|\btrending\b|\bopen source\b/i,
    /\bمشاريع مفتوحة\b|\bgit\b/i,
  ],
  code: [
    /\bكود\b|\bكوود\b|\bبرمجة\b|\bاكتب\b|\bبرنامج\b|\bدالة\b|\bfunction\b/i,
    /\bcode\b|\bscript\b|\bprogram\b|\bclass\b|\bdebugg\b|\bfix.*error\b|\berror.*fix\b/i,
    /```|`[^`]+`/,
  ],
  calculate: [
    /\bاحسب\b|\bكم يساوي\b|\bكم هو\b|\bرياضيات\b/i,
    /\bcalculate\b|\bcompute\b|\bmath\b|\bsolve\b/i,
    /\d+\s*[+\-*/^%]\s*\d+/,
  ],
  summarize: [
    /\bلخص\b|\bملخص\b|\bاختصر\b/i,
    /\bsummariz\b|\bsummar\b|\btldr\b|\btoo long\b/i,
    /https?:\/\//i,
  ],
  translate: [
    /\bترجم\b|\bترجمة\b/i,
    /\btranslat\b/i,
  ],
  facts: [
    /\bحقيقة\b|\bحقائق\b|\bمعلومة\b|\bهل تعلم\b|\bشيء مثير\b|\bأخبرني عن\b/i,
    /\bfact\b|\bdid you know\b|\btell me something\b|\binteresting\b/i,
  ],
};

/**
 * Detect intent from user message.
 * @param {string} text
 * @returns {string} intent name or 'chat'
 */
function detectIntent(text) {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(rx => rx.test(text))) {
      logger.debug('registry', `Intent detected: ${intent}`);
      return intent;
    }
  }
  return 'chat';
}

/**
 * Extract relevant parameter from user message based on intent.
 */
function extractParam(text, intent) {
  const t = text.trim();

  switch (intent) {
    case 'weather': {
      const m = t.match(
        /(?:طقس|جو|حرارة|weather|forecast|temperature)\s+(?:في|in|at|of|by)?\s*([^\?!.،\n]{2,30})/i
      );
      return m?.[1]?.trim() || 'Tripoli';
    }

    case 'news': {
      const m = t.match(
        /(?:أخبار|اخبار|news)\s+(?:عن|about|في|on|of)?\s*([^\?!.،\n]{2,40})/i
      );
      return m?.[1]?.trim() || 'artificial intelligence';
    }

    case 'search': {
      return t
        .replace(/^(?:ابحث عن|ابحث|بحث عن|search for|search|find|look up)/i, '')
        .replace(/^(?:من هو|ما هو|ما هي|who is|what is|tell me about)/i, '')
        .trim() || t;
    }

    case 'github': {
      const m = t.match(/(?:github|مستودعات|repos)\s+(?:عن|about|on|in)?\s*([^\?!.،\n]{2,30})/i);
      return m?.[1]?.trim() || '';
    }

    case 'calculate': {
      // Extract math expression
      const m = t.match(/[\d\s+\-*/^%×÷().٠-٩]+/);
      return m?.[0]?.trim() || t;
    }

    default:
      return t;
  }
}

/**
 * Get skill metadata for the /help command.
 */
const SKILL_LIST = [
  { emoji: '🔍', name: 'بحث',      trigger: 'ابحث عن [موضوع]',           desc: 'بحث في الإنترنت' },
  { emoji: '📰', name: 'أخبار',    trigger: 'أخبار [موضوع]',              desc: 'آخر أخبار التقنية والذكاء الاصطناعي' },
  { emoji: '🌤️', name: 'طقس',     trigger: 'طقس [مدينة]',                desc: 'الطقس الحالي لأي مدينة' },
  { emoji: '💻', name: 'كود',      trigger: 'اكتب كود [وصف]',            desc: 'كتابة وشرح وإصلاح الكود' },
  { emoji: '🐙', name: 'GitHub',   trigger: 'github trending',            desc: 'أبرز المستودعات على GitHub' },
  { emoji: '📝', name: 'تلخيص',   trigger: 'لخص [نص أو رابط]',          desc: 'تلخيص أي نص أو مقال' },
  { emoji: '🌍', name: 'ترجمة',   trigger: 'ترجم [نص] إلى [لغة]',        desc: 'ترجمة بين اللغات' },
  { emoji: '🧮', name: 'حساب',    trigger: 'احسب [عملية]',               desc: 'عمليات حسابية' },
  { emoji: '💡', name: 'حقائق',   trigger: 'هل تعلم / أخبرني حقيقة',    desc: 'حقائق مثيرة عن التقنية' },
  { emoji: '💬', name: 'محادثة',  trigger: 'أي رسالة عادية',             desc: 'دردشة وأسئلة ونقاشات' },
];

module.exports = { detectIntent, extractParam, SKILL_LIST, INTENT_PATTERNS };
