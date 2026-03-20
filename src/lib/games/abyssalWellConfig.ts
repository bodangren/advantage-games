import type { Difficulty } from '@/store/useGameStore'

export type AbyssalWellDifficulty = Difficulty

export type DifficultyConfig = {
  name: string
  wordCount: number
}

export type CreatureType = 'goblin-scout' | 'cave-spider' | 'shadow-demon'

export const ABYSSAL_WELL_CONFIG = {
  gameWidth: 390,
  gameHeight: 700,
  lanes: 8,
  rimRadius: 120,
  wellDepth: 5,

  player: {
    fireRate: 300,
    projectileSpeed: 400,
    radius: 18,
  },

  enemy: {
    baseSpeed: 50,
    spawnInterval: 2000,
    radius: 20,
    wordOrbRadius: 25,
  },

  creatureSpeeds: {
    'goblin-scout': 50,
    'cave-spider': 70,
    'shadow-demon': 90,
  },

  difficulties: {
    easy: { name: 'Shallow Well', wordCount: 4 },
    normal: { name: 'Deep Chasm', wordCount: 5 },
    hard: { name: 'Abyss', wordCount: 6 },
    extreme: { name: 'Abyss', wordCount: 7 },
  },

  lives: 3,

  xp: {
    perCorrectWord: 1,
    accuracyBonus: 1,
    maxXP: 10,
  },
}

export function getDifficultyConfig(difficulty: AbyssalWellDifficulty): DifficultyConfig {
  return ABYSSAL_WELL_CONFIG.difficulties[difficulty] ?? ABYSSAL_WELL_CONFIG.difficulties.normal
}

export function getCreatureSpeed(creatureType: CreatureType): number {
  return ABYSSAL_WELL_CONFIG.creatureSpeeds[creatureType] ?? ABYSSAL_WELL_CONFIG.creatureSpeeds['cave-spider']
}
