import { usePotionRushStore, Ingredient } from '@/store/usePotionRushStore'

describe('usePotionRushStore discardIngredient', () => {
  const makeIngredient = (id: string): Ingredient => ({
    id,
    word: 'test',
    x: 100,
    y: 200,
    type: 'herb',
    width: 80,
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
