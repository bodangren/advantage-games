import { render, screen, fireEvent } from '@testing-library/react'
import { GameEndScreen } from '../GameEndScreen'

describe('GameEndScreen', () => {
  it('renders score correctly', () => {
    render(
      <GameEndScreen
        status="victory"
        score={1200}
        xp={200}
        accuracy={0.9}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('1200')).toBeInTheDocument()
  })

  it('renders accuracy as percentage', () => {
    render(
      <GameEndScreen
        status="victory"
        score={1200}
        xp={200}
        accuracy={0.823}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('82%')).toBeInTheDocument()
  })

  it('renders XP value', () => {
    render(
      <GameEndScreen
        status="victory"
        score={1200}
        xp={250}
        accuracy={0.9}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('XP Earned: 250')).toBeInTheDocument()
  })

  it('applies victory styling when status is victory', () => {
    render(
      <GameEndScreen
        status="victory"
        score={1200}
        xp={200}
        accuracy={0.9}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: /victory/i })).toHaveClass('text-emerald-400')
  })

  it('applies defeat styling when status is defeat', () => {
    render(
      <GameEndScreen
        status="defeat"
        score={800}
        xp={120}
        accuracy={0.5}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: /defeated/i })).toHaveClass('text-rose-400')
  })

  it('renders custom stats when provided', () => {
    render(
      <GameEndScreen
        status="complete"
        score={900}
        xp={180}
        accuracy={0.7}
        customStats={[
          { label: 'Monsters Defeated', value: 12 },
          { label: 'Time Survived', value: '3:45' },
        ]}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('Monsters Defeated')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Time Survived')).toBeInTheDocument()
    expect(screen.getByText('3:45')).toBeInTheDocument()
  })

  it('calls onRestart when button clicked', () => {
    const onRestart = jest.fn()
    render(
      <GameEndScreen
        status="victory"
        score={1200}
        xp={200}
        accuracy={0.9}
        onRestart={onRestart}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(onRestart).toHaveBeenCalled()
  })

  it('renders exit button when onExit provided', () => {
    render(
      <GameEndScreen
        status="victory"
        score={1200}
        xp={200}
        accuracy={0.9}
        onRestart={jest.fn()}
        onExit={jest.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument()
  })

  it('handles 0% accuracy edge case', () => {
    render(
      <GameEndScreen
        status="defeat"
        score={0}
        xp={0}
        accuracy={0}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
