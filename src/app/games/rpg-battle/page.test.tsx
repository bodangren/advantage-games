import { render, screen } from '@testing-library/react'
import RpgBattlePage from './page'

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('RpgBattlePage', () => {
  it('renders the RPG battle shell', () => {
    render(<RpgBattlePage />)

    expect(screen.getByText(/RPG Battle/i)).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('Battle Log')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
  })
})
