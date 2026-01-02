import { render, screen } from '@testing-library/react'
import { Enemy } from './Enemy'

describe('Enemy', () => {
  it('renders the term', () => {
    render(
      <Enemy 
        id="1" 
        x={50}
        term="Apple" 
        duration={5} 
        onReachBottom={jest.fn()} 
      />
    )
    
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})
