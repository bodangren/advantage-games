import { render, screen } from '@testing-library/react'
import { WizardZombieGame } from './WizardZombieGame'
import { VocabularyItem } from '@/store/useGameStore'

// Mock Konva
jest.mock('react-konva', () => {
  return {
    Stage: ({ children }: any) => <div data-testid="stage">{children}</div>,
    Layer: ({ children }: any) => <div data-testid="layer">{children}</div>,
    Circle: ({ radius, fill, name }: any) => (
      <div data-testid={name || 'circle'} data-radius={radius} data-fill={fill} />
    ),
    Rect: ({ width, height, fill }: any) => (
        <div data-testid="rect" style={{ width, height, background: fill }} />
    ),
    Text: ({ text }: any) => <span>{text}</span>,
    Group: ({ children }: any) => <div>{children}</div>,
  }
})

// Mock useSound
jest.mock('@/hooks/useSound', () => ({
  useSound: () => ({ playSound: jest.fn() }),
}))

const vocabulary: VocabularyItem[] = [
  { term: 'Apple', translation: 'Manzana', id: '1' },
  { term: 'Banana', translation: 'Platano', id: '2' },
  { term: 'Cat', translation: 'Gato', id: '3' },
  { term: 'Dog', translation: 'Perro', id: '4' },
]

describe('WizardZombieGame', () => {
  it('renders the game stage', () => {
    render(<WizardZombieGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    expect(screen.getByTestId('stage')).toBeInTheDocument()
  })

  it('renders the player', () => {
    render(<WizardZombieGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    expect(screen.getByTestId('player')).toBeInTheDocument()
  })

  it('renders orbs', () => {
    render(<WizardZombieGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    // Should have 3 orbs initially
    const orbs = screen.getAllByTestId('orb')
    expect(orbs).toHaveLength(3)
  })

  it('displays the target word UI', () => {
    render(<WizardZombieGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    expect(screen.getByText(/Find:/i)).toBeInTheDocument()
  })

  it('renders debug info', () => {
    render(<WizardZombieGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    expect(screen.getByText(/Debug Info:/i)).toBeInTheDocument()
    expect(screen.getByText(/Player:/i)).toBeInTheDocument()
  })
})
