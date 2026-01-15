import { create } from 'zustand'
import { 
  CastleDefenseState, 
  createCastleDefenseState, 
  Player,
  MAP_CONFIG,
  spawnWords,
  generateSpawnQueue
} from '@/lib/castleDefense'
import { CASTLE_DEFENSE_CONFIG } from '@/lib/castleDefenseConfig'
import type { VocabularyItem } from '@/store/useGameStore'

export interface CastleDefenseStore extends CastleDefenseState {
  // Actions
  initialize: (vocabulary: VocabularyItem[]) => void
  startGame: () => void
  setPlayerInput: (dx: number, dy: number, drop?: boolean) => void
  tick: (dt: number) => void
  reset: () => void
}

// Temporary input state storage
let inputState = { dx: 0, dy: 0, drop: false }

export const useCastleDefenseStore = create<CastleDefenseStore>((set, get) => ({
  // Initial Empty State
  ...createCastleDefenseState([]),

  initialize: (vocabulary: VocabularyItem[]) => {
    set(createCastleDefenseState(vocabulary))
  },

  startGame: () => {
    set({ status: 'playing' })
  },

  setPlayerInput: (dx: number, dy: number, drop?: boolean) => {
    inputState = { dx, dy, drop: drop || false }
  },

  tick: (dt: number) => {
    const state = get()
    const { player, words, enemies, towers, projectiles, status, hearts, score, gameTime, spawnTimer, wave, waveBudget, spawnQueue, waveCooldownTimer } = state
    
    if (status === 'idle' || status === 'gameover' || status === 'victory') return

    // COOLDOWN STATE
    if (status === 'cooldown') {
        const nextCooldown = waveCooldownTimer - dt
        if (nextCooldown <= 0) {
            // Start Next Wave
            const nextWave = wave + 1
            const nextBudget = Math.floor(CASTLE_DEFENSE_CONFIG.WAVE.INITIAL_BUDGET * Math.pow(CASTLE_DEFENSE_CONFIG.WAVE.MULTIPLIER, nextWave - 1))
            const nextQueue = generateSpawnQueue(nextBudget)
            
            set({
                status: 'playing',
                wave: nextWave,
                waveBudget: nextBudget,
                spawnQueue: nextQueue,
                waveCooldownTimer: 0,
                spawnTimer: 0 // Ready to spawn immediately
            })
        } else {
            set({ waveCooldownTimer: nextCooldown })
        }
        return 
    }

    // MAIN GAME LOGIC
    const nextGameTime = gameTime + dt
    let nextSpawnTimer = spawnTimer + dt
    let nextHearts = hearts
    let nextStatus = status
    let nextScore = score
    let nextEvent: typeof state.lastEvent = null
    let nextSpawnQueue = [...spawnQueue]
    let nextWaveCooldown = waveCooldownTimer

    // 1. Move Player
    let newX = player.x + inputState.dx * player.speed
    let newY = player.y + inputState.dy * player.speed
    newX = Math.max(player.radius, Math.min(800 - player.radius, newX))
    newY = Math.max(player.radius, Math.min(600 - player.radius, newY))
    const nextPlayer: Player = { ...player, x: newX, y: newY }

    // --- DROP LOGIC ---
    let nextInventory = [...player.inventory]
    let eruptionOccurred = false
    let finalWords = [...state.words]

    if (inputState.drop && nextInventory.length > 0) {
        eruptionOccurred = true
        nextEvent = { type: 'erupt', id: Date.now(), x: nextPlayer.x, y: nextPlayer.y }
        nextInventory.forEach(w => {
            finalWords.push({
                ...w,
                isCollected: false,
                x: MAP_CONFIG.wordField.minX + Math.random() * (MAP_CONFIG.wordField.maxX - MAP_CONFIG.wordField.minX),
                y: MAP_CONFIG.wordField.minY + Math.random() * (MAP_CONFIG.wordField.maxY - MAP_CONFIG.wordField.minY)
            })
        })
        nextInventory = []
        inputState.drop = false // Consume input
    }

    // 2. Spawn Enemies
    let spawnedEnemies: typeof enemies = []
    if (status === 'playing') {
        if (enemies.length < CASTLE_DEFENSE_CONFIG.WAVE.MAX_CONCURRENT_ENEMIES && nextSpawnQueue.length > 0) {
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
                        type: type
                    })
                }
            }
        } else if (enemies.length === 0 && nextSpawnQueue.length === 0) {
             nextStatus = 'cooldown'
             nextWaveCooldown = CASTLE_DEFENSE_CONFIG.WAVE.COOLDOWN_MS
        }
    }

    // 3. Move Enemies
    const nextEnemies: typeof enemies = []
    const currentEnemies = [...enemies, ...spawnedEnemies]
    currentEnemies.forEach(enemy => {
        const target = MAP_CONFIG.path[enemy.pathIndex]
        if (!target) {
            nextHearts -= 1
            nextEvent = { type: 'damage', id: Date.now() }
            if (nextHearts <= 0) nextStatus = 'gameover'
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
            nextEnemies.push({ ...enemy, x: enemy.x + moveX, y: enemy.y + moveY, distanceTraveled: enemy.distanceTraveled + enemy.speed })
        }
    })

    // Tower Shooting
    const nextProjectiles: typeof projectiles = []
    const nextTowers = towers.map(tower => {
        if (nextGameTime - tower.lastFired < tower.cooldown) return tower
        let bestTarget: typeof enemies[0] | null = null
        let minDist = tower.range
        nextEnemies.forEach(e => {
            const dx = e.x - tower.x
            const dy = e.y - tower.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < minDist) { minDist = d; bestTarget = e; }
        })
        if (bestTarget) {
            nextProjectiles.push({
                id: `proj-${Date.now()}-${Math.random()}`,
                x: tower.x,
                y: tower.y,
                radius: 5,
                targetId: bestTarget.id,
                damage: tower.damage,
                speed: 8
            })
            return { ...tower, lastFired: nextGameTime }
        }
        return tower
    })

    // Projectile Collision
    const liveProjectiles: typeof projectiles = []
    const currentProjectiles = [...projectiles, ...nextProjectiles]
    currentProjectiles.forEach(proj => {
        const target = nextEnemies.find(e => e.id === proj.targetId)
        if (!target) return
        const dx = target.x - proj.x
        const dy = target.y - proj.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < target.radius + proj.radius) {
            target.hp -= proj.damage
            if (!nextEvent) nextEvent = { type: 'hit', id: Date.now(), x: target.x, y: target.y }
            if (target.hp <= 0) {
                const stats = CASTLE_DEFENSE_CONFIG.ENEMIES[target.type]
                nextScore += stats.reward
                const idx = nextEnemies.indexOf(target)
                if (idx > -1) nextEnemies.splice(idx, 1)
            }
        } else {
            const moveX = (dx / dist) * proj.speed
            const moveY = (dy / dist) * proj.speed
            liveProjectiles.push({ ...proj, x: proj.x + moveX, y: proj.y + moveY })
        }
    })

    // 4. WIN CONDITION
    if (nextTowers.length === MAP_CONFIG.towerSlots.length && nextEnemies.length === 0 && nextSpawnQueue.length === 0 && nextStatus !== 'gameover') {
        nextStatus = 'victory'
    }

    // 5. Word Collection (Only if didn't drop)
    if (!eruptionOccurred) {
        const collectedWords: typeof words = []
        const remainingWords: typeof words = []
        finalWords.forEach(word => {
            const dx = nextPlayer.x - word.x
            const dy = nextPlayer.y - word.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < player.radius + word.radius) {
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

    // 6. Tower Activation
    let towerBuilt = false
    const { towerSlots } = MAP_CONFIG

    if (nextInventory.length > 0) {
        for (const slot of towerSlots) {
            if (nextTowers.some(t => t.x === slot.x && t.y === slot.y)) continue
            const dx = nextPlayer.x - slot.x
            const dy = nextPlayer.y - slot.y
            if (Math.sqrt(dx * dx + dy * dy) < 40) {
                const expectedWords = state.targetSentence.split(' ')
                if (nextInventory.length === expectedWords.length && nextInventory.every((w, i) => w.text === expectedWords[i])) {
                    nextTowers.push({ 
                        id: `tower-${Date.now()}`, 
                        x: slot.x, 
                        y: slot.y, 
                        radius: 30, 
                        range: CASTLE_DEFENSE_CONFIG.TOWER.RANGE, 
                        damage: CASTLE_DEFENSE_CONFIG.TOWER.DAMAGE, 
                        cooldown: CASTLE_DEFENSE_CONFIG.TOWER.COOLDOWN, 
                        lastFired: 0 
                    })
                    nextInventory = []
                    towerBuilt = true
                    nextEvent = { type: 'build', id: Date.now(), x: slot.x, y: slot.y }
                } else if (nextInventory.length >= expectedWords.length) {
                    eruptionOccurred = true
                    nextEvent = { type: 'erupt', id: Date.now(), x: slot.x, y: slot.y }
                    nextInventory.forEach(w => {
                        finalWords.push({ ...w, isCollected: false, x: MAP_CONFIG.wordField.minX + Math.random() * (MAP_CONFIG.wordField.maxX - MAP_CONFIG.wordField.minX), y: MAP_CONFIG.wordField.minY + Math.random() * (MAP_CONFIG.wordField.maxY - MAP_CONFIG.wordField.minY) })
                    })
                    nextInventory = []
                }
                break
            }
        }
    }

    if (towerBuilt) {
        const { vocabulary } = state
        let nextTargetSentence = state.targetSentence
        let nextTargetTranslation = state.targetTranslation
        let nextWords: typeof words = []

        if (nextTowers.length < MAP_CONFIG.towerSlots.length) {
            const nextTarget = vocabulary[Math.floor(Math.random() * vocabulary.length)]
            nextTargetSentence = nextTarget.term
            nextTargetTranslation = nextTarget.translation
            nextWords = spawnWords(nextTarget, vocabulary)
        }

        set({
            gameTime: nextGameTime, spawnTimer: nextSpawnTimer, hearts: nextHearts, status: nextStatus, score: nextScore + 50,
            player: { ...nextPlayer, inventory: [] },
            enemies: nextEnemies, towers: nextTowers, projectiles: liveProjectiles,
            words: nextWords, targetSentence: nextTargetSentence, targetTranslation: nextTargetTranslation,
            lastEvent: nextEvent, spawnQueue: nextSpawnQueue, waveCooldownTimer: nextWaveCooldown
        })
    } else {
        set({
            gameTime: nextGameTime, spawnTimer: nextSpawnTimer, hearts: nextHearts, status: nextStatus, score: nextScore,
            player: { ...nextPlayer, inventory: nextInventory },
            enemies: nextEnemies, towers: nextTowers, projectiles: liveProjectiles,
            words: finalWords, // eruptionOccurred logic is handled by finalWords modification
            lastEvent: nextEvent, spawnQueue: nextSpawnQueue, waveCooldownTimer: nextWaveCooldown
        })
    }
  },

  reset: () => {
    set(createCastleDefenseState([]))
  }
}))
