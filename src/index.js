require('dotenv').config();

// Auto-detect which bot to run based on available env vars
if (process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN) {
  console.log('[Launcher] Twitter credentials detected → starting Twitter bot...');
  require('./twitter.js');
} else if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log('[Launcher] Telegram credentials detected → starting Telegram bot...');
  require('./telegram.js');
} else {
  console.error('[Launcher] No valid credentials found.');
  console.error('  → For Twitter: set TWITTER_API_KEY + TWITTER_ACCESS_TOKEN');
  console.error('  → For Telegram: set TELEGRAM_BOT_TOKEN');
  process.exit(1);
}
