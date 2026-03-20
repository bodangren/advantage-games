import type { Difficulty } from '@/store/useGameStore'

export type SpellweaversRunDifficulty = Difficulty

export type DifficultyConfig = {
  name: string
  scrollSpeed: number
  spawnInterval: number
  maxWords: number
}

export const GAME_WIDTH = 390
export const GAME_HEIGHT = 600

export const SPELLWEAVERS_RUN_CONFIG = {
  laneCount: 3,
  scrollSpeed: {
    easy: 60,
    normal: 90,
    hard: 120,
    extreme: 150,
  },
  spawnInterval: {
    easy: 2000,
    normal: 1500,
    hard: 1000,
    extreme: 700,
  },
  collectionZoneHeight: 80,
  initialMana: 100,
  wrongWordPenalty: 20,
  xpPerSentence: 2,
  xpPerCorrectWord: 1,
  comboMultiplier: 0.1,
  orbRadius: 30,
  orbSpacing: 20,
  scrollHeight: 60,
  difficulties: {
    easy: {
      name: 'Whisper Woods',
      scrollSpeed: 60,
      spawnInterval: 2000,
      maxWords: 4,
    },
    normal: {
      name: 'Mystic Mountain',
      scrollSpeed: 90,
      spawnInterval: 1500,
      maxWords: 6,
    },
    hard: {
      name: 'Void Passage',
      scrollSpeed: 120,
      spawnInterval: 1000,
      maxWords: 8,
    },
    extreme: {
      name: 'Void Passage Extreme',
      scrollSpeed: 150,
      spawnInterval: 700,
      maxWords: 10,
    },
  },
}

export function getDifficultyConfig(difficulty: SpellweaversRunDifficulty): DifficultyConfig {
  return SPELLWEAVERS_RUN_CONFIG.difficulties[difficulty] ?? SPELLWEAVERS_RUN_CONFIG.difficulties.normal
}
