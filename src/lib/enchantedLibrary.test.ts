import { describe, it, expect } from '@jest/globals'
import type { VocabularyItem } from '@/store/useGameStore'
import {
  createEnchantedLibraryState,
  GAME_WIDTH,
  GAME_HEIGHT,
  INITIAL_MANA,
  MAX_SHIELD_CHARGES,
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
})
