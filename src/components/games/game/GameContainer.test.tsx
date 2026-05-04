import { render, screen } from '@testing-library/react'
import { GameContainer } from './GameContainer'
import { useGameStore } from '@/store/useGameStore'

jest.mock('@/store/useGameStore', () => {
  const mockStore = jest.fn()
  ;(mockStore as unknown as { getState: jest.Mock }).getState = jest.fn(() => ({ missedWords: [] }))
  return {
    useGameStore: mockStore,
  }
})

jest.mock('nanoid', () => ({
  nanoid: () => 'test-id',
}))

const mockUseGameStore = useGameStore as unknown as jest.Mock

describe('GameContainer', () => {
  it('renders StartScreen initially', () => {
    mockUseGameStore.mockReturnValue({
      status: 'idle',
      vocabulary: [],
      score: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      resetGame: jest.fn(),
    })

    render(<GameContainer />)
    expect(screen.getByText(/Defense Briefing/i)).toBeInTheDocument()
  })

  it('renders GameEngine when status is playing', () => {
    mockUseGameStore.mockReturnValue({
      status: 'playing',
      vocabulary: [{ term: 'Apple', translation: 'Manzana' }],
      score: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      castles: { left: 3, center: 3, right: 3 },
      resetGame: jest.fn(),
      damageCastle: jest.fn(),
      increaseScore: jest.fn(),
      incrementAttempts: jest.fn(),
    })

    render(<GameContainer />)
    expect(screen.getByTestId('game-stage')).toBeInTheDocument()
  })

  it('renders ResultsScreen when status is game-over', () => {
    mockUseGameStore.mockReturnValue({
      status: 'game-over',
      vocabulary: [],
      score: 100,
      correctAnswers: 5,
      totalAttempts: 10,
      resetGame: jest.fn(),
      missedWords: [],
    })

    render(<GameContainer />)
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument()
  })

  it('calls onComplete when game ends', () => {
    const onComplete = jest.fn()
    const missedWords = [{ term: 'Apple', translation: 'Manzana' }];
    mockUseGameStore.mockReturnValue({
      status: 'game-over',
      vocabulary: [],
      score: 100,
      correctAnswers: 5,
      totalAttempts: 10,
      resetGame: jest.fn(),
      missedWords,
    })
    mockUseGameStore.getState = jest.fn(() => ({ missedWords }))

    render(<GameContainer onComplete={onComplete} />)
    expect(onComplete).toHaveBeenCalled()
  })

  it('calls onComplete exactly once even if score changes after game over', () => {
    const onComplete = jest.fn()
    const missedWords = [{ term: 'Apple', translation: 'Manzana' }];
    let mockScore = 100;
    
    mockUseGameStore.mockImplementation(() => ({
      status: 'game-over',
      vocabulary: [],
      score: mockScore,
      correctAnswers: 5,
      totalAttempts: 10,
      resetGame: jest.fn(),
      missedWords,
    }))
    mockUseGameStore.getState = jest.fn(() => ({ missedWords }))

    const { rerender } = render(<GameContainer onComplete={onComplete} />)
    expect(onComplete).toHaveBeenCalledTimes(1)
    
    // Simulate score change after game over
    mockScore = 200;
    rerender(<GameContainer onComplete={onComplete} />)
    
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('calls onComplete again after restart and new game over', () => {
    const onComplete = jest.fn()
    const missedWords = [{ term: 'Apple', translation: 'Manzana' }];
    let mockStatus = 'game-over';
    
    mockUseGameStore.mockImplementation(() => ({
      status: mockStatus,
      vocabulary: [],
      score: 100,
      correctAnswers: 5,
      totalAttempts: 10,
      resetGame: jest.fn(),
      missedWords,
      castles: { left: 3, center: 3, right: 3 },
    }))
    mockUseGameStore.getState = jest.fn(() => ({ missedWords }))

    const { rerender } = render(<GameContainer onComplete={onComplete} />)
    expect(onComplete).toHaveBeenCalledTimes(1)
    
    // Simulate restart (playing -> game-over)
    mockStatus = 'playing';
    rerender(<GameContainer onComplete={onComplete} />)
    
    mockStatus = 'game-over';
    rerender(<GameContainer onComplete={onComplete} />)
    
    expect(onComplete).toHaveBeenCalledTimes(2)
  })

  it('displays missed words on results screen', () => {
    const missedWords = [
      { term: 'Apple', translation: 'Manzana' },
      { term: 'Banana', translation: 'Plátano' },
    ];
    mockUseGameStore.mockReturnValue({
      status: 'game-over',
      vocabulary: [],
      score: 100,
      correctAnswers: 5,
      totalAttempts: 10,
      resetGame: jest.fn(),
      missedWords,
    })
    mockUseGameStore.getState = jest.fn(() => ({ missedWords }))

    render(<GameContainer />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Manzana')).toBeInTheDocument()
  })
})
