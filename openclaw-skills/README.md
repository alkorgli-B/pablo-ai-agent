# Pablo Skills for OpenClaw 🦞💰

Integrate Pablo AI Agent's skills into your [OpenClaw](https://github.com/openclaw/openclaw) setup.

## Available Skills

| Skill | Emoji | Description |
|-------|-------|-------------|
| `pablo-crypto` | 💰 | Real-time crypto prices from CoinGecko |
| `pablo-news` | 📰 | Latest tech & AI news |
| `pablo-weather` | 🌤️ | Weather for any city |
| `pablo-github` | 🐙 | GitHub trending repos |
| `pablo-aimodels` | 🤖 | AI models comparison & knowledge |
| `pablo-chat` | 💬 | Full conversation with Pablo |

---

## Setup (2 steps)

### Step 1 — Start Pablo API Server

```bash
cd pablo-ai-agent
cp .env.example .env    # Fill in your API keys
npm install
node src/api/server.js  # Runs on http://127.0.0.1:3747
```

> The server runs locally on port `3747`. Change it with `PABLO_API_PORT=XXXX` in your `.env`.

### Step 2 — Install Skills into OpenClaw

```bash
# Copy all Pablo skills to OpenClaw workspace
cp -r openclaw-skills/* ~/.openclaw/workspace/skills/

# Or install individual skills
cp -r openclaw-skills/pablo-crypto ~/.openclaw/workspace/skills/
```

OpenClaw hot-reloads skill changes automatically — no restart needed.

---

## Usage in OpenClaw

Once installed, just ask naturally:

```
# Crypto
"What's the price of Bitcoin?"           → pablo-crypto
"سعر الإيثيريوم"                         → pablo-crypto
"Show me top 10 coins"                   → pablo-crypto

# News
"Latest AI news"                         → pablo-news
"أخبار التقنية"                          → pablo-news

# Weather
"Weather in Riyadh"                      → pablo-weather
"طقس جدة"                               → pablo-weather

# GitHub
"GitHub trending today"                  → pablo-github
"Trending Rust repos"                    → pablo-github

# AI Models
"Claude vs GPT-4o which is better?"     → pablo-aimodels
"أفضل نموذج AI للبرمجة"                 → pablo-aimodels

# Chat
"Ask pablo: what do you think about..."  → pablo-chat
```

---

## API Reference

| Endpoint | Method | Params | Description |
|----------|--------|--------|-------------|
| `/health` | GET | — | Server status |
| `/crypto` | GET | `coin` or `top` | Crypto price |
| `/weather` | GET | `city` | Weather |
| `/news` | GET | `topic` | News |
| `/github` | GET | `topic` | GitHub repos |
| `/search` | GET | `q` | Web search |
| `/fact` | GET | — | Random tech fact |
| `/calculate` | GET | `expr` | Math |
| `/aimodels` | GET | `q` | AI models Q&A |
| `/chat` | POST | `{message, history}` | Full chat |

---

## Environment Variables

```env
PABLO_API_PORT=3747          # API server port (default: 3747)
GROQ_API_KEY=...             # Required: primary AI provider
GEMINI_API_KEY=...           # Optional: fallback AI
SERPER_API_KEY=...           # Optional: better web search
NEWSAPI_KEY=...              # Optional: more news sources
OPENWEATHER_KEY=...          # Optional: better weather
```

---

## Keep Pablo API Running

To keep Pablo API running in the background alongside OpenClaw:

```bash
# Using pm2
npm install -g pm2
pm2 start src/api/server.js --name pablo-api
pm2 save

# Or run in background with nohup
nohup node src/api/server.js > pablo-api.log 2>&1 &
```
