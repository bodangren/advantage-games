import { describe, it, expect } from '@jest/globals'
import type { VocabularyItem } from '@/store/useGameStore'
import {
  createEnchantedLibraryState,
  spawnBooks,
  checkBookCollisions,
  checkSpiritCollisions,
  selectNextTargetWord,
  spawnSpirit,
  updateSpirits,
  advanceEnchantedLibraryTime,
  GAME_WIDTH,
  GAME_HEIGHT,
  INITIAL_MANA,
  MAX_SHIELD_CHARGES,
  INITIAL_SPIRIT_SPEED,
} from './enchantedLibrary'

export type DirectionalInput = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  cast: boolean
}

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

  describe('spawnBooks', () => {
    it('creates 4 books (1 correct, 3 decoys)', () => {
      const target = SAMPLE_VOCABULARY[0]
      const books = spawnBooks(target, SAMPLE_VOCABULARY)

      expect(books).toHaveLength(4)

      const correctBooks = books.filter(b => b.isCorrect)
      const decoyBooks = books.filter(b => !b.isCorrect)

      expect(correctBooks).toHaveLength(1)
      expect(decoyBooks).toHaveLength(3)
    })

    it('books positioned in quadrants around arena', () => {
      const target = SAMPLE_VOCABULARY[0]
      const books = spawnBooks(target, SAMPLE_VOCABULARY, () => 0.5)

      // All books should be positioned within game bounds
      books.forEach(book => {
        expect(book.x).toBeGreaterThan(0)
        expect(book.x).toBeLessThan(GAME_WIDTH)
        expect(book.y).toBeGreaterThan(0)
        expect(book.y).toBeLessThan(GAME_HEIGHT)
      })

      // Books should be spread out (not all in same position)
      const positions = books.map(b => `${b.x},${b.y}`)
      const uniquePositions = new Set(positions)
      expect(uniquePositions.size).toBe(4)
    })

    it('each book has translation label', () => {
      const target = SAMPLE_VOCABULARY[0]
      const books = spawnBooks(target, SAMPLE_VOCABULARY)

      books.forEach(book => {
        expect(book.translation).toBeDefined()
        expect(book.translation).not.toBe('')
      })
    })

    it('correct book matches target word', () => {
      const target = SAMPLE_VOCABULARY[1] // 'dog'
      const books = spawnBooks(target, SAMPLE_VOCABULARY)

      const correctBook = books.find(b => b.isCorrect)
      expect(correctBook).toBeDefined()
      expect(correctBook?.word).toBe(target.term)
      expect(correctBook?.translation).toBe(target.translation)
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

  describe('checkBookCollisions', () => {
    it('detects collision when player near book (radius check)', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const playerNearBook = {
        ...state,
        player: {
          ...state.player,
          x: state.books[0].x,
          y: state.books[0].y,
        },
      }

      const result = checkBookCollisions(playerNearBook, SAMPLE_VOCABULARY)

      // Books should change (one collected)
      expect(result.books).not.toEqual(state.books)
    })

    it('correct book: +10 mana, +1 shield charge, progress incremented', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const correctBook = state.books.find(b => b.isCorrect)!

      const playerAtCorrectBook = {
        ...state,
        mana: 50,
        player: {
          ...state.player,
          x: correctBook.x,
          y: correctBook.y,
          shieldCharges: 2,
        },
      }

      const result = checkBookCollisions(playerAtCorrectBook, SAMPLE_VOCABULARY)

      expect(result.mana).toBe(60) // +10
      expect(result.player.shieldCharges).toBe(3) // +1

      // Progress should increment
      const progress = result.vocabularyProgress.get(state.targetWord)
      expect(progress).toBe(1) // Was 0, now 1
    })

    it('incorrect book: -5 mana, no shield charge', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const incorrectBook = state.books.find(b => !b.isCorrect)!

      const playerAtIncorrectBook = {
        ...state,
        mana: 50,
        player: {
          ...state.player,
          x: incorrectBook.x,
          y: incorrectBook.y,
          shieldCharges: 2,
        },
      }

      const result = checkBookCollisions(playerAtIncorrectBook, SAMPLE_VOCABULARY)

      expect(result.mana).toBe(45) // -5
      expect(result.player.shieldCharges).toBe(2) // No change
    })

    it('respects max 3 shield charges', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const correctBook = state.books.find(b => b.isCorrect)!

      const playerWithMaxCharges = {
        ...state,
        player: {
          ...state.player,
          x: correctBook.x,
          y: correctBook.y,
          shieldCharges: 3, // Already at max
        },
      }

      const result = checkBookCollisions(playerWithMaxCharges, SAMPLE_VOCABULARY)

      expect(result.player.shieldCharges).toBe(3) // Should not exceed max
    })

    it('books despawn after collection', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const bookToCollect = state.books[0]

      const playerAtBook = {
        ...state,
        player: {
          ...state.player,
          x: bookToCollect.x,
          y: bookToCollect.y,
        },
      }

      const result = checkBookCollisions(playerAtBook, SAMPLE_VOCABULARY)

      // Should still have 4 books (new ones spawned)
      expect(result.books).toHaveLength(4)

      // But they should be different books
      expect(result.books).not.toEqual(state.books)
    })

    it('new books spawn after collection', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const bookToCollect = state.books[0]

      const playerAtBook = {
        ...state,
        player: {
          ...state.player,
          x: bookToCollect.x,
          y: bookToCollect.y,
        },
      }

      const result = checkBookCollisions(playerAtBook, SAMPLE_VOCABULARY)

      // Should have 4 new books
      expect(result.books).toHaveLength(4)
      expect(result.books.some(b => b.isCorrect)).toBe(true)
    })
  })

  describe('selectNextTargetWord', () => {
    it('selects word that hasn\'t been collected 2x yet', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)

      // Mark first word as collected once
      state.vocabularyProgress.set(SAMPLE_VOCABULARY[0].term, 1)
      // Mark second word as collected twice (complete)
      state.vocabularyProgress.set(SAMPLE_VOCABULARY[1].term, 2)

      const nextWord = selectNextTargetWord(state, SAMPLE_VOCABULARY)

      // Should not select the word that's already collected 2x
      expect(nextWord).not.toBe(SAMPLE_VOCABULARY[1].term)
    })

    it('cycles through vocabulary appropriately', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)

      const word1 = selectNextTargetWord(state, SAMPLE_VOCABULARY)

      // Mark first selected word as collected once
      state.vocabularyProgress.set(word1, 1)

      const word2 = selectNextTargetWord(state, SAMPLE_VOCABULARY)

      // Should be a valid word from vocabulary
      expect(SAMPLE_VOCABULARY.some(v => v.term === word2)).toBe(true)
    })
  })

  describe('mana system', () => {
    it('mana can go negative (no minimum)', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const incorrectBook = state.books.find(b => !b.isCorrect)!

      const lowManaState = {
        ...state,
        mana: 2, // Very low mana
        player: {
          ...state.player,
          x: incorrectBook.x,
          y: incorrectBook.y,
        },
      }

      const result = checkBookCollisions(lowManaState, SAMPLE_VOCABULARY)

      // Mana should go negative (-3)
      expect(result.mana).toBe(-3)
    })

    it('mana displayed as score', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)

      // Mana is the score
      expect(state.mana).toBe(INITIAL_MANA)
      expect(state.mana).toBe(50)
    })

    it('correct book adds 10 mana', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const correctBook = state.books.find(b => b.isCorrect)!

      const playerAtCorrect = {
        ...state,
        mana: 50,
        player: {
          ...state.player,
          x: correctBook.x,
          y: correctBook.y,
        },
      }

      const result = checkBookCollisions(playerAtCorrect, SAMPLE_VOCABULARY)

      expect(result.mana).toBe(60)
    })

    it('wrong book subtracts 5 mana', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const incorrectBook = state.books.find(b => !b.isCorrect)!

      const playerAtIncorrect = {
        ...state,
        mana: 50,
        player: {
          ...state.player,
          x: incorrectBook.x,
          y: incorrectBook.y,
        },
      }

      const result = checkBookCollisions(playerAtIncorrect, SAMPLE_VOCABULARY)

      expect(result.mana).toBe(45)
    })

    it('spirit collision subtracts 10 mana', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const withSpirit = {
        ...state,
        mana: 50,
        spirits: [{
          id: 'spirit-1',
          x: state.player.x,
          y: state.player.y,
          velocityX: 2,
          velocityY: 0,
          speed: 2,
          radius: 15,
          bounced: false,
        }],
      }

      const result = checkSpiritCollisions(withSpirit)

      expect(result.mana).toBe(40) // -10 mana
    })
  })

  describe('advanceEnchantedLibraryTime', () => {
    const noInput: DirectionalInput = {
      up: false,
      down: false,
      left: false,
      right: false,
      cast: false,
    }

    it('updates player position based on input', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const moveRight: DirectionalInput = {
        ...noInput,
        right: true,
      }

      const result = advanceEnchantedLibraryTime(state, moveRight, 16)

      expect(result.player.x).toBeGreaterThan(state.player.x)
    })

    it('clamps player to boundaries', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const playerNearEdge = {
        ...state,
        player: {
          ...state.player,
          x: GAME_WIDTH - 5,
          y: 300,
        },
      }

      const moveRight: DirectionalInput = {
        ...noInput,
        right: true,
      }

      const result = advanceEnchantedLibraryTime(playerNearEdge, moveRight, 16)

      // Player should be clamped to GAME_WIDTH
      expect(result.player.x).toBeLessThanOrEqual(GAME_WIDTH)
    })

    it('updates spirits', () => {
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
        }],
      }

      const result = advanceEnchantedLibraryTime(withSpirit, noInput, 16)

      // Spirit should have moved
      expect(result.spirits[0].x).not.toBe(100)
    })

    it('spawns new spirit when timer expires and no spirit active', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const readyToSpawn = {
        ...state,
        spiritSpawnTimer: 0,
        spirits: [],
      }

      const result = advanceEnchantedLibraryTime(readyToSpawn, noInput, 16)

      // Should have spawned a spirit
      expect(result.spirits.length).toBeGreaterThan(0)
    })

    it('increments game time', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)

      const result = advanceEnchantedLibraryTime(state, noInput, 16)

      expect(result.gameTime).toBe(state.gameTime + 16)
    })

    it('decrements spirit spawn timer', () => {
      const state = createEnchantedLibraryState(SAMPLE_VOCABULARY)
      const withTimer = {
        ...state,
        spiritSpawnTimer: 1000,
      }

      const result = advanceEnchantedLibraryTime(withTimer, noInput, 16)

      expect(result.spiritSpawnTimer).toBe(1000 - 16)
    })
  })
})
