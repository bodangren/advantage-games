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
  hp: number
  maxHp: number
  speed: number
  shockwaveCharges: number
  maxShockwaveCharges: number
  invulnerabilityTime: number
}

export type Zombie = Entity & {
  speed: number
  damage: number
}

export type Orb = Entity & {
  word: string
  translation: string
  isCorrect: boolean
}

export type WizardZombieState = {
  status: 'playing' | 'gameover'
  player: Player
  zombies: Zombie[]
  orbs: Orb[]
  targetWord: string
  score: number
  correctAnswers: number
  totalAttempts: number
  spawnTimer: number
  difficultyMultiplier: number
  gameTime: number
}

export type WizardZombieConfig = {
  rng?: () => number
}

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const PLAYER_RADIUS = 20
export const ZOMBIE_RADIUS = 15
export const ORB_RADIUS = 25
export const INITIAL_HP = 100
export const MAX_SHOCKWAVE_CHARGES = 3
export const INVULNERABILITY_DURATION = 500 // ms

export const createWizardZombieState = (
  vocabulary: VocabularyItem[],
  { rng = Math.random }: WizardZombieConfig = {}
): WizardZombieState => {
  if (vocabulary.length === 0) {
    throw new Error('Vocabulary cannot be empty')
  }

  const targetIndex = Math.floor(rng() * vocabulary.length)
  const target = vocabulary[targetIndex]
  
  const player: Player = {
    id: 'player',
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    radius: PLAYER_RADIUS,
    hp: INITIAL_HP,
    maxHp: INITIAL_HP,
    speed: 3,
    shockwaveCharges: 0,
    maxShockwaveCharges: MAX_SHOCKWAVE_CHARGES,
    invulnerabilityTime: 0,
  }

  const orbs = spawnOrbs(target, vocabulary, rng)

  return {
    status: 'playing',
    player,
    zombies: [],
    orbs,
    targetWord: target.term,
    score: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    spawnTimer: 0,
    difficultyMultiplier: 1,
    gameTime: 0,
  }
}

function spawnOrbs(
  target: VocabularyItem,
  vocabulary: VocabularyItem[],
  rng: () => number
): Orb[] {
  const quadrants = [
    { minX: 50, maxX: GAME_WIDTH / 2 - 50, minY: 50, maxY: GAME_HEIGHT / 2 - 50 }, // NW
    { minX: GAME_WIDTH / 2 + 50, maxX: GAME_WIDTH - 50, minY: 50, maxY: GAME_HEIGHT / 2 - 50 }, // NE
    { minX: 50, maxX: GAME_WIDTH / 2 - 50, minY: GAME_HEIGHT / 2 + 50, maxY: GAME_HEIGHT - 50 }, // SW
    { minX: GAME_WIDTH / 2 + 50, maxX: GAME_WIDTH - 50, minY: GAME_HEIGHT / 2 + 50, maxY: GAME_HEIGHT - 50 }, // SE
  ]

  // Shuffle quadrants
  for (let i = quadrants.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[quadrants[i], quadrants[j]] = [quadrants[j], quadrants[i]]
  }

  const selectedQuadrants = quadrants.slice(0, 3)
  const orbs: Orb[] = []

  // Correct orb
  const qCorrect = selectedQuadrants[0]
  orbs.push({
    id: `orb-correct-${Date.now()}`,
    x: qCorrect.minX + rng() * (qCorrect.maxX - qCorrect.minX),
    y: qCorrect.minY + rng() * (qCorrect.maxY - qCorrect.minY),
    radius: ORB_RADIUS,
    word: target.term,
    translation: target.translation,
    isCorrect: true,
  })

  // Decoy orbs
  const otherWords = vocabulary.filter((v) => v.id !== target.id)
  for (let i = 1; i < 3; i++) {
    const q = selectedQuadrants[i]
    let decoy: VocabularyItem
    if (otherWords.length > 0) {
      const dIndex = Math.floor(rng() * otherWords.length)
      decoy = otherWords.splice(dIndex, 1)[0]
    } else {
      decoy = target
    }

    orbs.push({
      id: `orb-decoy-${i}-${Date.now()}`,
      x: q.minX + rng() * (q.maxX - q.minX),
      y: q.minY + rng() * (q.maxY - q.minY),
      radius: ORB_RADIUS,
      word: target.term,
      translation: decoy.translation,
      isCorrect: false,
    })
  }

  return orbs
}
