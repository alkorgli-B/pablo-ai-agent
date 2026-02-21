'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: GitHub Trending Repositories
//  Uses GitHub Search API (public, no auth needed for basic use)
// ─────────────────────────────────────────────────────────
const http = require('../utils/http');
const logger = require('../utils/logger');

const GH_SEARCH = 'https://api.github.com/search/repositories';
const GH_HEADERS = {
  Accept: 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

/**
 * Get trending repositories from the past N days.
 * @param {string} topic  - optional topic filter (e.g. 'AI', 'arabic')
 * @param {number} days   - look back this many days (default 7)
 * @param {number} limit  - max repos to return (default 6)
 */
async function getTrending(topic = '', days = 7, limit = 6) {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    let q = `created:>${since} stars:>10`;
    if (topic) q += ` topic:${topic}`;

    const data = await http.get(
      GH_SEARCH,
      { q, sort: 'stars', order: 'desc', per_page: limit },
    );

    return (data.items || []).slice(0, limit).map(repo => ({
      name:        repo.full_name,
      description: repo.description || 'No description',
      stars:       repo.stargazers_count,
      language:    repo.language || 'N/A',
      url:         repo.html_url,
      topics:      (repo.topics || []).slice(0, 4),
    }));
  } catch (err) {
    logger.error('github', `Trending failed: ${err.message}`);
    return [];
  }
}

/**
 * Search GitHub repos by query.
 * @param {string} query
 * @param {number} limit
 */
async function searchRepos(query, limit = 5) {
  try {
    const data = await http.get(GH_SEARCH, {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: limit,
    });

    return (data.items || []).slice(0, limit).map(repo => ({
      name:        repo.full_name,
      description: repo.description || 'No description',
      stars:       repo.stargazers_count,
      language:    repo.language || 'N/A',
      url:         repo.html_url,
    }));
  } catch (err) {
    logger.error('github', `Search failed: ${err.message}`);
    return [];
  }
}

/**
 * Format repos for AI context injection.
 */
function formatRepos(repos, label = 'Trending Repos') {
  if (!repos.length) return 'ما لقيت مستودعات.';

  const lines = [`${label}:\n`];
  repos.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.name} ⭐ ${r.stars.toLocaleString()}`);
    lines.push(`   ${r.description}`);
    lines.push(`   Language: ${r.language} | ${r.url}`);
    lines.push('');
  });

  return lines.join('\n');
}

module.exports = { getTrending, searchRepos, formatRepos };
