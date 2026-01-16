import { getRoadTileInfo } from './castleDefense'

describe('getRoadTileInfo', () => {
  it('identifies a straight NS road', () => {
    // (1, 5) is on the vertical segment between (1, 1) and (1, 10)
    const info = getRoadTileInfo(1, 5)
    expect(info).toEqual({
      type: 'NS',
      rotation: 0
    })
  })

  it('identifies a straight EW road', () => {
    // (5, 10) is on the horizontal segment between (1, 10) and (14, 10)
    const info = getRoadTileInfo(5, 10)
    expect(info).toEqual({
      type: 'EW',
      rotation: 0
    })
  })

  it('identifies the first corner (North-to-East)', () => {
    // (1, 10) is a corner connecting Vertical (down) and Horizontal (right)
    // Neighbors: North (0,-1) and East (1,0)
    const info = getRoadTileInfo(1, 10)
    expect(info).toEqual({
      type: 'CORNER',
      rotation: 180
    })
  })

  it('identifies the second corner (West-to-North)', () => {
    // (14, 10) connects Horizontal (left) and Vertical (up)
    // Neighbors: West (-1,0) and North (0,-1)
    const info = getRoadTileInfo(14, 10)
    expect(info).toEqual({
      type: 'CORNER',
      rotation: 90
    })
  })

  it('returns null for non-road tiles', () => {
    const info = getRoadTileInfo(5, 5)
    expect(info).toBeNull()
  })
})
