---
name: pablo-github
version: 1.0.0
description: GitHub trending repositories and topic search. Shows top repos by stars, language, description — great for discovering new open source projects.
author: pablo-ai-agent
emoji: 🐙
permissions:
  - network:outbound
triggers:
  - /github
  - patterns:
    - "github trending"
    - "trending repos"
    - "open source projects"
    - "مستودعات github"
    - "مشاريع مفتوحة"
---

# Pablo GitHub Skill 🐙

Fetches GitHub trending repositories and topic searches.

## Pablo API Endpoint

```bash
# Trending (last 7 days)
curl "http://127.0.0.1:3747/github"

# Topic search
curl "http://127.0.0.1:3747/github?topic=rust"
```

**Parameters:**
- `topic` / `q` — Search topic (optional; if omitted → trending)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "owner/repo",
      "stars": 15200,
      "language": "TypeScript",
      "description": "...",
      "url": "https://github.com/..."
    }
  ],
  "formatted": "🐙 ..."
}
```

## Examples

| User says | API call |
|-----------|----------|
| "github trending" | `/github` |
| "trending AI repos" | `?topic=artificial-intelligence` |
| "مستودعات Rust" | `?topic=rust` |
| "open source LLMs" | `?topic=llm` |
