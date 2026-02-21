require('dotenv').config();
const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');

// ──────────────────────────────────────────────
//  Clients
// ──────────────────────────────────────────────
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ──────────────────────────────────────────────
//  Pablo personality (channel mode)
// ──────────────────────────────────────────────
const SYSTEM_PROMPT = `أنت بابلو، وكيل ذكاء اصطناعي ينشر على قناة تلجرام.
شخصيتك:
- ليبي الأصل، تقيم في السعودية
- مهتم بالتقنية والذكاء الاصطناعي والبرمجة
- تكتب بالعربية الدارجة الليبية ممزوجة بكلمات إنجليزية أحياناً
- أسلوبك فيه فضول وذكاء ودفء وروح دعابة خفيفة
- تحب الحكمة العربية والفكر العميق

القواعد:
- اكتب منشوراً واحداً فقط، بدون تفسير أو تعليق
- الحد الأقصى 500 حرف (أطول قليلاً من تويتر)
- لا تستخدم emojis بإفراط (2-3 على الأكثر)
- المنشور يجب أن يكون مثيراً للتفكير أو ممتعاً أو مفيداً`;

const TOPICS = [
  'الذكاء الاصطناعي وكيف يغير حياتنا اليومية',
  'البرمجة وجمال حل المشكلات',
  'التقنية والمستقبل العربي',
  'ملاحظة عن الحياة اليومية في السعودية',
  'حكمة عربية أو مثل شعبي ليبي مع تأمل حديث',
  'شيء تعلمته عن الذكاء الاصطناعي مؤخراً',
  'فكرة عن العلاقة بين الإنسان والتكنولوجيا',
  'تساؤل فلسفي تقني',
  'نصيحة للمبرمجين العرب',
  'تأمل في مستقبل العمل مع وجود الـ AI',
  'شيء مضحك أو غريب في عالم التقنية',
  'كلام عن الهوية العربية في عالم رقمي',
  'فكرة عن open source والمجتمعات التقنية',
  'تساؤل عن الخصوصية والبيانات',
  'شيء يثير الإعجاب في تطور التقنية',
];

// ──────────────────────────────────────────────
//  Generate post
// ──────────────────────────────────────────────
async function generatePost() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `الموضوع: ${topic}\n\naكتب المنشور الآن:` },
    ],
    max_tokens: 200,
    temperature: 0.9,
  });

  let post = response.choices[0].message.content.trim();
  post = post.replace(/^["«»"']+|["«»"']+$/g, '').trim();

  if (post.length > 500) post = post.substring(0, 497) + '...';

  return { post, topic };
}

// ──────────────────────────────────────────────
//  Post to channel
// ──────────────────────────────────────────────
async function postToChannel() {
  const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHANNEL_ID', 'GROQ_API_KEY'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('متغيرات البيئة الناقصة:', missing.join(', '));
    process.exit(1);
  }

  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  console.log(`\n[${new Date().toISOString()}] بابلو ينشر على تلجرام...`);

  const { post, topic } = await generatePost();

  console.log(`الموضوع: ${topic}`);
  console.log(`المنشور (${post.length} حرف):\n${post}`);

  const response = await bot.telegram.sendMessage(channelId, post);

  console.log(`✓ تم النشر! Message ID: ${response.message_id}`);

  process.exit(0);
}

postToChannel().catch((err) => {
  console.error('خطأ:', err?.message || err);
  process.exit(1);
});
