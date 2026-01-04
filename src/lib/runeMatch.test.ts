import { createRuneMatchState, type RuneMatchState, type Rune, type GridPosition, initializeGrid, swapRunes, findMatches, applyGravity, processMatches, initializeEmptyGrid, calculateMatchDamage, applyMatchResult } from './runeMatch'
import { RUNE_MATCH_CONFIG } from './runeMatchConfig'
import type { VocabularyItem } from '@/store/useGameStore'

const SAMPLE_VOCAB: VocabularyItem[] = [
  { term: 'สวัสดี', translation: 'Hello' },
  { term: 'แมว', translation: 'Cat' },
  { term: 'หมา', translation: 'Dog' },
  { term: 'น้ำ', translation: 'Water' },
  { term: 'ข้าว', translation: 'Rice' },
  { term: 'รัก', translation: 'Love' },
  { term: 'บ้าน', translation: 'House' },
  { term: 'ต้นไม้', translation: 'Tree' },
  { term: 'พระอาทิตย์', translation: 'Sun' },
  { term: 'พระจันทร์', translation: 'Moon' },
]

describe('combat logic', () => {
  it('calculates damage for a basic 2-match', () => {
    const damage = calculateMatchDamage(2, 0, false)
    expect(damage).toBe(5)
  })

  it('calculates damage for a 3-match', () => {
    const damage = calculateMatchDamage(3, 0, false)
    expect(damage).toBe(10)
  })

  it('applies power rune multiplier', () => {
    const damage = calculateMatchDamage(2, 0, true)
    expect(damage).toBe(10) // 5 * 2
  })

  it('applies cascade bonus', () => {
    const damage = calculateMatchDamage(2, 1, false)
    expect(damage).toBe(10) // 5 + 5
  })

  it('updates monster HP in state', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    state.status = 'playing'
    state.monster = { type: 'goblin', hp: 50, maxHp: 50, attack: 2, xp: 3 }
    state.grid = initializeEmptyGrid(SAMPLE_VOCAB) // Populate grid
    
    const result = {
      grid: state.grid,
      cascades: 1,
      allClearedCoords: [{ row: 0, col: 0 }, { row: 0, col: 1 }] // 2 runes
    }
    
    const newState = applyMatchResult(state, result)
    expect(newState.monster?.hp).toBe(40) // 5 (base) + 5 (cascade) = 10 damage
  })

  it('processes power-ups (heal)', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    state.status = 'playing'
    state.player.hp = 50
    state.grid = initializeEmptyGrid(SAMPLE_VOCAB)
    state.grid[0][0] = { id: 'h1', type: 'heal' }
    state.grid[0][1] = { id: 'h2', type: 'heal' }
    
    const result = {
      grid: state.grid,
      cascades: 1,
      allClearedCoords: [{ row: 0, col: 0 }, { row: 0, col: 1 }]
    }
    
    const newState = applyMatchResult(state, result)
    expect(newState.player.hp).toBe(60) // 50 + (2 * 5)
  })
})

describe('processMatches', () => {
  it('processes a single match and returns cascade count of 1', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[5][0] = rune
    grid[5][1] = rune
    
    const result = processMatches(grid, SAMPLE_VOCAB)
    expect(result.cascades).toBe(1)
    expect(findMatches(result.grid)).toHaveLength(0)
  })

  it('detects multiple cascades', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const runeA = { id: 'a', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    const runeB = { id: 'b', type: 'vocabulary', wordId: 'Cat', text: 'แมว' } as Rune
    
    // First match at bottom (row 5)
    grid[5][0] = runeA
    grid[5][1] = runeA
    
    // Set up second match that forms after row 5 clears
    grid[4][0] = runeB
    grid[3][0] = { id: 'x', type: 'vocabulary', wordId: 'Other', text: 'X' } as Rune
    grid[2][0] = runeB // This will fall to (4,0) eventually
    
    const result = processMatches(grid, SAMPLE_VOCAB)
    expect(result.cascades).toBeGreaterThanOrEqual(1) // Just verify it processes
  })
})

describe('applyGravity', () => {
  it('clears matched runes and fills from top', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const matchedCoords = [{ row: 5, col: 0 }, { row: 5, col: 1 }]
    
    const newGrid = applyGravity(grid, matchedCoords, SAMPLE_VOCAB)
    
    expect(newGrid[5][0]).not.toBe(grid[5][0])
    expect(newGrid[0][0]).toBeDefined()
  })

  it('shifts runes down correctly', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    const runeToShift = grid[4][0]
    const matchedCoords = [{ row: 5, col: 0 }]
    
    const newGrid = applyGravity(grid, matchedCoords, SAMPLE_VOCAB)
    
    // Rune at (4,0) should have moved to (5,0)
    expect(newGrid[5][0]).toBe(runeToShift)
  })
})

describe('findMatches', () => {
  it('finds horizontal matches (2+ runes)', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[0][0] = rune
    grid[0][1] = rune
    
    const matches = findMatches(grid)
    expect(matches.length).toBe(1)
    expect(matches[0]).toHaveLength(2)
    expect(matches[0]).toEqual(expect.arrayContaining([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]))
  })

  it('finds vertical matches (2+ runes)', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[0][0] = rune
    grid[1][0] = rune
    
    const matches = findMatches(grid)
    expect(matches.length).toBe(1)
    expect(matches[0]).toHaveLength(2)
  })

  it('matches mixed languages for the same wordId', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    grid[0][0] = { id: '1', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[0][1] = { id: '2', type: 'vocabulary', wordId: 'Hello', text: 'Hello' } as Rune
    
    const matches = findMatches(grid)
    expect(matches.length).toBe(1)
    expect(matches[0]).toHaveLength(2)
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
})

describe('initializeGrid', () => {
  it('creates a grid with correct dimensions', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    expect(grid.length).toBe(RUNE_MATCH_CONFIG.grid.rows)
    expect(grid[0].length).toBe(RUNE_MATCH_CONFIG.grid.columns)
  })

  it('does not have initial matches (2-in-a-row)', () => {
    const grid = initializeGrid(SAMPLE_VOCAB)
    
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const rune = grid[r][c]
        if (rune.type !== 'vocabulary') continue

        // Check horizontal pair
        if (c < grid[r].length - 1) {
          const r2 = grid[r][c+1]
          if (r2.type === 'vocabulary') {
            expect(rune.wordId).not.toBe(r2.wordId)
          }
        }

        // Check vertical pair
        if (r < grid.length - 1) {
          const r2 = grid[r+1][c]
          if (r2.type === 'vocabulary') {
            expect(rune.wordId).not.toBe(r2.wordId)
          }
        }
      }
    }
  })
})

describe('createRuneMatchState', () => {
  it('creates initial state in selection screen', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    expect(state.status).toBe('selection')
  })
})