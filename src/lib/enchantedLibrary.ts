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
