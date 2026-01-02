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
  inputLocked: boolean
  revealedTranslation: string | null
  
  // Actions
  initializeBattle: () => void
  setTurn: (turn: BattleTurn) => void
  setStatus: (status: BattleStatus) => void
  damagePlayer: (amount: number) => void
  damageEnemy: (amount: number) => void
  submitAnswer: (input: string, expected: string) => boolean
  addLogEntry: (text: string, type: BattleLogEntry['type']) => void
}

let revealTimeout: ReturnType<typeof setTimeout> | null = null

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
  inputLocked: false,
  revealedTranslation: null,

  initializeBattle: () => set({
    playerHealth: 100,
    playerMaxHealth: 100,
    enemyHealth: 100,
    enemyMaxHealth: 100,
    turn: 'player',
    status: 'playing',
    battleLog: [{ text: 'A wild monster appears!', type: 'system' }],
    streak: 0,
    xpEarned: 0,
    inputLocked: false,
    revealedTranslation: null
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

  submitAnswer: (input, expected) => {
    const normalizedInput = input.trim().toLowerCase()
    const normalizedExpected = expected.trim().toLowerCase()
    const isCorrect = normalizedInput === normalizedExpected

    if (revealTimeout) {
      clearTimeout(revealTimeout)
      revealTimeout = null
    }

    if (isCorrect) {
      set((state) => ({
        inputLocked: false,
        revealedTranslation: null,
        streak: state.streak + 1,
      }))
      return true
    }

    set({ inputLocked: true, revealedTranslation: expected, streak: 0 })
    revealTimeout = setTimeout(() => {
      set({ inputLocked: false, revealedTranslation: null })
      revealTimeout = null
    }, 2000)

    return false
  },

  addLogEntry: (text, type) => set((state) => ({
    battleLog: [...state.battleLog, { text, type }]
  }))
}))
