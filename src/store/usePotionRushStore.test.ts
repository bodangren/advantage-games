import { act } from '@testing-library/react'
import { usePotionRushStore } from './usePotionRushStore'

describe('usePotionRushStore Refinements', () => {
  beforeEach(() => {
    act(() => {
      usePotionRushStore.getState().reset()
    })
  })

  it('should have correct initial state for refinements', () => {
    const state = usePotionRushStore.getState()
    
    // Check new properties
    expect(state.reputation).toBe(100)
    expect(state.activeWordPool).toEqual([])
    expect(state.completedSentences).toBe(0)
    expect(state.baseBeltSpeed).toBeDefined()
    
    // Check removed properties (optional, but good for verification)
    // @ts-ignore
    expect(state.lives).toBeUndefined()
  })

  it('should update activeWordPool when spawning a customer', () => {
      const vocabList = [{ term: 'hello world', definition: 'greeting', id: '1' }]
      
      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      const state = usePotionRushStore.getState()
      expect(state.customers.length).toBe(1)
      expect(state.activeWordPool).toContain('hello')
      expect(state.activeWordPool).toContain('world')
  })

  it('should remove words from activeWordPool when customer is served', () => {
      const vocabList = [{ term: 'test', definition: 'test', id: '1' }]
      
      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      const state = usePotionRushStore.getState()
      const customer = state.customers[0]
      
      // Simulate cauldron completion
      usePotionRushStore.setState(prev => {
          const newCauldrons = [...prev.cauldrons]
          newCauldrons[0] = { ...newCauldrons[0], state: 'COMPLETED', targetSentence: customer.request, currentWords: ['test'] }
          return { cauldrons: newCauldrons }
      })

      act(() => {
          usePotionRushStore.getState().handleServeCustomer(customer.id, 0)
      })

      const newState = usePotionRushStore.getState()
      expect(newState.activeWordPool).not.toContain('test')
  })

  it('should increase completedSentences and speed when customer is served', () => {
      const vocabList = [{ term: 'test', definition: 'test', id: '1' }]
      
      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      const state = usePotionRushStore.getState()
      const customer = state.customers[0]
      
      // Simulate cauldron completion
      usePotionRushStore.setState(prev => {
          const newCauldrons = [...prev.cauldrons]
          newCauldrons[0] = { ...newCauldrons[0], state: 'COMPLETED', targetSentence: customer.request, currentWords: ['test'] }
          return { cauldrons: newCauldrons }
      })

      act(() => {
          usePotionRushStore.getState().handleServeCustomer(customer.id, 0)
      })

      const newState = usePotionRushStore.getState()
      expect(newState.completedSentences).toBe(1)
      
      // Speed should update in tick or directly?
      // The requirement says: Update tick or a selector to calculate currentSpeed.
      // If we store beltSpeed, we should update it.
      
      // Let's run a tick to ensure speed is updated if that's where logic resides, 
      // OR update it in handleServeCustomer.
      // Plan says: "Update handleServeCustomer to increment completedSentences" and "Update tick... to calculate currentSpeed"
      
      act(() => {
          usePotionRushStore.getState().tick(0.1)
      })
      
      const updatedState = usePotionRushStore.getState()
      // base is 50. 50 * (1.1 ^ 1) = 55.
      expect(updatedState.beltSpeed).toBeCloseTo(55)
  })

  it('should reduce reputation when customer leaves angry', () => {
      const vocabList = [{ term: 'test', definition: 'test', id: '1' }]
      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      // Fast forward time to make patience 0
      act(() => {
          usePotionRushStore.getState().tick(61) // Patience is 60
      })

      const state = usePotionRushStore.getState()
      expect(state.reputation).toBe(75) // 100 - 25
      expect(state.gameState).not.toBe('GAME_OVER')
      
      // Make 3 more leave
      act(() => {
        // Need to spawn more or just wait if we had more. 
        // For simplicity, just force reputation down
        usePotionRushStore.setState({ reputation: 25 })
        usePotionRushStore.setState(prev => ({ 
             customers: [{ ...prev.customers[0], patience: 0.1, state: 'WAITING' }] 
        }))
        usePotionRushStore.getState().tick(1)
      })
      
      expect(usePotionRushStore.getState().gameState).toBe('GAME_OVER')
  })

  it('should only spawn ingredients from activeWordPool', () => {
      const vocabList = [
          { term: 'needed word', definition: 'desc', id: '1' },
          { term: 'ignored word', definition: 'desc', id: '2' }
      ]

      act(() => {
          usePotionRushStore.getState().startGame()
          // Only spawn the first one as customer
          usePotionRushStore.getState().spawnCustomer([vocabList[0]])
      })

      // activeWordPool should be ['needed', 'word']
      
      act(() => {
          // Try to spawn multiple ingredients
          for (let i = 0; i < 10; i++) {
              usePotionRushStore.getState().spawnIngredient(vocabList, 1000)
          }
      })

      const state = usePotionRushStore.getState()
      const spawnedWords = state.conveyorItems.map(i => i.word)
      
      spawnedWords.forEach(word => {
          expect(['needed', 'word']).toContain(word)
          expect(word).not.toBe('ignored')
      })
  })

  it('should remove a word from activeWordPool when it is spawned as an ingredient', () => {
      const vocabList = [{ term: 'single', definition: 'desc', id: '1' }]

      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      expect(usePotionRushStore.getState().activeWordPool).toContain('single')

      act(() => {
          usePotionRushStore.getState().spawnIngredient(vocabList, 1000)
      })

      expect(usePotionRushStore.getState().activeWordPool).not.toContain('single')
      
      act(() => {
          // Attempting to spawn again should fail (empty pool)
          usePotionRushStore.getState().spawnIngredient(vocabList, 1000)
      })
      
      expect(usePotionRushStore.getState().conveyorItems.length).toBe(1)
  })

  it('should reset cauldron to IDLE when handleDumpCauldron is called', () => {
      act(() => {
          usePotionRushStore.getState().startGame()
          // Force a cauldron into BREWING state
          usePotionRushStore.setState(prev => {
              const newCauldrons = [...prev.cauldrons]
              newCauldrons[0] = { ...newCauldrons[0], state: 'BREWING', currentWords: ['test'] }
              return { cauldrons: newCauldrons }
          })
      })

      expect(usePotionRushStore.getState().cauldrons[0].state).toBe('BREWING')

      act(() => {
          usePotionRushStore.getState().handleDumpCauldron(0)
      })

      const state = usePotionRushStore.getState()
      expect(state.cauldrons[0].state).toBe('IDLE')
      expect(state.cauldrons[0].currentWords).toEqual([])
  })

  it('should recycle words back to activeWordPool when they fall off the conveyor', () => {
      const vocabList = [{ term: 'recycle', definition: 'desc', id: '1' }]

      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      // Spawn it (removes from pool)
      act(() => {
          usePotionRushStore.getState().spawnIngredient(vocabList, 1000)
      })
      
      expect(usePotionRushStore.getState().activeWordPool).not.toContain('recycle')

      // Move time forward enough for item to go off screen
      // Speed starts at 50, x starts at screenWidth + 100 (1000 + 100 = 1100).
      // Needs to go to -200. Delta = 1300. Time = 1300 / 50 = 26 seconds.
      act(() => {
          usePotionRushStore.getState().tick(30) 
      })

      expect(usePotionRushStore.getState().activeWordPool).toContain('recycle')
  })
})
