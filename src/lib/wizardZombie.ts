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
export const SPAWN_RATE_MS = 1000

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

export type InputState = {
  dx: number // -1, 0, 1
  dy: number // -1, 0, 1
}

export const advanceWizardZombieTime = (
  state: WizardZombieState,
  dt: number,
  input: InputState = { dx: 0, dy: 0 }
): WizardZombieState => {
  // Normalize vector if diagonal to prevent faster speed
  let moveX = input.dx
  let moveY = input.dy
  if (moveX !== 0 && moveY !== 0) {
    const invSqrt2 = 0.70710678118
    moveX *= invSqrt2
    moveY *= invSqrt2
  }

  const speed = state.player.speed
  // Scale speed by dt? Usually speed is px/frame or px/sec. 
  // Let's assume speed is px/frame (approx 16ms). If dt is 50ms, we scale.
  // Base frame is 16.6ms. 
  // speedFactor = dt / 16.6
  const speedFactor = dt / 16.6
  
  let newX = state.player.x + moveX * speed * speedFactor
  let newY = state.player.y + moveY * speed * speedFactor

  // Clamp to bounds
  newX = Math.max(PLAYER_RADIUS, Math.min(GAME_WIDTH - PLAYER_RADIUS, newX))
  newY = Math.max(PLAYER_RADIUS, Math.min(GAME_HEIGHT - PLAYER_RADIUS, newY))

  const nextState = {
    ...state,
    gameTime: state.gameTime + dt,
    player: {
      ...state.player,
      x: newX,
      y: newY,
    }
  }

  return updateZombies(nextState, dt, speedFactor)
}

function updateZombies(state: WizardZombieState, dt: number, speedFactor: number): WizardZombieState {
  let { zombies, spawnTimer } = state
  spawnTimer += dt

  // Spawn Logic (Cap at 50)
  if (spawnTimer >= SPAWN_RATE_MS && zombies.length < 50) {
    spawnTimer = 0
    const gateIndex = Math.floor(Math.random() * 4) // 0-3
    const gates = [
        { x: GAME_WIDTH / 2, y: -50 }, // N
        { x: GAME_WIDTH / 2, y: GAME_HEIGHT + 50 }, // S
        { x: -50, y: GAME_HEIGHT / 2 }, // W
        { x: GAME_WIDTH + 50, y: GAME_HEIGHT / 2 }, // E
    ]
    const gate = gates[gateIndex]
    
    zombies = [
        ...zombies,
        {
            id: `zombie-${Date.now()}-${Math.random()}`,
            x: gate.x,
            y: gate.y,
            radius: ZOMBIE_RADIUS,
            speed: 1.5 + (state.difficultyMultiplier * 0.1), // Mild speed increase
            damage: 10
        }
    ]
  }

  // Move Zombies (Vector-based optimization)
  const nextZombies = zombies.map(z => {
      let dx = state.player.x - z.x
      let dy = state.player.y - z.y
      
      // Add cheap noise to the target vector BEFORE normalization
      // This is much faster than trig functions
      dx += (Math.random() - 0.5) * 200 // Increased wander influence
      dy += (Math.random() - 0.5) * 200

      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 1) return z 

      // Normalize and scale
      const moveX = (dx / dist) * z.speed * speedFactor
      const moveY = (dy / dist) * z.speed * speedFactor
      
      return {
          ...z,
          x: z.x + moveX,
          y: z.y + moveY
      }
  })

  return {
      ...state,
      zombies: nextZombies,
      spawnTimer
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

  // Use all 4 quadrants
  const selectedQuadrants = quadrants
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

  // Decoy orbs (3 decoys)
  const otherWords = vocabulary.filter((v) => v.id !== target.id)
  for (let i = 1; i < 4; i++) {
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
