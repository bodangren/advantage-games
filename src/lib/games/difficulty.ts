import type { Difficulty } from '@/store/useGameStore'

export type DifficultyTier = {
  label: string
  speedMultiplier: number
  spawnRateMultiplier: number
  wordCount: { min: number; max: number }
  timerMultiplier: number
  hpMultiplier: number
  penaltyMultiplier: number
}

export const DIFFICULTY_TIERS: Record<Difficulty, DifficultyTier> = {
  easy: {
    label: 'Easy',
    speedMultiplier: 0.6,
    spawnRateMultiplier: 1.5,
    wordCount: { min: 3, max: 5 },
    timerMultiplier: 1.25,
    hpMultiplier: 1.5,
    penaltyMultiplier: 0.5,
  },
  normal: {
    label: 'Normal',
    speedMultiplier: 1.0,
    spawnRateMultiplier: 1.0,
    wordCount: { min: 5, max: 7 },
    timerMultiplier: 1.0,
    hpMultiplier: 1.0,
    penaltyMultiplier: 1.0,
  },
  hard: {
    label: 'Hard',
    speedMultiplier: 1.3,
    spawnRateMultiplier: 0.75,
    wordCount: { min: 7, max: 9 },
    timerMultiplier: 0.8,
    hpMultiplier: 0.7,
    penaltyMultiplier: 1.5,
  },
  extreme: {
    label: 'Extreme',
    speedMultiplier: 1.6,
    spawnRateMultiplier: 0.5,
    wordCount: { min: 9, max: 10 },
    timerMultiplier: 0.65,
    hpMultiplier: 0.4,
    penaltyMultiplier: 2.0,
  },
}

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'extreme']

export const FALLBACK_DIFFICULTY_CONFIG = {
  speed: 1.0,
  spawnRate: 1.0,
  wordCount: 6,
  timer: 15000,
  initialHp: 3,
  penalty: 10,
}

export const DIFFICULTY_GUARDRAILS = {
  minHp: 1,
  minLives: 1,
  minSpawnIntervalMs: 500,
  minTimerMs: 5000,
  maxEnemySpeedPxPerSec: 300,
  maxScrollSpeedPxPerSec: 200,
  maxWordCount: 10,
}
