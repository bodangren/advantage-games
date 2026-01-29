import { render, screen, fireEvent, act } from '@testing-library/react'
import { CastleDefenseGame } from './CastleDefenseGame'
import { VocabularyItem } from '@/store/useGameStore'
import type React from 'react'

type KonvaBaseProps = React.PropsWithChildren<Record<string, unknown>>
type TextProps = KonvaBaseProps & { text?: string }

jest.mock('react-konva', () => ({
  Stage: ({ children }: KonvaBaseProps) => <div data-testid="stage">{children}</div>,
  Layer: ({ children }: KonvaBaseProps) => <div data-testid="layer">{children}</div>,
  Circle: () => <div data-testid="circle" />,
  Rect: () => <div data-testid="rect" />,
  Image: () => <div data-testid="image" />,
  Text: ({ text }: TextProps) => <span>{text}</span>,
  Group: ({ children }: KonvaBaseProps) => <div>{children}</div>,
}))

jest.mock('@/hooks/useDirectionalInput', () => ({
  useDirectionalInput: () => ({
    input: { dx: 0, dy: 0, cast: false },
    setVirtualInput: jest.fn(),
    consumeCast: jest.fn(),
  }),
}))

global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe() {
    this.callback([
      { contentRect: { width: 800, height: 600 } } as ResizeObserverEntry,
    ], this)
  }

  unobserve() {}
  disconnect() {}
}

Object.defineProperty(global.Image.prototype, 'src', {
  set(src) {
    if (src) {
      setTimeout(() => {
        if (this.onload) this.onload(new Event('load'))
      }, 0)
    }
  },
})

const vocabulary: VocabularyItem[] = [
  { term: 'hello', translation: 'hola' },
  { term: 'world', translation: 'mundo' },
]

describe('CastleDefenseGame', () => {
  const startGame = async () => {
    render(<CastleDefenseGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    const startButton = await screen.findByRole('button', { name: /start mission/i })
    await act(async () => {
      fireEvent.click(startButton)
    })
  }

  it('renders the start screen initially', async () => {
    render(<CastleDefenseGame vocabulary={vocabulary} onComplete={jest.fn()} />)
    expect(await screen.findByRole('heading', { name: /castle defense/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start mission/i })).toBeInTheDocument()
  })

  it('renders the game stage after starting', async () => {
    await startGame()
    expect(await screen.findByTestId('stage')).toBeInTheDocument()
  })
})
