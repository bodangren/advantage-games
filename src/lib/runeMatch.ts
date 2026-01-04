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
}

export type RuneMatchConfig = {
  rng?: () => number
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
  }
}
