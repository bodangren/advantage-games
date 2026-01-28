// Game world dimensions (MUST match Wizard vs Zombie)
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const TILE_SIZE = 50

// Player constants
export const PLAYER_RADIUS = 20
export const PLAYER_SPEED = 3

// Enemy constants
export const ENEMY_SOLDIER_RADIUS = 12
export const ENEMY_SOLDIER_HP = 30
export const ENEMY_SOLDIER_SPEED = 1.5

export const ENEMY_TANK_RADIUS = 18
export const ENEMY_TANK_HP = 80
export const ENEMY_TANK_SPEED = 0.8

export const ENEMY_BOSS_RADIUS = 25
export const ENEMY_BOSS_HP = 200
export const ENEMY_BOSS_SPEED = 0.5

// Tower constants
export const TOWER_RANGE = 150
export const TOWER_FIRE_RATE_MS = 1000
export const TOWER_DAMAGE = 10

// Projectile constants
export const PROJECTILE_RADIUS = 5
export const PROJECTILE_SPEED = 8

// Word orb constants
export const WORD_RADIUS = 25

// Base constants
export const BASE_HP = 100
export const BASE_RADIUS = 40

// Timing constants (CRITICAL - must match Wizard)
export const GAME_TICK_MS = 50
export const SPAWN_RATE_MS = 2000
export const MAX_ENEMIES = 15

// Animation timing
export const ANIMATION_FRAME_MS = 150

// --- Types ---

// Base entity type (same pattern as Wizard)
export type Entity = {
  id: string
  x: number
  y: number
  radius: number
}

// Player type
export type Player = Entity & {
  speed: number
  inventory: string[]  // collected word translations
}

// Enemy types
export type EnemyType = 'soldier' | 'tank' | 'boss'

export type Enemy = Entity & {
  type: EnemyType
  hp: number
  maxHp: number
  speed: number
  waypointIndex: number
}

// Tower types
export type Tower = Entity & {
  isActive: boolean
  targetWord: string
  range: number
  lastFired: number
  damage: number
}

export type TowerSlot = Entity & {
  targetWord: string
}

// Projectile type
export type Projectile = Entity & {
  targetId: string
  speed: number
  damage: number
}

// Word orb type
export type Word = Entity & {
  term: string
  translation: string
  isCorrect: boolean
  isCollected: boolean
}

// Base type
export type Base = {
  x: number
  y: number
  hp: number
  maxHp: number
  radius: number
}

// Waypoint for enemy path
export type Waypoint = {
  x: number
  y: number
}

export type MapConfig = {
  path: Waypoint[]
  towerSlots: Waypoint[]
  spawnPoint: Waypoint
  basePoint: Waypoint
  wordField: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

// Main game state type
export type CastleDefenseState = {
  status: 'playing' | 'gameover' | 'victory'
  player: Player
  enemies: Enemy[]
  towers: Tower[]
  towerSlots: TowerSlot[]
  projectiles: Projectile[]
  words: Word[]
  base: Base
  path: Waypoint[]
  score: number
  wave: number
  spawnTimer: number
  gameTime: number
  targetWord: string  // current word player should collect
}

// Input state type (matches Wizard)
export type InputState = {
  dx: number
  dy: number
  drop?: boolean
}

// --- Factory Functions ---

// Helper to generate unique IDs
const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const MAP_CONFIG: MapConfig = {
  path: [
    { x: 75, y: 75 },
    { x: 75, y: 525 },
    { x: 725, y: 525 },
    { x: 725, y: 75 },
  ],
  spawnPoint: { x: 75, y: 75 },
  basePoint: { x: 725, y: 75 },
  towerSlots: [
    { x: 175, y: 425 },
    { x: 325, y: 425 },
    { x: 475, y: 425 },
    { x: 625, y: 425 },
    { x: 175, y: 175 },
    { x: 625, y: 175 },
  ],
  wordField: {
    minX: 200,
    maxX: 600,
    minY: 100,
    maxY: 300,
  },
}

// Default path from top-left to center (enemies follow this)
const DEFAULT_PATH: Waypoint[] = [
  { x: 0, y: 100 },      // Spawn point (off-screen left)
  { x: 200, y: 100 },    // First waypoint
  { x: 200, y: 300 },    // Turn down
  { x: 400, y: 300 },    // Move right to center
]

// Default tower slots
const DEFAULT_TOWER_SLOTS: TowerSlot[] = [
  { id: 'slot-1', x: 150, y: 200, radius: 30, targetWord: '' },
  { id: 'slot-2', x: 300, y: 150, radius: 30, targetWord: '' },
  { id: 'slot-3', x: 300, y: 450, radius: 30, targetWord: '' },
  { id: 'slot-4', x: 500, y: 200, radius: 30, targetWord: '' },
]

// Create initial game state
export function createInitialState(vocabulary: { term: string; translation: string }[]): CastleDefenseState {
  // Pick a random target word
  const targetItem = vocabulary.length > 0
    ? vocabulary[Math.floor(Math.random() * vocabulary.length)]
    : { term: 'default', translation: 'default' }

  // Assign target words to tower slots
  const towerSlots = DEFAULT_TOWER_SLOTS.map((slot, i) => ({
    ...slot,
    targetWord: vocabulary[i % vocabulary.length]?.translation || 'word'
  }))

  return {
    status: 'playing',
    player: {
      id: 'player',
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 100,
      radius: PLAYER_RADIUS,
      speed: PLAYER_SPEED,
      inventory: [],
    },
    enemies: [],
    towers: [],
    towerSlots,
    projectiles: [],
    words: [],
    base: {
      x: 400,
      y: 300,
      hp: BASE_HP,
      maxHp: BASE_HP,
      radius: BASE_RADIUS,
    },
    path: DEFAULT_PATH,
    score: 0,
    wave: 1,
    spawnTimer: 0,
    gameTime: 0,
    targetWord: targetItem.translation,
  }
}
