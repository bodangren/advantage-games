import {
  createRuneForgeChamberState,
  tickRuneForgeChamber,
  selectCircle,
  getCirclePosition,
  calculateXP,
  isPointInCircle,
} from './runeForgeChamber'
import { RUNE_FORGE_CHAMBER_CONFIG } from './runeForgeChamberConfig'

const mockVocabulary = [
  { term: 'The cat sits on the mat', translation: 'Le chat est assis sur le tapis' },
  { term: 'Hello world', translation: 'Bonjour le monde' },
]

describe('runeForgeChamber', () => {
  describe('createRuneForgeChamberState', () => {
    it('should throw error if vocabulary is empty', () => {
      expect(() => createRuneForgeChamberState([])).toThrow('Vocabulary cannot be empty')
    })

    it('should create initial state with default config', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      expect(state.status).toBe('playing')
      expect(state.difficulty).toBe('normal')
      expect(state.runeType).toBe('common-stone')
      expect(state.player.health).toBe(RUNE_FORGE_CHAMBER_CONFIG.initialHealth)
    })

    it('should create circles for each word', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      expect(state.circles.length).toBeGreaterThan(0)
      expect(state.words.length).toBe(state.circles.length)
    })

    it('should limit words based on difficulty', () => {
      const state = createRuneForgeChamberState(mockVocabulary, { difficulty: 'easy' })
      expect(state.words.length).toBeLessThanOrEqual(RUNE_FORGE_CHAMBER_CONFIG.difficulties.easy.wordCount)
    })

    it('should initialize timer at 2x difficulty value for level 1', () => {
      const state = createRuneForgeChamberState(mockVocabulary, { difficulty: 'easy' })
      expect(state.timer).toBe(RUNE_FORGE_CHAMBER_CONFIG.timerDurations.easy * 2)
      expect(state.maxTimer).toBe(RUNE_FORGE_CHAMBER_CONFIG.timerDurations.easy * 2)
    })

    it('should start at level 1', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      expect(state.level).toBe(1)
    })

    it('should set rune stone at center', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      expect(state.runeStone.centerX).toBe(RUNE_FORGE_CHAMBER_CONFIG.arenaWidth / 2)
      expect(state.runeStone.centerY).toBe(RUNE_FORGE_CHAMBER_CONFIG.arenaHeight / 2)
    })

    it('should start with empty collected words', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      expect(state.collectedWords).toEqual([])
      expect(state.targetIndex).toBe(0)
      expect(state.correctAnswers).toBe(0)
      expect(state.wrongAnswers).toBe(0)
    })

    it('should accept custom difficulty and rune type', () => {
      const state = createRuneForgeChamberState(mockVocabulary, {
        difficulty: 'hard',
        runeType: 'void-essence',
      })
      expect(state.difficulty).toBe('hard')
      expect(state.runeType).toBe('void-essence')
    })

    it('should use deterministic RNG for testing', () => {
      const rng = () => 0.5
      const state1 = createRuneForgeChamberState(mockVocabulary, { rng })
      const state2 = createRuneForgeChamberState(mockVocabulary, { rng })
      expect(state1.words).toEqual(state2.words)
    })
  })

  describe('tickRuneForgeChamber', () => {
    it('should return unchanged state if not playing', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const endedState = { ...state, status: 'victory' as const }
      const result = tickRuneForgeChamber(endedState, 50)
      expect(result).toBe(endedState)
    })

    it('should decrement timer', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const result = tickRuneForgeChamber(state, 100)
      expect(result.timer).toBe(state.timer - 100)
    })

    it('should increment game time', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const result = tickRuneForgeChamber(state, 100)
      expect(result.gameTime).toBe(100)
    })

    it('should set defeat when timer reaches zero', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const lowTimerState = { ...state, timer: 50 }
      const result = tickRuneForgeChamber(lowTimerState, 100)
      expect(result.status).toBe('defeat')
    })

    it('should set defeat when health reaches zero', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const lowHealthState = {
        ...state,
        player: { ...state.player, health: 10 },
      }
      const result = tickRuneForgeChamber(lowHealthState, 50)
      expect(result.status).toBe('playing')
    })

    it('should rotate circles', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const initialAngles = state.circles.map(c => c.angle)
      const result = tickRuneForgeChamber(state, 100)
      result.circles.forEach((circle, i) => {
        expect(circle.angle).toBeGreaterThan(initialAngles[i])
      })
    })

    it('should advance to level 2 when all words collected (not victory)', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const completedState = {
        ...state,
        targetIndex: state.words.length,
        collectedWords: state.words,
      }
      const result = tickRuneForgeChamber(completedState, 50)
      expect(result.status).toBe('playing')
      expect(result.level).toBe(2)
      expect(result.collectedWords).toHaveLength(0)
    })

    it('level 2 timer is maxTimer * 0.8', () => {
      const state = createRuneForgeChamberState(mockVocabulary, { difficulty: 'easy' })
      const completedState = {
        ...state,
        targetIndex: state.words.length,
        collectedWords: state.words,
      }
      const level2 = tickRuneForgeChamber(completedState, 50)
      const expectedTimer = state.maxTimer * 0.8
      expect(level2.maxTimer).toBeCloseTo(expectedTimer, 0)
    })
  })

  describe('selectCircle', () => {
    it('should return unchanged state if not playing', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const endedState = { ...state, status: 'victory' as const }
      const result = selectCircle(endedState, 'any-id')
      expect(result).toBe(endedState)
    })

    it('should mark circle as selected and advance on correct word', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const targetWord = state.words[0]
      const targetCircle = state.circles.find(c => c.word === targetWord)!
      
      const result = selectCircle(state, targetCircle.id)
      
      expect(result.circles.find(c => c.id === targetCircle.id)?.selected).toBe(true)
      expect(result.collectedWords).toContain(targetWord)
      expect(result.targetIndex).toBe(1)
      expect(result.correctAnswers).toBe(1)
    })

    it('should damage player on wrong word', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const targetWord = state.words[0]
      const wrongCircle = state.circles.find(c => c.word !== targetWord)!
      
      const result = selectCircle(state, wrongCircle.id)
      
      expect(result.player.health).toBe(state.player.health - RUNE_FORGE_CHAMBER_CONFIG.wrongWordDamage)
      expect(result.wrongAnswers).toBe(1)
      expect(result.targetIndex).toBe(0)
    })

    it('should set defeat when health reaches zero from wrong selection', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const lowHealthState = {
        ...state,
        player: { ...state.player, health: 10 },
      }
      const targetWord = state.words[0]
      const wrongCircle = state.circles.find(c => c.word !== targetWord)!
      
      const result = selectCircle(lowHealthState, wrongCircle.id)
      
      expect(result.status).toBe('defeat')
    })

    it('should advance to next level when all words collected', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      let currentState = state

      for (let i = 0; i < state.words.length; i++) {
        const targetWord = currentState.words[i]
        const targetCircle = currentState.circles.find(c => c.word === targetWord && !c.selected)!
        currentState = selectCircle(currentState, targetCircle.id)
      }

      expect(currentState.status).toBe('playing')
      expect(currentState.level).toBe(2)
    })

    it('should not allow selecting already selected circles', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const targetWord = state.words[0]
      const targetCircle = state.circles.find(c => c.word === targetWord)!
      
      const afterFirst = selectCircle(state, targetCircle.id)
      const afterSecond = selectCircle(afterFirst, targetCircle.id)
      
      expect(afterSecond).toBe(afterFirst)
    })
  })

  describe('getCirclePosition', () => {
    it('should calculate position based on angle and orbit radius', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const circle = state.circles[0]
      const baseAngle = 0
      
      const pos = getCirclePosition(circle, state.runeStone, baseAngle)
      
      const expectedX = state.runeStone.centerX + Math.cos(circle.angle) * circle.orbitRadius
      const expectedY = state.runeStone.centerY + Math.sin(circle.angle) * circle.orbitRadius
      
      expect(pos.x).toBeCloseTo(expectedX, 5)
      expect(pos.y).toBeCloseTo(expectedY, 5)
    })

    it('should add base angle to circle angle', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const circle = state.circles[0]
      
      const pos1 = getCirclePosition(circle, state.runeStone, 0)
      const pos2 = getCirclePosition(circle, state.runeStone, Math.PI / 2)
      
      expect(pos1.x).not.toBe(pos2.x)
      expect(pos1.y).not.toBe(pos2.y)
    })
  })

  describe('calculateXP', () => {
    it('should calculate base XP from correct answers', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const completedState = {
        ...state,
        correctAnswers: 5,
        wrongAnswers: 0,
        timer: state.maxTimer * 0.5,
        player: { health: 100 },
      }
      
      const xp = calculateXP(completedState)
      
      expect(xp).toBeGreaterThanOrEqual(5)
    })

    it('should add accuracy bonus for no wrong answers', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const perfectState = {
        ...state,
        correctAnswers: 4,
        wrongAnswers: 0,
        timer: state.maxTimer * 0.5,
        player: { health: 100 },
      }
      
      const xp = calculateXP(perfectState)
      
      expect(xp).toBe(4 + RUNE_FORGE_CHAMBER_CONFIG.accuracyBonus + RUNE_FORGE_CHAMBER_CONFIG.speedBonus + RUNE_FORGE_CHAMBER_CONFIG.survivalBonus)
    })

    it('should add speed bonus for fast completion', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const fastState = {
        ...state,
        correctAnswers: 4,
        wrongAnswers: 0,
        timer: state.maxTimer * 0.5,
        player: { health: 100 },
      }
      
      const xp = calculateXP(fastState)
      
      expect(xp).toBeGreaterThanOrEqual(4 + RUNE_FORGE_CHAMBER_CONFIG.accuracyBonus)
    })

    it('should add survival bonus for high health', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const healthyState = {
        ...state,
        correctAnswers: 4,
        wrongAnswers: 0,
        timer: state.maxTimer * 0.5,
        player: { health: 80 },
      }
      
      const xp = calculateXP(healthyState)
      
      expect(xp).toBeGreaterThanOrEqual(4 + RUNE_FORGE_CHAMBER_CONFIG.accuracyBonus)
    })

    it('should cap XP at maxXP', () => {
      const state = createRuneForgeChamberState(mockVocabulary)
      const highXPState = {
        ...state,
        correctAnswers: 20,
        wrongAnswers: 0,
        timer: state.maxTimer,
        player: { health: 100 },
      }
      
      const xp = calculateXP(highXPState)
      
      expect(xp).toBeLessThanOrEqual(RUNE_FORGE_CHAMBER_CONFIG.maxXP)
    })
  })

  describe('isPointInCircle', () => {
    it('should return true when point is inside circle', () => {
      const point = { x: 100, y: 100 }
      const center = { x: 100, y: 100 }
      const radius = 50
      
      expect(isPointInCircle(point, center, radius)).toBe(true)
    })

    it('should return true when point is on edge', () => {
      const point = { x: 150, y: 100 }
      const center = { x: 100, y: 100 }
      const radius = 50
      
      expect(isPointInCircle(point, center, radius)).toBe(true)
    })

    it('should return false when point is outside circle', () => {
      const point = { x: 200, y: 100 }
      const center = { x: 100, y: 100 }
      const radius = 50
      
      expect(isPointInCircle(point, center, radius)).toBe(false)
    })
  })
})
