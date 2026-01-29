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
    
    expect(state.reputation).toBe(100)
    expect(state.activeWordPool).toEqual([])
    expect(state.completedSentences).toBe(0)
    expect(state.customers).toEqual([null, null, null])
  })

  it('should update activeWordPool when spawning a customer', () => {
      const vocabList = [{ term: 'hello world', definition: 'greeting', id: '1' }]
      
      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      const state = usePotionRushStore.getState()
      // Should fill first slot
      expect(state.customers[0]).not.toBeNull()
      expect(state.customers[1]).toBeNull()
      
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
      const customer = state.customers[0]!
      
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
      const customer = state.customers[0]!
      
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
      
      act(() => {
          usePotionRushStore.getState().tick(0.1)
      })
      
      const updatedState = usePotionRushStore.getState()
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
      
      // Verify customer state is LEAVING_ANGRY
      expect(state.customers[0]?.state).toBe('LEAVING_ANGRY')
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

  it('should reset Cauldron[0] when Customer[0] leaves angry', () => {
      const vocabList = [{ term: 'orphan me', definition: 'desc', id: '1' }]

      act(() => {
          usePotionRushStore.getState().startGame()
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      const customer = usePotionRushStore.getState().customers[0]!

      // Start brewing for this customer
      usePotionRushStore.setState(prev => {
          const nextCauldrons = [...prev.cauldrons]
          nextCauldrons[0] = { 
              ...nextCauldrons[0], 
              state: 'BREWING',
              targetSentence: customer.request,
              currentWords: ['orphan'] 
          }
          return { cauldrons: nextCauldrons }
      })

      // Fast forward to make customer leave
      act(() => {
          usePotionRushStore.getState().tick(61)
      })

      const state = usePotionRushStore.getState()
      // Customer should be LEAVING_ANGRY
      expect(state.customers[0]?.state).toBe('LEAVING_ANGRY')
      
      // Cauldron should be reset
      expect(state.cauldrons[0].state).toBe('IDLE')
      expect(state.cauldrons[0].currentWords).toEqual([])
  })

  it('should reset Cauldron[0] if Customer[0] leaves, even if Customer[1] needs the same sentence', () => {
      const vocabList = [{ term: 'shared', definition: 'desc', id: '1' }]

      act(() => {
          usePotionRushStore.getState().startGame()
          // Spawn A (Slot 0)
          usePotionRushStore.getState().spawnCustomer(vocabList)
          // Spawn B (Slot 1)
          usePotionRushStore.getState().spawnCustomer(vocabList)
      })

      const state = usePotionRushStore.getState()
      const customerA = state.customers[0]!
      
      // Start brewing for A in Cauldron 0
      usePotionRushStore.setState(prev => {
          const nextCauldrons = [...prev.cauldrons]
          nextCauldrons[0] = { 
              ...nextCauldrons[0], 
              state: 'BREWING',
              targetSentence: customerA.request,
              currentWords: ['shared'] 
          }
          // Also brewing for B in Cauldron 1? No, just verify 0 resets.
          return { cauldrons: nextCauldrons }
      })

      // Make A leave
      act(() => {
          // Manually reduce patience for Slot 0
          usePotionRushStore.setState(prev => {
              const nextCust = [...prev.customers]
              if (nextCust[0]) nextCust[0] = { ...nextCust[0], patience: 0.1 }
              return { customers: nextCust }
          })
          usePotionRushStore.getState().tick(1)
      })

      const newState = usePotionRushStore.getState()
      expect(newState.customers[0]?.state).toBe('LEAVING_ANGRY')
      expect(newState.customers[1]?.state).toBe('WAITING')

      // Cauldron 0 should reset because Customer 0 left. 
      // It does NOT matter that Customer 1 needs 'shared'.
      expect(newState.cauldrons[0].state).toBe('IDLE')
  })
})