---
name: pablo-crypto
version: 1.0.0
description: Real-time cryptocurrency prices, market caps, and 24h/7d changes for Bitcoin, Ethereum, Solana, and 40+ coins — powered by CoinGecko via Pablo agent API.
author: pablo-ai-agent
emoji: 💰
permissions:
  - network:outbound
triggers:
  - /crypto
  - patterns:
    - "bitcoin price"
    - "ethereum price"
    - "btc price"
    - "eth price"
    - "crypto price"
    - "top coins"
    - "سعر بيتكوين"
    - "سعر الإيثيريوم"
    - "أسعار العملات الرقمية"
    - "كريبتو"
---

# Pablo Crypto Skill 💰

Fetches **real-time** cryptocurrency data from CoinGecko via the local Pablo API.

## Pablo API Endpoint

**Base URL:** `http://127.0.0.1:3747`

Make sure Pablo API is running before using this skill:
```bash
cd /path/to/pablo-ai-agent && node src/api/server.js
```

---

## Getting a Single Coin Price

```bash
curl "http://127.0.0.1:3747/crypto?coin=bitcoin"
```

**Supported coin identifiers** (use symbol, name, or Arabic):
- `bitcoin` / `btc` / `بيتكوين`
- `ethereum` / `eth` / `إيثيريوم`
- `solana` / `sol` / `سولانا`
- `binancecoin` / `bnb`
- `ripple` / `xrp`
- `dogecoin` / `doge` / `دوج`
- `shiba-inu` / `shib`
- `pepe`, `ton`, `cardano`, `polkadot`, `avalanche`, `chainlink`, `tron`...

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "price": 97450.23,
    "change24h": 2.15,
    "change7d": -1.8,
    "marketCap": 1920000000000,
    "volume24h": 42000000000,
    "rank": 1
  },
  "formatted": "💰 *Bitcoin (BTC)* ..."
}
```

---

## Getting Top 10 Coins

```bash
curl "http://127.0.0.1:3747/crypto?top=10"
```

---

## How to Use This Skill

When the user asks about a cryptocurrency price or market data:

1. Parse the coin name from the user's message (Bitcoin → `bitcoin`, BTC → `btc`, بيتكوين → `bitcoin`)
2. Call the Pablo API: `curl "http://127.0.0.1:3747/crypto?coin=<coin_id>"`
3. Use the `formatted` field from the response to present the data to the user
4. Always mention the data is live from CoinGecko

**Important:** This is REAL-TIME data — never guess or hallucinate prices. Always call the API.

---

## Example Queries → Actions

| User says | API call |
|-----------|----------|
| "What's Bitcoin's price?" | `?coin=bitcoin` |
| "ETH price" | `?coin=eth` |
| "سعر البيتكوين" | `?coin=bitcoin` |
| "Top 10 crypto" | `?top=10` |
| "سعر سولانا" | `?coin=solana` |
