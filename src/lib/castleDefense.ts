import type { VocabularyItem } from '@/store/useGameStore'
import { EnemyType, CASTLE_DEFENSE_CONFIG } from './castleDefenseConfig'

// --- Constants & Config ---

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const TILE_SIZE = 50 // Visual reference for grid alignment
export const PLAYER_RADIUS = 20
export const ENEMY_RADIUS = 15
export const TOWER_RADIUS = 30
export const WORD_RADIUS = 20
export const PROJECTILE_RADIUS = 5

export const PLAYER_SPEED = 4
export const BASE_ENEMY_SPEED = 1.5
export const PROJECTILE_SPEED = 8

// --- Types ---

export type Point = {
  x: number
  y: number
}

export type Entity = Point & {
  id: string
  radius: number
}

export type Player = Entity & {
  speed: number
  inventory: Word[] // Words currently carried by the player
}

export type Word = Entity & {
  text: string
  translation: string // The translation this word belongs to
  originalIndex: number // Position in the correct sentence (0, 1, 2...)
  isDistractor: boolean
  isCollected: boolean
}

export type Enemy = Entity & {
  type: EnemyType
  hp: number
  maxHp: number
  speed: number
  pathIndex: number 
  distanceTraveled: number
}

export type Tower = Entity & {
  range: number
  damage: number
  cooldown: number // ms between shots
  lastFired: number // Game time ms
  targetId?: string // ID of currently targeted enemy
}

export type Projectile = Entity & {
  targetId: string // Homing missile logic
  damage: number
  speed: number
}

export type GameEvent = {
  type: 'damage' | 'build' | 'erupt' | 'hit'
  id: number // Unique ID to trigger effects
  x?: number
  y?: number
}

export type CastleDefenseState = {
  status: 'idle' | 'playing' | 'gameover' | 'victory' | 'cooldown'
  
  // Map Data
  grassMap: number[][] // 16x12 array of grass variant indices (0-3)

  // Entities
  player: Player
  enemies: Enemy[]
  towers: Tower[]
  words: Word[] 
  projectiles: Projectile[]
  
  // Game Logic
  vocabulary: VocabularyItem[]
  targetSentence: string 
  targetTranslation: string 
  hearts: number 
  score: number
  wave: number
  
  // Wave Logic
  waveBudget: number
  spawnQueue: EnemyType[]
  waveCooldownTimer: number
  
  // Timers
  gameTime: number
  spawnTimer: number
  
  // Events
  lastEvent: GameEvent | null
}

export type MapConfig = {
  path: Point[] // Array of waypoints for enemies to follow
  towerSlots: Point[] // Locations where towers can be built
  spawnPoint: Point // Where enemies appear
  basePoint: Point // The "House" to defend
  wordField: { // Area where words spawn
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

// --- Initial State Factory ---

export const INITIAL_HEARTS = 5

export const MAP_CONFIG: MapConfig = {
  // Simple "U" shape path for now
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
    { x: 175, y: 175 }, // Inner defense
    { x: 625, y: 175 },
  ],
  wordField: {
    minX: 200,
    maxX: 600,
    minY: 100,
    maxY: 300,
  }
}

export type RoadInfo = {
  type: 'EW' | 'NS' | 'CORNER'
  rotation: number
}

/**
 * Returns road tile information for a given grid coordinate.
 * Grid coordinates are 0-indexed (0-15 for X, 0-11 for Y).
 */
export function getRoadTileInfo(gridX: number, gridY: number): RoadInfo | null {
  const worldX = gridX * TILE_SIZE + TILE_SIZE / 2
  const worldY = gridY * TILE_SIZE + TILE_SIZE / 2

  // 1. Identify if this point is on any path segment
  let segmentIndex = -1
  for (let i = 0; i < MAP_CONFIG.path.length - 1; i++) {
    const p1 = MAP_CONFIG.path[i]
    const p2 = MAP_CONFIG.path[i + 1]
    
    const minX = Math.min(p1.x, p2.x)
    const maxX = Math.max(p1.x, p2.x)
    const minY = Math.min(p1.y, p2.y)
    const maxY = Math.max(p1.y, p2.y)

    if (worldX >= minX && worldX <= maxX && worldY >= minY && worldY <= maxY) {
      segmentIndex = i
      // Keep checking because it might be a corner (belongs to two segments)
    }
  }

  if (segmentIndex === -1) return null

  // 2. Check if it's a corner
  const cornerIndex = MAP_CONFIG.path.findIndex(p => p.x === worldX && p.y === worldY)
  
  if (cornerIndex !== -1 && cornerIndex > 0 && cornerIndex < MAP_CONFIG.path.length - 1) {
    const prev = MAP_CONFIG.path[cornerIndex - 1]
    const curr = MAP_CONFIG.path[cornerIndex]
    const next = MAP_CONFIG.path[cornerIndex + 1]

    const dx1 = Math.sign(prev.x - curr.x)
    const dy1 = Math.sign(prev.y - curr.y)
    const dx2 = Math.sign(next.x - curr.x)
    const dy2 = Math.sign(next.y - curr.y)

    // Directions relative to curr:
    // dy -1 = North, dy 1 = South, dx 1 = East, dx -1 = West
    const dirs = new Set([`${dx1},${dy1}`, `${dx2},${dy2}`])

    // road_corner.png default: West (-1,0) and South (0,1)
    if (dirs.has('-1,0') && dirs.has('0,1')) return { type: 'CORNER', rotation: 0 }
    if (dirs.has('0,-1') && dirs.has('-1,0')) return { type: 'CORNER', rotation: 90 }
    if (dirs.has('1,0') && dirs.has('0,-1')) return { type: 'CORNER', rotation: 180 }
    if (dirs.has('0,1') && dirs.has('1,0')) return { type: 'CORNER', rotation: 270 }
    
    return { type: 'CORNER', rotation: 0 } // Fallback
  }

  // 3. If not corner, it's straight
  const p1 = MAP_CONFIG.path[segmentIndex]
  const p2 = MAP_CONFIG.path[segmentIndex + 1]
  
  if (p1.x === p2.x) return { type: 'NS', rotation: 0 }
  return { type: 'EW', rotation: 0 }
}


export const createCastleDefenseState = (
  vocabulary: VocabularyItem[],
  config: Partial<CastleDefenseState> = {}
): CastleDefenseState => {
  // Fallback if no vocab provided (should be handled by caller)
  const fallbackVocab = { term: 'Welcome', translation: 'Bienvenue' }
  const targetItem = vocabulary.length > 0 ? vocabulary[0] : fallbackVocab
  
  const player: Player = {
    id: 'player',
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    radius: PLAYER_RADIUS,
    speed: PLAYER_SPEED,
    inventory: [],
  }

  const initialState: CastleDefenseState = {
    status: 'idle',
    grassMap: Array.from({ length: 12 }, () => 
        Array.from({ length: 16 }, () => Math.floor(Math.random() * 4))
    ),
    player,
    enemies: [],
    towers: [], // Starts empty
    words: [], // Will be spawned by game loop
    projectiles: [],
    vocabulary,
    targetSentence: targetItem.term,
    targetTranslation: targetItem.translation,
    hearts: INITIAL_HEARTS,
    score: 0,
    wave: 1,
    waveBudget: CASTLE_DEFENSE_CONFIG.WAVE.INITIAL_BUDGET,
    spawnQueue: generateSpawnQueue(CASTLE_DEFENSE_CONFIG.WAVE.INITIAL_BUDGET),
    waveCooldownTimer: 0,
    gameTime: 0,
    spawnTimer: 0,
    lastEvent: null,
    ...config,
  }
  
  // Initial Spawn
  const initialWords = spawnWords(targetItem)
  return {
      ...initialState,
      words: initialWords
  }
}

// Helper to generate queue based on budget
export function generateSpawnQueue(budget: number): EnemyType[] {
    const queue: EnemyType[] = []
    let remaining = budget
    const { SOLDIER, TANK, BOSS } = CASTLE_DEFENSE_CONFIG.ENEMIES

    // Simple Algorithm:
    // 1. If budget > 100, buy a BOSS.
    // 2. Buy Tanks with 40% of remaining budget.
    // 3. Fill rest with Soldiers.
    
    while(remaining >= BOSS.cost && remaining > 100) {
        queue.push('BOSS')
        remaining -= BOSS.cost
    }

    // Tanks
    const tankBudget = remaining * 0.4
    let tankSpend = 0
    while(tankSpend < tankBudget && remaining >= TANK.cost) {
        queue.push('TANK')
        remaining -= TANK.cost
        tankSpend += TANK.cost
    }

    // Soldiers
    while(remaining >= SOLDIER.cost) {
        queue.push('SOLDIER')
        remaining -= SOLDIER.cost
    }

    // Shuffle queue for variety
    return queue.sort(() => Math.random() - 0.5)
}

export function spawnWords(target: VocabularyItem): Word[] {
    const words: Word[] = []
    const sentenceParts = target.term.split(' ')
    
    // 1. Add Correct Words
    sentenceParts.forEach((part, index) => {
        words.push({
            id: `word-${index}-${Date.now()}`,
            x: 0, // Assigned below
            y: 0,
            radius: WORD_RADIUS,
            text: part,
            translation: target.translation,
            originalIndex: index,
            isDistractor: false,
            isCollected: false
        })
    })

    // 2. Assign Non-Overlapping Positions using a Grid
    const field = MAP_CONFIG.wordField
    const padding = 20
    const cellSize = (WORD_RADIUS * 2) + padding
    
    const cols = Math.floor((field.maxX - field.minX) / cellSize)
    const rows = Math.floor((field.maxY - field.minY) / cellSize)
    
    const availableCells: {r: number, c: number}[] = []
    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            availableCells.push({r, c})
        }
    }

    // Shuffle cells
    availableCells.sort(() => Math.random() - 0.5)

    words.forEach((w, i) => {
        const cell = availableCells[i % availableCells.length]
        w.x = field.minX + cell.c * cellSize + cellSize / 2
        w.y = field.minY + cell.r * cellSize + cellSize / 2
    })

    return words
}
