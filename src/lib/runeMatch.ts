import type { VocabularyItem } from '@/store/useGameStore'
import { RUNE_MATCH_CONFIG, type MonsterType } from './runeMatchConfig'

export type GridPosition = {
  row: number
  col: number
}

export type VocabularyRune = {
  id: string
  type: 'vocabulary'
  word: string
  translation: string
}

export type PowerUpRune = {
  id: string
  type: 'heal' | 'shield'
}

export type Rune = VocabularyRune | PowerUpRune

export type Player = {
  hp: number
  maxHp: number
  hasShield: boolean
}

export type Monster = {
  type: MonsterType
  hp: number
  maxHp: number
  attack: number
  xp: number
}

export type RuneMatchState = {
  status: 'selection' | 'playing' | 'victory' | 'defeat'
  selectedMonster: MonsterType | null
  player: Player
  monster: Monster | null
  grid: Rune[][]
  selectedCell: GridPosition | null
  attackTimer: number
  powerWord: string | null
  correctAnswers: number
  totalAttempts: number
  vocabulary: VocabularyItem[]
  rng: () => number
}

export type RuneMatchConfig = {
  rng?: () => number
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const initializeGrid = (
  vocabulary: VocabularyItem[],
  { rng = Math.random }: RuneMatchConfig = {}
): Rune[][] => {
  const { rows, columns } = RUNE_MATCH_CONFIG.grid
  const grid: Rune[][] = Array.from({ length: rows }, () => [])

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let validRune: Rune | null = null
      let attempts = 0
      
      while (!validRune && attempts < 100) {
        attempts++
        const rune = createRandomRune(vocabulary, rng)
        
        // Check for matches
        if (rune.type === 'vocabulary') {
          const hasHorizontalMatch = c >= 2 && 
            grid[r][c-1].type === 'vocabulary' && (grid[r][c-1] as VocabularyRune).translation === rune.translation &&
            grid[r][c-2].type === 'vocabulary' && (grid[r][c-2] as VocabularyRune).translation === rune.translation
          
          const hasVerticalMatch = r >= 2 && 
            grid[r-1][c].type === 'vocabulary' && (grid[r-1][c] as VocabularyRune).translation === rune.translation &&
            grid[r-2][c].type === 'vocabulary' && (grid[r-2][c] as VocabularyRune).translation === rune.translation
            
          if (!hasHorizontalMatch && !hasVerticalMatch) {
            validRune = rune
          }
        } else {
          // Power-ups don't match, so they are always valid during initialization
          validRune = rune
        }
      }
      
      grid[r][c] = validRune || createRandomRune(vocabulary, rng) // Fallback if stuck
    }
  }

  return grid
}

const createRandomRune = (vocabulary: VocabularyItem[], rng: () => number): Rune => {
  const roll = rng()
  const { spawnRate } = RUNE_MATCH_CONFIG.powerUps

  if (roll < spawnRate) {
    // Spawn power-up
    return {
      id: generateId(),
      type: rng() > 0.5 ? 'heal' : 'shield'
    }
  }

  // Spawn vocabulary rune
  const index = Math.floor(rng() * vocabulary.length)
  const item = vocabulary[index]
  return {
    id: generateId(),
    type: 'vocabulary',
    word: item.term,
    translation: item.translation
  }
}

export const createRuneMatchState = (
  vocabulary: VocabularyItem[],
  { rng = Math.random }: RuneMatchConfig = {}
): RuneMatchState => {
  if (vocabulary.length === 0) {
    throw new Error('Vocabulary cannot be empty')
  }

  return {
    status: 'selection',
    selectedMonster: null,
    player: {
      hp: RUNE_MATCH_CONFIG.player.maxHp,
      maxHp: RUNE_MATCH_CONFIG.player.maxHp,
      hasShield: false,
    },
    monster: null,
    grid: [],
    selectedCell: null,
    attackTimer: 0,
    powerWord: null,
    correctAnswers: 0,
    totalAttempts: 0,
    vocabulary,
    rng,
  }
}
