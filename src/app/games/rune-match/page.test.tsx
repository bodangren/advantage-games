import { render, screen, waitFor } from '@testing-library/react'
import RuneMatchPage from './page'

const mockPush = jest.fn()

// Mock the dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const MockedComponent = () => <div data-testid="rune-match-game">Mocked RuneMatchGame</div>
    MockedComponent.displayName = 'RuneMatchGame'
    return MockedComponent
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock useGameStore
const mockSetVocabulary = jest.fn()
const mockSetLastResult = jest.fn()
const mockLoadVocabulary = jest.fn().mockResolvedValue([])

jest.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: { vocabulary: string[]; setVocabulary: () => void; setLastResult: () => void }) => unknown) =>
    selector({
      vocabulary: [],
      setVocabulary: mockSetVocabulary,
      setLastResult: mockSetLastResult,
    }),
}))

jest.mock('@/lib/vocabLoader', () => ({
  loadVocabulary: (...args: unknown[]) => mockLoadVocabulary(...args),
}))

describe('RuneMatchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RuneMatchPage />)
    expect(screen.getByText('Rune Match')).toBeInTheDocument()
  })

  it('displays game title', () => {
    render(<RuneMatchPage />)
    expect(screen.getByText('Rune Match')).toBeInTheDocument()
  })

  it('displays game description', () => {
    render(<RuneMatchPage />)
    expect(screen.getByText(/match vocabulary runes/i)).toBeInTheDocument()
  })

  it('includes back to home link', () => {
    render(<RuneMatchPage />)
    const backLink = screen.getByRole('link', { name: /back to home/i })
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('renders RuneMatchGame component', () => {
    render(<RuneMatchPage />)
    expect(screen.getByTestId('rune-match-game')).toBeInTheDocument()
  })

  it('sets vocabulary if vocabulary is empty', async () => {
    render(<RuneMatchPage />)
    await waitFor(() => {
      expect(mockSetVocabulary).toHaveBeenCalled()
    })
  })
})
