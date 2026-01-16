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
  const initialWords = spawnWords(targetItem, vocabulary)
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

export function spawnWords(target: VocabularyItem, allVocabulary: VocabularyItem[]): Word[] {
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