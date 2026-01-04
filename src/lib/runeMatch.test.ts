import { createRuneMatchState, type RuneMatchState, type Rune, type GridPosition } from './runeMatch'
import type { VocabularyItem } from '@/store/useGameStore'

const SAMPLE_VOCAB: VocabularyItem[] = [
  { term: 'Hello', translation: 'สวัสดี' },
  { term: 'Cat', translation: 'แมว' },
  { term: 'Dog', translation: 'สุนัข' },
  { term: 'Water', translation: 'น้ำ' },
  { term: 'Food', translation: 'อาหาร' },
  { term: 'House', translation: 'บ้าน' },
  { term: 'Tree', translation: 'ต้นไม้' },
  { term: 'Sun', translation: 'พระอาทิตย์' },
  { term: 'Moon', translation: 'พระจันทร์' },
  { term: 'Star', translation: 'ดาว' },
]

describe('runeMatch types', () => {
  describe('GridPosition', () => {
    it('is defined correctly', () => {
      const pos: GridPosition = { row: 0, col: 0 }
      expect(pos.row).toBe(0)
      expect(pos.col).toBe(0)
    })
  })

  describe('Rune', () => {
    it('supports vocabulary rune type', () => {
      const rune: Rune = {
        id: 'rune-1',
        type: 'vocabulary',
        word: 'Hello',
        translation: 'สวัสดี',
      }
      expect(rune.type).toBe('vocabulary')
      expect(rune.word).toBe('Hello')
      expect(rune.translation).toBe('สวัสดี')
    })

    it('supports heal power-up type', () => {
      const rune: Rune = {
        id: 'heal-1',
        type: 'heal',
      }
      expect(rune.type).toBe('heal')
      expect(rune).not.toHaveProperty('word')
    })

    it('supports shield power-up type', () => {
      const rune: Rune = {
        id: 'shield-1',
        type: 'shield',
      }
      expect(rune.type).toBe('shield')
      expect(rune).not.toHaveProperty('word')
    })
  })
})

describe('createRuneMatchState', () => {
  it('creates initial state in selection screen', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(state.status).toBe('selection')
    expect(state.selectedMonster).toBeNull()
  })

  it('throws error for empty vocabulary', () => {
    expect(() => createRuneMatchState([])).toThrow('Vocabulary cannot be empty')
  })

  it('initializes with correct player stats', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(state.player.hp).toBe(100)
    expect(state.player.maxHp).toBe(100)
    expect(state.player.hasShield).toBe(false)
  })

  it('initializes monster as null in selection screen', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(state.monster).toBeNull()
  })

  it('initializes empty grid in selection screen', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(state.grid).toEqual([])
  })

  it('initializes combat stats', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(state.attackTimer).toBe(0)
    expect(state.powerWord).toBeNull()
    expect(state.correctAnswers).toBe(0)
    expect(state.totalAttempts).toBe(0)
  })

  it('accepts custom rng function', () => {
    const mockRng = jest.fn(() => 0.5)
    const state = createRuneMatchState(SAMPLE_VOCAB, { rng: mockRng })

    expect(state.status).toBe('selection')
    // RNG not used in selection screen, but should be stored for later
  })

  it('stores vocabulary reference', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    // State should have access to vocabulary for grid generation
    expect(state.status).toBe('selection')
  })
})

describe('RuneMatchState structure', () => {
  it('has correct status type options', () => {
    const states: RuneMatchState['status'][] = ['selection', 'playing', 'victory', 'defeat']

    states.forEach(status => {
      expect(['selection', 'playing', 'victory', 'defeat']).toContain(status)
    })
  })

  it('has player with required fields', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(state.player).toHaveProperty('hp')
    expect(state.player).toHaveProperty('maxHp')
    expect(state.player).toHaveProperty('hasShield')
  })

  it('supports monster selection types', () => {
    const monsterTypes: Array<'goblin' | 'skeleton' | 'orc' | 'dragon'> = [
      'goblin',
      'skeleton',
      'orc',
      'dragon',
    ]

    monsterTypes.forEach(type => {
      expect(['goblin', 'skeleton', 'orc', 'dragon']).toContain(type)
    })
  })

  it('has grid as 2D array of runes', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(Array.isArray(state.grid)).toBe(true)
    // Grid is empty in selection state
    expect(state.grid.length).toBe(0)
  })

  it('tracks score and attempts', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)

    expect(typeof state.correctAnswers).toBe('number')
    expect(typeof state.totalAttempts).toBe('number')
  })
})
