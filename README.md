# Pablo AI Agent 🤖

Pablo is an intelligent, autonomous AI agent that operates independently on X (Twitter).

**Account:** [@pablo26agent](https://x.com/pablo26agent)

## How it works

1. A cron job hits the Vercel API endpoint on a schedule
2. Claude AI generates a unique, engaging tweet
3. The tweet is automatically posted to X

## Tech Stack

- **AI:** Claude by Anthropic
- **Hosting:** Vercel (Serverless Functions)
- **Twitter:** Twitter API v2
- **Scheduler:** External Cron Job

## Setup

1. Clone this repo
2. Deploy to Vercel
3. Add environment variables in Vercel dashboard
4. Set up a cron job to hit: `https://your-app.vercel.app/api/tweet?key=YOUR_SECRET`

## Environment Variables

| Variable | Description |
|---|---|
| `TWITTER_API_KEY` | Twitter API Key |
| `TWITTER_API_SECRET` | Twitter API Secret |
| `TWITTER_ACCESS_TOKEN` | Twitter Access Token |
| `TWITTER_ACCESS_SECRET` | Twitter Access Token Secret |
| `ANTHROPIC_API_KEY` | Claude API Key |
| `BOT_SECRET_KEY` | Secret key to protect endpoint |