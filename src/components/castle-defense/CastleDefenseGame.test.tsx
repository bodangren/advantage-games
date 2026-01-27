import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CastleDefenseGame } from './CastleDefenseGame'
import { SAMPLE_SENTENCES } from '@/lib/sampleSentences'

// Mock Konva to avoid canvas issues in JSDOM
jest.mock('react-konva', () => ({
  Stage: ({ children }: any) => <div data-testid="stage">{children}</div>,
  Layer: ({ children }: any) => <div data-testid="layer">{children}</div>,
  Group: ({ children }: any) => <div data-testid="group">{children}</div>,
  Rect: () => <div data-testid="rect" />,
  Circle: () => <div data-testid="circle" />,
  Text: ({ text }: any) => <div data-testid="text">{text}</div>,
  Image: () => <div data-testid="image" />,
}))

// Mock DPad
jest.mock('@/components/ui/DPad', () => ({
  DPad: () => <div data-testid="dpad" />
}))

// Mock useSpriteAnimation
jest.mock('@/hooks/useSpriteAnimation', () => ({
  useSpriteAnimation: () => ({ row: 0, col: 0 })
}))

// Mock BackgroundLayer
jest.mock('./BackgroundLayer', () => ({
  BackgroundLayer: () => <div data-testid="background-layer" />
}))

// Mock CastleDefenseHUD
jest.mock('./CastleDefenseHUD', () => ({
  CastleDefenseHUD: () => <div data-testid="hud" />
}))

describe('CastleDefenseGame', () => {
  it('renders start screen initially', () => {
    render(<CastleDefenseGame vocabulary={SAMPLE_SENTENCES} onComplete={jest.fn()} />)
    
    expect(screen.getByText('Castle Defense')).toBeInTheDocument()
    expect(screen.getByText('Start Defense')).toBeInTheDocument()
  })

  it('starts game when start button is clicked', () => {
    render(<CastleDefenseGame vocabulary={SAMPLE_SENTENCES} onComplete={jest.fn()} />)
    
    const startButton = screen.getByText('Start Defense')
    fireEvent.click(startButton)
    
    // Start screen should disappear (or at least the title/button)
    expect(screen.queryByText('Start Defense')).not.toBeInTheDocument()
  })
})
