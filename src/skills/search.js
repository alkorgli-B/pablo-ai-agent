'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Web Search
//  Primary: Serper.dev (if SERPER_API_KEY set)
//  Fallback: DuckDuckGo Instant Answer API (always free)
// ─────────────────────────────────────────────────────────
const http = require('../utils/http');
const logger = require('../utils/logger');
const { env } = require('../config/env');

const DDG_API = 'https://api.duckduckgo.com/';
const SERPER_API = 'https://google.serper.dev/search';

/**
 * Search via Serper (Google results, requires API key).
 */
async function searchSerper(query) {
  const data = await http.post(
    SERPER_API,
    { q: query, num: 5, hl: 'ar' },
    {
      'X-API-KEY': env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    }
  );

  const results = [];

  // Answer box
  if (data.answerBox?.answer) {
    results.push({ title: data.answerBox.title || query, snippet: data.answerBox.answer, url: '' });
  }

  // Organic results
  for (const r of (data.organic || []).slice(0, 4)) {
    results.push({ title: r.title, snippet: r.snippet || '', url: r.link });
  }

  return results;
}

/**
 * Search via DuckDuckGo Instant Answer API (free, no key needed).
 */
async function searchDDG(query) {
  const data = await http.get(DDG_API, {
    q: query,
    format: 'json',
    no_html: 1,
    skip_disambig: 1,
  });

  const results = [];

  if (data.Abstract) {
    results.push({
      title: data.Heading || query,
      snippet: data.Abstract,
      url: data.AbstractURL || '',
    });
  }

  for (const topic of (data.RelatedTopics || []).slice(0, 4)) {
    if (topic.Text) {
      results.push({
        title: topic.Name || topic.Text.split(' - ')[0] || '',
        snippet: topic.Text,
        url: topic.FirstURL || '',
      });
    }
  }

  // If DDG returned nothing useful, fallback to a readable message
  if (results.length === 0 && data.Answer) {
    results.push({ title: 'Answer', snippet: data.Answer, url: '' });
  }

  return results;
}

/**
 * Main search function — auto-selects provider.
 * Returns array of { title, snippet, url }
 */
async function search(query) {
  try {
    if (env.SERPER_API_KEY) {
      logger.debug('search', `Using Serper for: "${query}"`);
      return await searchSerper(query);
    }
    logger.debug('search', `Using DDG for: "${query}"`);
    return await searchDDG(query);
  } catch (err) {
    logger.error('search', `Failed: ${err.message}`);
    return [];
  }
}

/**
 * Format results for AI context injection.
 */
function formatResults(results, query) {
  if (!results.length) return `لم أجد نتائج واضحة لـ "${query}".`;

  const lines = [`نتائج البحث عن "${query}":\n`];
  results.slice(0, 4).forEach((r, i) => {
    lines.push(`${i + 1}. ${r.title}`);
    if (r.snippet) lines.push(`   ${r.snippet}`);
    if (r.url) lines.push(`   ${r.url}`);
    lines.push('');
  });

  return lines.join('\n');
}

module.exports = { search, formatResults };
