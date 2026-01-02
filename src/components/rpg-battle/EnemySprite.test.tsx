import { render, screen } from '@testing-library/react'
import { EnemySprite } from './EnemySprite'

describe('EnemySprite', () => {
  it('renders the enemy pose sheet placeholder', () => {
    render(<EnemySprite />)

    const image = screen.getByAltText('Enemy sprite sheet') as HTMLImageElement
    expect(image.src).toContain('/games/rpg-battle/enemy_slime_pose_sheet_3x3.png')
  })
})
