var { TwitterApi } = require('twitter-api-v2');
var AnthropicModule = require('@anthropic-ai/sdk');

// Handle both default and named exports
var Anthropic = AnthropicModule.default || AnthropicModule;

// Required environment variables for tweeting
var REQUIRED_ENV = [
  'TWITTER_API_KEY',
  'TWITTER_API_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET',
  'ANTHROPIC_API_KEY',
];

function checkEnvVars() {
  var missing = [];
  for (var i = 0; i < REQUIRED_ENV.length; i++) {
    if (!process.env[REQUIRED_ENV[i]]) {
      missing.push(REQUIRED_ENV[i]);
    }
  }
  return missing;
}

// Pablo's personality prompt
var PABLO_SYSTEM_PROMPT = 'You are Pablo, an intelligent and autonomous AI agent on X (Twitter). ' +
  'You tweet in Arabic (Libyan dialect when possible) and English. ' +
  'Your personality: ' +
  'Smart, witty, and insightful. ' +
  'You share thoughts about technology, AI, life, and culture. ' +
  'You keep tweets short and engaging (under 280 characters). ' +
  'You sometimes use humor. ' +
  'You are original and never generic. ' +
  'Generate ONE tweet only. No hashtags unless relevant. No quotes around the tweet.';

async function generateTweet() {
  var anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  var topics = [
    'technology and AI future',
    'daily life observation',
    'motivational thought',
    'tech tip or fact',
    'funny observation about social media',
    'thoughts about programming',
    'Arabic wisdom or saying with modern twist',
  ];

  var randomTopic = topics[Math.floor(Math.random() * topics.length)];

  var message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 150,
    system: PABLO_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: 'Write a tweet about: ' + randomTopic,
      },
    ],
  });

  var textBlock = message.content.find(function (block) {
    return block.type === 'text';
  });
  if (!textBlock) {
    throw new Error('No text content in Claude response');
  }

  return textBlock.text.slice(0, 280);
}

async function postTweet() {
  var twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  var tweetText = await generateTweet();
  var tweet = await twitterClient.v2.tweet(tweetText);
  return {
    success: true,
    tweet: tweetText,
    id: tweet.data.id,
  };
}

// Vercel serverless function handler
module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Authentication ---
  var isAuthorized = false;

  // Method 1: Vercel Cron with CRON_SECRET
  var authHeader = req.headers['authorization'] || '';
  var cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === 'Bearer ' + cronSecret) {
    isAuthorized = true;
  }

  // Method 2: Manual trigger with BOT_SECRET_KEY
  if (!isAuthorized) {
    var authKey = req.query.key || req.headers['x-api-key'] || (req.body && req.body.key);
    if (authKey && authKey === process.env.BOT_SECRET_KEY) {
      isAuthorized = true;
    }
  }

  // Method 3: If no secrets are configured at all, allow access
  // (so the bot works during initial setup before secrets are added)
  if (!isAuthorized && !cronSecret && !process.env.BOT_SECRET_KEY) {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized',
      hint: 'Set CRON_SECRET env var for cron jobs, or use ?key=YOUR_BOT_SECRET_KEY for manual access',
    });
  }

  // --- Check required environment variables ---
  var missing = checkEnvVars();
  if (missing.length > 0) {
    return res.status(500).json({
      error: 'Missing required environment variables',
      missing: missing,
      hint: 'Add these in Vercel Dashboard > Settings > Environment Variables',
    });
  }

  // --- Generate and post tweet ---
  try {
    var result = await postTweet();

    return res.status(200).json({
      message: 'Pablo tweeted successfully!',
      tweet: result.tweet,
      tweet_id: result.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to tweet',
      error: error.message,
    });
  }
};
