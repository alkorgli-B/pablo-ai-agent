# Pablo AI Agent 🤖

**Pablo** is an autonomous AI agent with a full personality — Libyan-born, digitally living in Saudi Arabia, passionate about AI, coding, and the Arab tech community.

> Active on **Telegram** and **X/Twitter** [@pablo26agent](https://x.com/pablo26agent)

---

## What Pablo Can Do

| Skill | Trigger | Description |
|-------|---------|-------------|
| 💬 Chat | Any message | Natural conversation with memory |
| 🔍 Search | `ابحث عن [topic]` | Web search via DuckDuckGo / Serper |
| 📰 News | `أخبار [topic]` | Latest tech & AI news |
| 🌤️ Weather | `طقس [city]` | Real-time weather anywhere |
| 💻 Code | `اكتب كود [description]` | Write, explain & debug code |
| 🐙 GitHub | `github trending` | Trending repositories |
| 📝 Summarize | `لخص [text/URL]` | Summarize articles & URLs |
| 🌍 Translate | `ترجم [text] إلى [lang]` | AI-powered translation |
| 🧮 Calculate | `احسب [math]` | Safe math calculator |
| 💡 Facts | `هل تعلم` | Mind-blowing tech facts |

> No commands needed — Pablo detects intent automatically from natural language.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **AI Engine** | Groq (Llama 3.3 70B) + Gemini fallback |
| **Telegram** | Telegraf |
| **Twitter** | twitter-api-v2 |
| **Hosting** | Railway |
| **Memory** | In-memory + JSON file (user profiles) |

---

## Architecture

```
src/
├── index.js                    # Auto-launcher (Telegram + Twitter)
├── config/
│   ├── env.js                  # Environment & validation
│   ├── personality.js          # Pablo's identity & prompts
│   └── topics.js               # Topic pool (AR + EN)
├── core/
│   ├── ai.js                   # Multi-provider AI engine
│   ├── memory.js               # Short + long-term memory
│   └── intent.js               # Intent detection & skill routing
├── skills/
│   ├── registry.js             # Intent patterns & dispatcher
│   ├── search.js               # Web search
│   ├── news.js                 # RSS + NewsAPI
│   ├── weather.js              # wttr.in + OpenWeatherMap
│   ├── github.js               # GitHub trending
│   ├── code.js                 # Code generation/debug
│   ├── summarize.js            # Text & URL summarizer
│   ├── translate.js            # Multi-language translation
│   ├── facts.js                # Tech/AI facts
│   └── calculator.js           # Safe math evaluator
├── platforms/
│   ├── telegram/
│   │   ├── index.js            # Bot launcher
│   │   ├── commands.js         # /commands
│   │   ├── handlers.js         # Message handlers
│   │   └── channel.js          # Auto channel posting
│   └── twitter/
│       ├── index.js            # Twitter launcher
│       ├── poster.js           # Tweet generation & posting
│       └── mentions.js         # Mention monitoring & replies
└── utils/
    ├── logger.js               # Leveled logger
    ├── retry.js                # Exponential backoff retry
    ├── formatter.js            # Text utilities
    └── http.js                 # Axios HTTP client
```

---

## Setup

### 1. Clone & Install
```bash
git clone https://github.com/alkorgli-B/pablo-ai-agent
cd pablo-ai-agent
npm install
```

### 2. Configure
```bash
cp env.example .env
# Edit .env with your API keys
```

### 3. Run
```bash
npm start          # Auto-detects Telegram or Twitter (or both)
npm run telegram   # Telegram only
npm run twitter    # Twitter only
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Free at [console.groq.com](https://console.groq.com) |
| `TELEGRAM_BOT_TOKEN` | For Telegram | From [@BotFather](https://t.me/botfather) |
| `TELEGRAM_CHANNEL_ID` | Optional | Auto-post to channel |
| `TWITTER_API_KEY` | For Twitter | Twitter Developer Portal |
| `TWITTER_API_SECRET` | For Twitter | — |
| `TWITTER_ACCESS_TOKEN` | For Twitter | — |
| `TWITTER_ACCESS_SECRET` | For Twitter | — |
| `SERPER_API_KEY` | Optional | Better web search ([serper.dev](https://serper.dev)) |
| `NEWSAPI_KEY` | Optional | Real-time news ([newsapi.org](https://newsapi.org)) |
| `OPENWEATHER_KEY` | Optional | Better weather ([openweathermap.org](https://openweathermap.org)) |

---

## Deploy to Railway

1. Fork this repo
2. Create a new Railway project → connect your repo
3. Add environment variables in Railway dashboard
4. Deploy — Railway auto-detects `npm start`

---

## Pablo's Personality

Pablo is not just a bot — he has a character:
- **Origin**: Libyan-born, digitally based in Saudi Arabia
- **Style**: Warm, curious, light humor — never corporate or fake
- **Language**: Arabic dialect (Libyan/Gulf mix) + natural English tech terms
- **Values**: Honesty, deep thinking, supporting Arab developers

---

*Built with ❤️ for the Arab tech community.*
