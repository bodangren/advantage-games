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
  shakeIntensity: number // 0 to 1
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
        
        // Check for matches (now 2-in-a-row)
        if (rune.type === 'vocabulary') {
          const hasHorizontalMatch = c >= 1 && 
            grid[r][c-1].type === 'vocabulary' && (grid[r][c-1] as VocabularyRune).wordId === rune.wordId
          
          const hasVerticalMatch = r >= 1 && 
            grid[r-1][c].type === 'vocabulary' && (grid[r-1][c] as VocabularyRune).wordId === rune.wordId
            
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

// ... (swapRunes remains same)

export const initializeEmptyGrid = (vocabulary: VocabularyItem[]): Rune[][] => {
  const { rows, columns } = RUNE_MATCH_CONFIG.grid
  const grid: Rune[][] = []
  for (let r = 0; r < rows; r++) {
    grid[r] = []
    for (let c = 0; c < columns; c++) {
      // Use a unique ID and a word that won't match others easily
      const item = vocabulary[(r * columns + c) % vocabulary.length]
      grid[r][c] = {
        id: `empty-${r}-${c}`,
        type: 'vocabulary',
        wordId: `word-${r}-${c}`, // Unique wordId per cell
        text: item.term
      }
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
  const horizontalMatches: GridPosition[][] = []
  const verticalMatches: GridPosition[][] = []

  // Find all horizontal matches (2+ in a row)
  for (let r = 0; r < rows; r++) {
    let match: GridPosition[] = [{ row: r, col: 0 }]
    for (let c = 1; c <= cols; c++) {
      if (
        c < cols &&
        grid[r][c].type === 'vocabulary' &&
        grid[r][c - 1].type === 'vocabulary' &&
        (grid[r][c] as VocabularyRune).wordId === (grid[r][c - 1] as VocabularyRune).wordId
      ) {
        match.push({ row: r, col: c })
      } else {
        if (match.length >= 2) {
          horizontalMatches.push(match)
        }
        if (c < cols) match = [{ row: r, col: c }]
      }
    }
  }

  // Find all vertical matches (2+ in a row)
  for (let c = 0; c < cols; c++) {
    let match: GridPosition[] = [{ row: 0, col: c }]
    for (let r = 1; r <= rows; r++) {
      if (
        r < rows &&
        grid[r][c].type === 'vocabulary' &&
        grid[r - 1][c].type === 'vocabulary' &&
        (grid[r][c] as VocabularyRune).wordId === (grid[r - 1][c] as VocabularyRune).wordId
      ) {
        match.push({ row: r, col: c })
      } else {
        if (match.length >= 2) {
          verticalMatches.push(match)
        }
        if (r < rows) match = [{ row: r, col: c }]
      }
    }
  }

  const allMatchedCoords = [...horizontalMatches.flat(), ...verticalMatches.flat()]
  if (allMatchedCoords.length === 0) return []

  // Group overlapping matches (L/T shapes) using BFS
  const groups: MatchGroup[] = []
  const visited = new Set<string>()
  const posKey = (p: GridPosition) => `${p.row},${p.col}`
  
  const matchedSet = new Set(allMatchedCoords.map(posKey))

  for (const pos of allMatchedCoords) {
    const key = posKey(pos)
    if (visited.has(key)) continue

    const groupCoords: GridPosition[] = []
    const queue: GridPosition[] = [pos]
    visited.add(key)

    let hasIntersection = false
    const groupWordId = (grid[pos.row][pos.col] as VocabularyRune).wordId

    while (queue.length > 0) {
      const current = queue.shift()!
      groupCoords.push(current)

      // Check for L/T shape: coordinate is in both horizontal and vertical matches
      const inHorizontal = horizontalMatches.some(m => m.some(p => p.row === current.row && p.col === current.col))
      const inVertical = verticalMatches.some(m => m.some(p => p.row === current.row && p.col === current.col))
      if (inHorizontal && inVertical) hasIntersection = true

      const neighbors = [
        { row: current.row - 1, col: current.col },
        { row: current.row + 1, col: current.col },
        { row: current.row, col: current.col - 1 },
        { row: current.row, col: current.col + 1 },
      ]

      for (const neighbor of neighbors) {
        const nKey = posKey(neighbor)
        if (matchedSet.has(nKey) && !visited.has(nKey)) {
          const neighborRune = grid[neighbor.row][neighbor.col]
          if (neighborRune.type === 'vocabulary' && neighborRune.wordId === groupWordId) {
            visited.add(nKey)
            queue.push(neighbor)
          }
        }
      }
    }
    groups.push({
      coords: groupCoords,
      isSpecial: hasIntersection,
      wordId: groupWordId
    })
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
  const allGroups: MatchGroup[] = []
  
  let groups = findMatches(currentGrid)
  
  while (groups.length > 0) {
    cascades++
    for (const group of groups) {
      allClearedCoords.push(...group.coords)
      allGroups.push(group)
    }
    
    currentGrid = applyGravity(currentGrid, groups.flatMap(g => g.coords), vocabulary, { rng })
    groups = findMatches(currentGrid)
    
    if (cascades > 100) break
  }

  return {
    grid: currentGrid,
    cascades,
    allClearedCoords,
    groups: allGroups
  }
}

export const advanceTime = (
  state: RuneMatchState,
  deltaMs: number
): RuneMatchState => {
  if (state.status !== 'playing') return state

  let newState = { ...state }
  newState.attackTimer += deltaMs
  
  // Decay shake
  newState.shakeIntensity = Math.max(0, newState.shakeIntensity - deltaMs / 500)

  const { attackIntervalMs } = RUNE_MATCH_CONFIG.combat

  if (newState.attackTimer >= attackIntervalMs) {
    // Monster Attacks!
    newState.attackTimer %= attackIntervalMs
    newState.shakeIntensity = 1.0
    
    // Rotate Power Word
    newState.powerWord = newState.vocabulary[Math.floor(newState.rng() * newState.vocabulary.length)].translation

    if (newState.player.hasShield) {
      // Shield blocks one attack
      newState.player = { ...newState.player, hasShield: false }
    } else {
      // Random damage from 1 to monster.attack
      const monsterAtk = newState.monster?.attack || 1
      const damage = Math.floor(state.rng() * monsterAtk) + 1
      newState.player = { 
        ...newState.player, 
        hp: Math.max(0, newState.player.hp - damage) 
      }
    }
  }

  return newState
}

export const calculateMatchDamage = (
  runeCount: number,
  cascades: number,
  isPowerRune: boolean
): number => {
  const { combat } = RUNE_MATCH_CONFIG
  
  // Base damage
  let damage = 0
  if (runeCount === 2) damage = 5
  else if (runeCount === 3) damage = combat.match3Damage
  else if (runeCount === 4) damage = combat.match4Damage
  else if (runeCount >= 5) damage = combat.match5Damage

  // Multipliers
  if (isPowerRune) damage *= combat.powerRuneMultiplier
  
  // Cascade bonus
  if (cascades > 0) {
    damage += cascades * combat.cascadeBonus
  }

  return damage
}

export const applyMatchResult = (
  state: RuneMatchState,
  result: MatchResult
): RuneMatchState => {
  if (state.status !== 'playing') return state

  let monsterHp = state.monster?.hp || 0
  let playerHp = state.player.hp
  let hasShield = state.player.hasShield
  let correctAnswers = state.correctAnswers
  let totalAttempts = state.totalAttempts

  // Calculate total damage from all groups
  let totalDamage = 0

  for (const group of result.groups) {
    const firstCoord = group.coords[0]
    const rune = state.grid[firstCoord.row][firstCoord.col]
    
    if (rune.type === 'vocabulary') {
      totalAttempts++
      const isPower = rune.wordId === state.powerWord
      if (isPower) correctAnswers++
      
      const damage = calculateMatchDamage(group.coords.length, result.cascades, isPower)
      const groupBonus = group.isSpecial ? RUNE_MATCH_CONFIG.combat.lShapeDamage : 0
      
      totalDamage += damage + groupBonus
    } else if (rune.type === 'heal') {
      playerHp = Math.min(state.player.maxHp, playerHp + (group.coords.length * RUNE_MATCH_CONFIG.powerUps.healAmount))
    } else if (rune.type === 'shield') {
      hasShield = true
    }
  }

  monsterHp = Math.max(0, monsterHp - totalDamage)

  return {
    ...state,
    grid: result.grid,
    monster: state.monster ? { ...state.monster, hp: monsterHp } : null,
    player: { ...state.player, hp: playerHp, hasShield },
    correctAnswers,
    totalAttempts,
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
    powerWord: vocabulary[Math.floor(rng() * vocabulary.length)].translation,
    correctAnswers: 0,
    totalAttempts: 0,
    vocabulary,
    rng,
    shakeIntensity: 0,
  }
}
