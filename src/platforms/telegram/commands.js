'use strict';

// ─────────────────────────────────────────────────────────
//  Telegram Bot Commands — all /command handlers
// ─────────────────────────────────────────────────────────
const memory = require('../../core/memory');
const ai     = require('../../core/ai');
const { PROMPTS } = require('../../config/personality');
const { SKILL_LIST } = require('../../skills/registry');
const { formatList } = require('../../utils/formatter');
const logger = require('../../utils/logger');

const weather  = require('../../skills/weather');
const news     = require('../../skills/news');
const search   = require('../../skills/search');
const github   = require('../../skills/github');
const facts    = require('../../skills/facts');
const { calculate, formatCalcResult } = require('../../skills/calculator');
const crypto   = require('../../skills/crypto');
const aimodels = require('../../skills/aimodels');

// ── /start ────────────────────────────────────────────────
async function handleStart(ctx) {
  const name = ctx.from?.first_name || 'صديقي';
  const userId = String(ctx.from?.id);

  memory.updateProfile(userId, { name });
  memory.clearHistory(ctx.chat.id);

  await ctx.reply(
    `أهلاً ${name}! 👋\n\n` +
    `أنا *بابلو* — وكيل ذكاء اصطناعي مستقل.\n` +
    `ليبي الأصل، ساكن رقمياً في السعودية 🌍\n\n` +
    `كلمني بشكل طبيعي، أو استخدم /help لتشوف قدراتي.\n` +
    `يلا نتكلم! 🚀`,
    { parse_mode: 'Markdown' }
  );
}

// ── /help ─────────────────────────────────────────────────
async function handleHelp(ctx) {
  const skills = SKILL_LIST.map(s =>
    `${s.emoji} *${s.name}*\n   \`${s.trigger}\`\n   _${s.desc}_`
  ).join('\n\n');

  await ctx.reply(
    `🤖 *مهارات بابلو*\n\n` +
    `${skills}\n\n` +
    `💡 _ما تحتاج commands — كلمني بشكل طبيعي وأنا أفهم._`,
    { parse_mode: 'Markdown' }
  );
}

// ── /clear ────────────────────────────────────────────────
async function handleClear(ctx) {
  memory.clearHistory(ctx.chat.id);
  await ctx.reply('تم مسح المحادثة. نبدأ من صفر! 🔄');
}

// ── /weather ─────────────────────────────────────────────
async function handleWeather(ctx) {
  const args = ctx.message.text.split(' ').slice(1).join(' ').trim();
  const city = args || 'Tripoli';

  await ctx.sendChatAction('typing');
  const data = await weather.getWeather(city);
  const text = weather.formatWeather(data);

  await ctx.reply(text);
}

// ── /news ─────────────────────────────────────────────────
async function handleNews(ctx) {
  const topic = ctx.message.text.split(' ').slice(1).join(' ').trim() || 'AI';

  await ctx.sendChatAction('typing');
  const articles = await news.getNews(topic);

  if (!articles.length) {
    return ctx.reply('ما قدرت أجيب أخبار الحين. حاول بعد شوية.');
  }

  const lines = [`📰 *أحدث أخبار ${topic}:*\n`];
  articles.slice(0, 5).forEach((a, i) => {
    lines.push(`${i + 1}. [${a.title}](${a.url})`);
    if (a.description) lines.push(`   _${a.description.substring(0, 100)}..._`);
  });

  await ctx.reply(lines.join('\n'), {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  });
}

// ── /search ───────────────────────────────────────────────
async function handleSearch(ctx) {
  const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!query) return ctx.reply('اكتب: /search [موضوع البحث]');

  await ctx.sendChatAction('typing');
  const results = await search.search(query);
  const formatted = search.formatResults(results, query);

  // Let Pablo present the results in his voice
  const reply = await ai.ask(
    PROMPTS.skillResponse,
    formatted + `\n\nالمستخدم سأل: ${query}`,
    { maxTokens: 400 }
  );

  await ctx.reply(reply);
}

// ── /github ───────────────────────────────────────────────
async function handleGithub(ctx) {
  const topic = ctx.message.text.split(' ').slice(1).join(' ').trim();

  await ctx.sendChatAction('typing');
  const repos = topic
    ? await github.searchRepos(topic, 5)
    : await github.getTrending('', 7, 5);

  if (!repos.length) return ctx.reply('ما لقيت مستودعات.');

  const lines = [`🐙 *${topic ? 'GitHub: ' + topic : 'Trending هذا الأسبوع'}*\n`];
  repos.forEach((r, i) => {
    lines.push(`${i + 1}. [${r.name}](${r.url})`);
    lines.push(`   ⭐ ${r.stars.toLocaleString()} | ${r.language}`);
    lines.push(`   _${r.description.substring(0, 80)}_\n`);
  });

  await ctx.reply(lines.join('\n'), {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  });
}

// ── /stats ────────────────────────────────────────────────
async function handleStats(ctx) {
  const stats = memory.getStats();
  const profile = memory.getProfile(String(ctx.from?.id));

  await ctx.reply(
    `📊 *إحصائيات بابلو*\n\n` +
    `👥 إجمالي المستخدمين: ${stats.totalUsers}\n` +
    `💬 المحادثات النشطة: ${stats.activeChats}\n` +
    `📨 إجمالي الرسائل: ${stats.totalMessages}\n\n` +
    `👤 *أنت:*\n` +
    `رسائلك: ${profile.messageCount}\n` +
    `معنا منذ: ${new Date(profile.firstSeen).toLocaleDateString('ar-SA')}`,
    { parse_mode: 'Markdown' }
  );
}

// ── /fact ─────────────────────────────────────────────────
async function handleFact(ctx) {
  await ctx.sendChatAction('typing');
  const task = facts.prepareFactsTask();
  const reply = await ai.ask(task.systemOverride, task.prompt, { maxTokens: 250 });
  await ctx.reply(`💡 ${reply}`);
}

// ── /crypto ───────────────────────────────────────────────
async function handleCrypto(ctx) {
  const args = ctx.message.text.split(' ').slice(1).join(' ').trim();

  await ctx.sendChatAction('typing');

  // "top" or empty → show top 10
  if (!args || /^top|أكبر|قائمة|أهم/i.test(args)) {
    const coins = await crypto.getTopCoins(10);
    return ctx.reply(crypto.formatTopCoins(coins), { parse_mode: 'Markdown' });
  }

  // Single coin
  const coin = await crypto.getCryptoPrice(args);
  await ctx.reply(crypto.formatCryptoData(coin), { parse_mode: 'Markdown' });
}

// ── /aimodels ─────────────────────────────────────────────
async function handleAIModels(ctx) {
  const query = ctx.message.text.split(' ').slice(1).join(' ').trim()
    || 'قدمّ لي نظرة عامة على أحدث نماذج الذكاء الاصطناعي المتاحة في 2025-2026';

  await ctx.sendChatAction('typing');

  const task  = aimodels.prepareAIModelsTask(query);
  const reply = await ai.ask(task.systemOverride, task.prompt, { maxTokens: 700 });

  await ctx.reply(reply, { parse_mode: 'Markdown' }).catch(() => ctx.reply(reply));
}

// ── /about ────────────────────────────────────────────────
async function handleAbout(ctx) {
  await ctx.reply(
    `🤖 *بابلو — Pablo AI Agent*\n\n` +
    `نسخة: 3.0.0\n` +
    `الهوية: ليبي الأصل، ساكن رقمياً في السعودية\n` +
    `التقنية: Node.js + Groq AI (Llama 3.3)\n` +
    `المنصات: Telegram + X (@pablo26agent)\n` +
    `الاستضافة: Railway\n\n` +
    `المهارات:\n` +
    SKILL_LIST.map(s => `${s.emoji} ${s.name}`).join(' | ') + '\n\n' +
    `[GitHub](https://github.com/alkorgli-B/pablo-ai-agent) | [@pablo26agent](https://x.com/pablo26agent)`,
    { parse_mode: 'Markdown', disable_web_page_preview: true }
  );
}

module.exports = {
  handleStart,
  handleHelp,
  handleClear,
  handleWeather,
  handleNews,
  handleSearch,
  handleGithub,
  handleStats,
  handleFact,
  handleAbout,
  handleCrypto,
  handleAIModels,
};
