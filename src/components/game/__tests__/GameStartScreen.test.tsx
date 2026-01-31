import { render, screen, fireEvent } from '@testing-library/react'
import { GameStartScreen } from '../GameStartScreen'

const mockVocab = [
  { term: 'Dragon', translation: 'Dragón' },
  { term: 'Shield', translation: 'Escudo' },
]

const mockInstructions = [
  { step: 1, text: 'Collect the matching word.' },
  { step: 2, text: 'Avoid the traps.' },
]

describe('GameStartScreen', () => {
  it('renders the game title', () => {
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        vocabulary={mockVocab}
        onStart={jest.fn()}
      />
    )

    expect(screen.getByText('Mystic Quest')).toBeInTheDocument()
  })

  it('renders subtitle badge when provided', () => {
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        gameSubtitle="Hero Trial"
        vocabulary={mockVocab}
        onStart={jest.fn()}
      />
    )

    expect(screen.getByText('Hero Trial')).toBeInTheDocument()
  })

  it('renders vocabulary list with correct item count', () => {
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        vocabulary={mockVocab}
        onStart={jest.fn()}
      />
    )

    expect(screen.getByText('2 Sentences')).toBeInTheDocument()
    expect(screen.getByText('Dragon')).toBeInTheDocument()
    expect(screen.getByText('Escudo')).toBeInTheDocument()
  })

  it('renders instructions when provided', () => {
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        vocabulary={mockVocab}
        instructions={mockInstructions}
        onStart={jest.fn()}
      />
    )

    expect(screen.getByText('Collect the matching word.')).toBeInTheDocument()
    expect(screen.getByText('Avoid the traps.')).toBeInTheDocument()
  })

  it('renders pro tip when provided', () => {
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        vocabulary={mockVocab}
        proTip="Stay focused to chain combos."
        onStart={jest.fn()}
      />
    )

    expect(screen.getByText(/pro tip/i)).toBeInTheDocument()
    expect(screen.getByText('Stay focused to chain combos.')).toBeInTheDocument()
  })

  it('calls onStart when button clicked', () => {
    const onStart = jest.fn()
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        vocabulary={mockVocab}
        onStart={onStart}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /start game/i }))
    expect(onStart).toHaveBeenCalled()
  })

  it('uses custom startButtonText when provided', () => {
    render(
      <GameStartScreen
        gameTitle="Mystic Quest"
        vocabulary={mockVocab}
        startButtonText="Begin Quest"
        onStart={jest.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /begin quest/i })).toBeInTheDocument()
  })
})
