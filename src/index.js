require('dotenv').config();

// Auto-detect which bot to run based on available env vars
// Telegram is checked first — Twitter as fallback
if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log('[Launcher] Telegram credentials detected → starting Pablo on Telegram...');
  require('./telegram.js');
} else if (process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN) {
  console.log('[Launcher] Twitter credentials detected → starting Pablo on Twitter...');
  require('./twitter.js');
} else {
  console.error('[Launcher] No valid credentials found.');
  console.error('  → For Telegram: set TELEGRAM_BOT_TOKEN + GROQ_API_KEY');
  console.error('  → For Twitter : set TWITTER_API_KEY + TWITTER_ACCESS_TOKEN + GROQ_API_KEY');
  process.exit(1);
}
