'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Interesting Tech/AI Facts
//  Generates a fresh, mind-blowing fact using AI
// ─────────────────────────────────────────────────────────

const FACTS_CATEGORIES = [
  'الذكاء الاصطناعي وتاريخه',
  'حقائق مذهلة عن الإنترنت',
  'معلومات غير معروفة عن البرمجة',
  'أرقام مذهلة عن التكنولوجيا',
  'حقائق عن المعالجات والحواسيب',
  'قصص طريفة من تاريخ التقنية',
  'حقائق عن الخصوصية الرقمية',
  'معلومات عن الفضاء ومعالجة البيانات',
  'حقائق مثيرة عن open source',
  'أرقام عن استهلاك الطاقة في مراكز البيانات',
];

const FACTS_SYSTEM = `أنت بابلو، تشارك حقائق تقنية مذهلة.
قواعد:
- حقيقة واحدة فقط، مثيرة ومفاجئة حقاً
- ابدأ بـ "هل تعلم أن..." أو "حقيقة مذهلة:"
- أضف سياقاً مختصراً يوضح لماذا هذا مهم أو مدهش
- الطول: 2-4 جمل فقط
- بالعربية الدارجة`;

/**
 * Get random facts category.
 */
function randomCategory() {
  return FACTS_CATEGORIES[Math.floor(Math.random() * FACTS_CATEGORIES.length)];
}

/**
 * Prepare facts task for AI.
 * @param {string} topic - optional specific topic
 */
function prepareFactsTask(topic = null) {
  const category = topic || randomCategory();

  return {
    systemOverride: FACTS_SYSTEM,
    prompt: `اعطني حقيقة مذهلة ومفاجئة عن: ${category}`,
    category,
  };
}

module.exports = { prepareFactsTask, FACTS_CATEGORIES };
