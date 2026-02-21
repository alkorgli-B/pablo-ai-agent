---
name: pablo-news
version: 1.0.0
description: Latest tech and AI news from NewsAPI and RSS feeds. Covers AI, programming, startups, cybersecurity, and more — in Arabic and English.
author: pablo-ai-agent
emoji: 📰
permissions:
  - network:outbound
triggers:
  - /news
  - patterns:
    - "latest news"
    - "tech news"
    - "AI news"
    - "أخبار"
    - "اخبار تقنية"
    - "آخر الأخبار"
---

# Pablo News Skill 📰

Fetches the latest technology and AI news via the local Pablo API.

## Pablo API Endpoint

```bash
curl "http://127.0.0.1:3747/news?topic=artificial+intelligence"
```

**Parameters:**
- `topic` / `q` — Search topic (default: `artificial intelligence`)

**Topics:** `AI`, `programming`, `cybersecurity`, `startups`, `open source`, `robotics`, `machine learning`, `web development`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "OpenAI releases GPT-5...",
      "source": "TechCrunch",
      "url": "https://...",
      "publishedAt": "2026-02-21T..."
    }
  ],
  "formatted": "📰 ..."
}
```

## How to Use

1. Extract the topic from the user's message
2. Call: `curl "http://127.0.0.1:3747/news?topic=<topic>"`
3. Present the `formatted` response or list articles naturally
4. If no topic specified, default to `AI`

## Examples

| User says | API call |
|-----------|----------|
| "آخر أخبار الذكاء الاصطناعي" | `?topic=artificial+intelligence` |
| "أخبار البرمجة" | `?topic=programming` |
| "tech news" | `?topic=technology` |
| "أخبار أمن" | `?topic=cybersecurity` |
