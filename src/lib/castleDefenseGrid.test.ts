import { MAP_CONFIG, TILE_SIZE } from './castleDefense'

describe('Castle Defense Grid System', () => {
  it('has a TILE_SIZE of 50', () => {
    expect(TILE_SIZE).toBe(50)
  })

  it('aligns all path points to grid centers', () => {
    MAP_CONFIG.path.forEach((point) => {
      expect((point.x - 25) % 50).toBe(0)
      expect((point.y - 25) % 50).toBe(0)
    })
  })

  it('aligns all tower slots to grid centers', () => {
    MAP_CONFIG.towerSlots.forEach((slot) => {
      expect((slot.x - 25) % 50).toBe(0)
      expect((slot.y - 25) % 50).toBe(0)
    })
  })

  it('aligns spawn point to grid center', () => {
    expect((MAP_CONFIG.spawnPoint.x - 25) % 50).toBe(0)
    expect((MAP_CONFIG.spawnPoint.y - 25) % 50).toBe(0)
  })

  it('aligns base point to grid center', () => {
    expect((MAP_CONFIG.basePoint.x - 25) % 50).toBe(0)
    expect((MAP_CONFIG.basePoint.y - 25) % 50).toBe(0)
  })
})
