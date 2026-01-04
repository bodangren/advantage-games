import { createRuneMatchState, type RuneMatchState, type Rune, type GridPosition, initializeGrid, swapRunes, findMatches, applyGravity, processMatches, initializeEmptyGrid, calculateMatchDamage, applyMatchResult, type VocabularyRune, advanceTime } from './runeMatch'
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

describe('advanceTime', () => {
  it('increments attack timer', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    state.status = 'playing'
    
    const newState = advanceTime(state, 1000)
    expect(newState.attackTimer).toBe(1000)
  })

  it('triggers monster attack when timer exceeds interval', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    state.status = 'playing'
    state.monster = { type: 'goblin', hp: 50, maxHp: 50, attack: 10, xp: 3 }
    state.attackTimer = 4500
    
    const newState = advanceTime(state, 1000)
    
    expect(newState.attackTimer).toBe(500)
    expect(newState.player.hp).toBeLessThan(100)
  })

  it('shield blocks monster attack', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    state.status = 'playing'
    state.monster = { type: 'goblin', hp: 50, maxHp: 50, attack: 10, xp: 3 }
    state.player.hasShield = true
    state.attackTimer = 4500
    
    const newState = advanceTime(state, 1000)
    
    expect(newState.player.hp).toBe(100)
    expect(newState.player.hasShield).toBe(false)
  })
})

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
    expect(damage).toBe(10)
  })

  it('applies cascade bonus', () => {
    const damage = calculateMatchDamage(2, 1, false)
    expect(damage).toBe(10)
  })

  it('updates monster HP in state', () => {
    const state = createRuneMatchState(SAMPLE_VOCAB)
    state.status = 'playing'
    state.monster = { type: 'goblin', hp: 50, maxHp: 50, attack: 2, xp: 3 }
    state.grid = initializeEmptyGrid(SAMPLE_VOCAB)
    
    const result = {
      grid: state.grid,
      cascades: 1,
      allClearedCoords: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
      groups: [{
        coords: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
        isSpecial: false,
        wordId: (state.grid[0][0] as VocabularyRune).wordId
      }]
    }
    
    const newState = applyMatchResult(state, result)
    expect(newState.monster?.hp).toBe(40)
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
      allClearedCoords: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
      groups: [{
        coords: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
        isSpecial: false
      }]
    }
    
    state.grid[0][0] = { id: 'h1', type: 'heal' }
    state.grid[0][1] = { id: 'h2', type: 'heal' }

    const newState = applyMatchResult(state, result)
    expect(newState.player.hp).toBe(60)
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
    
    grid[5][0] = runeA
    grid[5][1] = runeA
    
    grid[4][0] = runeB
    grid[3][0] = { id: 'x', type: 'vocabulary', wordId: 'Other', text: 'X' } as Rune
    grid[2][0] = runeB 
    
    const result = processMatches(grid, SAMPLE_VOCAB)
    expect(result.cascades).toBeGreaterThanOrEqual(1)
  })
})

describe('findMatches', () => {
  it('finds horizontal matches (2+ runes)', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[0][0] = rune
    grid[0][1] = rune
    
    const groups = findMatches(grid)
    expect(groups.length).toBe(1)
    expect(groups[0].coords).toHaveLength(2)
    expect(groups[0].coords).toEqual(expect.arrayContaining([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]))
  })

  it('finds vertical matches (2+ runes)', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[0][0] = rune
    grid[1][0] = rune
    
    const groups = findMatches(grid)
    expect(groups.length).toBe(1)
    expect(groups[0].coords).toHaveLength(2)
  })

  it('detects L-shapes as special matches', () => {
    const grid = initializeEmptyGrid(SAMPLE_VOCAB)
    const rune = { id: 'test', type: 'vocabulary', wordId: 'Hello', text: 'สวัสดี' } as Rune
    grid[0][0] = rune
    grid[0][1] = rune
    grid[1][0] = rune
    
    const groups = findMatches(grid)
    expect(groups.length).toBe(1)
    expect(groups[0].coords).toHaveLength(3)
    expect(groups[0].isSpecial).toBe(true)
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

        if (c < grid[r].length - 1) {
          const r2 = grid[r][c+1]
          if (r2.type === 'vocabulary') {
            expect(rune.wordId).not.toBe(r2.wordId)
          }
        }

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