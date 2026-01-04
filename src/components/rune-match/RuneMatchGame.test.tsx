import { render, screen, waitFor } from '@testing-library/react'
import { RuneMatchGame } from './RuneMatchGame'
import type { VocabularyItem } from '@/store/useGameStore'
import type React from 'react'

type KonvaBaseProps = React.PropsWithChildren<Record<string, unknown>>
type RectProps = KonvaBaseProps & { width?: number; height?: number; fill?: string }
type ImageProps = KonvaBaseProps & { name?: string }
type TextProps = KonvaBaseProps & { text?: string }

// Mock Konva
jest.mock('react-konva', () => ({
  Stage: ({ children }: KonvaBaseProps) => <div data-testid="stage">{children}</div>,
  Layer: ({ children }: KonvaBaseProps) => <div data-testid="layer">{children}</div>,
  Rect: ({ width, height, fill }: RectProps) => (
    <div data-testid="rect" style={{ width, height, background: fill }} />
  ),
  Image: ({ name }: ImageProps) => <div data-testid={name || 'image'} />,
  Text: ({ text }: TextProps) => <span>{text}</span>,
  Group: ({ children }: KonvaBaseProps) => <div>{children}</div>,
}))

jest.mock('konva', () => ({
  Animation: class {
    start() {}
    stop() {}
  },
}))

// Mock Image to trigger onload
Object.defineProperty(global.Image.prototype, 'src', {
  set(src) {
    if (src) {
      setTimeout(() => {
        if (this.onload) this.onload()
      }, 0)
    }
  },
})

const SAMPLE_VOCAB: VocabularyItem[] = [
  { term: 'Hello', translation: 'สวัสดี' },
  { term: 'Cat', translation: 'แมว' },
  { term: 'Dog', translation: 'สุนัข' },
  { term: 'Water', translation: 'น้ำ' },
  { term: 'Food', translation: 'อาหาร' },
  { term: 'House', translation: 'บ้าน' },
  { term: 'Tree', translation: 'ต้นไม้' },
  { term: 'Sun', translation: 'พระอาทิตย์' },
  { term: 'Moon', translation: 'พระจันทร์' },
  { term: 'Star', translation: 'ดาว' },
]

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('RuneMatchGame', () => {
  const mockOnComplete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={mockOnComplete} />)
    expect(screen.getByTestId('rune-match-container')).toBeInTheDocument()
  })

  it('shows loading state while assets load', () => {
    render(<RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={mockOnComplete} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('has correct container aspect ratio', () => {
    render(<RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={mockOnComplete} />)
    const container = screen.getByTestId('rune-match-container')
    expect(container.className).toMatch(/aspect-video|h-\[60vh\]/)
  })

  it('applies dark theme styling', () => {
    render(<RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={mockOnComplete} />)
    const container = screen.getByTestId('rune-match-container')
    expect(container.className).toMatch(/bg-slate-950/)
  })

  it('has rounded corners and border', () => {
    render(<RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={mockOnComplete} />)
    const container = screen.getByTestId('rune-match-container')
    expect(container.className).toMatch(/rounded/)
    expect(container.className).toMatch(/border/)
  })

  it('accepts vocabulary prop', () => {
    const { rerender } = render(
      <RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={mockOnComplete} />
    )
    expect(() => rerender(<RuneMatchGame vocabulary={[]} onComplete={mockOnComplete} />)).not.toThrow()
  })

  it('accepts onComplete callback', () => {
    const customCallback = jest.fn()
    render(<RuneMatchGame vocabulary={SAMPLE_VOCAB} onComplete={customCallback} />)
    expect(customCallback).not.toHaveBeenCalled() // Should only call on game completion
  })
})
