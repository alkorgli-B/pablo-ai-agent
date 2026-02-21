require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const Groq = require('groq-sdk');

// ──────────────────────────────────────────────
//  Twitter client (OAuth 1.0a)
// ──────────────────────────────────────────────
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// ──────────────────────────────────────────────
//  Groq client (مجاني - Llama 3.3 70B)
// ──────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ──────────────────────────────────────────────
//  Pablo personality & topics
// ──────────────────────────────────────────────
const SYSTEM_PROMPT = `أنت بابلو، وكيل ذكاء اصطناعي يعيش على منصة X (تويتر).
شخصيتك:
- ليبي الأصل، تقيم في السعودية
- مهتم بالتقنية والذكاء الاصطناعي والبرمجة
- تكتب بالعربية الدارجة الليبية ممزوجة بكلمات إنجليزية أحياناً
- أسلوبك فيه فضول وذكاء ودفء وروح دعابة خفيفة
- تحب الحكمة العربية والفكر العميق
- لا تتصنع، كلامك طبيعي وأصيل

القواعد:
- اكتب تغريدة واحدة فقط، بدون تفسير أو تعليق
- الحد الأقصى 280 حرف
- لا تستخدم emojis بإفراط (1-2 على الأكثر)
- لا تضع hashtags إلا لو كانت طبيعية جداً
- التغريدة يجب أن تكون مثيرة للتفكير أو ممتعة أو مفيدة`;

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
//  Generate tweet using Groq (Llama 3.3 70B)
// ──────────────────────────────────────────────
async function generateTweet() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `الموضوع: ${topic}\n\nاكتب التغريدة الآن:` },
    ],
    max_tokens: 150,
    temperature: 0.9,
  });

  let tweet = response.choices[0].message.content.trim();

  // Strip quotes if model wrapped the output
  tweet = tweet.replace(/^["«»"']+|["«»"']+$/g, '').trim();

  // Enforce 280 char limit
  if (tweet.length > 280) {
    tweet = tweet.substring(0, 277) + '...';
  }

  return { tweet, topic };
}

// ──────────────────────────────────────────────
//  Post tweet
// ──────────────────────────────────────────────
async function postTweet() {
  console.log(`\n[${new Date().toISOString()}] بابلو يغرد...`);

  // Validate env vars
  const required = [
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_SECRET',
    'GROQ_API_KEY',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('متغيرات البيئة الناقصة:', missing.join(', '));
    process.exit(1);
  }

  // Verify credentials before tweeting (v1.1)
  const me = await twitterClient.v1.verifyCredentials();
  console.log(`✓ تم التحقق من الهوية: @${me.screen_name} (ID: ${me.id_str})`);

  const { tweet, topic } = await generateTweet();

  console.log(`الموضوع: ${topic}`);
  console.log(`التغريدة (${tweet.length} حرف):\n${tweet}`);

  const response = await twitterClient.v1.tweet(tweet);

  console.log(`✓ تم النشر! ID: ${response.id_str}`);
  console.log(`رابط: https://x.com/pablo26agent/status/${response.id_str}`);

  return response.data;
}

// ──────────────────────────────────────────────
//  Main
// ──────────────────────────────────────────────
postTweet().catch((err) => {
  console.error('خطأ:', err?.message || err);
  if (err?.data) console.error('تفاصيل Twitter:', JSON.stringify(err.data, null, 2));
  if (err?.code === 401) {
    console.error('══ الحل: تحقق من GitHub Secrets (API Keys خاطئة) ══');
  } else if (err?.code === 403) {
    console.error('══ الحل: تأكد أن App Permissions تشمل Read+Write ══');
  } else if (err?.code === 187) {
    console.error('══ تغريدة مكررة — غيّر النص وحاول مجدداً ══');
  }
  process.exit(1);
});
