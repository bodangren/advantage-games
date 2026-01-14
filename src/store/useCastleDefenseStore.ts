import { create } from 'zustand'
import { 
  CastleDefenseState, 
  createCastleDefenseState, 
  Player 
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
    if (state.status !== 'playing') return

    // 1. Move Player
    const { player } = state
    let newX = player.x + inputState.dx * player.speed
    let newY = player.y + inputState.dy * player.speed
    
    // Bounds Check (Simple)
    // TODO: Import GAME_WIDTH/HEIGHT for robustness, hardcoded for MVP step
    newX = Math.max(player.radius, Math.min(800 - player.radius, newX))
    newY = Math.max(player.radius, Math.min(600 - player.radius, newY))

    const nextPlayer: Player = {
      ...player,
      x: newX,
      y: newY,
    }

    set({
      gameTime: state.gameTime + dt,
      player: nextPlayer,
      // Placeholder for future logic updates
    })
  },

  reset: () => {
    set(createCastleDefenseState([]))
  }
}))
