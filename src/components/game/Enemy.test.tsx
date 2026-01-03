import { render, screen } from '@testing-library/react'
import { Enemy } from './Enemy'

describe('Enemy', () => {
  it('renders the term', () => {
    const { getByTestId } = render(
      <Enemy 
        id="1" 
        x={50}
        targetX={50}
        term="Apple" 
        duration={5} 
        state="falling"
        onReachBottom={jest.fn()} 
        onDeathComplete={jest.fn()}
      />
    )
    
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(getByTestId('enemy-sprite')).toHaveStyle({
      backgroundImage: 'url(/games/magic-defense/skeletons_3x3_pose_sheet.png)',
    })
  })
})
