import {
  createVillageGuardianState,
  tickVillageGuardian,
  calculateXP,
} from '../villageGuardian'
import {
  VILLAGE_GUARDIAN_CONFIG,
  getDifficultyConfig,
  getTimerDuration,
  getMonsterSpeed,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../villageGuardianConfig'

const mockVocabulary = [
  { term: 'The cat sits', translation: 'Le chat est assis' },
  { term: 'A dog runs', translation: 'Un chien court' },
  { term: 'The bird flies', translation: "L'oiseau vole" },
]

describe('villageGuardianConfig', () => {
  it('exports correct game dimensions', () => {
    expect(GAME_WIDTH).toBe(390)
    expect(GAME_HEIGHT).toBe(700)
  })

  it('returns correct difficulty config', () => {
    const easyConfig = getDifficultyConfig('easy')
    expect(easyConfig.name).toBe('Scout Party')
    expect(easyConfig.wordCount).toBe(4)

    const normalConfig = getDifficultyConfig('normal')
    expect(normalConfig.name).toBe('War Band')
    expect(normalConfig.wordCount).toBe(6)
  })
  it('returns correct timer duration', () => {
    expect(getTimerDuration('easy')).toBe(30000)
    expect(getTimerDuration('normal')).toBe(25000)
    expect(getTimerDuration('hard')).toBe(20000)
  })
  it('returns correct monster speed', () => {
    expect(getMonsterSpeed('bandits')).toBe(1.5)
    expect(getMonsterSpeed('goblins')).toBe(2.5)
    expect(getMonsterSpeed('dragons')).toBe(3.5)
  })
})

describe('createVillageGuardianState', () => {
  it('throws error when vocabulary is empty', () => {
    expect(() => createVillageGuardianState([])).toThrow('Vocabulary cannot be empty')
  })

  it('creates state with default difficulty and opponent', () => {
    const state = createVillageGuardianState(mockVocabulary)
    expect(state.status).toBe('playing')
    expect(state.difficulty).toBe('normal')
    expect(state.opponentType).toBe('bandits')
  })
  it('creates state with custom difficulty', () => {
    const state = createVillageGuardianState(mockVocabulary, { difficulty: 'hard' })
    expect(state.difficulty).toBe('hard')
  })
  it('creates state with custom opponent type', () => {
    const state = createVillageGuardianState(mockVocabulary, { opponentType: 'dragons' })
    expect(state.opponentType).toBe('dragons')
  })
  it('initializes knight at correct position', () => {
    const state = createVillageGuardianState(mockVocabulary)
    expect(state.knight.x).toBe(GAME_WIDTH / 2)
    expect(state.knight.y).toBe(100)
    expect(state.knight.lives).toBe(VILLAGE_GUARDIAN_CONFIG.initialLives)
  })
  it('spawns villagers based on word count', () => {
    const state = createVillageGuardianState(mockVocabulary, { difficulty: 'easy' })
    const diffConfig = getDifficultyConfig('easy')
    expect(state.villagers.length).toBe(Math.min(diffConfig.wordCount, state.words.length))
  })
  it('spawns one monster', () => {
    const state = createVillageGuardianState(mockVocabulary)
    expect(state.monsters.length).toBe(1)
  })
  it('initializes empty trail and collectedWords', () => {
    const state = createVillageGuardianState(mockVocabulary)
    expect(state.trail).toEqual([])
    expect(state.collectedWords).toEqual([])
  })
  it('sets correct timer based on difficulty', () => {
    const state = createVillageGuardianState(mockVocabulary, { difficulty: 'hard' })
    expect(state.timer).toBe(getTimerDuration('hard'))
    expect(state.maxTimer).toBe(getTimerDuration('hard'))
  })
})

describe('tickVillageGuardian', () => {
  it('returns same state when not playing', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const endedState = { ...state, status: 'victory' as const }
    const newState = tickVillageGuardian(endedState, 50)
    expect(newState).toBe(endedState)
  })

  it('decrements timer', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const newState = tickVillageGuardian(state, 100)
    expect(newState.timer).toBe(state.timer - 100)
  })

  it('sets defeat when timer reaches zero', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const lowTimerState = { ...state, timer: 50 }
    const newState = tickVillageGuardian(lowTimerState, 100)
    expect(newState.status).toBe('defeat')
  })
  it('increments game time', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const newState = tickVillageGuardian(state, 50)
    expect(newState.gameTime).toBe(50)
  })
  it('moves knight based on input', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const input = { dx: 1, dy: 0 }
    const newState = tickVillageGuardian(state, 100, input)
    expect(newState.knight.x).toBeGreaterThan(state.knight.x)
  })
  it('moves knight diagonally with normalized speed', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const input = { dx: 1, dy: 1 }
    const newState = tickVillageGuardian(state, 100, input)
    expect(newState.knight.x).toBeGreaterThan(state.knight.x)
    expect(newState.knight.y).toBeGreaterThan(state.knight.y)
  })
  it('keeps knight within bounds', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const cornerState = {
      ...state,
      knight: { ...state.knight, x: 10, y: 10 },
    }
    const input = { dx: -1, dy: -1 }
    const newState = tickVillageGuardian(cornerState, 100, input)
    expect(newState.knight.x).toBeGreaterThanOrEqual(VILLAGE_GUARDIAN_CONFIG.knightSize / 2)
    expect(newState.knight.y).toBeGreaterThanOrEqual(VILLAGE_GUARDIAN_CONFIG.knightSize / 2)
  })
  it('decreases invulnerability time', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const invincibleState = {
      ...state,
      knight: { ...state.knight, invulnerabilityTime: 500 },
    }
    const newState = tickVillageGuardian(invincibleState, 100)
    expect(newState.knight.invulnerabilityTime).toBe(400)
  })
})
describe('calculateXP', () => {
  it('calculates base XP from correct answers', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const completedState = {
      ...state,
      correctAnswers: 5,
      wrongAnswers: 0,
      timer: state.maxTimer * 0.6,
    }
    const xp = calculateXP(completedState)
    expect(xp).toBeGreaterThanOrEqual(5)
  })

  it('adds accuracy bonus for 90%+ accuracy', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const highAccuracyState = {
      ...state,
      correctAnswers: 5,
      wrongAnswers: 0,
    }
    const xp = calculateXP(highAccuracyState)
    expect(xp).toBeGreaterThanOrEqual(7)
  })
  it('caps XP at maxXP', () => {
    const state = createVillageGuardianState(mockVocabulary)
    const perfectState = {
      ...state,
      correctAnswers: 10,
      wrongAnswers: 0,
      timer: state.maxTimer * 0.6,
    }
    const xp = calculateXP(perfectState)
    expect(xp).toBeLessThanOrEqual(VILLAGE_GUARDIAN_CONFIG.maxXP)
  })
})
