import type { VocabularyItem } from '@/store/useGameStore'
import type { Difficulty } from '@/store/useGameStore'
import type { GoblinType } from './labyrinthGoblinKingConfig'
import {
  LABYRINTH_CONFIG,
  getDifficultyConfig,
  getGoblinSpeed,
  GAME_WIDTH,
  GAME_HEIGHT,
} from './labyrinthGoblinKingConfig'

export type GameStatus = 'start' | 'playing' | 'victory' | 'defeat'

export type Position = {
  x: number
  y: number
}

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

export type Player = {
  x: number
  y: number
  speed: number
  lives: number
  direction: Direction
  invulnerabilityTime: number
  heroicAura: boolean
  heroicAuraTimer: number
}

export type WordOrb = {
  id: string
  x: number
  y: number
  word: string
  orderIndex: number
  collected: boolean
}

export type Goblin = {
  id: string
  x: number
  y: number
  speed: number
  direction: Direction
  type: GoblinType
  fleeing: boolean
  eaten: boolean
}

export type TileType = 'wall' | 'floor'

export type Maze = TileType[][]

export type LabyrinthGoblinKingState = {
  status: GameStatus
  difficulty: Difficulty
  goblinType: GoblinType
  player: Player
  wordOrbs: WordOrb[]
  goblins: Goblin[]
  maze: Maze
  currentSentence: VocabularyItem
  words: string[]
  collectedWords: string[]
  targetIndex: number
  correctAnswers: number
  wrongAnswers: number
  goblinsEaten: number
  gameTime: number
}

export type LabyrinthGoblinKingConfig = {
  difficulty?: Difficulty
  goblinType?: GoblinType
  rng?: () => number
}

const generateId = () => Math.random().toString(36).substring(2, 9)

function createMaze(cols: number, rows: number): Maze {
  const maze: Maze = []
  for (let row = 0; row < rows; row++) {
    const rowTiles: TileType[] = []
    for (let col = 0; col < cols; col++) {
      if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
        rowTiles.push('wall')
      } else if (row % 2 === 0 && col % 2 === 0) {
        rowTiles.push('wall')
      } else {
        rowTiles.push('floor')
      }
    }
    maze.push(rowTiles)
  }
  maze[1][0] = 'floor'
  maze[rows - 2][cols - 1] = 'floor'
  return maze
}

function getFloorPositions(maze: Maze, rng: () => number): Position[] {
  const positions: Position[] = []
  const tileSize = LABYRINTH_CONFIG.tileSize
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 'floor') {
        positions.push({
          x: col * tileSize + tileSize / 2,
          y: row * tileSize + tileSize / 2,
        })
      }
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }
  return positions
}

function isWall(x: number, y: number, maze: Maze): boolean {
  const tileSize = LABYRINTH_CONFIG.tileSize
  const col = Math.floor(x / tileSize)
  const row = Math.floor(y / tileSize)
  if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length) {
    return true
  }
  return maze[row][col] === 'wall'
}

export function createLabyrinthGoblinKingState(
  sentence: VocabularyItem,
  config: LabyrinthGoblinKingConfig = {}
): LabyrinthGoblinKingState {
  const rng = config.rng ?? Math.random
  const difficulty = config.difficulty ?? 'normal'
  const goblinType = config.goblinType ?? 'scout'

  const diffConfig = getDifficultyConfig(difficulty)
  const words = sentence.term.split(' ').filter(w => w.trim().length > 0)

  const maze = createMaze(LABYRINTH_CONFIG.mazeCols, LABYRINTH_CONFIG.mazeRows)
  const floorPositions = getFloorPositions(maze, rng)

  const tileSize = LABYRINTH_CONFIG.tileSize
  const playerStartX = tileSize / 2
  const playerStartY = tileSize * 1.5

  const player: Player = {
    x: playerStartX,
    y: playerStartY,
    speed: LABYRINTH_CONFIG.playerSpeed,
    lives: diffConfig.lives,
    direction: 'none',
    invulnerabilityTime: 0,
    heroicAura: false,
    heroicAuraTimer: 0,
  }

  const wordOrbs: WordOrb[] = words.slice(0, diffConfig.wordCount).map((word, index) => {
    const pos = floorPositions[index] ?? { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 }
    return {
      id: generateId(),
      x: pos.x,
      y: pos.y,
      word,
      orderIndex: index,
      collected: false,
    }
  })

  const goblins: Goblin[] = []
  for (let i = 0; i < diffConfig.goblinCount; i++) {
    const pos = floorPositions[words.length + i] ?? { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 }
    goblins.push({
      id: generateId(),
      x: pos.x,
      y: pos.y,
      speed: getGoblinSpeed(goblinType),
      direction: 'none',
      type: goblinType,
      fleeing: false,
      eaten: false,
    })
  }

  return {
    status: 'start',
    difficulty,
    goblinType,
    player,
    wordOrbs,
    goblins,
    maze,
    currentSentence: sentence,
    words,
    collectedWords: [],
    targetIndex: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    goblinsEaten: 0,
    gameTime: 0,
  }
}

export type LabyrinthInput = {
  dx: number
  dy: number
}

function getRandomDirection(rng: () => number): Direction {
  const dirs: Direction[] = ['up', 'down', 'left', 'right']
  return dirs[Math.floor(rng() * dirs.length)]
}

function getOppositeDirection(dir: Direction): Direction {
  const opposites: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
    none: 'none',
  }
  return opposites[dir]
}

function moveInDirection(x: number, y: number, dir: Direction, speed: number): Position {
  switch (dir) {
    case 'up': return { x, y: y - speed }
    case 'down': return { x, y: y + speed }
    case 'left': return { x: x - speed, y }
    case 'right': return { x: x + speed, y }
    default: return { x, y }
  }
}

function canMove(newX: number, newY: number, maze: Maze, size: number): boolean {
  const halfSize = size / 2 - 2
  return !isWall(newX - halfSize, newY - halfSize, maze) &&
         !isWall(newX + halfSize, newY - halfSize, maze) &&
         !isWall(newX - halfSize, newY + halfSize, maze) &&
         !isWall(newX + halfSize, newY + halfSize, maze)
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export function tickLabyrinthGoblinKing(
  state: LabyrinthGoblinKingState,
  input: LabyrinthInput,
  deltaTimeMs: number
): LabyrinthGoblinKingState {
  if (state.status !== 'playing') return state

  const rng = Math.random
  const dt = deltaTimeMs / 16.67
  const newState = { ...state }

  newState.player = { ...state.player }
  if (newState.player.invulnerabilityTime > 0) {
    newState.player.invulnerabilityTime = Math.max(0, state.player.invulnerabilityTime - deltaTimeMs)
  }

  if (newState.player.heroicAura) {
    newState.player.heroicAuraTimer = Math.max(0, state.player.heroicAuraTimer - deltaTimeMs)
    if (newState.player.heroicAuraTimer <= 0) {
      newState.player.heroicAura = false
    }
  }

  const dx = input.dx
  const dy = input.dy
  let newDirection: Direction = state.player.direction

  if (Math.abs(dx) > Math.abs(dy)) {
    newDirection = dx > 0 ? 'right' : dx < 0 ? 'left' : state.player.direction
  } else if (dy !== 0) {
    newDirection = dy > 0 ? 'down' : dy < 0 ? 'up' : state.player.direction
  }

  if (dx !== 0 || dy !== 0) {
    const speed = state.player.speed * dt
    const newPos = moveInDirection(state.player.x, state.player.y, newDirection, speed)
    if (canMove(newPos.x, newPos.y, state.maze, LABYRINTH_CONFIG.playerSize)) {
      newState.player.x = newPos.x
      newState.player.y = newPos.y
    }
  }
  newState.player.direction = newDirection

  newState.wordOrbs = state.wordOrbs.map(orb => {
    if (orb.collected) return orb
    const dist = distance(state.player.x, state.player.y, orb.x, orb.y)
    if (dist < (LABYRINTH_CONFIG.playerSize + LABYRINTH_CONFIG.orbSize) / 2) {
      return { ...orb, collected: true }
    }
    return orb
  })

  const justCollectedOrb = newState.wordOrbs.find(
    (orb, i) => orb.collected && !state.wordOrbs[i].collected
  )
  if (justCollectedOrb) {
    if (justCollectedOrb.orderIndex === state.targetIndex) {
      newState.correctAnswers = state.correctAnswers + 1
      newState.collectedWords = [...state.collectedWords, justCollectedOrb.word]
      newState.targetIndex = state.targetIndex + 1

      if (newState.targetIndex >= newState.wordOrbs.length) {
        newState.player.heroicAura = true
        newState.player.heroicAuraTimer = LABYRINTH_CONFIG.heroicAuraDuration
        newState.goblins = newState.goblins.map(g => ({ ...g, fleeing: true }))
      }
    } else {
      newState.wrongAnswers = state.wrongAnswers + 1
      newState.player.lives = state.player.lives - 1
      newState.player.invulnerabilityTime = LABYRINTH_CONFIG.invulnerabilityDuration
      const floorPositions = getFloorPositions(state.maze, rng)
      const uncollectedOrbs = newState.wordOrbs.filter(o => !o.collected)
      const usedPositions = uncollectedOrbs.map(o => `${o.x},${o.y}`)
      const availablePositions = floorPositions.filter(
        p => !usedPositions.includes(`${p.x},${p.y}`)
      )
      if (availablePositions.length > 0) {
        const orbIndex = newState.wordOrbs.findIndex(o => o.id === justCollectedOrb.id)
        if (orbIndex >= 0) {
          const newPos = availablePositions[0]
          newState.wordOrbs = newState.wordOrbs.map((o, i) =>
            i === orbIndex ? { ...o, collected: false, x: newPos.x, y: newPos.y } : o
          )
        }
      }
    }
  }

  if (newState.player.lives <= 0) {
    newState.status = 'defeat'
    return newState
  }

  newState.goblins = state.goblins.map(goblin => {
    if (goblin.eaten) return goblin

    const newGoblin = { ...goblin }

    if (newState.player.heroicAura) {
      newGoblin.fleeing = true
    }

    const speed = goblin.speed * dt

    if (newGoblin.fleeing && newState.player.heroicAura) {
      const dx = goblin.x - state.player.x
      const dy = goblin.y - state.player.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const fleeX = goblin.x + (dx / dist) * speed
      const fleeY = goblin.y + (dy / dist) * speed
      if (canMove(fleeX, fleeY, state.maze, LABYRINTH_CONFIG.goblinSize)) {
        newGoblin.x = fleeX
        newGoblin.y = fleeY
      }
    } else {
      const dist = distance(state.player.x, state.player.y, goblin.x, goblin.y)
      if (dist < LABYRINTH_CONFIG.chaseRange && goblin.type !== 'scout') {
        const dx = state.player.x - goblin.x
        const dy = state.player.y - goblin.y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const chaseX = goblin.x + (dx / d) * speed
        const chaseY = goblin.y + (dy / d) * speed
        if (canMove(chaseX, chaseY, state.maze, LABYRINTH_CONFIG.goblinSize)) {
          newGoblin.x = chaseX
          newGoblin.y = chaseY
        }
      } else {
        if (Math.random() < 0.02 || goblin.direction === 'none') {
          newGoblin.direction = getRandomDirection(rng)
        }
        const newPos = moveInDirection(goblin.x, goblin.y, newGoblin.direction, speed)
        if (canMove(newPos.x, newPos.y, state.maze, LABYRINTH_CONFIG.goblinSize)) {
          newGoblin.x = newPos.x
          newGoblin.y = newPos.y
        } else {
          newGoblin.direction = getOppositeDirection(goblin.direction)
        }
      }
    }

    const collisionDist = distance(state.player.x, state.player.y, newGoblin.x, newGoblin.y)
    if (collisionDist < (LABYRINTH_CONFIG.playerSize + LABYRINTH_CONFIG.goblinSize) / 2) {
      if (newState.player.heroicAura) {
        newGoblin.eaten = true
        newState.goblinsEaten = (newState.goblinsEaten ?? state.goblinsEaten) + 1
      } else if (newState.player.invulnerabilityTime <= 0) {
        newState.player.lives = newState.player.lives - 1
        newState.player.invulnerabilityTime = LABYRINTH_CONFIG.invulnerabilityDuration
      }
    }

    return newGoblin
  })

  newState.gameTime = state.gameTime + deltaTimeMs

  return newState
}

export function startLabyrinthGoblinKing(state: LabyrinthGoblinKingState): LabyrinthGoblinKingState {
  if (state.status !== 'start') return state
  return { ...state, status: 'playing' }
}

export function calculateLabyrinthXP(state: LabyrinthGoblinKingState): number {
  const totalAttempts = state.correctAnswers + state.wrongAnswers
  const accuracy = totalAttempts > 0 ? state.correctAnswers / totalAttempts : 0
  const baseXP = Math.floor(state.correctAnswers * accuracy)
  const goblinBonus = state.goblinsEaten * LABYRINTH_CONFIG.xpPerGoblinEaten
  return Math.min(LABYRINTH_CONFIG.maxXP, baseXP + goblinBonus)
}

export function getTileAt(x: number, y: number, maze: Maze): TileType {
  const tileSize = LABYRINTH_CONFIG.tileSize
  const col = Math.floor(x / tileSize)
  const row = Math.floor(y / tileSize)
  if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length) {
    return 'wall'
  }
  return maze[row][col]
}
