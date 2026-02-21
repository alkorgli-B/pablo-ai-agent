'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Translation (AI-powered, no external API needed)
// ─────────────────────────────────────────────────────────

const TRANSLATE_SYSTEM = `أنت بابلو، مترجم محترف.
قواعد:
- ترجم بدقة مع الحفاظ على المعنى والأسلوب
- لو النص تقني، حافظ على المصطلحات التقنية
- لا تضيف تفسيراً — فقط الترجمة
- اذكر اللغة المترجَم إليها في أول سطر بشكل طبيعي`;

// Language name normalization (Arabic names → ISO)
const LANG_MAP = {
  // Arabic inputs
  'الإنجليزية': 'English', 'إنجليزي': 'English', 'انجليزي': 'English',
  'العربية': 'Arabic', 'عربي': 'Arabic',
  'الفرنسية': 'French', 'فرنسي': 'French',
  'الألمانية': 'German', 'ألماني': 'German',
  'الإسبانية': 'Spanish', 'إسباني': 'Spanish',
  'الإيطالية': 'Italian', 'إيطالي': 'Italian',
  'الصينية': 'Chinese', 'صيني': 'Chinese',
  'اليابانية': 'Japanese', 'ياباني': 'Japanese',
  'الروسية': 'Russian', 'روسي': 'Russian',
  'التركية': 'Turkish', 'تركي': 'Turkish',
  'الفارسية': 'Persian', 'فارسي': 'Persian',
  'الأردية': 'Urdu', 'أردو': 'Urdu',

  // English inputs (lowercase)
  'english': 'English', 'arabic': 'Arabic',
  'french': 'French', 'german': 'German', 'spanish': 'Spanish',
  'italian': 'Italian', 'chinese': 'Chinese', 'japanese': 'Japanese',
  'russian': 'Russian', 'turkish': 'Turkish', 'persian': 'Persian',
};

/**
 * Detect target language from user message.
 */
function detectTargetLanguage(text) {
  const lower = text.toLowerCase();

  // Check explicit "to X" or "إلى X"
  const toMatch = text.match(/(?:إلى|الى|to|in)\s+([\u0600-\u06FFa-zA-Z]+)/i);
  if (toMatch) {
    const lang = toMatch[1].trim();
    return LANG_MAP[lang] || LANG_MAP[lang.toLowerCase()] || lang;
  }

  // Check for language mentions anywhere
  for (const [key, val] of Object.entries(LANG_MAP)) {
    if (lower.includes(key.toLowerCase())) return val;
  }

  // Default: if text is Arabic, translate to English, else to Arabic
  const isArabic = /[\u0600-\u06FF]/.test(text);
  return isArabic ? 'English' : 'Arabic';
}

/**
 * Extract the text to translate (remove command keywords).
 */
function extractTextToTranslate(message) {
  return message
    .replace(/^(?:ترجم|translate|ترجمة)\s*/i, '')
    .replace(/(?:إلى|الى|to)\s+[\u0600-\u06FFa-zA-Z]+/i, '')
    .trim();
}

/**
 * Prepare translate task for AI.
 */
function prepareTranslateTask(message) {
  const targetLang = detectTargetLanguage(message);
  const textToTranslate = extractTextToTranslate(message) || message;

  return {
    systemOverride: TRANSLATE_SYSTEM,
    prompt: `ترجم هذا النص إلى ${targetLang}:\n\n"${textToTranslate}"`,
    targetLang,
  };
}

module.exports = { prepareTranslateTask, detectTargetLanguage };
