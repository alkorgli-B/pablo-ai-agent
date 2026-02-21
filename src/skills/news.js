'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: News — Tech & AI headlines
//  Primary: NewsAPI.org (if NEWSAPI_KEY set)
//  Fallback: RSS feeds (no key needed)
// ─────────────────────────────────────────────────────────
const http = require('../utils/http');
const { stripHtml } = require('../utils/formatter');
const logger = require('../utils/logger');
const { env } = require('../config/env');

const NEWSAPI_URL = 'https://newsapi.org/v2/top-headlines';

// Free RSS feeds — no auth needed
const RSS_FEEDS = [
  { name: 'TechCrunch',   url: 'https://techcrunch.com/feed/' },
  { name: 'The Verge',    url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
  { name: 'AI News',      url: 'https://www.artificialintelligence-news.com/feed/' },
];

// ── RSS parser (no external lib) ────────────────────────

function parseRSS(xml) {
  const items = [];
  const itemRx = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let m;

  while ((m = itemRx.exec(xml)) !== null) {
    const block = m[1];

    const title = extractTag(block, 'title');
    const link  = extractLink(block);
    const desc  = extractTag(block, 'description');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || '';

    if (title && link) {
      items.push({
        title: cleanCDATA(title).trim(),
        url:   link.trim(),
        description: stripHtml(cleanCDATA(desc)).substring(0, 200),
        source: '',
        publishedAt: pubDate,
      });
    }
  }

  return items;
}

function extractTag(xml, tag) {
  const rx = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  return rx.exec(xml)?.[1] || '';
}

function extractLink(xml) {
  // <link>...</link> or <link href="..."/>
  const simple = /<link[^>]*>([^<]+)<\/link>/i.exec(xml);
  if (simple) return simple[1];
  const attr = /<link[^>]+href="([^"]+)"/i.exec(xml);
  if (attr) return attr[1];
  return '';
}

function cleanCDATA(str) {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

// ── Providers ────────────────────────────────────────────

async function fetchNewsAPI(topic = 'artificial intelligence') {
  const data = await http.get(NEWSAPI_URL, {
    q: topic,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: 6,
    apiKey: env.NEWSAPI_KEY,
  });

  return (data.articles || []).map(a => ({
    title: a.title || '',
    url:   a.url || '',
    description: (a.description || '').substring(0, 200),
    source: a.source?.name || '',
    publishedAt: a.publishedAt || '',
  }));
}

async function fetchRSS() {
  const all = [];

  for (const feed of RSS_FEEDS) {
    try {
      const xml = await http.getRaw(feed.url);
      const items = parseRSS(xml).slice(0, 3);
      items.forEach(i => (i.source = feed.name));
      all.push(...items);
    } catch (err) {
      logger.debug('news', `RSS ${feed.name} failed: ${err.message}`);
    }
    if (all.length >= 8) break;
  }

  return all.slice(0, 8);
}

// ── Main ─────────────────────────────────────────────────

/**
 * Fetch latest tech/AI news.
 * @param {string} topic - optional search topic
 * @returns {Array<{title, url, description, source, publishedAt}>}
 */
async function getNews(topic = 'artificial intelligence') {
  try {
    if (env.NEWSAPI_KEY) {
      logger.debug('news', `Using NewsAPI for: "${topic}"`);
      return await fetchNewsAPI(topic);
    }
    logger.debug('news', 'Using RSS feeds');
    return await fetchRSS();
  } catch (err) {
    logger.error('news', `Failed: ${err.message}`);
    return [];
  }
}

/**
 * Format news for AI context injection.
 */
function formatNews(articles) {
  if (!articles.length) return 'لم أتمكن من جلب الأخبار الآن.';

  const lines = ['أحدث الأخبار التقنية:\n'];
  articles.slice(0, 5).forEach((a, i) => {
    lines.push(`${i + 1}. ${a.title}`);
    if (a.source) lines.push(`   المصدر: ${a.source}`);
    if (a.description) lines.push(`   ${a.description}`);
    if (a.url) lines.push(`   ${a.url}`);
    lines.push('');
  });

  return lines.join('\n');
}

module.exports = { getNews, formatNews };
