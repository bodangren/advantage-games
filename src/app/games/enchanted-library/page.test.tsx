import { render, screen } from '@testing-library/react'
import EnchantedLibraryPage from './page'

// Mock the dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const MockedComponent = () => <div data-testid="enchanted-library-game">Mocked EnchantedLibraryGame</div>
    MockedComponent.displayName = 'EnchantedLibraryGame'
    return MockedComponent
  },
}))

const mockSetVocabulary = jest.fn()
const mockSetLastResult = jest.fn()

jest.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: { vocabulary: string[]; setVocabulary: () => void; setLastResult: () => void }) => unknown) =>
    selector({
      vocabulary: [],
      setVocabulary: mockSetVocabulary,
      setLastResult: mockSetLastResult,
    }),
}))

describe('EnchantedLibraryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page title and description', () => {
    render(<EnchantedLibraryPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Enchanted Library')
    expect(screen.getByText(/collect magic books/i)).toBeInTheDocument()
  })

  it('renders the game container', () => {
    render(<EnchantedLibraryPage />)
    expect(screen.getByTestId('enchanted-library-game')).toBeInTheDocument()
  })

  it('contains a link back to home', () => {
    render(<EnchantedLibraryPage />)
    const link = screen.getByRole('link', { name: /back to home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('sets sample vocabulary if vocabulary is empty', () => {
    render(<EnchantedLibraryPage />)
    expect(mockSetVocabulary).toHaveBeenCalled()
  })
})
