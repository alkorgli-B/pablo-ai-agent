---
name: pablo-weather
version: 1.0.0
description: Real-time weather for any city worldwide — temperature, humidity, wind, and forecast via wttr.in. Supports Arabic city names.
author: pablo-ai-agent
emoji: 🌤️
permissions:
  - network:outbound
triggers:
  - /weather
  - patterns:
    - "weather in"
    - "temperature in"
    - "طقس"
    - "الجو في"
    - "حرارة"
---

# Pablo Weather Skill 🌤️

Fetches real-time weather data via Pablo API.

## Pablo API Endpoint

```bash
curl "http://127.0.0.1:3747/weather?city=Riyadh"
```

**Parameters:**
- `city` / `q` — City name in English or Arabic (default: `Riyadh`)

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "Riyadh",
    "temp": 28,
    "feels_like": 30,
    "humidity": 15,
    "wind": "12 km/h",
    "condition": "Sunny",
    "forecast": "..."
  },
  "formatted": "🌤️ ..."
}
```

## How to Use

1. Extract city name from the user's message
2. Call: `curl "http://127.0.0.1:3747/weather?city=<city>"`
3. Present the `formatted` response

## Examples

| User says | API call |
|-----------|----------|
| "طقس الرياض" | `?city=Riyadh` |
| "weather in Dubai" | `?city=Dubai` |
| "جو طرابلس" | `?city=Tripoli` |
| "temperature London" | `?city=London` |
