import type { VocabularyItem } from '@/store/useGameStore'

// --- Constants & Config ---

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const TILE_SIZE = 64 // Visual reference for grid alignment
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
  hp: number
  maxHp: number
  speed: number
  pathIndex: number // Current index in the map's path array
  distanceTraveled: number // For sorting/targeting logic
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

export type CastleDefenseState = {
  status: 'playing' | 'gameover' | 'victory'
  
  // Entities
  player: Player
  enemies: Enemy[]
  towers: Tower[]
  words: Word[] // Words on the field
  projectiles: Projectile[]
  
  // Game Logic
  vocabulary: VocabularyItem[]
  targetSentence: string // The full sentence to assemble
  targetTranslation: string // The hint shown to the user
  hearts: number // Base health
  score: number
  wave: number
  
  // Timers
  gameTime: number
  spawnTimer: number
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
    { x: 50, y: 50 },
    { x: 50, y: 500 },
    { x: 750, y: 500 },
    { x: 750, y: 50 },
  ],
  spawnPoint: { x: 50, y: 50 },
  basePoint: { x: 750, y: 50 },
  towerSlots: [
    { x: 150, y: 400 },
    { x: 300, y: 400 },
    { x: 450, y: 400 },
    { x: 600, y: 400 },
    { x: 150, y: 200 }, // Inner defense
    { x: 600, y: 200 },
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

  return {
    status: 'playing',
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
    gameTime: 0,
    spawnTimer: 0,
    ...config,
  }
  
  // Initial Spawn
  const initialWords = spawnWords(targetItem, vocabulary)
  return {
      ...initialState,
      words: initialWords
  }
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

    // 2. Add Distractors (Targeting ~3-5 extra words)
    // Filter out the current item to avoid duplicates if possible
    const otherVocab = allVocabulary.filter(v => v.term !== target.term)
    const distractorCount = Math.max(3, Math.min(5, otherVocab.length))
    
    for (let i = 0; i < distractorCount; i++) {
        // Pick random vocab
        const vocabIndex = Math.floor(Math.random() * otherVocab.length)
        const vocab = otherVocab[vocabIndex]
        if (!vocab) continue;
        
        // Pick random word from that vocab
        const parts = vocab.term.split(' ')
        const part = parts[Math.floor(Math.random() * parts.length)]
        
        words.push({
            id: `distractor-${i}-${Date.now()}`,
            x: 0, 
            y: 0,
            radius: WORD_RADIUS,
            text: part,
            translation: vocab.translation,
            originalIndex: -1,
            isDistractor: true,
            isCollected: false
        })
    }

    // 3. Assign Random Positions in Field
    // Simple collision avoidance could be added, but for MVP just random
    words.forEach(w => {
        w.x = MAP_CONFIG.wordField.minX + Math.random() * (MAP_CONFIG.wordField.maxX - MAP_CONFIG.wordField.minX)
        w.y = MAP_CONFIG.wordField.minY + Math.random() * (MAP_CONFIG.wordField.maxY - MAP_CONFIG.wordField.minY)
    })

    return words
}
