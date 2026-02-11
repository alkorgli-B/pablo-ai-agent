module.exports = async function handler(req, res) {
  return res.status(200).json({
    message: "API is working!",
    query: req.query,
    url: req.url,
    env_check: {
      has_twitter_key: !!process.env.TWITTER_API_KEY,
      has_anthropic_key: !!process.env.ANTHROPIC_API_KEY,
      has_bot_secret: !!process.env.BOT_SECRET_KEY,
    }
  });
};
