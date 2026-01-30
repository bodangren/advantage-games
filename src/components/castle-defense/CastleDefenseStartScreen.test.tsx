import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CastleDefenseStartScreen from './CastleDefenseStartScreen'
import { VocabularyItem } from '@/store/useGameStore'

const mockSentences: VocabularyItem[] = [
  { term: 'The cat sits', translation: 'แมวนั่งอยู่' },
  { term: 'I like apples', translation: 'ฉันชอบแอปเปิ้ล' },
]

describe('CastleDefenseStartScreen', () => {
  it('renders the title and instructions', () => {
    render(<CastleDefenseStartScreen onStart={jest.fn()} vocabulary={mockSentences} />)

    expect(screen.getByText('Castle Defense')).toBeInTheDocument()
    expect(screen.getByText('How to Defend')).toBeInTheDocument()
    expect(screen.getByText('Practice Sentences')).toBeInTheDocument()
  })

  it('renders the sentence list', () => {
    render(<CastleDefenseStartScreen onStart={jest.fn()} vocabulary={mockSentences} />)

    expect(screen.getByText('The cat sits')).toBeInTheDocument()
    expect(screen.getByText('แมวนั่งอยู่')).toBeInTheDocument()
    expect(screen.getByText('I like apples')).toBeInTheDocument()
    expect(screen.getByText('ฉันชอบแอปเปิ้ล')).toBeInTheDocument()
  })

  it('calls onStart when the start button is clicked', () => {
    const handleStart = jest.fn()
    render(<CastleDefenseStartScreen onStart={handleStart} vocabulary={mockSentences} />)

    fireEvent.click(screen.getByText('Start Defense'))
    expect(handleStart).toHaveBeenCalledTimes(1)
  })
})
