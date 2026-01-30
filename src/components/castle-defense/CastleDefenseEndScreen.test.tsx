import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CastleDefenseEndScreen from './CastleDefenseEndScreen'

describe('CastleDefenseEndScreen', () => {
  it('renders victory details, XP, and performance metrics', () => {
    render(
      <CastleDefenseEndScreen
        status="victory"
        score={1200}
        xp={12}
        wavesCompleted={3}
        enemiesDefeated={24}
        accuracy={0.6}
        onRestart={jest.fn()}
      />
    )

    expect(screen.getByText('Victory!')).toBeInTheDocument()
    expect(screen.getByText('Final Score')).toBeInTheDocument()
    expect(screen.getByText('1200')).toBeInTheDocument()
    expect(screen.getByText('XP Earned: 12')).toBeInTheDocument()
    expect(screen.getByText('Waves Cleared')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Enemies Defeated')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('calls onRestart when clicking Play Again', () => {
    const handleRestart = jest.fn()
    render(
      <CastleDefenseEndScreen
        status="gameover"
        score={500}
        xp={5}
        wavesCompleted={1}
        enemiesDefeated={7}
        accuracy={0.25}
        onRestart={handleRestart}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(handleRestart).toHaveBeenCalledTimes(1)
  })
})
