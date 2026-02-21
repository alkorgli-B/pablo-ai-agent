'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Code Generation, Explanation & Debugging
//  Fully AI-powered via the core/ai module
// ─────────────────────────────────────────────────────────
const logger = require('../utils/logger');

const CODE_SYSTEM_PROMPT = `أنت بابلو، مطور خبير بكل لغات البرمجة.
مهمتك: مساعدة المطورين بكتابة كود صحيح، تفسير الكود، وإيجاد الـ bugs.

قواعد:
- اكتب كوداً نظيفاً وقابلاً للقراءة
- استخدم markdown code blocks دائماً (\`\`\`language ... \`\`\`)
- اشرح الكود بإيجاز بعده (2-3 أسطر)
- لو في bug، وضّح المشكلة والحل
- لو ما ذُكرت اللغة، استنتجها من السياق أو استخدم Python كـ default
- اكتب بالعربية الدارجة مع المصطلحات التقنية بالإنجليزي`;

const CODE_INTENTS = {
  write:   /اكتب|كتب|ابني|أنشئ|write|create|generate|build|make a/i,
  explain: /اشرح|فسّر|وضّح|explain|what does|ماذا يفعل|كيف يعمل|how does/i,
  debug:   /بق|خطأ|error|bug|debug|fix|لماذا لا يعمل|مشكلة في|issue|broken/i,
  review:  /راجع|review|improve|حسّن|optimize|refactor/i,
  convert: /حوّل|convert|translate.*code|من.*إلى|from.*to/i,
};

/**
 * Detect code task intent from user message.
 */
function detectCodeIntent(text) {
  for (const [intent, rx] of Object.entries(CODE_INTENTS)) {
    if (rx.test(text)) return intent;
  }
  return 'write'; // Default: assume they want code written
}

/**
 * Build a targeted prompt based on detected intent.
 */
function buildCodePrompt(userMessage, intent) {
  const prefixes = {
    write:   'اكتب الكود التالي:',
    explain: 'اشرح هذا الكود:',
    debug:   'أصلح هذا الكود أو وضّح الخطأ:',
    review:  'راجع وحسّن هذا الكود:',
    convert: 'حوّل هذا الكود:',
  };

  return `${prefixes[intent] || ''}\n\n${userMessage}`;
}

/**
 * Prepare code skill context for AI.
 * Returns system prompt override and formatted user message.
 */
function prepareCodeTask(userMessage) {
  const intent = detectCodeIntent(userMessage);
  logger.debug('code', `Detected intent: ${intent}`);

  return {
    systemOverride: CODE_SYSTEM_PROMPT,
    prompt: buildCodePrompt(userMessage, intent),
    intent,
  };
}

/**
 * Supported languages for syntax highlighting (used in formatting hints).
 */
const SUPPORTED_LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go',
  'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'bash', 'html',
  'css', 'react', 'vue', 'nodejs', 'express', 'fastapi', 'django',
];

/**
 * Detect programming language from text.
 */
function detectLanguage(text) {
  const lower = text.toLowerCase();
  return SUPPORTED_LANGUAGES.find(lang => lower.includes(lang)) || null;
}

module.exports = { prepareCodeTask, detectCodeIntent, detectLanguage, CODE_SYSTEM_PROMPT };
