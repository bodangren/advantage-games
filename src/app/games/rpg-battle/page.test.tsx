import { render, screen } from '@testing-library/react'
import RpgBattlePage from './page'

describe('RpgBattlePage', () => {
  it('renders the RPG battle shell', () => {
    render(<RpgBattlePage />)

    expect(screen.getByText(/RPG Battle/i)).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('Battle Log')).toBeInTheDocument()
  })
})
