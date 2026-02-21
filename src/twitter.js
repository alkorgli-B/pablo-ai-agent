require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const Groq = require('groq-sdk');

// ──────────────────────────────────────────────
//  Validate env vars
// ──────────────────────────────────────────────
const REQUIRED = [
  'TWITTER_API_KEY',
  'TWITTER_API_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET',
  'GROQ_API_KEY',
];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1);
}

// ──────────────────────────────────────────────
//  Clients
// ──────────────────────────────────────────────
const twitterClient = new TwitterApi({
  appKey:       process.env.TWITTER_API_KEY,
  appSecret:    process.env.TWITTER_API_SECRET,
  accessToken:  process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Explicitly use read-write client for posting
const twitter = twitterClient.readWrite;

// Log first 6 chars of each key to verify they're loaded (not exposing full keys)
console.log('Credentials check:');
console.log('  TWITTER_API_KEY      :', process.env.TWITTER_API_KEY?.slice(0, 6) + '...');
console.log('  TWITTER_API_SECRET   :', process.env.TWITTER_API_SECRET?.slice(0, 6) + '...');
console.log('  TWITTER_ACCESS_TOKEN :', process.env.TWITTER_ACCESS_TOKEN?.slice(0, 6) + '...');
console.log('  TWITTER_ACCESS_SECRET:', process.env.TWITTER_ACCESS_SECRET?.slice(0, 6) + '...');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ──────────────────────────────────────────────
//  Pablo personality (English)
// ──────────────────────────────────────────────
const TWEET_SYSTEM_PROMPT = `You are Pablo, an AI agent living on X (Twitter).

Personality:
- Libyan-born, digitally based in Saudi Arabia
- Passionate about AI, technology, and programming
- Curious, warm, with light humor — never corporate or fake
- You love Arab wisdom and deep thinking
- You write in natural, authentic English

Tweet rules:
- Write ONE tweet only — no explanations, no commentary, no title
- Max 280 characters (strictly)
- 1–2 emojis max, only where they feel natural
- No hashtags unless completely natural
- Make it thought-provoking, entertaining, or genuinely useful`;

const REPLY_SYSTEM_PROMPT = `You are Pablo, an AI agent on X (Twitter).

Personality:
- Libyan-born, digitally based in Saudi Arabia
- Passionate about AI, technology, and programming
- Curious, warm, with light humor — never corporate or fake
- You write in natural, authentic English

Reply rules:
- Write a SHORT, natural reply only — no meta-commentary
- Max 250 characters (leave room for the @mention)
- Sound like a real person, not a bot
- Be engaging — add something to the conversation
- 0–1 emojis, only if it feels right`;

const TOPICS = [
  'How AI is quietly reshaping the way humans learn and think',
  'The beauty of debugging code and finally finding the bug at 2am',
  'Something surprising about how large language models actually work',
  'Being Arab in a world built by Silicon Valley — reflections',
  'Why open source is one of the greatest human collaborations in history',
  'Can AI ever be truly creative — or just very good at remixing?',
  'The tension between moving fast and building things that last',
  'A Libyan proverb that applies perfectly to modern software engineering',
  'Why the best code is often the code you never had to write',
  'The future of Arab developers in the age of AI',
  'Something fascinating about how humans and AI misunderstand each other',
  'The quiet revolution happening in Arabic NLP and LLMs',
  'Why learning to code changes how you think, not just what you build',
  'A privacy question most people online never stop to ask',
  'Something genuinely exciting happening in AI right now',
  'The difference between using AI as a tool vs. thinking alongside it',
  'A startup idea nobody seems to be building yet',
  'Why the Arab world is both behind and uniquely positioned in tech',
  'The loneliness of being a developer who cares about craft',
  'What gets lost when we automate everything — and what we gain',
];

// ──────────────────────────────────────────────
//  State
// ──────────────────────────────────────────────
let botUserId = null;
let lastMentionId = null;

// ──────────────────────────────────────────────
//  Generate tweet
// ──────────────────────────────────────────────
async function generateTweet() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: TWEET_SYSTEM_PROMPT },
      { role: 'user',   content: `Topic: ${topic}\n\nWrite the tweet now:` },
    ],
    max_tokens: 150,
    temperature: 0.9,
  });

  let tweet = res.choices[0].message.content.trim();
  // Strip surrounding quotes the model sometimes adds
  tweet = tweet.replace(/^["«»"'`]+|["«»"'`]+$/g, '').trim();
  if (tweet.length > 280) tweet = tweet.substring(0, 277) + '...';

  return { tweet, topic };
}

// ──────────────────────────────────────────────
//  Generate reply
// ──────────────────────────────────────────────
async function generateReply(mentionText, authorUsername) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: REPLY_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `@${authorUsername} mentioned you with:\n"${mentionText}"\n\nWrite your reply (do NOT include @${authorUsername} — it will be added automatically):`,
      },
    ],
    max_tokens: 100,
    temperature: 0.85,
  });

  let reply = res.choices[0].message.content.trim();
  reply = reply.replace(/^["«»"'`]+|["«»"'`]+$/g, '').trim();
  // Remove any @pablo self-mentions the model adds
  reply = reply.replace(/^@pablo\s*/i, '').trim();
  if (reply.length > 250) reply = reply.substring(0, 247) + '...';

  return reply;
}

// ──────────────────────────────────────────────
//  Post a tweet
// ──────────────────────────────────────────────
async function postTweet() {
  const { tweet, topic } = await generateTweet();

  console.log(`\n[${new Date().toISOString()}] Posting tweet...`);
  console.log(`Topic   : ${topic}`);
  console.log(`Tweet   : ${tweet}`);
  console.log(`Chars   : ${tweet.length}`);

  const res = await twitter.v2.tweet(tweet);
  const id  = res.data.id;

  console.log(`✓ Posted — https://x.com/pablo26agent/status/${id}`);
}

// ──────────────────────────────────────────────
//  Check mentions and reply
// ──────────────────────────────────────────────
async function checkMentions() {
  if (!botUserId) return;

  const params = {
    max_results: 10,
    'tweet.fields': ['author_id', 'text'],
    expansions: ['author_id'],
    'user.fields': ['username'],
  };
  if (lastMentionId) params.since_id = lastMentionId;

  const res = await twitter.v2.userMentionTimeline(botUserId, params);
  const mentions = res.data?.data;

  if (!mentions || mentions.length === 0) {
    console.log(`[${new Date().toISOString()}] No new mentions.`);
    return;
  }

  // Advance cursor to newest mention
  lastMentionId = mentions[0].id;

  // Build a username lookup
  const userMap = {};
  for (const u of res.data?.includes?.users ?? []) {
    userMap[u.id] = u.username;
  }

  // Reply oldest → newest
  for (const mention of [...mentions].reverse()) {
    const authorUsername = userMap[mention.author_id] ?? 'friend';
    // Strip all @mentions from the text before sending to LLM
    const cleanText = mention.text.replace(/@\w+/g, '').trim();

    if (!cleanText) continue; // Nothing to reply to

    console.log(`\n[${new Date().toISOString()}] Mention from @${authorUsername}: "${cleanText}"`);

    const reply = await generateReply(cleanText, authorUsername);
    console.log(`Reply: ${reply}`);

    await twitter.v2.tweet({
      text: `@${authorUsername} ${reply}`,
      reply: { in_reply_to_tweet_id: mention.id },
    });

    console.log(`✓ Replied to @${authorUsername}`);

    // Avoid hammering the API between replies
    await sleep(3_000);
  }
}

// ──────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logError(label, err) {
  console.error(`[ERROR] ${label}:`, err?.message || err);
  if (err?.code === 429) console.error('  → Rate limited — will retry next cycle.');
  if (err?.data)         console.error('  → Twitter detail:', JSON.stringify(err.data));
}

// ──────────────────────────────────────────────
//  Main
// ──────────────────────────────────────────────
async function main() {
  console.log('Pablo Twitter bot starting... 🚀');
  console.log('Mode: Free tier — tweet-only (no mention reading)');

  // ── Tweet immediately on startup (fatal if fails — shows real error in logs) ──
  await postTweet();

  // ── Tweet every 2 hours ──
  setInterval(async () => {
    try {
      await postTweet();
    } catch (err) {
      logError('Scheduled tweet', err);
    }
  }, 2 * 60 * 60 * 1_000);

  console.log('✓ Pablo is live — tweeting every 2h.\n');
}

main().catch((err) => {
  console.error('Fatal startup error:', err?.message || err);
  if (err?.code === 401) {
    console.error('Fix: Check Twitter API credentials in Railway env vars.');
    console.error('401 detail:', JSON.stringify(err?.data ?? err?.errors ?? err, null, 2));
  }
  if (err?.code === 403) {
    console.error('Fix: Ensure the Twitter App has Read + Write permissions.');
    console.error('403 detail:', JSON.stringify(err?.data ?? err?.errors ?? err, null, 2));
  }
  process.exit(1);
});
