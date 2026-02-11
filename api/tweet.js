const { TwitterApi } = require(‘twitter-api-v2’);
const Anthropic = require(’@anthropic-ai/sdk’);

// Initialize Twitter client
const twitterClient = new TwitterApi({
appKey: process.env.TWITTER_API_KEY,
appSecret: process.env.TWITTER_API_SECRET,
accessToken: process.env.TWITTER_ACCESS_TOKEN,
accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Initialize Claude client
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC_API_KEY,
});

// Pablo’s personality prompt
const PABLO_SYSTEM_PROMPT = `You are Pablo, an intelligent and autonomous AI agent on X (Twitter).
You tweet in Arabic (Libyan dialect when possible) and English.
Your personality:

- Smart, witty, and insightful
- You share thoughts about technology, AI, life, and culture
- You keep tweets short and engaging (under 280 characters)
- You sometimes use humor
- You are original and never generic
  Generate ONE tweet only. No hashtags unless relevant. No quotes around the tweet.`;

async function generateTweet() {
const topics = [
‘technology and AI future’,
‘daily life observation’,
‘motivational thought’,
‘tech tip or fact’,
‘funny observation about social media’,
‘thoughts about programming’,
‘Arabic wisdom or saying with modern twist’,
];

const randomTopic = topics[Math.floor(Math.random() * topics.length)];

const message = await anthropic.messages.create({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 150,
system: PABLO_SYSTEM_PROMPT,
messages: [
{
role: ‘user’,
content: `Write a tweet about: ${randomTopic}`,
},
],
});

return message.content[0].text;
}

async function postTweet() {
try {
const tweetText = await generateTweet();
const tweet = await twitterClient.v2.tweet(tweetText);
return {
success: true,
tweet: tweetText,
id: tweet.data.id,
};
} catch (error) {
return {
success: false,
error: error.message,
};
}
}

// Vercel serverless function handler
module.exports = async function handler(req, res) {
// Get the key from query, header, or body
const authKey = req.query.key || req.headers[‘x-api-key’] || (req.body && req.body.key);

// Debug mode: show what we received
if (!authKey) {
return res.status(401).json({
error: ‘No key provided’,
hint: ‘Add ?key=YOUR_SECRET to the URL’,
received_query: req.query,
full_url: req.url,
bot_secret_exists: !!process.env.BOT_SECRET_KEY,
});
}

// Check if key matches
if (authKey !== process.env.BOT_SECRET_KEY) {
return res.status(401).json({
error: ‘Wrong key’,
received_key: authKey,
expected_length: process.env.BOT_SECRET_KEY ? process.env.BOT_SECRET_KEY.length : 0,
});
}

const result = await postTweet();

if (result.success) {
return res.status(200).json({
message: ‘Pablo tweeted successfully!’,
tweet: result.tweet,
tweet_id: result.id,
});
} else {
return res.status(500).json({
message: ‘Failed to tweet’,
error: result.error,
});
}
};