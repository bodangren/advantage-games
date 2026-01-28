import { usePotionRushStore, Ingredient } from '@/store/usePotionRushStore'

describe('usePotionRushStore discardIngredient', () => {
  const makeIngredient = (id: string): Ingredient => ({
    id,
    word: 'test',
    x: 100,
    y: 200,
    type: 'herb',
    width: 80,
    isDragging: false,
  })

  beforeEach(() => {
    usePotionRushStore.setState({ conveyorItems: [] })
  })

  it('removes the ingredient when discarded', () => {
    const item = makeIngredient('ing-1')
    usePotionRushStore.setState({ conveyorItems: [item] })

    usePotionRushStore.getState().discardIngredient(item.id)

    expect(usePotionRushStore.getState().conveyorItems).toHaveLength(0)
  })

  it('does nothing when the ingredient id does not exist', () => {
    const item = makeIngredient('ing-1')
    usePotionRushStore.setState({ conveyorItems: [item] })

    usePotionRushStore.getState().discardIngredient('missing')

    expect(usePotionRushStore.getState().conveyorItems).toHaveLength(1)
  })
})

describe('usePotionRushStore dragging behavior', () => {
  const makeIngredient = (id: string, x: number, isDragging: boolean): Ingredient => ({
    id,
    word: 'drag',
    x,
    y: 200,
    type: 'herb',
    width: 80,
    isDragging,
  })

  beforeEach(() => {
    usePotionRushStore.setState({
      conveyorItems: [],
      gameState: 'PLAYING',
      beltSpeed: 100,
    })
  })

  it('marks an ingredient as dragging', () => {
    const item = makeIngredient('drag-1', 300, false)
    usePotionRushStore.setState({ conveyorItems: [item] })

    usePotionRushStore.getState().setIngredientDragging(item.id, true)

    const updated = usePotionRushStore.getState().conveyorItems[0]
    expect(updated.isDragging).toBe(true)
  })

  it('does not move dragging ingredients during tick', () => {
    const dragging = makeIngredient('dragging', 500, true)
    const moving = makeIngredient('moving', 500, false)
    usePotionRushStore.setState({ conveyorItems: [dragging, moving] })

    usePotionRushStore.getState().tick(1, 1280)

    const after = usePotionRushStore.getState().conveyorItems
    const dragAfter = after.find(item => item.id === 'dragging')
    const moveAfter = after.find(item => item.id === 'moving')

    expect(dragAfter?.x).toBe(500)
    expect(moveAfter?.x).toBe(400)
  })
})
