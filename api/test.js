module.exports = async function handler(req, res) {
  return res.status(200).json({
    message: "API is working!",
    query: req.query,
    url: req.url,
    env_check: {
      has_twitter_api_key: !!process.env.TWITTER_API_KEY,
      has_twitter_api_secret: !!process.env.TWITTER_API_SECRET,
      has_twitter_access_token: !!process.env.TWITTER_ACCESS_TOKEN,
      has_twitter_access_secret: !!process.env.TWITTER_ACCESS_SECRET,
      has_anthropic_key: !!process.env.ANTHROPIC_API_KEY,
      has_bot_secret: !!process.env.BOT_SECRET_KEY,
      has_cron_secret: !!process.env.CRON_SECRET,
    }
  });
};
