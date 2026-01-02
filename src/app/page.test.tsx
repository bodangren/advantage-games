import { render, screen } from '@testing-library/react'
import MainMenu from './page'

// Mock next/link since it's used in the component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('MainMenu', () => {
  it('renders the title and game option', () => {
    render(<MainMenu />)
    
    expect(screen.getByText(/Vocab Arcade/i)).toBeInTheDocument()
    expect(screen.getByText(/Magic Defense/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Play Now/i })).toHaveAttribute('href', '/games/magic-defense')
  })
})
