'use strict';

// ─────────────────────────────────────────────────────────
//  Topics pool for autonomous posting (Telegram + Twitter)
// ─────────────────────────────────────────────────────────

const TOPICS_AR = [
  // AI & Technology
  'كيف يغير الذكاء الاصطناعي طريقة تفكير البشر وتعلمهم',
  'شيء مفاجئ عن طريقة عمل نماذج اللغة الكبيرة (LLMs)',
  'الفرق الحقيقي بين استخدام الذكاء الاصطناعي كأداة والتفكير معه',
  'هل يمكن للذكاء الاصطناعي أن يكون مبدعاً حقاً؟',
  'الذاكرة في نماذج الذكاء الاصطناعي — ما يعرفونه وما ينسونه',
  'ما الذي نخسره حين نؤتمت كل شيء؟',
  'الثورة الهادئة في معالجة اللغة العربية بالذكاء الاصطناعي',
  'تساؤل عن الخصوصية والبيانات لا يطرحه أحد',

  // Programming & Craft
  'جمال الـ debugging وإيجاد البق في الساعة 2 الفجر',
  'أفضل كود هو الكود الذي لم تضطر لكتابته — لماذا؟',
  'تعلم البرمجة يغير طريقة تفكيرك، ليس فقط ما تبنيه',
  'وحدة المطور الذي يهتم بجودة الكود في عصر الشيبينغ السريع',
  'لماذا الـ open source من أعظم التعاونات البشرية في التاريخ',
  'التوتر بين السرعة وبناء أشياء تدوم',
  'نصيحة للمطورين العرب الجدد لا تُقال في الكورسات',

  // Arab World & Tech
  'كوننا عرباً في عالم بناه Silicon Valley',
  'العالم العربي: متأخر ومتقدم في نفس الوقت في التقنية',
  'مستقبل المطورين العرب في عصر الذكاء الاصطناعي',
  'لماذا نحتاج ذكاء اصطناعي يفهم ثقافتنا ولغتنا',
  'مثل ليبي أو حكمة عربية تنطبق على البرمجة الحديثة',

  // Deep thinking
  'فكرة ستارتأب لا أحد يبنيها بعد في المنطقة العربية',
  'الفرق بين الذكاء الاصطناعي الضيق (ANI) والعام (AGI) وأين نحن الآن',
  'كيف يسيء البشر والذكاء الاصطناعي فهم بعضهم',
  'تأمل في مستقبل العمل مع وجود الـ AI',
  'ما معنى الإبداع في عصر يمكن فيه للـ AI رسم ولحن وكتابة كل شيء؟',
];

const TOPICS_EN = [
  // AI & Technology
  'How AI is quietly reshaping the way humans learn and think',
  'Something surprising about how large language models actually work',
  'The difference between using AI as a tool vs. thinking alongside it',
  'Can AI ever be truly creative — or just very good at remixing?',
  'Memory in AI models — what they know and what they forget',
  'What we lose when we automate everything — and what we gain',
  'The quiet revolution happening in Arabic NLP and LLMs',
  'A privacy question most people online never stop to ask',

  // Programming & Craft
  'The beauty of debugging code and finally finding the bug at 2am',
  'Why the best code is often the code you never had to write',
  'Why learning to code changes how you think, not just what you build',
  'The loneliness of being a developer who cares about craft',
  'Why open source is one of the greatest human collaborations in history',
  'The tension between moving fast and building things that last',
  'What senior devs know that junior devs are still learning',

  // Arab World & Tech
  'Being Arab in a world built by Silicon Valley',
  'The Arab world: behind and uniquely positioned in tech at the same time',
  'The future of Arab developers in the age of AI',
  'Why we need AI that truly understands Arabic culture and language',
  'A Libyan proverb that applies perfectly to modern software engineering',

  // Deep thinking
  'A startup idea nobody seems to be building in the Arab world yet',
  'The difference between ANI and AGI — and where we actually are',
  'Something fascinating about how humans and AI misunderstand each other',
  'The future of work in a world where AI can do most tasks',
  'What does creativity mean when AI can paint, compose, and write?',
];

/**
 * Returns a random topic (Arabic or English based on lang param)
 */
function randomTopic(lang = 'ar') {
  const pool = lang === 'en' ? TOPICS_EN : TOPICS_AR;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns a random topic from the combined pool.
 */
function randomTopicAny() {
  const all = [...TOPICS_AR, ...TOPICS_EN];
  return all[Math.floor(Math.random() * all.length)];
}

module.exports = { TOPICS_AR, TOPICS_EN, randomTopic, randomTopicAny };
