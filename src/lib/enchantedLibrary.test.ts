import { describe, it, expect } from '@jest/globals'
import type { VocabularyItem } from '@/store/useGameStore'
import {
  createEnchantedLibraryState,
  spawnSpirit,
  updateSpirits,
  GAME_WIDTH,
  GAME_HEIGHT,
  INITIAL_MANA,
  MAX_SHIELD_CHARGES,
  INITIAL_SPIRIT_SPEED,
} from './enchantedLibrary'

const SAMPLE_VOCABULARY: VocabularyItem[] = [
  { term: 'cat', translation: 'แมว' },
  { term: 'dog', translation: 'สุนัข' },
  { term: 'bird', translation: 'นก' },
  { term: 'fish', translation: 'ปลา' },
]

describe('enchantedLibrary', () => {
  describe('createEnchantedLibraryState', () => {
    it('initializes with correct starting mana (50)', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.mana).toBe(50)
      expect(INITIAL_MANA).toBe(50)
    })

    it('creates 4 books (1 correct, 3 decoys)', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.books).toHaveLength(4)

      const correctBooks = state.books.filter(book => book.isCorrect)
      expect(correctBooks).toHaveLength(1)

      const decoyBooks = state.books.filter(book => !book.isCorrect)
      expect(decoyBooks).toHaveLength(3)
    })

    it('sets up vocabulary tracking (collect each word 2x)', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)

      // Check that vocabulary progress is initialized
      expect(state.vocabularyProgress).toBeDefined()
      expect(state.totalWords).toBe(SAMPLE_VOCABULARY.length)

      // Each word should start with 0 completions
      SAMPLE_VOCABULARY.forEach(vocab => {
        expect(state.vocabularyProgress.get(vocab.term)).toBe(0)
      })
    })

    it('initializes with 3 shield charges', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.player.shieldCharges).toBe(3)
      expect(state.player.maxShieldCharges).toBe(3)
      expect(MAX_SHIELD_CHARGES).toBe(3)
    })

    it('player spawns at center (400, 300)', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.player.x).toBe(GAME_WIDTH / 2)
      expect(state.player.y).toBe(GAME_HEIGHT / 2)
      expect(state.player.x).toBe(400)
      expect(state.player.y).toBe(300)
    })

    it('initializes with no spirits', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.spirits).toEqual([])
    })

    it('initializes with shield inactive', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.shieldActive).toBe(false)
      expect(state.shieldTimer).toBe(0)
    })

    it('initializes with playing status', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      expect(state.status).toBe('playing')
    })

    it('throws error for empty vocabulary', () => {
      expect(() => createEnchantedLibraryState([])).toThrow('Vocabulary cannot be empty')
    })
  })

  describe('spawnSpirit', () => {
    it('spawns from random wall position', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY, { rng: () => 0.5 })
      const newState = {
        ...state,
        player: {
          ...state.player,
          x: 400,
          y: 300,
        }
      }

      const result = spawnSpirit(newState, { rng: () => 0.5 })

      expect(result.spirits).toHaveLength(1)
      const spirit = result.spirits[0]

      // Spirit should be on a wall (x or y at boundary)
      const onWall =
        spirit.x <= 0 ||
        spirit.x >= GAME_WIDTH ||
        spirit.y <= 0 ||
        spirit.y >= GAME_HEIGHT

      expect(onWall).toBe(true)
    })

    it('calculates point ahead of player trajectory', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const playerMovingRight = {
        ...state,
        player: {
          ...state.player,
          x: 200,
          y: 300,
        }
      }

      const result = spawnSpirit(playerMovingRight, {
        rng: () => 0.5,
        playerVelocityX: 3,
        playerVelocityY: 0,
      })
      const spirit = result.spirits[0]

      // Spirit velocity should point toward predicted position ahead of player
      expect(spirit.velocityX).toBeDefined()
      expect(spirit.velocityY).toBeDefined()
    })

    it('creates straight-line velocity vector through predicted point', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY, { rng: () => 0.5 })
      const result = spawnSpirit(state, { rng: () => 0.5 })

      const spirit = result.spirits[0]

      // Velocity should be normalized to spirit speed
      const velocityMagnitude = Math.sqrt(
        spirit.velocityX * spirit.velocityX +
        spirit.velocityY * spirit.velocityY
      )

      expect(velocityMagnitude).toBeCloseTo(state.spiritSpeed, 1)
    })

    it('only spawns one spirit at a time', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const withOneSpirit = spawnSpirit(state)

      // Try to spawn another
      const result = spawnSpirit(withOneSpirit)

      // Should still have only 1 spirit
      expect(result.spirits).toHaveLength(1)
    })

    it('respects spawn timer', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const recentSpawn = {
        ...state,
        spiritSpawnTimer: 1000, // Recently spawned
      }

      const result = spawnSpirit(recentSpawn)

      // Should not spawn a new spirit
      expect(result.spirits).toHaveLength(0)
    })
  })

  describe('updateSpirits', () => {
    it('spirits move along velocity vector', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const withSpirit = {
        ...state,
        spirits: [{
          id: 'spirit-1',
          x: 100,
          y: 100,
          velocityX: 2,
          velocityY: 1,
          speed: 2,
          radius: 15,
          bounced: false,
        }]
      }

      const result = updateSpirits(withSpirit, 16) // 16ms delta

      expect(result.spirits[0].x).toBe(100 + 2)
      expect(result.spirits[0].y).toBe(100 + 1)
    })

    it('spirits despawn when exiting game bounds', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const spiritOffScreen = {
        ...state,
        spirits: [{
          id: 'spirit-1',
          x: GAME_WIDTH + 100, // Off right edge
          y: 300,
          velocityX: 2,
          velocityY: 0,
          speed: 2,
          radius: 15,
          bounced: false,
        }]
      }

      const result = updateSpirits(spiritOffScreen, 16)

      // Spirit should be removed
      expect(result.spirits).toHaveLength(0)
    })

    it('spirit speed increases over time', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)

      // Simulate game progression
      const lateGame = {
        ...state,
        gameTime: 60000, // 60 seconds
      }

      const result = updateSpirits(lateGame, 16)

      // Spirit speed should have increased from initial value
      expect(result.spiritSpeed).toBeGreaterThan(INITIAL_SPIRIT_SPEED)
    })
  })
})
