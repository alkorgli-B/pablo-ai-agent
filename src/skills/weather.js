'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Weather
//  Primary: wttr.in (always free, no key needed)
//  Optional: OpenWeatherMap (if OPENWEATHER_KEY set)
// ─────────────────────────────────────────────────────────
const http = require('../utils/http');
const logger = require('../utils/logger');
const { env } = require('../config/env');

const WTTR_URL  = 'https://wttr.in';
const OWM_URL   = 'https://api.openweathermap.org/data/2.5/weather';

// Weather condition icons
const CONDITION_ICONS = {
  Clear: '☀️', Sunny: '☀️', 'Partly cloudy': '⛅', Overcast: '☁️',
  Mist: '🌫️', Fog: '🌫️', Rain: '🌧️', Drizzle: '🌦️',
  'Heavy rain': '⛈️', Snow: '❄️', Thunderstorm: '⛈️', Blizzard: '🌨️',
};

function getIcon(desc) {
  for (const [k, v] of Object.entries(CONDITION_ICONS)) {
    if (desc.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '🌡️';
}

// ── wttr.in ──────────────────────────────────────────────

async function getWeatherWttr(city) {
  const data = await http.get(`${WTTR_URL}/${encodeURIComponent(city)}`, {
    format: 'j1',
  });

  const current = data.current_condition?.[0];
  const area    = data.nearest_area?.[0];
  const today   = data.weather?.[0];

  if (!current) throw new Error('No weather data');

  const cityName = area?.areaName?.[0]?.value || city;
  const country  = area?.country?.[0]?.value || '';
  const desc     = current.weatherDesc?.[0]?.value || 'N/A';
  const tempC    = current.temp_C;
  const feelsC   = current.FeelsLikeC;
  const humidity = current.humidity;
  const windKph  = current.windspeedKmph;
  const visKm    = current.visibility;

  const maxC = today?.maxtempC || tempC;
  const minC = today?.mintempC || tempC;

  return {
    city:        `${cityName}${country ? ', ' + country : ''}`,
    description: desc,
    icon:        getIcon(desc),
    tempC:       parseInt(tempC),
    feelsC:      parseInt(feelsC),
    humidity:    parseInt(humidity),
    windKph:     parseInt(windKph),
    visKm:       parseInt(visKm),
    maxC:        parseInt(maxC),
    minC:        parseInt(minC),
  };
}

// ── OpenWeatherMap ───────────────────────────────────────

async function getWeatherOWM(city) {
  const data = await http.get(OWM_URL, {
    q: city,
    appid: env.OPENWEATHER_KEY,
    units: 'metric',
    lang: 'ar',
  });

  return {
    city:        `${data.name}, ${data.sys.country}`,
    description: data.weather?.[0]?.description || '',
    icon:        getIcon(data.weather?.[0]?.main || ''),
    tempC:       Math.round(data.main.temp),
    feelsC:      Math.round(data.main.feels_like),
    humidity:    data.main.humidity,
    windKph:     Math.round((data.wind?.speed || 0) * 3.6),
    visKm:       Math.round((data.visibility || 0) / 1000),
    maxC:        Math.round(data.main.temp_max),
    minC:        Math.round(data.main.temp_min),
  };
}

// ── Main ─────────────────────────────────────────────────

/**
 * Get weather for a city.
 * @param {string} city
 * @returns {Object} weather data
 */
async function getWeather(city = 'Tripoli') {
  try {
    if (env.OPENWEATHER_KEY) {
      logger.debug('weather', `Using OWM for: ${city}`);
      return await getWeatherOWM(city);
    }
    logger.debug('weather', `Using wttr.in for: ${city}`);
    return await getWeatherWttr(city);
  } catch (err) {
    logger.error('weather', `Failed for ${city}: ${err.message}`);
    return null;
  }
}

/**
 * Format weather data for AI context injection.
 */
function formatWeather(data) {
  if (!data) return 'ما قدرت أجيب طقس هالمدينة — تأكد من اسم المدينة.';

  return [
    `الطقس في ${data.city} ${data.icon}`,
    `الحالة: ${data.description}`,
    `الحرارة: ${data.tempC}°C (تبدو ${data.feelsC}°C)`,
    `العظمى: ${data.maxC}°C | الصغرى: ${data.minC}°C`,
    `الرطوبة: ${data.humidity}% | الرياح: ${data.windKph} كم/ساعة`,
    `الرؤية: ${data.visKm} كم`,
  ].join('\n');
}

module.exports = { getWeather, formatWeather };
