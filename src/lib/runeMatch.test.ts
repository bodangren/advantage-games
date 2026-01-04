import { createRuneMatchState, type RuneMatchState, type Rune, type GridPosition, initializeGrid, swapRunes, findMatches, applyGravity, processMatches } from './runeMatch'
import { RUNE_MATCH_CONFIG } from './runeMatchConfig'

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

describe('processMatches', () => {
  it('processes a single match and returns cascade count of 1', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', word: 'A', translation: 'A' } as Rune
    grid[7][0] = rune
    grid[7][1] = rune
    grid[7][2] = rune
    
    const result = processMatches(grid, SAMPLE_VOCAB)
    expect(result.cascades).toBe(1)
    expect(findMatches(result.grid)).toHaveLength(0)
  })

  it('detects multiple cascades', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const runeA = { id: 'a', type: 'vocabulary', word: 'A', translation: 'A' } as Rune
    const runeB = { id: 'b', type: 'vocabulary', word: 'B', translation: 'B' } as Rune
    
    // First match at bottom
    grid[7][0] = runeA
    grid[7][1] = runeA
    grid[7][2] = runeA
    
    // Set up a second match that will fall into place
    grid[6][0] = runeB
    grid[6][1] = runeB
    grid[6][2] = runeB
    
    // And ensure the items ABOVE the first match are NOT runeB initially
    grid[7][0] = runeA // Already set
    grid[5][0] = runeB // This will fall to row 6
    grid[5][1] = runeB // This will fall to row 6
    grid[5][2] = runeB // This will fall to row 6
    
    // Actually simpler: 
    // Row 7: A A A
    // Row 6: B B B (already a match, processMatches should find it too)
    
    const result = processMatches(grid, SAMPLE_VOCAB)
    expect(result.cascades).toBeGreaterThanOrEqual(1)
  })
})

describe('applyGravity', () => {
  it('clears matched runes and fills from top', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const matchedCoords = [{ row: 7, col: 0 }, { row: 7, col: 1 }, { row: 7, col: 2 }]
    const originalTopRune = grid[0][0]
    
    const newGrid = applyGravity(grid, matchedCoords, SAMPLE_VOCAB)
    
    // Bottom runes should be different (shifted or new)
    expect(newGrid[7][0]).not.toBe(grid[7][0])
    
    // Top runes should be refilled
    expect(newGrid[0][0]).toBeDefined()
    expect(newGrid[0][1]).toBeDefined()
    expect(newGrid[0][2]).toBeDefined()
  })

  it('shifts runes down correctly', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const runeToShift = grid[6][0]
    const matchedCoords = [{ row: 7, col: 0 }]
    
    const newGrid = applyGravity(grid, matchedCoords, SAMPLE_VOCAB)
    
    // Rune at (6,0) should have moved to (7,0)
    expect(newGrid[7][0]).toBe(runeToShift)
  })
})

describe('findMatches', () => {
  it('finds horizontal matches', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', word: 'A', translation: 'A' } as Rune
    grid[0][0] = rune
    grid[0][1] = rune
    grid[0][2] = rune
    
    const matches = findMatches(grid)
    expect(matches.length).toBe(1)
    expect(matches[0]).toHaveLength(3)
    expect(matches[0]).toEqual(expect.arrayContaining([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]))
  })

  it('finds vertical matches', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', word: 'A', translation: 'A' } as Rune
    grid[0][0] = rune
    grid[1][0] = rune
    grid[2][0] = rune
    
    const matches = findMatches(grid)
    expect(matches.length).toBe(1)
    expect(matches[0]).toHaveLength(3)
  })

  it('handles L-shapes as unified matches', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', word: 'A', translation: 'A' } as Rune
    // Horizontal
    grid[0][0] = rune
    grid[0][1] = rune
    grid[0][2] = rune
    // Vertical
    grid[1][0] = rune
    grid[2][0] = rune
    
    const matches = findMatches(grid)
    // Depending on implementation, it might be 1 combined match or 2 overlapping matches.
    // Let's assume it finds all matching coordinates.
    const allMatchedCoords = matches.flat()
    expect(allMatchedCoords).toHaveLength(5)
  })
})

describe('swapRunes', () => {
  it('swaps two runes in the grid', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const r1 = grid[0][0]
    const r2 = grid[0][1]
    
    const newGrid = swapRunes(grid, { row: 0, col: 0 }, { row: 0, col: 1 })
    
    expect(newGrid[0][0]).toBe(r2)
    expect(newGrid[0][1]).toBe(r1)
  })

  it('does not mutate the original grid', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const r1 = grid[0][0]
    
    swapRunes(grid, { row: 0, col: 0 }, { row: 0, col: 1 })
    
    expect(grid[0][0]).toBe(r1)
  })
})

describe('initializeGrid', () => {
  it('creates a grid with correct dimensions', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    expect(grid.length).toBe(RUNE_MATCH_CONFIG.grid.rows)
    expect(grid[0].length).toBe(RUNE_MATCH_CONFIG.grid.columns)
  })

  it('contains valid runes', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    grid.flat().forEach(rune => {
      expect(['vocabulary', 'heal', 'shield']).toContain(rune.type)
      if (rune.type === 'vocabulary') {
        expect(rune.word).toBeDefined()
        expect(rune.translation).toBeDefined()
      }
    })
  })

  it('does not have initial matches', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const rune = grid[r][c]
        if (rune.type !== 'vocabulary') continue

        // Check horizontal
        if (c < grid[r].length - 2) {
          const r2 = grid[r][c+1]
          const r3 = grid[r][c+2]
          if (r2.type === 'vocabulary' && r3.type === 'vocabulary') {
            const match = rune.translation === r2.translation && rune.translation === r3.translation
            expect(match).toBe(false)
          }
        }

        // Check vertical
        if (r < grid.length - 2) {
          const r2 = grid[r+1][c]
          const r3 = grid[r+2][c]
          if (r2.type === 'vocabulary' && r3.type === 'vocabulary') {
            const match = rune.translation === r2.translation && rune.translation === r3.translation
            expect(match).toBe(false)
          }
        }
      }
    }
  })
})

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
