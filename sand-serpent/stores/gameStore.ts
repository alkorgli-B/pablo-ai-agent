// ============================================================
// Sand Serpent — Zustand Game Store
// ============================================================

import { create } from 'zustand';
import type {
  ActivePowerUp,
  ComboState,
  Difficulty,
  Direction,
  Food,
  GameScreen,
  GameState,
  GameStats,
  HighScoreEntry,
  Language,
  Obstacle,
  Particle,
  PersistedData,
  PowerUp,
  SnakeColor,
  WaveInfo,
} from '@/lib/types';
import {
  createInitialSnake,
  createInitialFoods,
  moveSnake,
  growSnake,
  shrinkSnake,
  checkWallCollision,
  checkSelfCollision,
  checkObstacleCollision,
  checkFoodCollision,
  checkPowerUpCollision,
  spawnFood,
  spawnPowerUp,
  getRandomPowerUpType,
  applyMagnetEffect,
  getWaveForFoodCount,
  generateObstacles,
  moveObstacles,
  calculateScore,
  calculateMoveInterval,
  createEatParticles,
  createDeathParticles,
  updateParticles,
  shouldSpawnPowerUp,
  isOpposite,
} from '@/lib/gameEngine';
import {
  COMBO_TIMEOUT,
  EAT_PARTICLE_COUNT,
  FOOD_SCORE,
  GOLDEN_EAT_PARTICLE_COUNT,
  GOLDEN_FOOD_INTERVAL,
  GOLDEN_FOOD_SCORE,
  GRID_SIZES,
  POISON_SEGMENT_LOSS,
  POWERUP_DURATIONS,
  REGULAR_FOOD_COUNT,
  SNAKE_COLORS,
  SNAKE_TONGUE_INTERVAL,
  WAVES,
} from '@/lib/constants';

const STORAGE_KEY = 'sand-serpent-data';

function loadPersistedData(): PersistedData {
  if (typeof window === 'undefined') return getDefaultPersistedData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultPersistedData();
}

function getDefaultPersistedData(): PersistedData {
  return {
    highScores: [],
    settings: { musicVolume: 0.7, sfxVolume: 0.8, language: 'en' },
    lastPlayer: { name: '', color: 'emerald', difficulty: 'normal' },
    stats: { totalGames: 0, totalScore: 0, totalFoodEaten: 0, bestCombo: 0, totalPlayTime: 0 },
  };
}

function savePersistedData(data: Partial<PersistedData>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadPersistedData();
    const merged = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
}

interface GameStore extends GameState {
  // Persisted data
  highScores: HighScoreEntry[];
  persistedStats: PersistedData['stats'];

  // Actions
  setScreen: (screen: GameScreen) => void;
  setPlayerName: (name: string) => void;
  setSnakeColor: (color: SnakeColor) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setLanguage: (lang: Language) => void;
  setMusicVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  togglePause: () => void;
  changeDirection: (dir: Direction) => void;
  startGame: () => void;
  gameLoop: (timestamp: number) => void;
  endGame: () => void;
  loadPersisted: () => void;
  addHighScore: (entry: HighScoreEntry) => void;
  isNewHighScore: (score: number) => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  screen: 'splash',
  snake: createInitialSnake(30),
  foods: [],
  powerUps: [],
  activePowerUps: [],
  particles: [],
  obstacles: [],
  combo: { count: 0, lastEatTime: 0, maxCombo: 0 },
  stats: {
    score: 0, length: 4, foodEaten: 0, goldenFoodEaten: 0,
    poisonFoodEaten: 0, powerupsCollected: 0, maxCombo: 0,
    waveReached: 1, timeSurvived: 0,
  },
  wave: WAVES[0],
  gridSize: 30,
  cellSize: 20,
  isPaused: false,
  isTransitioning: false,
  gameStartTime: 0,
  lastUpdateTime: 0,
  moveTimer: 0,
  foodEatenSinceLastPowerUp: 0,
  totalFoodEatenForGolden: 0,
  screenShake: { intensity: 0, duration: 0 },

  playerName: '',
  snakeColor: 'emerald',
  difficulty: 'normal',
  language: 'en',
  musicVolume: 0.7,
  sfxVolume: 0.8,
  musicEnabled: true,
  sfxEnabled: true,

  highScores: [],
  persistedStats: getDefaultPersistedData().stats,

  // Actions
  setScreen: (screen) => set({ screen }),

  setPlayerName: (name) => {
    set({ playerName: name });
    const state = get();
    savePersistedData({ lastPlayer: { name, color: state.snakeColor, difficulty: state.difficulty } });
  },

  setSnakeColor: (color) => {
    set({ snakeColor: color });
  },

  setDifficulty: (difficulty) => {
    set({ difficulty });
  },

  setLanguage: (lang) => {
    set({ language: lang });
    savePersistedData({ settings: { musicVolume: get().musicVolume, sfxVolume: get().sfxVolume, language: lang } });
  },

  setMusicVolume: (vol) => {
    set({ musicVolume: vol, musicEnabled: vol > 0 });
    savePersistedData({ settings: { musicVolume: vol, sfxVolume: get().sfxVolume, language: get().language } });
  },

  setSfxVolume: (vol) => {
    set({ sfxVolume: vol, sfxEnabled: vol > 0 });
    savePersistedData({ settings: { musicVolume: get().musicVolume, sfxVolume: vol, language: get().language } });
  },

  togglePause: () => {
    const state = get();
    if (state.screen !== 'game') return;
    set({ isPaused: !state.isPaused });
  },

  changeDirection: (dir) => {
    const state = get();
    if (state.isPaused || !state.snake.alive) return;
    if (!isOpposite(state.snake.direction, dir)) {
      set({
        snake: { ...state.snake, nextDirection: dir },
      });
    }
  },

  startGame: () => {
    const state = get();
    const gridSize = GRID_SIZES[state.difficulty];
    const snake = createInitialSnake(gridSize);
    const obstacles: Obstacle[] = [];
    const foods = createInitialFoods(gridSize, snake, obstacles);

    savePersistedData({
      lastPlayer: {
        name: state.playerName,
        color: state.snakeColor,
        difficulty: state.difficulty,
      },
    });

    set({
      screen: 'game',
      snake,
      foods,
      powerUps: [],
      activePowerUps: [],
      particles: [],
      obstacles,
      combo: { count: 0, lastEatTime: 0, maxCombo: 0 },
      stats: {
        score: 0, length: snake.segments.length, foodEaten: 0, goldenFoodEaten: 0,
        poisonFoodEaten: 0, powerupsCollected: 0, maxCombo: 0,
        waveReached: 1, timeSurvived: 0,
      },
      wave: WAVES[0],
      gridSize,
      isPaused: false,
      isTransitioning: false,
      gameStartTime: Date.now(),
      lastUpdateTime: Date.now(),
      moveTimer: 0,
      foodEatenSinceLastPowerUp: 0,
      totalFoodEatenForGolden: 0,
      screenShake: { intensity: 0, duration: 0 },
    });
  },

  gameLoop: (timestamp) => {
    const state = get();
    if (state.screen !== 'game' || state.isPaused || !state.snake.alive || state.isTransitioning) return;

    const now = Date.now();
    const dt = Math.min((now - state.lastUpdateTime) / 1000, 0.1); // cap dt
    const dtMs = dt * 1000;

    // Update tongue timer
    const tongueTimer = (state.snake.tongueTimer + dtMs) % SNAKE_TONGUE_INTERVAL;

    // Update move timer
    const hasSpeedBoost = state.activePowerUps.some(p => p.type === 'speed');
    const hasFreeze = state.activePowerUps.some(p => p.type === 'freeze');
    const moveInterval = calculateMoveInterval(state.difficulty, state.wave, hasSpeedBoost, hasFreeze);
    let moveTimer = state.moveTimer + dtMs;

    let snake = { ...state.snake, tongueTimer };
    let foods = [...state.foods];
    let powerUps = [...state.powerUps];
    let particles = updateParticles([...state.particles], dt);
    let obstacles = [...state.obstacles];
    let combo = { ...state.combo };
    let stats = { ...state.stats };
    let activePowerUps = state.activePowerUps
      .map(p => ({ ...p, remainingMs: p.remainingMs - dtMs }))
      .filter(p => p.remainingMs > 0);
    let foodEatenSinceLastPowerUp = state.foodEatenSinceLastPowerUp;
    let totalFoodEatenForGolden = state.totalFoodEatenForGolden;
    let screenShake = { ...state.screenShake };
    let wave = state.wave;
    let isTransitioning = false;

    // Update shield/fire state
    snake.shieldActive = activePowerUps.some(p => p.type === 'shield');
    snake.fireActive = activePowerUps.some(p => p.type === 'fire');

    // Magnet effect
    const hasMagnet = activePowerUps.some(p => p.type === 'magnet');
    if (hasMagnet) {
      foods = applyMagnetEffect(snake, foods, state.gridSize);
    }

    // Screen shake decay
    if (screenShake.duration > 0) {
      screenShake = {
        intensity: screenShake.intensity * 0.9,
        duration: screenShake.duration - dtMs,
      };
      if (screenShake.duration <= 0) {
        screenShake = { intensity: 0, duration: 0 };
      }
    }

    // Check combo timeout
    if (combo.count > 0 && now - combo.lastEatTime > COMBO_TIMEOUT) {
      combo = { count: 0, lastEatTime: 0, maxCombo: combo.maxCombo };
    }

    // Move snake
    if (moveTimer >= moveInterval) {
      moveTimer = 0;
      snake = moveSnake(snake, state.gridSize);

      // Move obstacles periodically (every 3 snake moves)
      if (wave.hasMovingObstacles && Math.random() < 0.33) {
        obstacles = moveObstacles(obstacles, state.gridSize);
      }

      // Check wall collision
      if (checkWallCollision(snake, state.gridSize)) {
        if (snake.shieldActive) {
          // Bounce back
          const head = snake.segments[0];
          head.pos.x = Math.max(0, Math.min(state.gridSize - 1, head.pos.x));
          head.pos.y = Math.max(0, Math.min(state.gridSize - 1, head.pos.y));
          activePowerUps = activePowerUps.filter(p => p.type !== 'shield');
          snake.shieldActive = false;
          screenShake = { intensity: 5, duration: 300 };
        } else {
          snake.alive = false;
          const color = SNAKE_COLORS[state.snakeColor].primary;
          particles = [...particles, ...createDeathParticles(snake.segments, state.cellSize, color)];
          screenShake = { intensity: 10, duration: 500 };
        }
      }

      // Check self collision (skip if fire mode)
      if (snake.alive && !snake.fireActive && checkSelfCollision(snake)) {
        if (snake.shieldActive) {
          activePowerUps = activePowerUps.filter(p => p.type !== 'shield');
          snake.shieldActive = false;
          screenShake = { intensity: 5, duration: 300 };
        } else {
          snake.alive = false;
          const color = SNAKE_COLORS[state.snakeColor].primary;
          particles = [...particles, ...createDeathParticles(snake.segments, state.cellSize, color)];
          screenShake = { intensity: 10, duration: 500 };
        }
      }

      // Check obstacle collision
      if (snake.alive && checkObstacleCollision(snake, obstacles)) {
        if (snake.shieldActive) {
          activePowerUps = activePowerUps.filter(p => p.type !== 'shield');
          snake.shieldActive = false;
          screenShake = { intensity: 5, duration: 300 };
        } else {
          snake.alive = false;
          const color = SNAKE_COLORS[state.snakeColor].primary;
          particles = [...particles, ...createDeathParticles(snake.segments, state.cellSize, color)];
          screenShake = { intensity: 10, duration: 500 };
        }
      }

      // Check food collision
      if (snake.alive) {
        const eatenFood = checkFoodCollision(snake, foods);
        if (eatenFood) {
          foods = foods.filter(f => f.id !== eatenFood.id);
          const hasDouble = activePowerUps.some(p => p.type === 'double');

          if (eatenFood.type === 'poison') {
            snake = shrinkSnake(snake, POISON_SEGMENT_LOSS);
            stats.poisonFoodEaten++;
            screenShake = { intensity: 4, duration: 200 };
            particles = [...particles, ...createEatParticles(
              eatenFood.pos, state.cellSize, '#8b5cf6', EAT_PARTICLE_COUNT
            )];
          } else {
            snake = growSnake(snake);

            // Combo
            if (now - combo.lastEatTime < COMBO_TIMEOUT) {
              combo.count++;
            } else {
              combo.count = 1;
            }
            combo.lastEatTime = now;
            combo.maxCombo = Math.max(combo.maxCombo, combo.count);

            const baseScore = eatenFood.type === 'golden' ? GOLDEN_FOOD_SCORE : FOOD_SCORE;
            const earnedScore = calculateScore(baseScore, combo.count, hasDouble);
            stats.score += earnedScore;
            stats.foodEaten++;
            if (eatenFood.type === 'golden') stats.goldenFoodEaten++;

            const particleColor = eatenFood.type === 'golden' ? '#fbbf24' : '#ef4444';
            const particleCount = eatenFood.type === 'golden' ? GOLDEN_EAT_PARTICLE_COUNT : EAT_PARTICLE_COUNT;
            particles = [...particles, ...createEatParticles(
              eatenFood.pos, state.cellSize, particleColor, particleCount
            )];

            foodEatenSinceLastPowerUp++;
            totalFoodEatenForGolden++;
          }

          stats.length = snake.segments.length;
          stats.maxCombo = combo.maxCombo;

          // Replenish food
          while (foods.filter(f => f.type === 'regular').length < REGULAR_FOOD_COUNT) {
            const newFood = spawnFood('regular', state.gridSize, snake, foods, powerUps, obstacles);
            if (newFood) foods.push(newFood);
            else break;
          }

          // Golden food
          if (totalFoodEatenForGolden >= GOLDEN_FOOD_INTERVAL && wave.hasGoldenFood) {
            const gf = spawnFood('golden', state.gridSize, snake, foods, powerUps, obstacles);
            if (gf) foods.push(gf);
            totalFoodEatenForGolden = 0;
          }

          // Poison food
          if (wave.hasPoisonFood && Math.random() < 0.15) {
            const pf = spawnFood('poison', state.gridSize, snake, foods, powerUps, obstacles);
            if (pf) foods.push(pf);
          }

          // Power-up spawning
          if (shouldSpawnPowerUp(foodEatenSinceLastPowerUp)) {
            const puType = getRandomPowerUpType(state.difficulty);
            const pu = spawnPowerUp(puType, state.gridSize, snake, foods, powerUps, obstacles);
            if (pu) powerUps.push(pu);
            foodEatenSinceLastPowerUp = 0;
          }

          // Wave check
          const newWave = getWaveForFoodCount(stats.foodEaten);
          if (newWave.number !== wave.number) {
            wave = newWave;
            stats.waveReached = wave.number;
            if (wave.hasObstacles) {
              obstacles = generateObstacles(wave, state.gridSize, snake);
            }
          }
        }
      }

      // Check power-up collision
      if (snake.alive) {
        const eatenPU = checkPowerUpCollision(snake, powerUps);
        if (eatenPU) {
          powerUps = powerUps.filter(p => p.id !== eatenPU.id);
          const duration = POWERUP_DURATIONS[eatenPU.type] || 10000;
          // Replace existing of same type
          activePowerUps = activePowerUps.filter(p => p.type !== eatenPU.type);
          activePowerUps.push({ type: eatenPU.type, remainingMs: duration, totalMs: duration });
          stats.powerupsCollected++;
          particles = [...particles, ...createEatParticles(
            eatenPU.pos, state.cellSize, '#fbbf24', 12
          )];
        }
      }
    }

    // Update time survived
    stats.timeSurvived = (now - state.gameStartTime) / 1000;

    set({
      snake,
      foods,
      powerUps,
      activePowerUps,
      particles,
      obstacles,
      combo,
      stats,
      wave,
      moveTimer,
      foodEatenSinceLastPowerUp,
      totalFoodEatenForGolden,
      screenShake,
      isTransitioning,
      lastUpdateTime: now,
    });

    // If dead, transition to game over after a delay
    if (!snake.alive) {
      setTimeout(() => {
        get().endGame();
      }, 1500);
    }
  },

  endGame: () => {
    const state = get();
    const persisted = loadPersistedData();

    // Update persisted stats
    const newStats = {
      totalGames: persisted.stats.totalGames + 1,
      totalScore: persisted.stats.totalScore + state.stats.score,
      totalFoodEaten: persisted.stats.totalFoodEaten + state.stats.foodEaten,
      bestCombo: Math.max(persisted.stats.bestCombo, state.stats.maxCombo),
      totalPlayTime: persisted.stats.totalPlayTime + state.stats.timeSurvived,
    };
    savePersistedData({ stats: newStats });

    set({
      screen: 'gameover',
      persistedStats: newStats,
    });
  },

  loadPersisted: () => {
    const data = loadPersistedData();
    set({
      highScores: data.highScores,
      persistedStats: data.stats,
      playerName: data.lastPlayer.name,
      snakeColor: data.lastPlayer.color,
      difficulty: data.lastPlayer.difficulty,
      language: data.settings.language,
      musicVolume: data.settings.musicVolume,
      sfxVolume: data.settings.sfxVolume,
      musicEnabled: data.settings.musicVolume > 0,
      sfxEnabled: data.settings.sfxVolume > 0,
    });
  },

  addHighScore: (entry) => {
    const persisted = loadPersistedData();
    const scores = [...persisted.highScores, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    savePersistedData({ highScores: scores });
    set({ highScores: scores });
  },

  isNewHighScore: (score) => {
    const state = get();
    if (state.highScores.length < 10) return score > 0;
    return score > (state.highScores[state.highScores.length - 1]?.score ?? 0);
  },
}));
