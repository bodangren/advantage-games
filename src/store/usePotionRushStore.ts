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
  leaveTimer?: number
}

export interface Ingredient {
  id: string
  word: string
  x: number
  y: number // usually fixed Y on the belt
  type: 'potion' | 'mushroom' | 'mineral' | 'herb'
  width: number
  isDragging: boolean
}

export type PotionRushEffectType = 'SPLASH' | 'SMOKE' | 'SUCCESS'

export interface PotionRushEffect {
  id: string
  type: PotionRushEffectType
  x: number
  y: number
  age: number
  duration: number
  seed: number
}

interface PotionRushState {
  // Game Status
  gameState: GameState
  score: number
  reputation: number // 0-100%
  dayTime: number // 0 to 1 (Day progress)

  // Entities
  cauldrons: Cauldron[]
  customers: Customer[]
  conveyorItems: Ingredient[]
  effects: PotionRushEffect[]
  
  // Settings / Config
  baseBeltSpeed: number
  beltSpeed: number
  spawnRate: number
  
  // Logic State
  activeWordPool: string[]
  completedSentences: number

  // Actions
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  
  // Logic
  tick: (dt: number) => void
  spawnCustomer: (vocabList: VocabularyItem[]) => void
  spawnIngredient: (vocabList: VocabularyItem[], screenWidth: number) => void
  
  // Interaction
  handleDropIngredient: (
    cauldronIndex: number,
    ingredientId: string,
    dropPosition?: { x: number; y: number }
  ) => void
  handleDumpCauldron: (cauldronIndex: number) => void
  handleServeCustomer: (
    customerId: string,
    cauldronIndex: number,
    servePosition?: { x: number; y: number }
  ) => void
  discardIngredient: (ingredientId: string) => void
  setIngredientDragging: (ingredientId: string, isDragging: boolean) => void
  spawnEffect: (type: PotionRushEffectType, x: number, y: number) => void
  
  // Helpers
  reset: () => void
}

// --- Constants ---
const MAX_CUSTOMERS = 3 // Max allowed at the counter
const BELT_Y = 500 // Placeholder
const INGREDIENT_WIDTH = 80 // Placeholder
const LEAVE_DURATION = 1.5 // seconds to keep leaving customers on screen
const EFFECT_DURATIONS: Record<PotionRushEffectType, number> = {
  SPLASH: 0.6,
  SMOKE: 1.1,
  SUCCESS: 0.9,
}

export const usePotionRushStore = create<PotionRushState>((set, get) => ({
  gameState: 'MENU',
  score: 0,
  reputation: 100,
  dayTime: 0,
  
  cauldrons: [
    { id: 0, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
    { id: 1, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
    { id: 2, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
  ],
  customers: [],
  conveyorItems: [],
  effects: [],
  
  baseBeltSpeed: 50,
  beltSpeed: 50, // Pixels per second
  spawnRate: 2100, // ms
  
  activeWordPool: [],
  completedSentences: 0,
  
  startGame: () => set({
      gameState: 'PLAYING',
      score: 0,
      reputation: 100,
      dayTime: 0,
      customers: [],
      conveyorItems: [],
      effects: [],
      activeWordPool: [],
      completedSentences: 0,
      beltSpeed: 50,
      cauldrons: [
        { id: 0, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
        { id: 1, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
        { id: 2, state: 'IDLE', targetSentence: null, currentWords: [], shake: false },
      ],
    }),
  
  pauseGame: () => set({ gameState: 'PAUSED' }),
  resumeGame: () => set({ gameState: 'PLAYING' }),
  endGame: () => set({ gameState: 'GAME_OVER' }),
  
  reset: () => set({
      gameState: 'MENU',
      customers: [],
      conveyorItems: [],
      effects: [],
      score: 0,
      reputation: 100,
      activeWordPool: [],
      completedSentences: 0
  }),

  spawnCustomer: (vocabList) => {
      const { customers, gameState, activeWordPool } = get()
      if (gameState !== 'PLAYING') return
      if (customers.length >= MAX_CUSTOMERS) return

      const randomVocab = vocabList[Math.floor(Math.random() * vocabList.length)]
      const types: CustomerType[] = ['orc', 'elf', 'wizard', 'dwarf', 'goblin', 'human', 'skeleton']
      const randomType = types[Math.floor(Math.random() * types.length)]

      const newCustomer: Customer = {
          id: Math.random().toString(36).substr(2, 9),
          type: randomType,
          request: randomVocab,
          patience: 60, // seconds
          maxPatience: 60,
          state: 'WAITING',
          leaveTimer: undefined
      }

      // Add words to active pool
      const newWords = randomVocab.term.split(' ')
      set({ 
          customers: [...customers, newCustomer],
          activeWordPool: [...activeWordPool, ...newWords]
      })
  },

  spawnIngredient: (vocabList, screenWidth) => {
      const { conveyorItems, gameState, activeWordPool } = get()
      if (gameState !== 'PLAYING') return
      if (activeWordPool.length === 0) return

      // Pick only from active pool
      const poolIndex = Math.floor(Math.random() * activeWordPool.length)
      const randomWord = activeWordPool[poolIndex]
      
      const types: Ingredient['type'][] = ['potion', 'mushroom', 'mineral', 'herb']
      const randomType = types[Math.floor(Math.random() * types.length)]

      const newItem: Ingredient = {
          id: Math.random().toString(36).substr(2, 9),
          word: randomWord,
          x: screenWidth + 100,
          y: BELT_Y,
          type: randomType,
          width: INGREDIENT_WIDTH,
          isDragging: false
      }

      // Remove the word from the active pool
      const nextActiveWordPool = [...activeWordPool]
      nextActiveWordPool.splice(poolIndex, 1)

      set({ 
          conveyorItems: [...conveyorItems, newItem],
          activeWordPool: nextActiveWordPool
      })
  },

  tick: (dt) => {
      const { gameState, conveyorItems, beltSpeed, customers, dayTime, reputation, effects, activeWordPool, baseBeltSpeed, completedSentences } = get()
      if (gameState !== 'PLAYING') return

      // Calculate speed
      const targetSpeed = baseBeltSpeed * Math.pow(1.1, completedSentences)

      // 1. Move Conveyor Items & Recycle Words
      let recycledWords: string[] = []
      const nextItems: Ingredient[] = []
      
      conveyorItems.forEach(item => {
          if (item.isDragging) {
              nextItems.push(item)
          } else {
              const nextX = item.x - (targetSpeed * dt)
              if (nextX > -200) {
                  nextItems.push({ ...item, x: nextX })
              } else {
                  // Despawned - recycle word
                  recycledWords.push(item.word)
              }
          }
      })

      // 2. Update Customer Patience
      let nextReputation = reputation
      let wordsToRemove: string[] = []

      const nextCustomers = customers
        .map(c => {
          if (c.state !== 'WAITING') {
             const remaining = (c.leaveTimer ?? LEAVE_DURATION) - dt
             return { ...c, leaveTimer: remaining }
          }
          
          const newPatience = c.patience - dt
          if (newPatience <= 0) {
             nextReputation -= 25
             wordsToRemove.push(...c.request.term.split(' '))
             return { ...c, patience: 0, state: 'LEAVING_ANGRY' as const, leaveTimer: LEAVE_DURATION }
          }
          return { ...c, patience: newPatience }
        })
        .filter(c => c.state === 'WAITING' || (c.leaveTimer ?? 0) > 0)

      // Update activeWordPool
      let nextActiveWordPool = activeWordPool
      
      // Add recycled words
      if (recycledWords.length > 0) {
          nextActiveWordPool = [...nextActiveWordPool, ...recycledWords]
      }

      // Remove words from angry customers
      if (wordsToRemove.length > 0) {
          // If recycled words were just added, we use that list.
          // Note: If a word is recycled AND the customer leaves at the same exact tick, 
          // we should technically remove it. 
          // Current Logic: 
          // 1. Recycle words (add to pool)
          // 2. Angry customer (remove from pool)
          // This seems correct. If customer leaves, we don't want those words anymore, even if they just fell off the belt.
          
          // However, we need to be careful not to mutate if we haven't already
          if (nextActiveWordPool === activeWordPool) {
              nextActiveWordPool = [...activeWordPool]
          }
          
          wordsToRemove.forEach(word => {
               const idx = nextActiveWordPool.indexOf(word)
               if (idx > -1) nextActiveWordPool.splice(idx, 1)
          })
      }

      // 3. Update Day Time
      const nextDayTime = dayTime + (dt * 0.01) // slow day progression

      const nextEffects = effects
        .map(effect => ({ ...effect, age: effect.age + dt }))
        .filter(effect => effect.age < effect.duration)
      
      if (nextReputation <= 0 || nextDayTime >= 1) {
          set({ gameState: 'GAME_OVER', reputation: nextReputation, effects: nextEffects })
      } else {
          set({
            conveyorItems: nextItems,
            customers: nextCustomers,
            reputation: nextReputation,
            dayTime: nextDayTime,
            effects: nextEffects,
            activeWordPool: nextActiveWordPool,
            beltSpeed: targetSpeed
          })
      }
  },

  handleDropIngredient: (cauldronIndex, ingredientId, dropPosition) => {
    const { cauldrons, conveyorItems, customers } = get()
    const ingredient = conveyorItems.find(i => i.id === ingredientId)
    const cauldron = cauldrons[cauldronIndex]

    if (!ingredient || !cauldron) return

    // Remove from belt
    set({ conveyorItems: conveyorItems.filter(i => i.id !== ingredientId) })

    // If Cauldron is WARNING or COMPLETED, ignore drops (must be emptied first)
    if (cauldron.state === 'WARNING' || cauldron.state === 'COMPLETED') return

    const emitEffect = (type: PotionRushEffectType) => {
      if (!dropPosition) return
      get().spawnEffect(type, dropPosition.x, dropPosition.y)
    }

    emitEffect('SPLASH')

    // LOGIC:
    // If IDLE: We need to see if this word starts ANY waiting customer's sentence.
    // If BREWING: Check against current assigned sentence.

    const nextCauldron = { ...cauldron }
    const { activeWordPool } = get()

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
            emitEffect('SMOKE')
            // Don't recycle here because it's technically IN the cauldron now (as the single wrong word)
            // It will be recycled when dumped.
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
            emitEffect('SMOKE')
            // Reset shake after short delay usually, or handle in UI
            
            // Recycle the wrong ingredient back to pool immediately
            // because it is NOT added to currentWords in this branch
            set({ activeWordPool: [...activeWordPool, ingredient.word] })
        }
    }

    const nextCauldrons = [...cauldrons]
    nextCauldrons[cauldronIndex] = nextCauldron
    set({ cauldrons: nextCauldrons })
  },

  handleDumpCauldron: (cauldronIndex) => {
      const { cauldrons, activeWordPool } = get()
      const cauldronToDump = cauldrons[cauldronIndex]
      
      // Recycle words in the cauldron
      const recycledWords = [...cauldronToDump.currentWords]
      const nextActiveWordPool = [...activeWordPool, ...recycledWords]

      const nextCauldrons = [...cauldrons]
      nextCauldrons[cauldronIndex] = {
          id: cauldronIndex,
          state: 'IDLE',
          targetSentence: null,
          currentWords: [],
          shake: false
      }
      set({ 
          cauldrons: nextCauldrons,
          activeWordPool: nextActiveWordPool
      })
  },

  handleServeCustomer: (customerId, cauldronIndex, servePosition) => {
     const { customers, cauldrons, score, activeWordPool } = get()
     const cauldron = cauldrons[cauldronIndex]
     
     if (cauldron.state !== 'COMPLETED') return

     const customerIndex = customers.findIndex(c => c.id === customerId)
     if (customerIndex === -1) return

     // Verify match (should be guaranteed by UI allowing drag, but double check)
     if (customers[customerIndex].request.term !== cauldron.targetSentence?.term) return

     // Update Customer
     const nextCustomers = [...customers]
     nextCustomers[customerIndex] = { ...nextCustomers[customerIndex], state: 'LEAVING_HAPPY', leaveTimer: LEAVE_DURATION }

     // Remove words from pool
     const wordsToRemove = customers[customerIndex].request.term.split(' ')
     let nextActiveWordPool = [...activeWordPool]
     wordsToRemove.forEach(word => {
         const idx = nextActiveWordPool.indexOf(word)
         if (idx > -1) nextActiveWordPool.splice(idx, 1)
     })

     // Reset Cauldron
     const nextCauldrons = [...cauldrons]
     nextCauldrons[cauldronIndex] = {
         id: cauldronIndex,
         state: 'IDLE',
         targetSentence: null,
         currentWords: [],
         shake: false
     }

     set({ 
         customers: nextCustomers, 
         cauldrons: nextCauldrons, 
         score: score + 100, 
         activeWordPool: nextActiveWordPool,
         completedSentences: get().completedSentences + 1
     })

     if (servePosition) {
       get().spawnEffect('SUCCESS', servePosition.x, servePosition.y)
     }
  },

  discardIngredient: (ingredientId) => {
    const { conveyorItems } = get()
    set({ conveyorItems: conveyorItems.filter(item => item.id !== ingredientId) })
  },

  setIngredientDragging: (ingredientId, isDragging) => {
    const { conveyorItems } = get()
    set({
      conveyorItems: conveyorItems.map(item =>
        item.id === ingredientId ? { ...item, isDragging } : item
      )
    })
  },

  spawnEffect: (type, x, y) => {
    const effect: PotionRushEffect = {
      id: Math.random().toString(36).slice(2, 10),
      type,
      x,
      y,
      age: 0,
      duration: EFFECT_DURATIONS[type],
      seed: Math.random(),
    }

    set(state => ({ effects: [...state.effects, effect] }))
  },

}))
