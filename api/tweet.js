var { TwitterApi } = require('twitter-api-v2');
var AnthropicModule = require('@anthropic-ai/sdk');

// Handle both default and named exports
var Anthropic = AnthropicModule.default || AnthropicModule;

// Required environment variables for tweeting
var TWITTER_ENV = [
  'TWITTER_API_KEY',
  'TWITTER_API_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET',
];

var REQUIRED_ENV = TWITTER_ENV.concat(['ANTHROPIC_API_KEY']);

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
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  // Manual access uses ?key=<BOT_SECRET_KEY>
  // If neither secret is configured, all requests are allowed
  var isAuthorized = false;
  var authHeader = req.headers['authorization'] || '';
  var cronSecret = (process.env.CRON_SECRET || '').trim();
  var botSecret = (process.env.BOT_SECRET_KEY || '').trim();
  var authKey = (req.query.key || req.headers['x-api-key'] || (req.body && req.body.key) || '').trim();

  // Check CRON_SECRET (for Vercel Cron)
  if (cronSecret && authHeader === 'Bearer ' + cronSecret) {
    isAuthorized = true;
  }

  // Check BOT_SECRET_KEY (for manual access) - trim both to avoid whitespace issues
  if (!isAuthorized && botSecret && authKey && authKey === botSecret) {
    isAuthorized = true;
  }

  // If no secrets configured at all, allow everything (initial setup)
  if (!isAuthorized && !cronSecret && !botSecret) {
    isAuthorized = true;
  }

  // If CRON_SECRET is not set, allow requests without a key param (for Vercel Cron)
  if (!isAuthorized && !cronSecret && !authKey) {
    isAuthorized = true;
  }

  // If BOT_SECRET_KEY is not set, allow any request with a key param (for testing)
  if (!isAuthorized && !botSecret && authKey) {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized',
      hint: 'The key you provided does not match BOT_SECRET_KEY in Vercel env vars. Check spelling and whitespace.',
      debug: {
        has_cron_secret_env: Boolean(cronSecret),
        has_bot_secret_env: Boolean(botSecret),
        key_provided: Boolean(authKey),
        bot_secret_length: botSecret.length,
        key_length: authKey.length,
        bot_secret_preview: botSecret ? botSecret.slice(0, 4) + '***' : '(empty)',
        key_preview: authKey ? authKey.slice(0, 4) + '***' : '(empty)',
        match: authKey === botSecret,
      },
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

  // --- Test mode: post a hardcoded tweet without Claude API ---
  if (req.query.test === '1') {
    var twitterMissing = [];
    for (var i = 0; i < TWITTER_ENV.length; i++) {
      if (!process.env[TWITTER_ENV[i]]) twitterMissing.push(TWITTER_ENV[i]);
    }
    if (twitterMissing.length > 0) {
      return res.status(500).json({
        error: 'Missing Twitter env vars',
        missing: twitterMissing,
      });
    }
    try {
      var testClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });
      var testText = 'مرحبا، انا بابلو 🤖 بديت اليوم! صانعي @alkorgli فهّمني كل شي. Hello world, I am Pablo AI - I just started today!';
      var testTweet = await testClient.v2.tweet(testText);
      return res.status(200).json({
        message: 'Pablo first tweet posted!',
        mode: 'test',
        tweet: testText,
        tweet_id: testTweet.data.id,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to post test tweet',
        error: error.message,
      });
    }
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
