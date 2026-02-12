// ============================================================
// Sand Serpent — Core Game Engine (Pure Functions)
// ============================================================

import type {
  Direction,
  Difficulty,
  Food,
  FoodType,
  GameState,
  Obstacle,
  Particle,
  Position,
  PowerUp,
  PowerUpType,
  Snake,
  SnakeSegment,
  WaveInfo,
} from './types';
import {
  COMBO_TIMEOUT,
  FOOD_SCORE,
  GOLDEN_FOOD_INTERVAL,
  GOLDEN_FOOD_SCORE,
  GRID_SIZES,
  INITIAL_SNAKE_LENGTH,
  MAGNET_RADIUS,
  MAX_PARTICLES,
  POISON_SEGMENT_LOSS,
  POWERUP_DURATIONS,
  POWERUP_SPAWN_MAX,
  POWERUP_SPAWN_MIN,
  REGULAR_FOOD_COUNT,
  SNAKE_BASE_SPEED,
  SPEED_BOOST_MULTIPLIER,
  WAVES,
  FOOD_PER_WAVE,
  DIFFICULTY_CONFIG,
  FREEZE_SLOW_FACTOR,
} from './constants';

let idCounter = 0;
function genId(): string {
  return `${++idCounter}_${Date.now()}`;
}

// ---- Direction Helpers ----

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export function isOpposite(a: Direction, b: Direction): boolean {
  return OPPOSITE_DIRECTIONS[a] === b;
}

// ---- Initialization ----

export function createInitialSnake(gridSize: number): Snake {
  const mid = Math.floor(gridSize / 2);
  const segments: SnakeSegment[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    const pos = { x: mid - i, y: mid };
    segments.push({ pos: { ...pos }, renderPos: { ...pos } });
  }
  return {
    segments,
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    speed: 1,
    alive: true,
    shieldActive: false,
    fireActive: false,
    tongueTimer: 0,
    eyeDirection: 'RIGHT',
  };
}

export function createInitialFoods(gridSize: number, snake: Snake, obstacles: Obstacle[]): Food[] {
  const foods: Food[] = [];
  for (let i = 0; i < REGULAR_FOOD_COUNT; i++) {
    const pos = getRandomEmptyPosition(gridSize, snake, foods, [], obstacles);
    if (pos) {
      foods.push({
        pos,
        type: 'regular',
        bobOffset: Math.random() * Math.PI * 2,
        spawnTime: Date.now(),
        id: genId(),
      });
    }
  }
  return foods;
}

export function getRandomEmptyPosition(
  gridSize: number,
  snake: Snake,
  foods: Food[],
  powerUps: PowerUp[],
  obstacles: Obstacle[],
): Position | null {
  const occupied = new Set<string>();
  snake.segments.forEach(s => occupied.add(`${s.pos.x},${s.pos.y}`));
  foods.forEach(f => occupied.add(`${f.pos.x},${f.pos.y}`));
  powerUps.forEach(p => occupied.add(`${p.pos.x},${p.pos.y}`));
  obstacles.forEach(o => occupied.add(`${o.pos.x},${o.pos.y}`));

  const empty: Position[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

// ---- Movement ----

export function moveSnake(snake: Snake, gridSize: number): Snake {
  const dir = snake.nextDirection;
  const vec = DIRECTION_VECTORS[dir];
  const head = snake.segments[0];
  const newHeadPos: Position = {
    x: head.pos.x + vec.x,
    y: head.pos.y + vec.y,
  };

  const newSegments: SnakeSegment[] = [
    { pos: newHeadPos, renderPos: { ...head.pos } },
    ...snake.segments.slice(0, -1).map(s => ({
      pos: { ...s.pos },
      renderPos: { ...s.renderPos },
    })),
  ];

  return {
    ...snake,
    segments: newSegments,
    direction: dir,
    eyeDirection: dir,
  };
}

export function growSnake(snake: Snake): Snake {
  const tail = snake.segments[snake.segments.length - 1];
  return {
    ...snake,
    segments: [
      ...snake.segments,
      { pos: { ...tail.pos }, renderPos: { ...tail.renderPos } },
    ],
  };
}

export function shrinkSnake(snake: Snake, amount: number): Snake {
  const minLength = 2;
  const newLength = Math.max(minLength, snake.segments.length - amount);
  return {
    ...snake,
    segments: snake.segments.slice(0, newLength),
  };
}

// ---- Collision Detection ----

export function checkWallCollision(snake: Snake, gridSize: number): boolean {
  const head = snake.segments[0].pos;
  return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
}

export function checkSelfCollision(snake: Snake): boolean {
  const head = snake.segments[0].pos;
  return snake.segments.slice(1).some(s => s.pos.x === head.x && s.pos.y === head.y);
}

export function checkObstacleCollision(snake: Snake, obstacles: Obstacle[]): boolean {
  const head = snake.segments[0].pos;
  return obstacles.some(o => o.pos.x === head.x && o.pos.y === head.y);
}

export function checkFoodCollision(snake: Snake, foods: Food[]): Food | null {
  const head = snake.segments[0].pos;
  return foods.find(f => f.pos.x === head.x && f.pos.y === head.y) || null;
}

export function checkPowerUpCollision(snake: Snake, powerUps: PowerUp[]): PowerUp | null {
  const head = snake.segments[0].pos;
  return powerUps.find(p => p.pos.x === head.x && p.pos.y === head.y) || null;
}

// ---- Food Spawning ----

export function spawnFood(
  type: FoodType,
  gridSize: number,
  snake: Snake,
  foods: Food[],
  powerUps: PowerUp[],
  obstacles: Obstacle[],
): Food | null {
  const pos = getRandomEmptyPosition(gridSize, snake, foods, powerUps, obstacles);
  if (!pos) return null;
  return {
    pos,
    type,
    bobOffset: Math.random() * Math.PI * 2,
    spawnTime: Date.now(),
    id: genId(),
  };
}

// ---- Power-Up Spawning ----

export function getRandomPowerUpType(difficulty: Difficulty): PowerUpType {
  const types: PowerUpType[] = ['speed', 'double', 'magnet', 'fire', 'freeze'];
  if (DIFFICULTY_CONFIG[difficulty].hasShield) {
    types.push('shield');
  }
  return types[Math.floor(Math.random() * types.length)];
}

export function spawnPowerUp(
  type: PowerUpType,
  gridSize: number,
  snake: Snake,
  foods: Food[],
  powerUps: PowerUp[],
  obstacles: Obstacle[],
): PowerUp | null {
  const pos = getRandomEmptyPosition(gridSize, snake, foods, powerUps, obstacles);
  if (!pos) return null;
  return {
    pos,
    type,
    id: genId(),
    spawnTime: Date.now(),
    rotationAngle: 0,
  };
}

// ---- Magnet Effect ----

export function applyMagnetEffect(
  snake: Snake,
  foods: Food[],
  gridSize: number,
): Food[] {
  const head = snake.segments[0].pos;
  return foods.map(food => {
    const dx = food.pos.x - head.x;
    const dy = food.pos.y - head.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= MAGNET_RADIUS && dist > 0) {
      const moveX = dx > 0 ? -1 : dx < 0 ? 1 : 0;
      const moveY = dy > 0 ? -1 : dy < 0 ? 1 : 0;
      const newX = Math.max(0, Math.min(gridSize - 1, food.pos.x + moveX));
      const newY = Math.max(0, Math.min(gridSize - 1, food.pos.y + moveY));
      return { ...food, pos: { x: newX, y: newY } };
    }
    return food;
  });
}

// ---- Wave System ----

export function getWaveForFoodCount(totalFoodEaten: number): WaveInfo {
  const waveIndex = Math.min(
    Math.floor(totalFoodEaten / FOOD_PER_WAVE),
    WAVES.length - 1
  );
  return WAVES[waveIndex];
}

export function generateObstacles(wave: WaveInfo, gridSize: number, snake: Snake): Obstacle[] {
  if (!wave.hasObstacles) return [];
  const count = Math.min(wave.number - 9, 8); // 1-8 obstacles
  const obstacles: Obstacle[] = [];
  const occupied = new Set<string>();
  snake.segments.forEach(s => occupied.add(`${s.pos.x},${s.pos.y}`));

  // Keep center area clear
  const margin = 4;
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    while (attempts < 100) {
      const x = Math.floor(Math.random() * (gridSize - margin * 2)) + margin;
      const y = Math.floor(Math.random() * (gridSize - margin * 2)) + margin;
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        occupied.add(key);
        obstacles.push({
          pos: { x, y },
          moving: wave.hasMovingObstacles && Math.random() > 0.5,
          moveDirection: ['UP', 'DOWN', 'LEFT', 'RIGHT'][Math.floor(Math.random() * 4)] as Direction,
        });
        break;
      }
      attempts++;
    }
  }
  return obstacles;
}

export function moveObstacles(obstacles: Obstacle[], gridSize: number): Obstacle[] {
  return obstacles.map(obs => {
    if (!obs.moving || !obs.moveDirection) return obs;
    const vec = DIRECTION_VECTORS[obs.moveDirection];
    let newX = obs.pos.x + vec.x;
    let newY = obs.pos.y + vec.y;
    let newDir = obs.moveDirection;

    // Bounce off walls
    if (newX < 1 || newX >= gridSize - 1 || newY < 1 || newY >= gridSize - 1) {
      newDir = OPPOSITE_DIRECTIONS[obs.moveDirection];
      const bounceVec = DIRECTION_VECTORS[newDir];
      newX = obs.pos.x + bounceVec.x;
      newY = obs.pos.y + bounceVec.y;
    }

    return {
      ...obs,
      pos: { x: newX, y: newY },
      moveDirection: newDir,
    };
  });
}

// ---- Score Calculation ----

export function calculateScore(
  baseScore: number,
  comboCount: number,
  hasDoublePoints: boolean,
): number {
  const comboMultiplier = Math.max(1, comboCount);
  const doubleMultiplier = hasDoublePoints ? 2 : 1;
  return baseScore * comboMultiplier * doubleMultiplier;
}

// ---- Speed Calculation ----

export function calculateMoveInterval(
  difficulty: Difficulty,
  wave: WaveInfo,
  hasSpeedBoost: boolean,
  hasFreeze: boolean,
): number {
  let interval = SNAKE_BASE_SPEED[difficulty];
  interval = interval / wave.speedMultiplier;
  if (hasSpeedBoost) {
    interval = interval * (1 - SPEED_BOOST_MULTIPLIER);
  }
  if (hasFreeze) {
    interval = interval / FREEZE_SLOW_FACTOR;
  }
  return Math.max(40, interval);
}

// ---- Particle Creation ----

export function createEatParticles(
  pos: Position,
  cellSize: number,
  color: string,
  count: number,
): Particle[] {
  const particles: Particle[] = [];
  const cx = pos.x * cellSize + cellSize / 2;
  const cy = pos.y * cellSize + cellSize / 2;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      size: 2 + Math.random() * 3,
      color,
      alpha: 1,
      type: 'burst',
    });
  }
  return particles;
}

export function createDeathParticles(
  segments: { pos: Position }[],
  cellSize: number,
  color: string,
): Particle[] {
  const particles: Particle[] = [];
  const segCount = Math.min(segments.length, 20);
  for (let i = 0; i < segCount; i++) {
    const seg = segments[i];
    const cx = seg.pos.x * cellSize + cellSize / 2;
    const cy = seg.pos.y * cellSize + cellSize / 2;
    for (let j = 0; j < 3; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1,
        type: 'burst',
      });
    }
  }
  return particles;
}

export function createAmbientParticle(canvasWidth: number, canvasHeight: number): Particle {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.2 - Math.random() * 0.3,
    life: 1,
    maxLife: 1,
    size: 1 + Math.random() * 2,
    color: '#f5b74633',
    alpha: 0.3 + Math.random() * 0.3,
    type: 'ambient',
  };
}

export function updateParticles(particles: Particle[], dt: number): Particle[] {
  return particles
    .map(p => {
      const decay = p.type === 'ambient' ? 0.001 : 0.02;
      return {
        ...p,
        x: p.x + p.vx * dt * 60,
        y: p.y + p.vy * dt * 60,
        life: p.life - decay * dt * 60,
        alpha: p.type === 'ambient' ? p.alpha : p.life,
        vy: p.type === 'burst' ? p.vy + 0.02 * dt * 60 : p.vy,
      };
    })
    .filter(p => p.life > 0)
    .slice(0, MAX_PARTICLES);
}

// ---- Rating ----

export function getRating(score: number): { title: string; titleAr: string; icon: string } {
  const { SCORE_RATINGS } = require('./constants');
  let result = SCORE_RATINGS[0];
  for (const rating of SCORE_RATINGS) {
    if (score >= rating.min) result = rating;
  }
  return result;
}

// ---- Should spawn power-up ----

export function shouldSpawnPowerUp(foodEatenSinceLastPowerUp: number): boolean {
  const threshold = POWERUP_SPAWN_MIN + Math.floor(Math.random() * (POWERUP_SPAWN_MAX - POWERUP_SPAWN_MIN + 1));
  return foodEatenSinceLastPowerUp >= threshold;
}

// ---- Interpolation helpers ----

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpPos(a: Position, b: Position, t: number): Position {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}
