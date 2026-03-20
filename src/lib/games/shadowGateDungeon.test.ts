import {
  createShadowGateDungeonState,
  tickShadowGateDungeon,
  calculateXP,
  setPlayerVelocity,
} from './shadowGateDungeon'
import { SHADOW_GATE_DUNGEON_CONFIG, GAME_WIDTH, GAME_HEIGHT } from './shadowGateDungeonConfig'
import type { VocabularyItem } from '@/store/useGameStore'

const mockVocabulary: VocabularyItem[] = [
  { term: 'the quick brown fox jumps over the lazy dog', translation: 'le renard brun rapide saute par-dessus le chien paresseux' },
  { term: 'hello world today is great and wonderful', translation: 'bonjour monde aujourd\'hui est super et merveilleux' },
]

describe('shadowGateDungeon', () => {
  describe('createShadowGateDungeonState', () => {
    it('should throw error for empty vocabulary', () => {
      expect(() => createShadowGateDungeonState([])).toThrow('Vocabulary cannot be empty')
    })

    it('should create state with default difficulty normal', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.difficulty).toBe('normal')
    })

    it('should create state with default creature type orc-hunter', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.creatureType).toBe('orc-hunter')
    })

    it('should create state with playing status', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.status).toBe('playing')
    })

    it('should initialize player with full health', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.player.health).toBe(SHADOW_GATE_DUNGEON_CONFIG.initialHealth)
    })

    it('should initialize player at bottom center', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.player.position.x).toBe(GAME_WIDTH / 2)
      expect(state.player.position.y).toBe(GAME_HEIGHT - 100)
    })

    it('should initialize creature at top center', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.creature.position.x).toBe(GAME_WIDTH / 2)
      expect(state.creature.position.y).toBe(100)
    })

    it('should initialize gate as locked', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.gate.unlocked).toBe(false)
    })

    it('should spawn crystals equal to word count', () => {
      const state = createShadowGateDungeonState(mockVocabulary, { difficulty: 'easy' })
      expect(state.crystals.length).toBe(4)
    })

    it('should use custom difficulty', () => {
      const state = createShadowGateDungeonState(mockVocabulary, { difficulty: 'hard' })
      expect(state.difficulty).toBe('hard')
      expect(state.words.length).toBe(6)
    })

    it('should use custom creature type', () => {
      const state = createShadowGateDungeonState(mockVocabulary, { creatureType: 'shadow-dragon' })
      expect(state.creatureType).toBe('shadow-dragon')
    })

    it('should initialize counters to zero', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      expect(state.collectedWords).toEqual([])
      expect(state.targetIndex).toBe(0)
      expect(state.correctAnswers).toBe(0)
      expect(state.wrongAnswers).toBe(0)
      expect(state.gameTime).toBe(0)
    })

    it('should use seeded rng for deterministic results', () => {
      let seed = 0.5
      const rng = () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }
      const state1 = createShadowGateDungeonState(mockVocabulary, { rng })
      seed = 0.5
      const state2 = createShadowGateDungeonState(mockVocabulary, { rng })
      expect(state1.crystals[0].position.x).toBe(state2.crystals[0].position.x)
    })
  })

  describe('tickShadowGateDungeon', () => {
    it('should not update state if not playing', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const endedState = { ...state, status: 'victory' as const }
      const newState = tickShadowGateDungeon(endedState, 16)
      expect(newState).toBe(endedState)
    })

    it('should increment game time', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const newState = tickShadowGateDungeon(state, 16)
      expect(newState.gameTime).toBe(16)
    })

    it('should move player according to velocity', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const stateWithVelocity = setPlayerVelocity(state, { x: 1, y: 0 })
      const newState = tickShadowGateDungeon(stateWithVelocity, 1000)
      expect(newState.player.position.x).toBeGreaterThan(state.player.position.x)
    })

    it('should keep player within bounds', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const stateWithVelocity = setPlayerVelocity(state, { x: 10, y: 10 })
      const newState = tickShadowGateDungeon(stateWithVelocity, 5000)
      expect(newState.player.position.x).toBeLessThanOrEqual(GAME_WIDTH - SHADOW_GATE_DUNGEON_CONFIG.playerRadius)
      expect(newState.player.position.y).toBeLessThanOrEqual(GAME_HEIGHT - SHADOW_GATE_DUNGEON_CONFIG.playerRadius)
    })

    it('should move creature toward player', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const initialCreatureY = state.creature.position.y
      const newState = tickShadowGateDungeon(state, 1000)
      expect(newState.creature.position.y).toBeGreaterThan(initialCreatureY)
    })

    it('should detect player-creature collision and deal damage', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const nearCreatureState = {
        ...state,
        creature: {
          ...state.creature,
          position: { x: state.player.position.x + 5, y: state.player.position.y + 5 },
        },
      }
      const newState = tickShadowGateDungeon(nearCreatureState, 16)
      expect(newState.player.health).toBeLessThan(SHADOW_GATE_DUNGEON_CONFIG.initialHealth)
    })

    it('should apply invincibility after damage', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const nearCreatureState = {
        ...state,
        creature: {
          ...state.creature,
          position: { x: state.player.position.x + 5, y: state.player.position.y + 5 },
        },
      }
      const newState = tickShadowGateDungeon(nearCreatureState, 16)
      expect(newState.player.invincible).toBe(true)
    })

    it('should detect defeat when health reaches zero', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const lowHealthState = {
        ...state,
        player: {
          ...state.player,
          health: 10,
        },
        creature: {
          ...state.creature,
          position: { x: state.player.position.x + 5, y: state.player.position.y + 5 },
        },
      }
      const newState = tickShadowGateDungeon(lowHealthState, 16)
      expect(newState.status).toBe('defeat')
    })

    it('should detect correct word collection', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const targetWord = state.words[0]
      const crystal = state.crystals.find((c) => c.word === targetWord)!
      const nearCrystalState = {
        ...state,
        player: {
          ...state.player,
          position: { ...crystal.position },
        },
      }
      const newState = tickShadowGateDungeon(nearCrystalState, 16)
      expect(newState.collectedWords).toContain(targetWord)
      expect(newState.targetIndex).toBe(1)
    })

    it('should detect wrong word collection and deal damage', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const wrongWord = state.words[1]
      const crystal = state.crystals.find((c) => c.word === wrongWord)!
      const nearCrystalState = {
        ...state,
        player: {
          ...state.player,
          position: { ...crystal.position },
        },
      }
      const newState = tickShadowGateDungeon(nearCrystalState, 16)
      expect(newState.player.health).toBeLessThan(SHADOW_GATE_DUNGEON_CONFIG.initialHealth)
      expect(newState.wrongAnswers).toBe(1)
    })

    it('should unlock gate when all words collected', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const allCollectedState = {
        ...state,
        collectedWords: [...state.words],
        targetIndex: state.words.length,
        crystals: state.crystals.map((c) => ({ ...c, collected: true })),
      }
      const newState = tickShadowGateDungeon(allCollectedState, 16)
      expect(newState.gate.unlocked).toBe(true)
    })

    it('should detect victory when player reaches unlocked gate', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const nearGateState = {
        ...state,
        gate: { ...state.gate, unlocked: true },
        collectedWords: [...state.words],
        targetIndex: state.words.length,
        player: {
          ...state.player,
          position: {
            x: state.gate.position.x + state.gate.width / 2,
            y: state.gate.position.y + state.gate.height / 2,
          },
        },
      }
      const newState = tickShadowGateDungeon(nearGateState, 16)
      expect(newState.status).toBe('victory')
    })
  })

  describe('calculateXP', () => {
    it('should calculate base XP from correct answers', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const completedState = {
        ...state,
        correctAnswers: 5,
        wrongAnswers: 0,
        gameTime: 20000,
        player: { ...state.player, health: 100 },
      }
      const xp = calculateXP(completedState)
      expect(xp).toBeGreaterThanOrEqual(5)
    })

    it('should add accuracy bonus when no wrong answers', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const perfectState = {
        ...state,
        correctAnswers: 4,
        wrongAnswers: 0,
        gameTime: 40000,
        player: { ...state.player, health: 30 },
      }
      const xp = calculateXP(perfectState)
      expect(xp).toBe(5)
    })

    it('should add speed bonus when completed under threshold', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const fastState = {
        ...state,
        correctAnswers: 4,
        wrongAnswers: 1,
        gameTime: 20000,
        player: { ...state.player, health: 30 },
      }
      const xp = calculateXP(fastState)
      expect(xp).toBe(5)
    })

    it('should add survival bonus when health above threshold', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const healthyState = {
        ...state,
        correctAnswers: 4,
        wrongAnswers: 1,
        gameTime: 40000,
        player: { ...state.player, health: 60 },
      }
      const xp = calculateXP(healthyState)
      expect(xp).toBe(5)
    })

    it('should cap XP at maxXP', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const perfectState = {
        ...state,
        correctAnswers: 10,
        wrongAnswers: 0,
        gameTime: 10000,
        player: { ...state.player, health: 100 },
      }
      const xp = calculateXP(perfectState)
      expect(xp).toBe(SHADOW_GATE_DUNGEON_CONFIG.maxXP)
    })
  })

  describe('setPlayerVelocity', () => {
    it('should update player velocity', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      const newState = setPlayerVelocity(state, { x: 1, y: -1 })
      expect(newState.player.velocity).toEqual({ x: 1, y: -1 })
    })

    it('should not mutate original state', () => {
      const state = createShadowGateDungeonState(mockVocabulary)
      setPlayerVelocity(state, { x: 1, y: -1 })
      expect(state.player.velocity).toEqual({ x: 0, y: 0 })
    })
  })
})
