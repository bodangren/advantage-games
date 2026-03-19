import type { VocabularyItem } from '@/store/useGameStore'
import type { Difficulty } from '@/store/useGameStore'
import { SPELLWEAVERS_RUN_CONFIG, GAME_WIDTH, GAME_HEIGHT } from './spellweaversRunConfig'

export type Lane = 'left' | 'center' | 'right'

export type GameStatus = 'start' | 'playing' | 'victory' | 'defeat'

export type WordOrb = {
  id: string
  word: string
  orderIndex: number
  lane: Lane
  y: number
  collected: boolean
}

export type SpellweaversRunState = {
  status: GameStatus
  difficulty: Difficulty
  mana: number
  score: number
  combo: number
  collectedWords: string[]
  targetIndex: number
  orbs: WordOrb[]
  currentSentence: VocabularyItem
  words: string[]
  correctAnswers: number
  totalAttempts: number
  sentencesCompleted: number
  gameTime: number
  spawnTimer: number
}

export type SpellweaversRunConfig = {
  difficulty?: Difficulty
  rng?: () => number
}

export function createSpellweaversRunState(
  vocabulary: VocabularyItem[],
  config: SpellweaversRunConfig = {}
): SpellweaversRunState {
  if (vocabulary.length === 0) {
    throw new Error('Vocabulary cannot be empty')
  }

  const rng = config.rng ?? Math.random
  const difficulty = config.difficulty ?? 'normal'

  const sentenceIndex = Math.floor(rng() * vocabulary.length)
  const currentSentence = vocabulary[sentenceIndex]
  const words = currentSentence.term.split(' ')

  return {
    status: 'playing',
    difficulty,
    mana: SPELLWEAVERS_RUN_CONFIG.initialMana,
    score: 0,
    combo: 0,
    collectedWords: [],
    targetIndex: 0,
    orbs: [],
    currentSentence,
    words,
    correctAnswers: 0,
    totalAttempts: 0,
    sentencesCompleted: 0,
    gameTime: 0,
    spawnTimer: 0,
  }
}
