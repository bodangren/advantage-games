import { DIFFICULTY_GUARDRAILS, DIFFICULTY_TIERS, FALLBACK_DIFFICULTY_CONFIG } from './difficulty'

describe('difficulty guardrails', () => {
  describe('DIFFICULTY_GUARDRAILS', () => {
    it('should have minimum HP of at least 1', () => {
      expect(DIFFICULTY_GUARDRAILS.minHp).toBeGreaterThanOrEqual(1)
    })

    it('should have minimum lives of at least 1', () => {
      expect(DIFFICULTY_GUARDRAILS.minLives).toBeGreaterThanOrEqual(1)
    })

    it('should have minimum spawn interval of at least 500ms', () => {
      expect(DIFFICULTY_GUARDRAILS.minSpawnIntervalMs).toBeGreaterThanOrEqual(500)
    })

    it('should have minimum timer of at least 5000ms', () => {
      expect(DIFFICULTY_GUARDRAILS.minTimerMs).toBeGreaterThanOrEqual(5000)
    })

    it('should have max enemy speed under 300 px/s', () => {
      expect(DIFFICULTY_GUARDRAILS.maxEnemySpeedPxPerSec).toBeLessThanOrEqual(300)
    })

    it('should have max scroll speed under 200 px/s', () => {
      expect(DIFFICULTY_GUARDRAILS.maxScrollSpeedPxPerSec).toBeLessThanOrEqual(200)
    })

    it('should have max word count of 10', () => {
      expect(DIFFICULTY_GUARDRAILS.maxWordCount).toBeLessThanOrEqual(10)
    })
  })

  describe('DIFFICULTY_TIERS compliance', () => {
    it('all tiers should have wordCount.max <= guardrails.maxWordCount', () => {
      for (const [tier, config] of Object.entries(DIFFICULTY_TIERS)) {
        expect(config.wordCount.max).toBeLessThanOrEqual(
          DIFFICULTY_GUARDRAILS.maxWordCount,
          `${tier} tier wordCount.max (${config.wordCount.max}) exceeds guardrail (${DIFFICULTY_GUARDRAILS.maxWordCount})`
        )
      }
    })
  })

  describe('FALLBACK_DIFFICULTY_CONFIG', () => {
    it('should have valid speed multiplier', () => {
      expect(FALLBACK_DIFFICULTY_CONFIG.speed).toBeGreaterThan(0)
      expect(FALLBACK_DIFFICULTY_CONFIG.speed).toBeLessThanOrEqual(2)
    })

    it('should have valid spawn rate multiplier', () => {
      expect(FALLBACK_DIFFICULTY_CONFIG.spawnRate).toBeGreaterThan(0)
      expect(FALLBACK_DIFFICULTY_CONFIG.spawnRate).toBeLessThanOrEqual(2)
    })

    it('should have reasonable word count', () => {
      expect(FALLBACK_DIFFICULTY_CONFIG.wordCount).toBeGreaterThanOrEqual(1)
      expect(FALLBACK_DIFFICULTY_CONFIG.wordCount).toBeLessThanOrEqual(20)
    })

    it('should have reasonable timer', () => {
      expect(FALLBACK_DIFFICULTY_CONFIG.timer).toBeGreaterThanOrEqual(5000)
      expect(FALLBACK_DIFFICULTY_CONFIG.timer).toBeLessThanOrEqual(60000)
    })

    it('should have reasonable initial HP', () => {
      expect(FALLBACK_DIFFICULTY_CONFIG.initialHp).toBeGreaterThanOrEqual(1)
      expect(FALLBACK_DIFFICULTY_CONFIG.initialHp).toBeLessThanOrEqual(10)
    })
  })
})

export function validateDifficultyConfig(config: {
  speed?: number
  spawnInterval?: number
  wordCount?: number
  timer?: number
  initialHp?: number
  initialLives?: number
}): string[] {
  const errors: string[] = []

  if (config.speed !== undefined && config.speed > DIFFICULTY_GUARDRAILS.maxScrollSpeedPxPerSec) {
    errors.push(`Speed ${config.speed} exceeds max ${DIFFICULTY_GUARDRAILS.maxScrollSpeedPxPerSec} px/s`)
  }

  if (config.spawnInterval !== undefined && config.spawnInterval < DIFFICULTY_GUARDRAILS.minSpawnIntervalMs) {
    errors.push(`Spawn interval ${config.spawnInterval}ms is below minimum ${DIFFICULTY_GUARDRAILS.minSpawnIntervalMs}ms`)
  }

  if (config.wordCount !== undefined && config.wordCount > DIFFICULTY_GUARDRAILS.maxWordCount) {
    errors.push(`Word count ${config.wordCount} exceeds max ${DIFFICULTY_GUARDRAILS.maxWordCount}`)
  }

  if (config.timer !== undefined && config.timer < DIFFICULTY_GUARDRAILS.minTimerMs) {
    errors.push(`Timer ${config.timer}ms is below minimum ${DIFFICULTY_GUARDRAILS.minTimerMs}ms`)
  }

  if (config.initialHp !== undefined && config.initialHp < DIFFICULTY_GUARDRAILS.minHp) {
    errors.push(`Initial HP ${config.initialHp} is below minimum ${DIFFICULTY_GUARDRAILS.minHp}`)
  }

  if (config.initialLives !== undefined && config.initialLives < DIFFICULTY_GUARDRAILS.minLives) {
    errors.push(`Initial lives ${config.initialLives} is below minimum ${DIFFICULTY_GUARDRAILS.minLives}`)
  }

  return errors
}
