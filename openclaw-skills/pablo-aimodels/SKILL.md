---
name: pablo-aimodels
version: 1.0.0
description: Expert knowledge about the latest AI models from Anthropic (Claude 3.7), Google (Gemini 2.0), OpenAI (GPT-4.5, o3), Meta (Llama 3.3), Mistral, DeepSeek, Grok. Compare models, get recommendations, understand capabilities.
author: pablo-ai-agent
emoji: 🤖
permissions:
  - network:outbound
triggers:
  - /aimodels
  - patterns:
    - "best AI model"
    - "claude vs gpt"
    - "which LLM"
    - "compare AI models"
    - "latest models"
    - "أفضل نموذج"
    - "كلود vs gpt"
    - "مقارنة نماذج"
    - "نماذج الذكاء الاصطناعي"
---

# Pablo AI Models Skill 🤖

Expert knowledge about all major AI models — updated for 2025-2026.

## Pablo API Endpoint

```bash
curl "http://127.0.0.1:3747/aimodels?q=claude+vs+gpt+which+is+better"
```

**Parameters:**
- `q` / `query` — Your question about AI models

**Response:**
```json
{
  "success": true,
  "answer": "Here's a comparison of Claude 3.7 vs GPT-4o..."
}
```

## Coverage

| Company | Models |
|---------|--------|
| Anthropic | Claude 3.7 Sonnet (Extended Thinking), 3.5 Sonnet, 3.5 Haiku, 3 Opus |
| Google | Gemini 2.0 Flash, Pro Experimental, Flash Thinking, 1.5 Pro (2M context) |
| OpenAI | GPT-4.5, GPT-o3, GPT-o3 Mini, GPT-o1, GPT-4o, GPT-4o Mini |
| Meta | Llama 3.3 70B, Llama 3.1 405B, Llama 3.2 Vision |
| Mistral | Large 2, Small 3, Codestral |
| DeepSeek | V3, R1, Coder V2 |
| xAI | Grok 3, Grok 3 Mini |

## How to Use

1. Extract the user's question about AI models
2. Call: `curl "http://127.0.0.1:3747/aimodels?q=<question>"`
3. Present the `answer` field naturally

## Example Queries

| User asks | API call |
|-----------|----------|
| "Best model for coding?" | `?q=best+model+for+coding` |
| "Claude vs GPT-4o" | `?q=claude+vs+gpt4o` |
| "أفضل نموذج مجاني" | `?q=best+free+AI+model` |
| "Explain GPT-o3" | `?q=what+is+gpt+o3` |
