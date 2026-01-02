import { render, screen } from '@testing-library/react'
import { Missile } from './Missile'

describe('Missile', () => {
  it('renders the term', () => {
    render(
      <Missile 
        id="1" 
        term="Apple" 
        duration={5} 
        onReachBottom={jest.fn()} 
      />
    )
    
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})
