# 🤖 Pablo AI Agent

**Autonomous AI Agent on X (Twitter)**

Pablo is an intelligent, autonomous AI agent that operates independently on X (formerly Twitter), powered by Claude Sonnet 4.5 and GPT-4.

## ✨ Features

- 🧠 **Advanced AI** - Powered by Claude Sonnet 4.5 & GPT-4
- 🤖 **Fully Autonomous** - Operates 24/7 without human intervention
- 💬 **Smart Interactions** - Responds intelligently to mentions and tweets
- 📝 **Original Content** - Creates and posts unique tweets regularly
- 📊 **Analytics Dashboard** - Monitor activity and engagement
- 🎨 **Customizable Personality** - Easy to configure tone and style

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Twitter Developer Account with API keys
- Anthropic API key (Claude)
- OpenAI API key (optional, for GPT-4 backup)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pablo-ai-agent.git
cd pablo-ai-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_SECRET=your_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret

ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key

CRON_SECRET=your_random_secret
PABLO_USERNAME=your_twitter_username
```

4. **Run locally**
```bash
# Start the dashboard
npm run dev

# In another terminal, run the agent
npm run agent:dev
```

Visit `http://localhost:3000` to see the dashboard.

## 🌐 Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Pablo AI Agent"
git push origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add all environment variables
- Deploy!

Vercel will automatically set up the cron jobs from `vercel.json`.

## 📁 Project Structure

```
pablo-ai-agent/
├── src/
│   ├── agent/
│   │   ├── personality.ts    # Pablo's personality & behavior
│   │   └── runner.ts          # Main agent engine
│   ├── lib/
│   │   ├── twitter.ts         # Twitter API wrapper
│   │   ├── ai.ts              # AI helpers (Claude & GPT-4)
│   │   └── utils.ts           # Utility functions
│   └── app/
│       ├── page.tsx           # Home page
│       ├── dashboard/         # Dashboard
│       └── api/cron/          # API routes for cron jobs
├── .env.local                 # Your API keys (not committed)
├── package.json
└── vercel.json               # Vercel configuration
```

## 🎨 Customization

### Personality

Edit `src/agent/personality.ts` to customize:
- Name and bio
- Personality traits
- Topics of interest
- Posting style
- Activity schedule

### Posting Frequency

Edit `src/agent/runner.ts`:
```typescript
const CONFIG = {
  POST_INTERVAL: 3 * 60 * 60 * 1000, // Post every 3 hours
  MAX_REPLIES_PER_CYCLE: 5,          // Max replies per cycle
};
```

## 🔒 Security

- Never commit `.env.local` to Git
- Use Vercel's environment variables for production
- Enable 2FA on all API accounts
- Regularly rotate API keys

## 📊 What Pablo Does

- ✅ Monitors mentions every minute
- ✅ Responds to relevant tweets intelligently
- ✅ Posts original content every 3 hours
- ✅ Likes interesting tweets
- ✅ Learns from interactions
- ✅ Maintains consistent personality

## 💰 Cost Estimate

- Twitter API: **Free** (within rate limits)
- Claude API: **~$3-8/month**
- OpenAI API: **~$2-7/month** (optional)
- Vercel: **Free** (hobby tier)

**Total: $5-15/month**

## 🆘 Troubleshooting

### Agent not posting?
- Check Twitter API rate limits
- Verify API credentials in environment variables
- Check Vercel function logs

### AI not responding?
- Confirm Claude/OpenAI API keys are correct
- Check API quotas and billing
- Review error logs

### Dashboard not loading?
- Ensure all dependencies are installed
- Check build logs in Vercel
- Test locally first with `npm run dev`

## 📄 License

MIT License - Feel free to use and modify!

## 🙏 Credits

- Built with Next.js 14, TypeScript, and Tailwind CSS
- Powered by Anthropic Claude and OpenAI GPT-4
- Twitter API v2

---

**Made with ❤️ and AI**

For questions or issues, please open a GitHub issue.
