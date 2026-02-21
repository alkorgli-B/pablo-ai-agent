'use strict';

// ─────────────────────────────────────────────────────────
//  Crypto Skill — Real-time prices from CoinGecko API
//  No API key required (free tier: ~30 req/min)
// ─────────────────────────────────────────────────────────
const http   = require('../utils/http');
const logger = require('../utils/logger');

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// ── Coin name/symbol → CoinGecko ID ───────────────────────
const COIN_MAP = {
  // Bitcoin
  'btc': 'bitcoin', 'bitcoin': 'bitcoin',
  'بيتكوين': 'bitcoin', 'بتكوين': 'bitcoin', 'بيت كوين': 'bitcoin',
  // Ethereum
  'eth': 'ethereum', 'ethereum': 'ethereum',
  'إيثيريوم': 'ethereum', 'اثيريوم': 'ethereum', 'ايثيريوم': 'ethereum',
  // BNB
  'bnb': 'binancecoin', 'binance': 'binancecoin', 'بينانس': 'binancecoin',
  // Solana
  'sol': 'solana', 'solana': 'solana', 'سولانا': 'solana',
  // XRP
  'xrp': 'ripple', 'ripple': 'ripple', 'ريبل': 'ripple',
  // Cardano
  'ada': 'cardano', 'cardano': 'cardano',
  // Dogecoin
  'doge': 'dogecoin', 'dogecoin': 'dogecoin', 'دوج': 'dogecoin', 'دوجكوين': 'dogecoin',
  // Polygon
  'matic': 'matic-network', 'polygon': 'matic-network', 'pol': 'matic-network',
  // Chainlink
  'link': 'chainlink', 'chainlink': 'chainlink',
  // Avalanche
  'avax': 'avalanche-2', 'avalanche': 'avalanche-2',
  // Litecoin
  'ltc': 'litecoin', 'litecoin': 'litecoin',
  // Uniswap
  'uni': 'uniswap', 'uniswap': 'uniswap',
  // Cosmos
  'atom': 'cosmos', 'cosmos': 'cosmos',
  // Tron
  'trx': 'tron', 'tron': 'tron',
  // Stablecoins
  'usdt': 'tether', 'tether': 'tether',
  'usdc': 'usd-coin',
  'dai': 'dai',
  // Meme coins
  'pepe': 'pepe',
  'shib': 'shiba-inu', 'shiba': 'shiba-inu', 'شيبا': 'shiba-inu',
  'floki': 'floki',
  // Layer 2 / Others
  'ton': 'the-open-network',
  'arb': 'arbitrum', 'arbitrum': 'arbitrum',
  'op': 'optimism', 'optimism': 'optimism',
  'dot': 'polkadot', 'polkadot': 'polkadot',
  'near': 'near', 'fil': 'filecoin',
  'apt': 'aptos', 'aptos': 'aptos',
  'sui': 'sui',
  'inj': 'injective-protocol', 'injective': 'injective-protocol',
  'sei': 'sei-network',
};

function resolveCoinId(query) {
  if (!query) return 'bitcoin';
  const q = query.toLowerCase().trim();
  return COIN_MAP[q] || q;
}

// ── API Calls ──────────────────────────────────────────────

/**
 * Get full data for a single coin
 */
async function getCryptoPrice(coinQuery) {
  const coinId = resolveCoinId(coinQuery);

  try {
    const data = await http.get(`${COINGECKO_BASE}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    return {
      id:         data.id,
      name:       data.name,
      symbol:     data.symbol?.toUpperCase(),
      price:      data.market_data?.current_price?.usd,
      change24h:  data.market_data?.price_change_percentage_24h,
      change7d:   data.market_data?.price_change_percentage_7d,
      change30d:  data.market_data?.price_change_percentage_30d,
      marketCap:  data.market_data?.market_cap?.usd,
      volume24h:  data.market_data?.total_volume?.usd,
      rank:       data.market_cap_rank,
      high24h:    data.market_data?.high_24h?.usd,
      low24h:     data.market_data?.low_24h?.usd,
      ath:        data.market_data?.ath?.usd,
      athDate:    data.market_data?.ath_date?.usd,
    };
  } catch (err) {
    logger.warn('crypto', `Failed to get price for ${coinId}: ${err.message}`);
    return null;
  }
}

/**
 * Get top N coins by market cap
 */
async function getTopCoins(n = 10) {
  try {
    const data = await http.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: n,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h,7d',
      },
    });

    return data.map(c => ({
      rank:      c.market_cap_rank,
      name:      c.name,
      symbol:    c.symbol?.toUpperCase(),
      price:     c.current_price,
      change24h: c.price_change_percentage_24h,
      change7d:  c.price_change_percentage_7d_in_currency,
      marketCap: c.market_cap,
    }));
  } catch (err) {
    logger.warn('crypto', `Failed to get top coins: ${err.message}`);
    return [];
  }
}

// ── Formatters ─────────────────────────────────────────────

function formatPrice(price) {
  if (price == null) return 'N/A';
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (price >= 1)    return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
}

function formatChange(pct) {
  if (pct == null) return '—';
  const arrow = pct >= 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(pct).toFixed(2)}%`;
}

function formatBigNumber(n) {
  if (!n) return 'N/A';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function formatCryptoData(coin) {
  if (!coin) return 'ما قدرت أجيب بيانات هذه العملة. جرّب رمزها الإنجليزي (BTC, ETH, SOL...)';

  const icon24h = coin.change24h >= 0 ? '🟢' : '🔴';
  const icon7d  = coin.change7d  >= 0 ? '📈' : '📉';

  return [
    `💰 *${coin.name} (${coin.symbol})*  #${coin.rank}`,
    ``,
    `السعر: \`${formatPrice(coin.price)}\``,
    `24h:  ${icon24h} ${formatChange(coin.change24h)}`,
    `7d:   ${icon7d} ${formatChange(coin.change7d)}`,
    ``,
    `Market Cap:  ${formatBigNumber(coin.marketCap)}`,
    `Volume (24h): ${formatBigNumber(coin.volume24h)}`,
    `High/Low (24h): ${formatPrice(coin.high24h)} / ${formatPrice(coin.low24h)}`,
    ``,
    `_بيانات حقيقية من CoinGecko_`,
  ].join('\n');
}

function formatTopCoins(coins) {
  if (!coins.length) return 'ما قدرت أجيب بيانات السوق الحين.';

  const lines = ['📊 *أكبر 10 عملات — الوقت الحالي*\n'];
  coins.forEach(c => {
    const icon = c.change24h >= 0 ? '🟢' : '🔴';
    lines.push(
      `${c.rank}. *${c.symbol}* ${formatPrice(c.price)}  ${icon} ${formatChange(c.change24h)}`
    );
  });
  lines.push('\n_بيانات حقيقية من CoinGecko_');
  return lines.join('\n');
}

/**
 * Raw data string for AI injection (context)
 */
function formatForAI(coin) {
  if (!coin) return 'لا توجد بيانات';
  return [
    `عملة: ${coin.name} (${coin.symbol}) — المرتبة #${coin.rank}`,
    `السعر الحالي: ${formatPrice(coin.price)}`,
    `التغير 24h: ${formatChange(coin.change24h)}`,
    `التغير 7d: ${formatChange(coin.change7d)}`,
    `القيمة السوقية: ${formatBigNumber(coin.marketCap)}`,
    `حجم التداول (24h): ${formatBigNumber(coin.volume24h)}`,
    `أعلى/أدنى (24h): ${formatPrice(coin.high24h)} / ${formatPrice(coin.low24h)}`,
    `المصدر: CoinGecko — بيانات حقيقية ومحدّثة`,
  ].join('\n');
}

module.exports = {
  getCryptoPrice,
  getTopCoins,
  formatCryptoData,
  formatTopCoins,
  formatForAI,
  resolveCoinId,
};
