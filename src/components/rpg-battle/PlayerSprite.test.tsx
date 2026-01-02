import { render, screen } from '@testing-library/react'
import { PlayerSprite } from './PlayerSprite'

describe('PlayerSprite', () => {
  it('renders the player pose sheet placeholder', () => {
    render(<PlayerSprite />)

    const image = screen.getByAltText('Player sprite sheet') as HTMLImageElement
    expect(image.src).toContain('/games/rpg-battle/hero_male_pose_sheet_3x3.png')
  })
})
