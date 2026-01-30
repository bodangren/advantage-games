import type { VocabularyItem } from '@/store/useGameStore'

export type Point = {
  x: number
  y: number
}

export type Entity = Point & {
  id: string
  radius: number
}

export type Player = Entity & {
  shieldCharges: number
  maxShieldCharges: number
  speed: number
}

export type Spirit = Entity & {
  velocityX: number
  velocityY: number
  speed: number
  bounced: boolean
}

export type Book = Entity & {
  word: string
  translation: string
  isCorrect: boolean
}

export type EnchantedLibraryState = {
  status: 'playing' | 'gameover' | 'victory'
  player: Player
  spirits: Spirit[]
  books: Book[]
  targetWord: string
  mana: number
  vocabularyProgress: Map<string, number>
  totalWords: number
  shieldActive: boolean
  shieldTimer: number
  gameTime: number
  spiritSpawnTimer: number
  spiritSpeed: number
}

export type EnchantedLibraryConfig = {
  rng?: () => number
}

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const PLAYER_RADIUS = 20
export const SPIRIT_RADIUS = 15
export const BOOK_RADIUS = 25
export const INITIAL_MANA = 50
export const MAX_SHIELD_CHARGES = 3
export const SHIELD_DURATION = 2000 // ms
export const SPIRIT_SPAWN_RATE_MS = 3000
export const INITIAL_SPIRIT_SPEED = 2
export const SPIRIT_SPEED_INCREASE_RATE = 0.1 // per 10 seconds
export const PREDICT_AHEAD_DISTANCE = 100 // pixels

export const createEnchantedLibraryState = (
  vocabulary: VocabularyItem[],
  { rng = Math.random }: EnchantedLibraryConfig = {}
): EnchantedLibraryState => {
  if (vocabulary.length === 0) {
    throw new Error('Vocabulary cannot be empty')
  }

  // Initialize vocabulary progress (each word needs to be collected 2x)
  const vocabularyProgress = new Map<string, number>()
  vocabulary.forEach(vocab => {
    vocabularyProgress.set(vocab.term, 0)
  })

  // Select random target word
  const targetIndex = Math.floor(rng() * vocabulary.length)
  const target = vocabulary[targetIndex]

  // Create player at center
  const player: Player = {
    id: 'player',
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    radius: PLAYER_RADIUS,
    speed: 3,
    shieldCharges: MAX_SHIELD_CHARGES,
    maxShieldCharges: MAX_SHIELD_CHARGES,
  }

  // Spawn initial books (1 correct, 3 decoys)
  const books = spawnBooks(target, vocabulary, rng)

  return {
    status: 'playing',
    player,
    spirits: [],
    books,
    targetWord: target.term,
    mana: INITIAL_MANA,
    vocabularyProgress,
    totalWords: vocabulary.length,
    shieldActive: false,
    shieldTimer: 0,
    gameTime: 0,
    spiritSpawnTimer: 0,
    spiritSpeed: INITIAL_SPIRIT_SPEED,
  }
}

/**
 * Spawn 4 books: 1 correct answer, 3 decoys
 * Books are positioned in quadrants around the arena
 */
export const spawnBooks = (
  target: VocabularyItem,
  vocabulary: VocabularyItem[],
  rng: () => number = Math.random
): Book[] => {
  const books: Book[] = []

  // Create correct book
  const correctBook: Book = {
    id: `book-correct`,
    word: target.term,
    translation: target.translation,
    isCorrect: true,
    radius: BOOK_RADIUS,
    x: 0, // Will be positioned in quadrants
    y: 0,
  }
  books.push(correctBook)

  // Create 3 decoy books
  const decoys = vocabulary
    .filter(v => v.term !== target.term)
    .sort(() => rng() - 0.5)
    .slice(0, 3)

  decoys.forEach((decoy, index) => {
    const decoyBook: Book = {
      id: `book-decoy-${index}`,
      word: decoy.term,
      translation: decoy.translation,
      isCorrect: false,
      radius: BOOK_RADIUS,
      x: 0,
      y: 0,
    }
    books.push(decoyBook)
  })

  // Position books in quadrants
  const quadrants = [
    { x: GAME_WIDTH * 0.25, y: GAME_HEIGHT * 0.25 }, // Top-left
    { x: GAME_WIDTH * 0.75, y: GAME_HEIGHT * 0.25 }, // Top-right
    { x: GAME_WIDTH * 0.25, y: GAME_HEIGHT * 0.75 }, // Bottom-left
    { x: GAME_WIDTH * 0.75, y: GAME_HEIGHT * 0.75 }, // Bottom-right
  ]

  // Shuffle quadrants
  const shuffledQuadrants = quadrants.sort(() => rng() - 0.5)

  books.forEach((book, index) => {
    book.x = shuffledQuadrants[index].x
    book.y = shuffledQuadrants[index].y
  })

  return books
}

/**
 * Spawn a new spirit that moves toward predicted player position
 * Only spawns if timer is ready and no spirit exists
 */
export const spawnSpirit = (
  state: EnchantedLibraryState,
  { rng = Math.random, playerVelocityX = 0, playerVelocityY = 0 }: {
    rng?: () => number,
    playerVelocityX?: number,
    playerVelocityY?: number
  } = {}
): EnchantedLibraryState => {
  // Don't spawn if timer not ready
  if (state.spiritSpawnTimer > 0) {
    return state
  }

  // Don't spawn if spirit already exists (one at a time)
  if (state.spirits.length > 0) {
    return state
  }

  // Calculate predicted player position
  const predictedPlayerX = state.player.x + playerVelocityX * PREDICT_AHEAD_DISTANCE
  const predictedPlayerY = state.player.y + playerVelocityY * PREDICT_AHEAD_DISTANCE

  // Choose random wall to spawn from
  const wall = Math.floor(rng() * 4) // 0=top, 1=right, 2=bottom, 3=left
  let spawnX = 0
  let spawnY = 0

  switch (wall) {
    case 0: // Top wall
      spawnX = rng() * GAME_WIDTH
      spawnY = 0
      break
    case 1: // Right wall
      spawnX = GAME_WIDTH
      spawnY = rng() * GAME_HEIGHT
      break
    case 2: // Bottom wall
      spawnX = rng() * GAME_WIDTH
      spawnY = GAME_HEIGHT
      break
    case 3: // Left wall
      spawnX = 0
      spawnY = rng() * GAME_HEIGHT
      break
  }

  // Calculate velocity toward predicted position
  const dx = predictedPlayerX - spawnX
  const dy = predictedPlayerY - spawnY
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Normalize to spirit speed
  const velocityX = (dx / distance) * state.spiritSpeed
  const velocityY = (dy / distance) * state.spiritSpeed

  const newSpirit: Spirit = {
    id: `spirit-${Date.now()}`,
    x: spawnX,
    y: spawnY,
    radius: SPIRIT_RADIUS,
    velocityX,
    velocityY,
    speed: state.spiritSpeed,
    bounced: false,
  }

  return {
    ...state,
    spirits: [newSpirit],
    spiritSpawnTimer: SPIRIT_SPAWN_RATE_MS,
  }
}

/**
 * Update spirit positions and remove spirits that exit the screen
 * Also handles progressive difficulty (speed increase over time)
 */
export const updateSpirits = (
  state: EnchantedLibraryState,
  dt: number
): EnchantedLibraryState => {
  // Update spirit positions
  const updatedSpirits = state.spirits.map(spirit => ({
    ...spirit,
    x: spirit.x + spirit.velocityX,
    y: spirit.y + spirit.velocityY,
  }))

  // Remove spirits that are off-screen
  const onScreenSpirits = updatedSpirits.filter(spirit => {
    return (
      spirit.x >= -SPIRIT_RADIUS &&
      spirit.x <= GAME_WIDTH + SPIRIT_RADIUS &&
      spirit.y >= -SPIRIT_RADIUS &&
      spirit.y <= GAME_HEIGHT + SPIRIT_RADIUS
    )
  })

  // Increase spirit speed over time (every 10 seconds)
  const speedIncrement = (state.gameTime / 10000) * SPIRIT_SPEED_INCREASE_RATE
  const newSpiritSpeed = INITIAL_SPIRIT_SPEED + speedIncrement

  return {
    ...state,
    spirits: onScreenSpirits,
    spiritSpeed: newSpiritSpeed,
  }
}
