import {
  createSpellweaversRunState,
  type SpellweaversRunState,
  type WordOrb,
  type Lane,
} from './spellweaversRun'
import type { VocabularyItem } from '@/store/useGameStore'

describe('spellweaversRun', () => {
  const vocabulary: VocabularyItem[] = [
    { term: 'The cat sits', translation: 'Le chat est assis' },
    { term: 'I love you', translation: 'Je t\'aime' },
  ]

  describe('createSpellweaversRunState', () => {
    it('should initialize with playing status', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.status).toBe('playing')
    })

    it('should initialize with full mana', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.mana).toBe(100)
    })

    it('should initialize with zero score', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.score).toBe(0)
    })

    it('should initialize with zero combo', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.combo).toBe(0)
    })

    it('should initialize with empty collected words', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.collectedWords).toEqual([])
    })

    it('should initialize with target index 0', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.targetIndex).toBe(0)
    })

    it('should initialize with empty orbs array', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.orbs).toEqual([])
    })

    it('should set current sentence from vocabulary', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.currentSentence).toBeDefined()
      expect(state.currentSentence.term).toBeDefined()
      expect(state.currentSentence.translation).toBeDefined()
    })

    it('should set words array from sentence term', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.words).toBeDefined()
      expect(state.words.length).toBeGreaterThan(0)
    })

    it('should set correct answers and total attempts to zero', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.correctAnswers).toBe(0)
      expect(state.totalAttempts).toBe(0)
    })

    it('should set sentences completed to zero', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.sentencesCompleted).toBe(0)
    })

    it('should throw error if vocabulary is empty', () => {
      expect(() => createSpellweaversRunState([])).toThrow('Vocabulary cannot be empty')
    })

    it('should accept difficulty parameter', () => {
      const state = createSpellweaversRunState(vocabulary, { difficulty: 'hard' })
      expect(state.difficulty).toBe('hard')
    })

    it('should default to normal difficulty', () => {
      const state = createSpellweaversRunState(vocabulary)
      expect(state.difficulty).toBe('normal')
    })
  })

  describe('WordOrb type', () => {
    it('should have correct structure', () => {
      const orb: WordOrb = {
        id: 'orb-1',
        word: 'The',
        orderIndex: 0,
        lane: 'left',
        y: 0,
        collected: false,
      }
      expect(orb.id).toBe('orb-1')
      expect(orb.word).toBe('The')
      expect(orb.orderIndex).toBe(0)
      expect(orb.lane).toBe('left')
      expect(orb.y).toBe(0)
      expect(orb.collected).toBe(false)
    })
  })

  describe('Lane type', () => {
    it('should be left, center, or right', () => {
      const lanes: Lane[] = ['left', 'center', 'right']
      expect(lanes).toHaveLength(3)
    })
  })
})
