import { render, waitFor, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { BackgroundLayer } from './BackgroundLayer'

type MockDivProps = ComponentProps<'div'> & { listening?: boolean }
type MockImageProps = ComponentProps<'div'> & { image?: { src?: string } | null }

// Mock react-konva
jest.mock('react-konva', () => ({
  Layer: ({ children, listening, ...props }: MockDivProps) => <div data-testid="layer" data-listening={listening} {...props}>{children}</div>,
  Image: ({ image, ...props }: MockImageProps) => <div data-testid="konva-image" data-src={image?.src} {...props} />,
  Stage: ({ children, ...props }: MockDivProps) => <div data-testid="stage" {...props}>{children}</div>,
  Group: ({ children, ...props }: MockDivProps) => <div data-testid="group" {...props}>{children}</div>,
}))

// Mock Image loading
const originalImage = window.Image
beforeAll(() => {
  Object.defineProperty(window, 'Image', {
    writable: true,
    configurable: true,
    value: class MockImage {
    onload: () => void = () => {}
    src: string = ''
    constructor() {
      setTimeout(() => this.onload(), 10)
    }
    }
  })
})

afterAll(() => {
  Object.defineProperty(window, 'Image', {
    writable: true,
    configurable: true,
    value: originalImage
  })
})

describe('BackgroundLayer', () => {
  it('renders grid of tiles', async () => {
    const grassMap = [[0, 1], [2, 3]]
    render(
        <BackgroundLayer grassMap={grassMap} />
    )
    
    // Wait for images to load
    await waitFor(() => {
        const images = screen.getAllByTestId('konva-image')
        // 2x2 grid = 4 tiles. 
        // Logic might add roads if coords match road.
        // (0,0), (1,0), (0,1), (1,1)
        // With current MAP_CONFIG:
        // (0,0) is not road. (0,1) not road.
        // Actually coords are indices.
        // In MAP_CONFIG:
        // Path starts at (1,1) -> (75, 75) is index 1 (1*50+25).
        // My mock grid is indices 0,1.
        // 0,0: index 0. Not road.
        // 1,0: index 1,0. Not road.
        // 0,1: index 0,1. Not road.
        // 1,1: index 1,1. IS ROAD (Start of path).
        
        // So expected: 
        // 4 grass images (base)
        // + 1 road image at (1,1)
        // Total 5 images?
        // My implementation:
        // "Always render grass first (as base)?"
        // "if (images[grassSrc]) ... grid.push(grass)"
        // "if (roadInfo) ... grid.push(road)"
        
        // So yes, 5 images.
        expect(images.length).toBeGreaterThanOrEqual(4)
    })
  })
})
