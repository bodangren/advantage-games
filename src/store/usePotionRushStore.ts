import { create } from 'zustand'
import { VocabularyItem } from '@/store/useGameStore'

// --- Types ---

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'

export type CauldronState = 'IDLE' | 'BREWING' | 'WARNING' | 'COMPLETED'

export interface Cauldron {
  id: number
  state: CauldronState
  targetSentence: VocabularyItem | null
  currentWords: string[]
  // For visual feedback
  shake: boolean
}

export type CustomerType = 'orc' | 'elf' | 'wizard' | 'dwarf' | 'goblin' | 'human' | 'skeleton'

export interface Customer {
  id: string
  type: CustomerType
  request: VocabularyItem
  patience: number // 0-100 or seconds
  maxPatience: number
  state: 'WAITING' | 'LEAVING_ANGRY' | 'LEAVING_HAPPY'
  cauldronId?: number // If served, which cauldron served them (for animation)
}

export interface Ingredient {
  id: string
  word: string
  x: number
  y: number // usually fixed Y on the belt
  type: 'potion' | 'mushroom' | 'mineral' | 'herb'
  width: number
}

interface PotionRushState {
  // Game Status
  gameState: GameState
  score: number
  lives: number // Shop reputation?
  dayTime: number // 0 to 1 (Day progress)

  // Entities
  cauldrons: Cauldron[]
  customers: Customer[]
  conveyorItems: Ingredient[]
  
  // Settings / Config
  beltSpeed: number
  spawnRate: number
  
  // Actions
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  
  // Logic
  tick: (dt: number, screenWidth: number) => void
  spawnCustomer: (vocabList: VocabularyItem[]) => void
  spawnIngredient: (vocabList: VocabularyItem[], screenWidth: number) => void
  
  // Interaction
  handleDropIngredient: (cauldronIndex: number, ingredientId: string) => void
  handleDumpCauldron: (cauldronIndex: number) => void
  handleServeCustomer: (customerId: string, cauldronIndex: number) => void
  
  // Helpers
  reset: () => void
}

// --- Constants ---
const MAX_CUSTOMERS = 4 // Max allowed in queue/counter
const BELT_Y = 500 // Placeholder
const INGREDIENT_WIDTH = 80 // Placeholder

export const usePotionRushStore = create<PotionRushState>((set, get) => ({
  gameState: 'MENU',
  score: 0,
  lives: 3,
  dayTime: 0,
  
  cauldrons: [
    { id: 0, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
    { id: 1, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
    { id: 2, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
  ],
  customers: [],
  conveyorItems: [],
  
  beltSpeed: 100, // Pixels per second
  spawnRate: 2000, // ms
  
  startGame: () => set({ gameState: 'PLAYING', score: 0, lives: 3, dayTime: 0, customers: [], conveyorItems: [], cauldrons: [
      { id: 0, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
      { id: 1, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
      { id: 2, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
    ] 
  }),
  
  pauseGame: () => set({ gameState: 'PAUSED' }),
  resumeGame: () => set({ gameState: 'PLAYING' }),
  endGame: () => set({ gameState: 'GAME_OVER' }),
  
  reset: () => set({
      gameState: 'MENU',
      customers: [],
      conveyorItems: [],
      score: 0
  }),

  spawnCustomer: (vocabList) => {
      const { customers, gameState } = get()
      if (gameState !== 'PLAYING') return
      if (customers.length >= MAX_CUSTOMERS) return

      const randomVocab = vocabList[Math.floor(Math.random() * vocabList.length)]
      const types: CustomerType[] = ['orc', 'elf', 'wizard', 'dwarf', 'goblin', 'human', 'skeleton']
      const randomType = types[Math.floor(Math.random() * types.length)]

      const newCustomer: Customer = {
          id: Math.random().toString(36).substr(2, 9),
          type: randomType,
          request: randomVocab,
          patience: 30, // seconds
          maxPatience: 30,
          state: 'WAITING'
      }

      set({ customers: [...customers, newCustomer] })
  },

  spawnIngredient: (vocabList, screenWidth) => {
      const { conveyorItems, gameState } = get()
      if (gameState !== 'PLAYING') return

      // Logic: Prioritize ingredients needed for current orders, but mix in randoms
      const allWords = vocabList.flatMap(v => v.term.split(' '))
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)]
      
      const types: Ingredient['type'][] = ['potion', 'mushroom', 'mineral', 'herb']
      const randomType = types[Math.floor(Math.random() * types.length)]

      const newItem: Ingredient = {
          id: Math.random().toString(36).substr(2, 9),
          word: randomWord,
          x: screenWidth + 100,
          y: BELT_Y,
          type: randomType,
          width: INGREDIENT_WIDTH
      }

      set({ conveyorItems: [...conveyorItems, newItem] })
  },

  tick: (dt, screenWidth) => {
      const { gameState, conveyorItems, beltSpeed, customers, dayTime, lives } = get()
      if (gameState !== 'PLAYING') return

      // 1. Move Conveyor Items
      const nextItems = conveyorItems
        .map(item => ({ ...item, x: item.x - (beltSpeed * dt) }))
        .filter(item => item.x > -200) // Despawn off-screen

      // 2. Update Customer Patience
      let nextLives = lives
      const nextCustomers = customers.map(c => {
          if (c.state !== 'WAITING') return c
          
          const newPatience = c.patience - dt
          if (newPatience <= 0) {
             nextLives -= 1
             return { ...c, patience: 0, state: 'LEAVING_ANGRY' as const }
          }
          return { ...c, patience: newPatience }
      })

      // Remove fully left customers (simple logic for now, usually animation handles this)
      // For now, let's keep them in state marked LEAVING until UI cleans them up or we add a cleanup phase

      // 3. Update Day Time
      const nextDayTime = dayTime + (dt * 0.01) // slow day progression
      
      if (nextLives <= 0 || nextDayTime >= 1) {
          set({ gameState: 'GAME_OVER', lives: nextLives })
      } else {
          set({ conveyorItems: nextItems, customers: nextCustomers, lives: nextLives, dayTime: nextDayTime })
      }
  },

  handleDropIngredient: (cauldronIndex, ingredientId) => {
    const { cauldrons, conveyorItems, customers } = get()
    const ingredient = conveyorItems.find(i => i.id === ingredientId)
    const cauldron = cauldrons[cauldronIndex]

    if (!ingredient || !cauldron) return

    // Remove from belt
    set({ conveyorItems: conveyorItems.filter(i => i.id !== ingredientId) })

    // If Cauldron is WARNING or COMPLETED, ignore drops (must be emptied first)
    if (cauldron.state === 'WARNING' || cauldron.state === 'COMPLETED') return

    // LOGIC:
    // If IDLE: We need to see if this word starts ANY waiting customer's sentence.
    // If BREWING: Check against current assigned sentence.

    let nextCauldron = { ...cauldron }

    if (cauldron.state === 'IDLE') {
        // Find a customer whose sentence starts with this word
        // And who ISN'T already being served by another cauldron? (Optional complexity)
        // For simplicity: Match any waiting customer.
        const potentialMatch = customers.find(c => 
            c.state === 'WAITING' && 
            c.request.term.split(' ')[0].toLowerCase() === ingredient.word.toLowerCase()
        )

        if (potentialMatch) {
            nextCauldron.state = 'BREWING'
            nextCauldron.targetSentence = potentialMatch.request
            nextCauldron.currentWords = [ingredient.word]
        } else {
            // Wrong start!
            nextCauldron.state = 'WARNING'
            nextCauldron.currentWords = [ingredient.word]
        }
    } else if (cauldron.state === 'BREWING' && cauldron.targetSentence) {
        // Check next word
        const targetWords = cauldron.targetSentence.term.split(' ')
        const nextIndex = cauldron.currentWords.length
        
        if (targetWords[nextIndex].toLowerCase() === ingredient.word.toLowerCase()) {
            nextCauldron.currentWords = [...cauldron.currentWords, ingredient.word]
            
            // Check Completion
            if (nextCauldron.currentWords.length === targetWords.length) {
                nextCauldron.state = 'COMPLETED'
            }
        } else {
            // WRONG INGREDIENT!
            nextCauldron.state = 'WARNING'
            nextCauldron.shake = true
            // Reset shake after short delay usually, or handle in UI
        }
    }

    const nextCauldrons = [...cauldrons]
    nextCauldrons[cauldronIndex] = nextCauldron
    set({ cauldrons: nextCauldrons })
  },

  handleDumpCauldron: (cauldronIndex) => {
      const { cauldrons } = get()
      const nextCauldrons = [...cauldrons]
      nextCauldrons[cauldronIndex] = {
          id: cauldronIndex,
          state: 'IDLE',
          targetSentence: null,
          currentWords: [],
          shake: false
      }
      set({ cauldrons: nextCauldrons })
  },

  handleServeCustomer: (customerId, cauldronIndex) => {
     const { customers, cauldrons, score } = get()
     const cauldron = cauldrons[cauldronIndex]
     
     if (cauldron.state !== 'COMPLETED') return

     const customerIndex = customers.findIndex(c => c.id === customerId)
     if (customerIndex === -1) return

     // Verify match (should be guaranteed by UI allowing drag, but double check)
     if (customers[customerIndex].request.term !== cauldron.targetSentence?.term) return

     // Update Customer
     const nextCustomers = [...customers]
     nextCustomers[customerIndex] = { ...nextCustomers[customerIndex], state: 'LEAVING_HAPPY' }

     // Reset Cauldron
     const nextCauldrons = [...cauldrons]
     nextCauldrons[cauldronIndex] = {
         id: cauldronIndex,
         state: 'IDLE',
         targetSentence: null,
         currentWords: [],
         shake: false
     }

     set({ customers: nextCustomers, cauldrons: nextCauldrons, score: score + 100 })
  }

}))
