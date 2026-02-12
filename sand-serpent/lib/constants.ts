// ============================================================
// Sand Serpent — Game Constants
// ============================================================

import type { ColorScheme, Difficulty, SnakeColor, WaveInfo } from './types';

// Grid sizes per difficulty
export const GRID_SIZES: Record<Difficulty, number> = {
  casual: 24,
  normal: 30,
  hardcore: 36,
};

// Canvas sizes
export const CANVAS_DESKTOP = 650;
export const CANVAS_TABLET_PADDING = 40;
export const CANVAS_MOBILE_PADDING = 20;

// Snake
export const INITIAL_SNAKE_LENGTH = 4;
export const SNAKE_BASE_SPEED: Record<Difficulty, number> = {
  casual: 150,    // ms per move
  normal: 120,
  hardcore: 90,
};
export const SNAKE_TONGUE_INTERVAL = 1000; // ms
export const SNAKE_BODY_WAVE_AMPLITUDE = 0.15;
export const SNAKE_BODY_WAVE_FREQUENCY = 0.4;
export const GHOST_TRAIL_FRAMES = 3;

// Food
export const REGULAR_FOOD_COUNT = 3;
export const GOLDEN_FOOD_INTERVAL = 15; // every N eats
export const FOOD_BOB_SPEED = 0.003;
export const FOOD_BOB_AMPLITUDE = 3;
export const FOOD_SCORE = 10;
export const GOLDEN_FOOD_SCORE = 50;
export const POISON_SEGMENT_LOSS = 3;

// Power-ups
export const POWERUP_SPAWN_MIN = 8;
export const POWERUP_SPAWN_MAX = 12;
export const POWERUP_DURATIONS: Record<string, number> = {
  speed: 10000,
  shield: 15000,
  double: 12000,
  magnet: 10000,
  fire: 10000,
  freeze: 8000,
};
export const SPEED_BOOST_MULTIPLIER = 0.5;  // 50% faster
export const MAGNET_RADIUS = 3;
export const FREEZE_SLOW_FACTOR = 0.5;

// Combo
export const COMBO_TIMEOUT = 2500; // ms
export const COMBO_MULTIPLIER_BASE = 1;

// Particles
export const MAX_PARTICLES = 200;
export const EAT_PARTICLE_COUNT = 10;
export const GOLDEN_EAT_PARTICLE_COUNT = 16;
export const DEATH_PARTICLE_COUNT = 50;
export const AMBIENT_PARTICLE_COUNT = 30;

// Waves
export const FOOD_PER_WAVE = 15;

export const WAVES: WaveInfo[] = [
  { number: 1, name: 'Desert Dunes', nameAr: 'كثبان الصحراء', speedMultiplier: 1.0, hasGoldenFood: false, hasPoisonFood: false, hasObstacles: false, hasMovingObstacles: false, sandParticles: false },
  { number: 2, name: 'Desert Dunes', nameAr: 'كثبان الصحراء', speedMultiplier: 1.0, hasGoldenFood: false, hasPoisonFood: false, hasObstacles: false, hasMovingObstacles: false, sandParticles: false },
  { number: 3, name: 'Desert Dunes', nameAr: 'كثبان الصحراء', speedMultiplier: 1.0, hasGoldenFood: false, hasPoisonFood: false, hasObstacles: false, hasMovingObstacles: false, sandParticles: false },
  { number: 4, name: 'Oasis Path', nameAr: 'طريق الواحة', speedMultiplier: 1.1, hasGoldenFood: true, hasPoisonFood: false, hasObstacles: false, hasMovingObstacles: false, sandParticles: false },
  { number: 5, name: 'Oasis Path', nameAr: 'طريق الواحة', speedMultiplier: 1.1, hasGoldenFood: true, hasPoisonFood: false, hasObstacles: false, hasMovingObstacles: false, sandParticles: false },
  { number: 6, name: 'Oasis Path', nameAr: 'طريق الواحة', speedMultiplier: 1.1, hasGoldenFood: true, hasPoisonFood: false, hasObstacles: false, hasMovingObstacles: false, sandParticles: false },
  { number: 7, name: 'Sandstorm', nameAr: 'عاصفة رملية', speedMultiplier: 1.2, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: false, hasMovingObstacles: false, sandParticles: true },
  { number: 8, name: 'Sandstorm', nameAr: 'عاصفة رملية', speedMultiplier: 1.2, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: false, hasMovingObstacles: false, sandParticles: true },
  { number: 9, name: 'Sandstorm', nameAr: 'عاصفة رملية', speedMultiplier: 1.2, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: false, hasMovingObstacles: false, sandParticles: true },
  { number: 10, name: 'Ancient Ruins', nameAr: 'الأطلال القديمة', speedMultiplier: 1.3, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: false, sandParticles: true },
  { number: 11, name: 'Ancient Ruins', nameAr: 'الأطلال القديمة', speedMultiplier: 1.3, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: false, sandParticles: true },
  { number: 12, name: 'Ancient Ruins', nameAr: 'الأطلال القديمة', speedMultiplier: 1.3, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: false, sandParticles: true },
  { number: 13, name: "Dragon's Lair", nameAr: 'عرين التنين', speedMultiplier: 1.5, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 14, name: "Dragon's Lair", nameAr: 'عرين التنين', speedMultiplier: 1.5, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 15, name: "Dragon's Lair", nameAr: 'عرين التنين', speedMultiplier: 1.5, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 16, name: 'Infinite Sands', nameAr: 'الرمال اللانهائية', speedMultiplier: 1.6, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 17, name: 'Infinite Sands', nameAr: 'الرمال اللانهائية', speedMultiplier: 1.7, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 18, name: 'Infinite Sands', nameAr: 'الرمال اللانهائية', speedMultiplier: 1.8, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 19, name: 'Infinite Sands', nameAr: 'الرمال اللانهائية', speedMultiplier: 1.9, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
  { number: 20, name: 'Infinite Sands', nameAr: 'الرمال اللانهائية', speedMultiplier: 2.0, hasGoldenFood: true, hasPoisonFood: true, hasObstacles: true, hasMovingObstacles: true, sandParticles: true },
];

// Colors
export const SNAKE_COLORS: Record<SnakeColor, ColorScheme> = {
  emerald: { primary: '#34d399', secondary: '#059669', glow: '#34d39966', dark: '#064e3b', light: '#6ee7b7' },
  sapphire: { primary: '#60a5fa', secondary: '#2563eb', glow: '#60a5fa66', dark: '#1e3a5f', light: '#93c5fd' },
  ruby: { primary: '#f87171', secondary: '#dc2626', glow: '#f8717166', dark: '#7f1d1d', light: '#fca5a5' },
  amber: { primary: '#fbbf24', secondary: '#d97706', glow: '#fbbf2466', dark: '#78350f', light: '#fde68a' },
  violet: { primary: '#a78bfa', secondary: '#7c3aed', glow: '#a78bfa66', dark: '#4c1d95', light: '#c4b5fd' },
  cyan: { primary: '#22d3ee', secondary: '#0891b2', glow: '#22d3ee66', dark: '#164e63', light: '#67e8f9' },
  rose: { primary: '#fb7185', secondary: '#e11d48', glow: '#fb718566', dark: '#881337', light: '#fda4af' },
  obsidian: { primary: '#94a3b8', secondary: '#475569', glow: '#94a3b866', dark: '#1e293b', light: '#cbd5e1' },
};

export const POWERUP_COLORS: Record<string, string> = {
  speed: '#fbbf24',
  shield: '#60a5fa',
  double: '#a78bfa',
  magnet: '#fb923c',
  fire: '#ef4444',
  freeze: '#22d3ee',
};

export const POWERUP_ICONS: Record<string, string> = {
  speed: '⚡',
  shield: '🛡️',
  double: '💎',
  magnet: '🧲',
  fire: '🔥',
  freeze: '❄️',
};

// Difficulty configs
export const DIFFICULTY_CONFIG: Record<Difficulty, {
  powerupFrequency: number;
  hasShield: boolean;
}> = {
  casual: { powerupFrequency: 0.8, hasShield: true },
  normal: { powerupFrequency: 1.0, hasShield: true },
  hardcore: { powerupFrequency: 1.3, hasShield: false },
};

// Ratings
export const SCORE_RATINGS = [
  { min: 0, title: 'Hatchling', titleAr: 'فرخ', icon: '🥚' },
  { min: 100, title: 'Desert Crawler', titleAr: 'زاحف الصحراء', icon: '🦎' },
  { min: 500, title: 'Sand Viper', titleAr: 'أفعى الرمال', icon: '🐍' },
  { min: 1000, title: 'Golden Serpent', titleAr: 'الثعبان الذهبي', icon: '👑' },
  { min: 2500, title: 'Sand God', titleAr: 'إله الرمال', icon: '⚡' },
];
