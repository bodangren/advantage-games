import type { VocabularyItem } from '@/store/useGameStore'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TILE_SIZE,
  PLAYER_RADIUS,
  WORD_RADIUS,
  PROJECTILE_RADIUS,
  MAP_CONFIG,
  createCastleDefenseState,
  generateSpawnQueue,
  spawnWords,
  type CastleDefenseState,
  type Player,
  type Enemy,
  type Tower,
  type Projectile,
  type Word,
} from './castleDefense'
import { CASTLE_DEFENSE_CONFIG } from './castleDefenseConfig'

export const GAME_TICK_MS = 50
export const ANIMATION_FRAME_MS = 150

export type InputState = {
  dx: number
  dy: number
  drop?: boolean
}

export {
  GAME_WIDTH,
  GAME_HEIGHT,
  TILE_SIZE,
  PLAYER_RADIUS,
  WORD_RADIUS,
  PROJECTILE_RADIUS,
  MAP_CONFIG,
}

export type {
  CastleDefenseState,
  Player,
  Enemy,
  Tower,
  Projectile,
  Word,
}

export function createInitialState(vocabulary: VocabularyItem[]): CastleDefenseState {
  return createCastleDefenseState(vocabulary)
}

export function advanceCastleDefenseTime(
  state: CastleDefenseState,
  dt: number,
  input: InputState,
  vocabulary: VocabularyItem[]
): CastleDefenseState {
  if (state.status === 'idle' || state.status === 'gameover' || state.status === 'victory') {
    return state
  }

  if (state.status === 'cooldown') {
    const nextCooldown = state.waveCooldownTimer - dt
    if (nextCooldown <= 0) {
      const nextWave = state.wave + 1
      const nextBudget = Math.floor(
        CASTLE_DEFENSE_CONFIG.WAVE.INITIAL_BUDGET * Math.pow(CASTLE_DEFENSE_CONFIG.WAVE.MULTIPLIER, nextWave - 1)
      )
      const nextQueue = generateSpawnQueue(nextBudget)
      return {
        ...state,
        status: 'playing',
        wave: nextWave,
        waveBudget: nextBudget,
        spawnQueue: nextQueue,
        waveCooldownTimer: 0,
        spawnTimer: 0,
      }
    }
    return { ...state, waveCooldownTimer: nextCooldown }
  }

  const nextGameTime = state.gameTime + dt
  let nextSpawnTimer = state.spawnTimer + dt
  let nextHearts = state.hearts
  let nextStatus: CastleDefenseState['status'] = state.status
  let nextScore = state.score
  let nextEvent: CastleDefenseState['lastEvent'] = null
  const nextSpawnQueue = [...state.spawnQueue]
  let nextWaveCooldown = state.waveCooldownTimer
  let isGameOver = false

  // 1. Move Player
  let newX = state.player.x + input.dx * state.player.speed
  let newY = state.player.y + input.dy * state.player.speed
  newX = Math.max(state.player.radius, Math.min(GAME_WIDTH - state.player.radius, newX))
  newY = Math.max(state.player.radius, Math.min(GAME_HEIGHT - state.player.radius, newY))
  const nextPlayer: Player = { ...state.player, x: newX, y: newY }

  // 2. Drop logic
  let nextInventory = [...state.player.inventory]
  let eruptionOccurred = false
  let finalWords = [...state.words]

  if (input.drop && nextInventory.length > 0) {
    eruptionOccurred = true
    nextEvent = { type: 'erupt', id: Date.now(), x: nextPlayer.x, y: nextPlayer.y }
    nextInventory.forEach(w => {
      finalWords.push({
        ...w,
        isCollected: false,
        x: MAP_CONFIG.wordField.minX + Math.random() * (MAP_CONFIG.wordField.maxX - MAP_CONFIG.wordField.minX),
        y: MAP_CONFIG.wordField.minY + Math.random() * (MAP_CONFIG.wordField.maxY - MAP_CONFIG.wordField.minY),
      })
    })
    nextInventory = []
  }

  // 3. Spawn Enemies
  const spawnedEnemies: Enemy[] = []
  if (nextStatus === 'playing') {
    if (
      state.enemies.length < CASTLE_DEFENSE_CONFIG.WAVE.MAX_CONCURRENT_ENEMIES &&
      nextSpawnQueue.length > 0
    ) {
      if (nextSpawnTimer >= 1500) {
        nextSpawnTimer = 0
        const type = nextSpawnQueue.shift()
        if (type) {
          const stats = CASTLE_DEFENSE_CONFIG.ENEMIES[type]
          spawnedEnemies.push({
            id: `enemy-${Date.now()}-${Math.random()}`,
            x: MAP_CONFIG.spawnPoint.x,
            y: MAP_CONFIG.spawnPoint.y,
            radius: stats.radius,
            hp: stats.hp,
            maxHp: stats.hp,
            speed: stats.speed,
            pathIndex: 1,
            distanceTraveled: 0,
            type,
          })
        }
      }
    } else if (state.enemies.length === 0 && nextSpawnQueue.length === 0) {
      nextStatus = 'cooldown'
      nextWaveCooldown = CASTLE_DEFENSE_CONFIG.WAVE.COOLDOWN_MS
    }
  }

  // 4. Move Enemies
  const nextEnemies: Enemy[] = []
  const currentEnemies = [...state.enemies, ...spawnedEnemies]
  currentEnemies.forEach(enemy => {
    const target = MAP_CONFIG.path[enemy.pathIndex]
    if (!target) {
      nextHearts -= 1
      nextEvent = { type: 'damage', id: Date.now() }
      if (nextHearts <= 0) {
        nextStatus = 'gameover'
        isGameOver = true
      }
      return
    }
    const dx = target.x - enemy.x
    const dy = target.y - enemy.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 5) {
      nextEnemies.push({ ...enemy, pathIndex: enemy.pathIndex + 1 })
    } else {
      const moveX = (dx / dist) * enemy.speed
      const moveY = (dy / dist) * enemy.speed
      nextEnemies.push({
        ...enemy,
        x: enemy.x + moveX,
        y: enemy.y + moveY,
        distanceTraveled: enemy.distanceTraveled + enemy.speed,
      })
    }
  })

  // 5. Tower Shooting
  const nextProjectiles: Projectile[] = []
  const nextTowers = state.towers.map(tower => {
    if (nextGameTime - tower.lastFired < tower.cooldown) return tower
    let bestTarget: Enemy | null = null
    let minDist = tower.range
    for (const enemy of nextEnemies) {
      const dx = enemy.x - tower.x
      const dy = enemy.y - tower.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDist) {
        minDist = dist
        bestTarget = enemy
      }
    }
    if (bestTarget) {
      nextProjectiles.push({
        id: `proj-${Date.now()}-${Math.random()}`,
        x: tower.x,
        y: tower.y,
        radius: PROJECTILE_RADIUS,
        targetId: bestTarget.id,
        damage: tower.damage,
        speed: 8,
      })
      return { ...tower, lastFired: nextGameTime }
    }
    return tower
  })

  // 6. Projectile Collision
  const liveProjectiles: Projectile[] = []
  const currentProjectiles = [...state.projectiles, ...nextProjectiles]
  let updatedEnemies = [...nextEnemies]

  currentProjectiles.forEach(proj => {
    const targetIndex = updatedEnemies.findIndex(e => e.id === proj.targetId)
    if (targetIndex === -1) return

    const target = updatedEnemies[targetIndex]
    const dx = target.x - proj.x
    const dy = target.y - proj.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < target.radius + proj.radius) {
      const nextHp = target.hp - proj.damage
      if (!nextEvent) nextEvent = { type: 'hit', id: Date.now(), x: target.x, y: target.y }

      if (nextHp <= 0) {
        const stats = CASTLE_DEFENSE_CONFIG.ENEMIES[target.type]
        nextScore += stats.reward
        updatedEnemies = updatedEnemies.filter(e => e.id !== target.id)
      } else {
        updatedEnemies[targetIndex] = { ...target, hp: nextHp }
      }
    } else {
      const moveX = (dx / dist) * proj.speed
      const moveY = (dy / dist) * proj.speed
      liveProjectiles.push({ ...proj, x: proj.x + moveX, y: proj.y + moveY })
    }
  })

  // 7. Win Condition
  if (!isGameOver && nextTowers.length === MAP_CONFIG.towerSlots.length && updatedEnemies.length === 0 && nextSpawnQueue.length === 0) {
    nextStatus = 'victory'
  }

  // 8. Word Collection (Only if didn't drop)
  if (!eruptionOccurred) {
    const collectedWords: Word[] = []
    const remainingWords: Word[] = []
    finalWords.forEach(word => {
      const dx = nextPlayer.x - word.x
      const dy = nextPlayer.y - word.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < nextPlayer.radius + word.radius) {
        collectedWords.push({ ...word, isCollected: true })
      } else {
        remainingWords.push(word)
      }
    })

    if (collectedWords.length > 0) {
      nextInventory = [...nextInventory, ...collectedWords]
      finalWords = remainingWords
    }
  }

  // 9. Tower Activation
  let towerBuilt = false
  const { towerSlots } = MAP_CONFIG

  if (nextInventory.length > 0) {
    for (const slot of towerSlots) {
      if (nextTowers.some(t => t.x === slot.x && t.y === slot.y)) continue
      const dx = nextPlayer.x - slot.x
      const dy = nextPlayer.y - slot.y
      if (Math.sqrt(dx * dx + dy * dy) < 40) {
        const expectedWords = state.targetSentence.split(' ')
        if (
          nextInventory.length === expectedWords.length &&
          nextInventory.every((w, i) => w.text === expectedWords[i])
        ) {
          nextTowers.push({
            id: `tower-${Date.now()}`,
            x: slot.x,
            y: slot.y,
            radius: 30,
            range: CASTLE_DEFENSE_CONFIG.TOWER.RANGE,
            damage: CASTLE_DEFENSE_CONFIG.TOWER.DAMAGE,
            cooldown: CASTLE_DEFENSE_CONFIG.TOWER.COOLDOWN,
            lastFired: 0,
          })
          nextInventory = []
          towerBuilt = true
          nextEvent = { type: 'build', id: Date.now(), x: slot.x, y: slot.y }
        } else if (nextInventory.length >= expectedWords.length) {
          eruptionOccurred = true
          nextEvent = { type: 'erupt', id: Date.now(), x: slot.x, y: slot.y }
          nextInventory.forEach(w => {
            finalWords.push({
              ...w,
              isCollected: false,
              x: MAP_CONFIG.wordField.minX + Math.random() * (MAP_CONFIG.wordField.maxX - MAP_CONFIG.wordField.minX),
              y: MAP_CONFIG.wordField.minY + Math.random() * (MAP_CONFIG.wordField.maxY - MAP_CONFIG.wordField.minY),
            })
          })
          nextInventory = []
        }
        break
      }
    }
  }

  if (towerBuilt) {
    const vocabList = vocabulary.length > 0 ? vocabulary : state.vocabulary
    let nextTargetSentence = state.targetSentence
    let nextTargetTranslation = state.targetTranslation
    let nextWords: Word[] = []

    if (nextTowers.length < MAP_CONFIG.towerSlots.length) {
      const nextTarget = vocabList[Math.floor(Math.random() * vocabList.length)]
      nextTargetSentence = nextTarget.term
      nextTargetTranslation = nextTarget.translation
      nextWords = spawnWords(nextTarget)
    }

    return {
      ...state,
      gameTime: nextGameTime,
      spawnTimer: nextSpawnTimer,
      hearts: nextHearts,
      status: nextStatus,
      score: nextScore + 50,
      player: { ...nextPlayer, inventory: [] },
      enemies: updatedEnemies,
      towers: nextTowers,
      projectiles: liveProjectiles,
      words: nextWords,
      targetSentence: nextTargetSentence,
      targetTranslation: nextTargetTranslation,
      lastEvent: nextEvent,
      spawnQueue: nextSpawnQueue,
      waveCooldownTimer: nextWaveCooldown,
    }
  }

  return {
    ...state,
    gameTime: nextGameTime,
    spawnTimer: nextSpawnTimer,
    hearts: nextHearts,
    status: nextStatus,
    score: nextScore,
    player: { ...nextPlayer, inventory: nextInventory },
    enemies: updatedEnemies,
    towers: nextTowers,
    projectiles: liveProjectiles,
    words: finalWords,
    lastEvent: nextEvent,
    spawnQueue: nextSpawnQueue,
    waveCooldownTimer: nextWaveCooldown,
  }
}
