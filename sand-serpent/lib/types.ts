// ============================================================
// Sand Serpent — Type Definitions
// ============================================================

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameScreen = 'splash' | 'menu' | 'setup' | 'game' | 'gameover';

export type Difficulty = 'casual' | 'normal' | 'hardcore';

export type Language = 'en' | 'ar';

export type SnakeColor =
  | 'emerald'
  | 'sapphire'
  | 'ruby'
  | 'amber'
  | 'violet'
  | 'cyan'
  | 'rose'
  | 'obsidian';

export type PowerUpType =
  | 'speed'
  | 'shield'
  | 'double'
  | 'magnet'
  | 'fire'
  | 'freeze';

export type FoodType = 'regular' | 'golden' | 'poison';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment {
  pos: Position;
  /** Interpolated position for smooth rendering */
  renderPos: Position;
}

export interface Snake {
  segments: SnakeSegment[];
  direction: Direction;
  nextDirection: Direction;
  speed: number;
  alive: boolean;
  shieldActive: boolean;
  fireActive: boolean;
  tongueTimer: number;
  eyeDirection: Direction;
}

export interface Food {
  pos: Position;
  type: FoodType;
  bobOffset: number;
  spawnTime: number;
  id: string;
}

export interface PowerUp {
  pos: Position;
  type: PowerUpType;
  id: string;
  spawnTime: number;
  rotationAngle: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingMs: number;
  totalMs: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'burst' | 'trail' | 'ambient' | 'sparkle' | 'fire' | 'ice';
}

export interface WaveInfo {
  number: number;
  name: string;
  nameAr: string;
  speedMultiplier: number;
  hasGoldenFood: boolean;
  hasPoisonFood: boolean;
  hasObstacles: boolean;
  hasMovingObstacles: boolean;
  sandParticles: boolean;
}

export interface Obstacle {
  pos: Position;
  moving: boolean;
  moveDirection?: Direction;
}

export interface ComboState {
  count: number;
  lastEatTime: number;
  maxCombo: number;
}

export interface GameStats {
  score: number;
  length: number;
  foodEaten: number;
  goldenFoodEaten: number;
  poisonFoodEaten: number;
  powerupsCollected: number;
  maxCombo: number;
  waveReached: number;
  timeSurvived: number;
}

export interface GameState {
  screen: GameScreen;
  snake: Snake;
  foods: Food[];
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
  particles: Particle[];
  obstacles: Obstacle[];
  combo: ComboState;
  stats: GameStats;
  wave: WaveInfo;
  gridSize: number;
  cellSize: number;
  isPaused: boolean;
  isTransitioning: boolean;
  gameStartTime: number;
  lastUpdateTime: number;
  moveTimer: number;
  foodEatenSinceLastPowerUp: number;
  totalFoodEatenForGolden: number;
  screenShake: { intensity: number; duration: number };

  // Player settings
  playerName: string;
  snakeColor: SnakeColor;
  difficulty: Difficulty;
  language: Language;

  // Audio
  musicVolume: number;
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface HighScoreEntry {
  name: string;
  score: number;
  date: string;
  color: SnakeColor;
  wave: number;
  length: number;
}

export interface PersistedData {
  highScores: HighScoreEntry[];
  settings: {
    musicVolume: number;
    sfxVolume: number;
    language: Language;
  };
  lastPlayer: {
    name: string;
    color: SnakeColor;
    difficulty: Difficulty;
  };
  stats: {
    totalGames: number;
    totalScore: number;
    totalFoodEaten: number;
    bestCombo: number;
    totalPlayTime: number;
  };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  glow: string;
  dark: string;
  light: string;
}

export type SoundEffect =
  | 'eat_food'
  | 'eat_golden'
  | 'eat_poison'
  | 'powerup_get'
  | 'powerup_end'
  | 'shield_break'
  | 'combo_x5'
  | 'combo_break'
  | 'wall_hit'
  | 'game_over'
  | 'new_record'
  | 'wave_start'
  | 'button_click'
  | 'button_hover'
  | 'snake_turn'
  | 'countdown';
