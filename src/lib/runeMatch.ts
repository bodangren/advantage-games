import type { VocabularyItem } from '@/store/useGameStore'
import { RUNE_MATCH_CONFIG, type MonsterType } from './runeMatchConfig'

export type GridPosition = {
  row: number
  col: number
}

export type VocabularyRune = {
  id: string
  type: 'vocabulary'
  wordId: string // Unique identifier for the vocabulary item (e.g. the English term)
  text: string   // The actual text displayed (can be Thai or English)
}

export type PowerUpRune = {
  id: string
  type: 'heal' | 'shield'
}

export type Rune = VocabularyRune | PowerUpRune

export type Player = {
  hp: number
  maxHp: number
  hasShield: boolean
}

export type Monster = {
  type: MonsterType
  hp: number
  maxHp: number
  attack: number
  xp: number
}

export type RuneMatchState = {
  status: 'selection' | 'playing' | 'victory' | 'defeat'
  selectedMonster: MonsterType | null
  player: Player
  monster: Monster | null
  grid: Rune[][]
  selectedCell: GridPosition | null
  attackTimer: number
  powerWord: string | null
  correctAnswers: number
  totalAttempts: number
  vocabulary: VocabularyItem[]
  rng: () => number
}

export type RuneMatchConfig = {
  rng?: () => number
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const initializeGrid = (
  vocabulary: VocabularyItem[],
  { rng = Math.random }: RuneMatchConfig = {}
): Rune[][] => {
  const { rows, columns } = RUNE_MATCH_CONFIG.grid
  const grid: Rune[][] = Array.from({ length: rows }, () => [])

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let validRune: Rune | null = null
      let attempts = 0
      
      while (!validRune && attempts < 100) {
        attempts++
        const rune = createRandomRune(vocabulary, rng)
        
        // Check for matches
        if (rune.type === 'vocabulary') {
          const hasHorizontalMatch = c >= 2 && 
            grid[r][c-1].type === 'vocabulary' && (grid[r][c-1] as VocabularyRune).wordId === rune.wordId &&
            grid[r][c-2].type === 'vocabulary' && (grid[r][c-2] as VocabularyRune).wordId === rune.wordId
          
          const hasVerticalMatch = r >= 2 && 
            grid[r-1][c].type === 'vocabulary' && (grid[r-1][c] as VocabularyRune).wordId === rune.wordId &&
            grid[r-2][c].type === 'vocabulary' && (grid[r-2][c] as VocabularyRune).wordId === rune.wordId
            
          if (!hasHorizontalMatch && !hasVerticalMatch) {
            validRune = rune
          }
        } else {
          // Power-ups don't match, so they are always valid during initialization
          validRune = rune
        }
      }
      
      grid[r][c] = validRune || createRandomRune(vocabulary, rng) // Fallback if stuck
    }
  }

  return grid
}

export const swapRunes = (
  grid: Rune[][],
  pos1: GridPosition,
  pos2: GridPosition
): Rune[][] => {
  const newGrid = grid.map(row => [...row])
  const temp = newGrid[pos1.row][pos1.col]
  newGrid[pos1.row][pos1.col] = newGrid[pos2.row][pos2.col]
  newGrid[pos2.row][pos2.col] = temp
  return newGrid
}

export const findMatches = (grid: Rune[][]): GridPosition[][] => {
  const rows = grid.length
  const cols = grid[0].length
  const matchedPositions: GridPosition[] = []

  // Find all horizontal matches
  for (let r = 0; r < rows; r++) {
    let matchLength = 1
    for (let c = 1; c <= cols; c++) {
      if (
        c < cols &&
        grid[r][c].type === 'vocabulary' &&
        grid[r][c - 1].type === 'vocabulary' &&
        (grid[r][c] as VocabularyRune).wordId === (grid[r][c - 1] as VocabularyRune).wordId
      ) {
        matchLength++
      } else {
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matchedPositions.push({ row: r, col: c - 1 - i })
          }
        }
        matchLength = 1
      }
    }
  }

  // Find all vertical matches
  for (let c = 0; c < cols; c++) {
    let matchLength = 1
    for (let r = 1; r <= rows; r++) {
      if (
        r < rows &&
        grid[r][c].type === 'vocabulary' &&
        grid[r - 1][c].type === 'vocabulary' &&
        (grid[r][c] as VocabularyRune).wordId === (grid[r - 1][c] as VocabularyRune).wordId
      ) {
        matchLength++
      } else {
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matchedPositions.push({ row: r - 1 - i, col: c })
          }
        }
        matchLength = 1
      }
    }
  }

  if (matchedPositions.length === 0) return []

  // Group overlapping matches (L/T shapes) using BFS
  const groups: GridPosition[][] = []
  const visited = new Set<string>()
  const posKey = (p: GridPosition) => `${p.row},${p.col}`
  
  // Create a set for quick lookup of matched positions
  const matchedSet = new Set(matchedPositions.map(posKey))

  for (const pos of matchedPositions) {
    const key = posKey(pos)
    if (visited.has(key)) continue

    const group: GridPosition[] = []
    const queue: GridPosition[] = [pos]
    visited.add(key)

    while (queue.length > 0) {
      const current = queue.shift()!
      group.push(current)

      // Check neighbors in matchedPositions
      const neighbors = [
        { row: current.row - 1, col: current.col },
        { row: current.row + 1, col: current.col },
        { row: current.row, col: current.col - 1 },
        { row: current.row, col: current.col + 1 },
      ]

      for (const neighbor of neighbors) {
        const nKey = posKey(neighbor)
        if (matchedSet.has(nKey) && !visited.has(nKey)) {
          visited.add(nKey)
          queue.push(neighbor)
        }
      }
    }
    groups.push(group)
  }

  return groups
}

export const applyGravity = (
  grid: Rune[][],
  matchedCoords: GridPosition[],
  vocabulary: VocabularyItem[],
  { rng = Math.random }: RuneMatchConfig = {}
): Rune[][] => {
  const rows = grid.length
  const cols = grid[0].length
  const newGrid: (Rune | null)[][] = grid.map(row => [...row])

  // Mark matched runes as null
  for (const { row, col } of matchedCoords) {
    newGrid[row][col] = null
  }

  // Shift runes down and fill from top
  for (let c = 0; c < cols; c++) {
    // Extract non-null runes from column
    const columnRunes: Rune[] = []
    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][c] !== null) {
        columnRunes.push(newGrid[r][c] as Rune)
      }
    }

    // Fill column from bottom to top
    for (let r = rows - 1; r >= 0; r--) {
      const existingRune = columnRunes.shift()
      if (existingRune) {
        newGrid[r][c] = existingRune
      } else {
        // Refill from top
        newGrid[r][c] = createRandomRune(vocabulary, rng)
      }
    }
  }

  return newGrid as Rune[][]
}

export type MatchResult = {
  grid: Rune[][]
  cascades: number
  allClearedCoords: GridPosition[]
}

export const processMatches = (
  grid: Rune[][],
  vocabulary: VocabularyItem[],
  { rng = Math.random }: RuneMatchConfig = {}
): MatchResult => {
  let currentGrid = grid
  let cascades = 0
  const allClearedCoords: GridPosition[] = []
  
  let matches = findMatches(currentGrid)
  
  while (matches.length > 0) {
    cascades++
    const currentMatchCoords = matches.flat()
    allClearedCoords.push(...currentMatchCoords)
    
    currentGrid = applyGravity(currentGrid, currentMatchCoords, vocabulary, { rng })
    matches = findMatches(currentGrid)
    
    // Safety break to prevent infinite loops if something goes wrong
    if (cascades > 100) break
  }

  return {
    grid: currentGrid,
    cascades,
    allClearedCoords,
  }
}

const createRandomRune = (vocabulary: VocabularyItem[], rng: () => number): Rune => {
  const roll = rng()
  const { spawnRate } = RUNE_MATCH_CONFIG.powerUps

  if (roll < spawnRate) {
    // Spawn power-up
    return {
      id: generateId(),
      type: rng() > 0.5 ? 'heal' : 'shield'
    }
  }

  // Spawn vocabulary rune
  const index = Math.floor(rng() * vocabulary.length)
  const item = vocabulary[index]
  
  // Randomly choose between Term (Thai) and Translation (English)
  const showTranslation = rng() > 0.5

  return {
    id: generateId(),
    type: 'vocabulary',
    wordId: item.translation, // Use English translation as unique ID
    text: showTranslation ? item.translation : item.term
  }
}


export const createRuneMatchState = (
  vocabulary: VocabularyItem[],
  { rng = Math.random }: RuneMatchConfig = {}
): RuneMatchState => {
  if (vocabulary.length === 0) {
    throw new Error('Vocabulary cannot be empty')
  }

  return {
    status: 'selection',
    selectedMonster: null,
    player: {
      hp: RUNE_MATCH_CONFIG.player.maxHp,
      maxHp: RUNE_MATCH_CONFIG.player.maxHp,
      hasShield: false,
    },
    monster: null,
    grid: [],
    selectedCell: null,
    attackTimer: 0,
    powerWord: null,
    correctAnswers: 0,
    totalAttempts: 0,
    vocabulary,
    rng,
  }
}
