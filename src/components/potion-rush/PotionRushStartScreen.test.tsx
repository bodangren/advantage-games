import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PotionRushStartScreen from './PotionRushStartScreen'
import { VocabularyItem } from '@/store/useGameStore'

const mockVocab: VocabularyItem[] = [
    { term: 'Gato', translation: 'Cat' },
    { term: 'Perro', translation: 'Dog' }
]

describe('PotionRushStartScreen', () => {
    it('renders the title and instructions', () => {
        render(<PotionRushStartScreen onStart={jest.fn()} vocabulary={mockVocab} />)
        
        expect(screen.getByText('Potion Rush')).toBeInTheDocument()
        expect(screen.getByText('Alchemical Management')).toBeInTheDocument()
        expect(screen.getByText('How to Play')).toBeInTheDocument()
    })

    it('renders the vocabulary list', () => {
        render(<PotionRushStartScreen onStart={jest.fn()} vocabulary={mockVocab} />)
        
        expect(screen.getByText('Gato')).toBeInTheDocument()
        expect(screen.getByText('Cat')).toBeInTheDocument()
        expect(screen.getByText('Perro')).toBeInTheDocument()
        expect(screen.getByText('Dog')).toBeInTheDocument()
    })

    it('calls onStart when the start button is clicked', () => {
        const handleStart = jest.fn()
        render(<PotionRushStartScreen onStart={handleStart} vocabulary={mockVocab} />)
        
        const startButton = screen.getByText('Start Brewing')
        fireEvent.click(startButton)
        
        expect(handleStart).toHaveBeenCalledTimes(1)
    })
})
