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
  crypto: [
    // Arabic coin names (no \b — Arabic chars are non-word chars in JS regex)
    /بيتكوين|بتكوين|بيت\s*كوين/i,
    /إيثيريوم|اثيريوم|ايثيريوم|إيثر/i,
    /سولانا|دوجكوين|دوج\s*كوين|ريبل|كارداني|بينانس/i,
    /شيبا\s*اينو|شيبا/i,
    // Arabic trigger words + coin context
    /(?:سعر|شارت|chart|قيمة|كم\s+يساوي|كم\s+سعر|كم\s+ثمن)\s+(?:ال)?(?:بيتكوين|بتكوين|إيثيريوم|اثيريوم|سولانا|دوج|ريبل|عملة)/i,
    /(?:سعر|شارت|قيمة|كم)\s+(?:btc|eth|bnb|sol|xrp|ada|doge|shib|pepe|ton|trx)/i,
    // Generic Arabic crypto keywords
    /عملة\s+رقمية|عملات\s+رقمية|كريبتو|بلوكتشين|تشفير|العملات\s+المشفرة/i,
    /السوق\s+الرقمي|السوق\s+المشفر|أسعار\s+العملات/i,
    // English coin symbols/names (with proper \b since they're ASCII)
    /\bbtc\b|\beth\b|\bbnb\b|\bsol\b|\bxrp\b|\bada\b|\bdoge\b|\bmatic\b|\bavax\b|\bltc\b|\blink\b|\bdot\b|\bshib\b|\bpepe\b|\bton\b|\btrx\b|\busdt\b/i,
    /\bcrypto\b|\bcryptocurrenc\b|\bbitcoin\b|\bethereum\b|\bsolana\b|\bripple\b|\bdogecoin\b/i,
    // Price queries in English
    /\bprice\s+of\b|\bbtc\s*\/\s*usd|\beth\s*\/\s*usd|\bcoin\s+price\b/i,
  ],
  aimodels: [
    // Arabic (no \b for Arabic words)
    /نماذج\s*(?:ذكاء|ai)|نموذج\s*(?:ذكاء|ai)/i,
    /كلود|جيميناي|جيمناي/i,
    /أفضل\s*(?:نموذج|نماذج)|(?:نموذج|نماذج)\s*أفضل/i,
    /فرق\s*بين\s*(?:claude|gpt|gemini|llama|grok|mistral|deepseek)/i,
    /مقارنة.*نماذج|نماذج.*مقارنة|أحدث.*نماذج|نماذج.*أحدث/i,
    /أحدث.*(?:ai|ذكاء)|(?:ai|ذكاء).*أحدث/i,
    // English model names (ASCII — \b works fine)
    /\bgpt\b|\bgemini\b|\bclaude\b|\bllama\b|\bgrok\b|\bmistral\b|\bdeepseek\b/i,
    /\banthropicb|\bopenai\b|\bxai\b|\bmeta\s*ai\b/i,
    /\bai\s*models?\b|\bbest\s*ai\b|\blatest\s*ai\b|\bllm\b/i,
    /\bgpt-4\b|\bgpt-?4o\b|\bgpt-?o[13]\b|\bclaude-?3\b|\bgemini-?2\b/i,
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

    case 'crypto': {
      // Check for "top list" request first
      if (/أكبر|أهم|قائمة|أفضل\s+عملات|top\s+coins?|top\s+crypto|all\s+coins?/i.test(t)) return 'top';

      // Arabic coin names (with or without ال article)
      if (/(?:ال)?بيتكوين|(?:ال)?بتكوين/.test(t))              return 'bitcoin';
      if (/(?:ال)?إيثيريوم|(?:ال)?اثيريوم|(?:ال)?ايثيريوم/.test(t)) return 'ethereum';
      if (/(?:ال)?سولانا/.test(t))                              return 'solana';
      if (/(?:ال)?دوجكوين|(?:ال)?دوج\s*كوين/.test(t))          return 'dogecoin';
      if (/دوج(?!كوين)/.test(t))                               return 'dogecoin';
      if (/(?:ال)?شيبا/.test(t))                               return 'shiba-inu';
      if (/(?:ال)?ريبل/.test(t))                               return 'ripple';
      if (/(?:ال)?بينانس/.test(t))                             return 'binancecoin';
      if (/(?:ال)?كارداني|(?:ال)?كاردانو/.test(t))             return 'cardano';

      // English coin symbols (ASCII — \b works fine here)
      const coinMatch = t.match(
        /\b(btc|eth|bnb|sol|xrp|ada|doge|matic|avax|ltc|link|dot|shib|pepe|ton|trx|usdt|usdc|arb|op|near|apt|sui|inj|sei|floki|bitcoin|ethereum|solana|ripple|dogecoin|cardano|binance|polkadot|chainlink|avalanche|litecoin|uniswap|cosmos|tron|tether|polygon)\b/i
      );
      if (coinMatch) return coinMatch[1].toLowerCase();

      return 'bitcoin'; // default
    }

    default:
      return t;
  }
}

/**
 * Get skill metadata for the /help command.
 */
const SKILL_LIST = [
  { emoji: '🔍', name: 'بحث',         trigger: 'ابحث عن [موضوع]',              desc: 'بحث في الإنترنت' },
  { emoji: '📰', name: 'أخبار',       trigger: 'أخبار [موضوع]',               desc: 'آخر أخبار التقنية والذكاء الاصطناعي' },
  { emoji: '🌤️', name: 'طقس',        trigger: 'طقس [مدينة]',                 desc: 'الطقس الحالي لأي مدينة' },
  { emoji: '💰', name: 'كريبتو',      trigger: 'BTC سعر / سعر بيتكوين / top crypto', desc: 'أسعار حقيقية من CoinGecko' },
  { emoji: '🤖', name: 'نماذج AI',    trigger: 'claude vs gpt / أفضل نموذج AI', desc: 'مقارنة نماذج الذكاء الاصطناعي' },
  { emoji: '💻', name: 'كود',         trigger: 'اكتب كود [وصف]',              desc: 'كتابة وشرح وإصلاح الكود' },
  { emoji: '🐙', name: 'GitHub',      trigger: 'github trending',              desc: 'أبرز المستودعات على GitHub' },
  { emoji: '📝', name: 'تلخيص',      trigger: 'لخص [نص أو رابط]',            desc: 'تلخيص أي نص أو مقال' },
  { emoji: '🌍', name: 'ترجمة',      trigger: 'ترجم [نص] إلى [لغة]',          desc: 'ترجمة بين اللغات' },
  { emoji: '🧮', name: 'حساب',       trigger: 'احسب [عملية]',                desc: 'عمليات حسابية' },
  { emoji: '💡', name: 'حقائق',      trigger: 'هل تعلم / أخبرني حقيقة',      desc: 'حقائق مثيرة عن التقنية' },
  { emoji: '💬', name: 'محادثة',     trigger: 'أي رسالة عادية',              desc: 'دردشة وأسئلة ونقاشات' },
];

module.exports = { detectIntent, extractParam, SKILL_LIST, INTENT_PATTERNS };
