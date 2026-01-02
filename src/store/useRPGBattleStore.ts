import { create } from 'zustand'

export type BattleStatus = 'idle' | 'playing' | 'victory' | 'defeat'
export type BattleTurn = 'player' | 'enemy'

export interface BattleLogEntry {
  text: string
  type: 'player' | 'enemy' | 'system'
}

export interface RPGBattleState {
  playerHealth: number
  playerMaxHealth: number
  enemyHealth: number
  enemyMaxHealth: number
  turn: BattleTurn
  status: BattleStatus
  battleLog: BattleLogEntry[]
  streak: number
  xpEarned: number
  
  // Actions
  initializeBattle: () => void
  setTurn: (turn: BattleTurn) => void
  setStatus: (status: BattleStatus) => void
  damagePlayer: (amount: number) => void
  damageEnemy: (amount: number) => void
  addLogEntry: (text: string, type: BattleLogEntry['type']) => void
}

export const useRPGBattleStore = create<RPGBattleState>((set) => ({
  playerHealth: 100,
  playerMaxHealth: 100,
  enemyHealth: 100,
  enemyMaxHealth: 100,
  turn: 'player',
  status: 'idle',
  battleLog: [],
  streak: 0,
  xpEarned: 0,

  initializeBattle: () => set({
    playerHealth: 100,
    playerMaxHealth: 100,
    enemyHealth: 100,
    enemyMaxHealth: 100,
    turn: 'player',
    status: 'playing',
    battleLog: [{ text: 'A wild monster appears!', type: 'system' }],
    streak: 0,
    xpEarned: 0
  }),

  setTurn: (turn) => set({ turn }),
  setStatus: (status) => set({ status }),

  damagePlayer: (amount) => set((state) => {
    const nextHealth = Math.max(0, state.playerHealth - amount)
    const nextStatus = state.status === 'playing' && nextHealth <= 0 ? 'defeat' : state.status

    return { playerHealth: nextHealth, status: nextStatus }
  }),

  damageEnemy: (amount) => set((state) => {
    const nextHealth = Math.max(0, state.enemyHealth - amount)
    const nextStatus = state.status === 'playing' && nextHealth <= 0 ? 'victory' : state.status

    return { enemyHealth: nextHealth, status: nextStatus }
  }),

  addLogEntry: (text, type) => set((state) => ({
    battleLog: [...state.battleLog, { text, type }]
  }))
}))
