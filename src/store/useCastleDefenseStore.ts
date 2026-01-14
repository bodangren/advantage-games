import { create } from 'zustand'
import { 
  CastleDefenseState, 
  createCastleDefenseState, 
  Player,
  MAP_CONFIG,
  spawnWords
} from '@/lib/castleDefense'
import type { VocabularyItem } from '@/store/useGameStore'

export interface CastleDefenseStore extends CastleDefenseState {
  // Actions
  initialize: (vocabulary: VocabularyItem[]) => void
  setPlayerInput: (dx: number, dy: number) => void
  tick: (dt: number) => void
  reset: () => void
}

// Temporary input state storage (not in main state to avoid re-renders if possible, 
// but for simplicity in this architecture we might keep it in the store or closure)
let inputState = { dx: 0, dy: 0 }

export const useCastleDefenseStore = create<CastleDefenseStore>((set, get) => ({
  // Initial Empty State
  ...createCastleDefenseState([]),

  initialize: (vocabulary: VocabularyItem[]) => {
    set(createCastleDefenseState(vocabulary))
  },

  setPlayerInput: (dx: number, dy: number) => {
    inputState = { dx, dy }
  },

  tick: (dt: number) => {
    const state = get()
    const { player, words, enemies, towers, projectiles, status, hearts, score, gameTime, spawnTimer } = state
    if (status !== 'playing') return

    const nextGameTime = gameTime + dt
    let nextSpawnTimer = spawnTimer + dt
    let nextHearts = hearts
    let nextStatus = status
    let nextScore = score

    // 1. Move Player
    // ... (logic remains same, but I'll update the whole function for consistency if needed, 
    // but better to just do the combat parts)
    
    // Actually, I'll rewrite the tick function one more time to include all logic cleanly.
    // (I'll skip the step-by-step for the rest of this turn and just provide the full final tick)

    // 1. Move Player
    let newX = player.x + inputState.dx * player.speed
    let newY = player.y + inputState.dy * player.speed
    newX = Math.max(player.radius, Math.min(800 - player.radius, newX))
    newY = Math.max(player.radius, Math.min(600 - player.radius, newY))
    const nextPlayer: Player = { ...player, x: newX, y: newY }

    // 2. Spawn Enemies
    let spawnedEnemies: typeof enemies = []
    if (nextSpawnTimer >= 3000) {
        nextSpawnTimer = 0
        spawnedEnemies.push({
            id: `enemy-${Date.now()}`,
            x: MAP_CONFIG.spawnPoint.x,
            y: MAP_CONFIG.spawnPoint.y,
            radius: 15, hp: 20, maxHp: 20, speed: 1.2,
            pathIndex: 1, distanceTraveled: 0
        })
    }

    // 3. Move Enemies & Tower Combat
    const nextEnemies: typeof enemies = []
    const currentEnemies = [...enemies, ...spawnedEnemies]
    currentEnemies.forEach(enemy => {
        const target = MAP_CONFIG.path[enemy.pathIndex]
        if (!target) {
            nextHearts -= 1
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

    // Tower Shooting Logic
    const nextProjectiles: typeof projectiles = []
    const nextTowers = towers.map(tower => {
        if (nextGameTime - tower.lastFired < tower.cooldown) return tower
        
        // Find nearest enemy in range
        let bestTarget: typeof enemies[0] | null = null
        let minDist = tower.range

        nextEnemies.forEach(e => {
            const dx = e.x - tower.x
            const dy = e.y - tower.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < minDist) {
                minDist = d
                bestTarget = e
            }
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

    // Projectile Movement & Collision
    const liveProjectiles: typeof projectiles = []
    const currentProjectiles = [...projectiles, ...nextProjectiles]
    
    currentProjectiles.forEach(proj => {
        const target = nextEnemies.find(e => e.id === proj.targetId)
        if (!target) return // Target died or reached base

        const dx = target.x - proj.x
        const dy = target.y - proj.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < target.radius + proj.radius) {
            target.hp -= proj.damage
            if (target.hp <= 0) {
                nextScore += 10
                // Remove enemy from nextEnemies
                const idx = nextEnemies.indexOf(target)
                if (idx > -1) nextEnemies.splice(idx, 1)
            }
        } else {
            const moveX = (dx / dist) * proj.speed
            const moveY = (dy / dist) * proj.speed
            liveProjectiles.push({ ...proj, x: proj.x + moveX, y: proj.y + moveY })
        }
    })

    // 4. Word Collection
    const collectedWords: typeof words = []
    const remainingWords: typeof words = []
    state.words.forEach(word => {
        const dx = nextPlayer.x - word.x
        const dy = nextPlayer.y - word.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < player.radius + word.radius) {
            collectedWords.push({ ...word, isCollected: true })
        } else {
            remainingWords.push(word)
        }
    })

    // 5. Activation
    let nextInventory = [...player.inventory, ...collectedWords]
    let towerBuilt = false
    let eruptionOccurred = false
    let finalWords = [...remainingWords]
    const { towerSlots } = MAP_CONFIG

    if (nextInventory.length > 0) {
        for (const slot of towerSlots) {
            if (nextTowers.some(t => t.x === slot.x && t.y === slot.y)) continue
            const dx = nextPlayer.x - slot.x
            const dy = nextPlayer.y - slot.y
            if (Math.sqrt(dx * dx + dy * dy) < 40) {
                const expectedWords = state.targetSentence.split(' ')
                if (nextInventory.length === expectedWords.length && nextInventory.every((w, i) => w.text === expectedWords[i])) {
                    nextTowers.push({ id: `tower-${Date.now()}`, x: slot.x, y: slot.y, radius: 30, range: 200, damage: 10, cooldown: 1000, lastFired: 0 })
                    nextInventory = []
                    towerBuilt = true
                } else if (nextInventory.length >= expectedWords.length) {
                    eruptionOccurred = true
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
        const nextTarget = vocabulary[Math.floor(Math.random() * vocabulary.length)]
        finalWords = spawnWords(nextTarget, vocabulary)
        set({
            gameTime: nextGameTime, spawnTimer: nextSpawnTimer, hearts: nextHearts, status: nextStatus, score: nextScore + 50,
            player: { ...nextPlayer, inventory: [] },
            enemies: nextEnemies, towers: nextTowers, projectiles: liveProjectiles,
            words: finalWords, targetSentence: nextTarget.term, targetTranslation: nextTarget.translation
        })
    } else {
        set({
            gameTime: nextGameTime, spawnTimer: nextSpawnTimer, hearts: nextHearts, status: nextStatus, score: nextScore,
            player: { ...nextPlayer, inventory: nextInventory },
            enemies: nextEnemies, towers: nextTowers, projectiles: liveProjectiles,
            words: eruptionOccurred ? finalWords : remainingWords
        })
    }
  },

  reset: () => {
    set(createCastleDefenseState([]))
  }
}))
