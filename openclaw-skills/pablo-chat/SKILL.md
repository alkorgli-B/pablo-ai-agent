---
name: pablo-chat
version: 1.0.0
description: Chat with Pablo — a Libyan-born AI agent with Arabic-first personality, tech expertise, and long-term memory. Supports multi-turn conversations in Arabic and English.
author: pablo-ai-agent
emoji: 💬
permissions:
  - network:outbound
triggers:
  - /pablo
  - patterns:
    - "ask pablo"
    - "اسأل بابلو"
    - "pablo thinks"
    - "بابلو"
---

# Pablo Chat Skill 💬

Send any message to Pablo — the Arabic-first AI agent — and get a natural, intelligent response.

## Pablo API Endpoint

```bash
curl -X POST http://127.0.0.1:3747/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ما رأيك في مستقبل الذكاء الاصطناعي العربي؟",
    "history": []
  }'
```

**Request body:**
```json
{
  "message": "Your message here",
  "history": [
    { "role": "user",      "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Pablo's response here..."
}
```

## Pablo's Identity

- **Name:** بابلو (Pablo)
- **Origin:** Libyan-born, digitally based in Saudi Arabia
- **Personality:** Curious, warm, honest, light humor — never corporate
- **Language:** Arabic-first (Libyan/Gulf dialect), natural English tech terms
- **Expertise:** AI, programming, technology, Arab tech community
- **Model:** Llama 3.3 70B via Groq (fast, free)

## Multi-turn Conversation

Pass the conversation history to maintain context:

```bash
curl -X POST http://127.0.0.1:3747/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "وش رأيك في DeepSeek؟",
    "history": [
      { "role": "user", "content": "تكلم لي عن نماذج الذكاء الاصطناعي" },
      { "role": "assistant", "content": "بالنسبة لنماذج الذكاء الاصطناعي..." }
    ]
  }'
```

## When to Use

Use this skill for:
- General conversation and questions
- Opinions on tech topics
- Analysis and explanations
- Creative writing in Arabic
- Anything that doesn't fit the specialized skills
