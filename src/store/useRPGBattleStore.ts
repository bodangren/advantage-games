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

  addLogEntry: (text, type) => set((state) => ({
    battleLog: [...state.battleLog, { text, type }]
  }))
}))
