'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Circle, Text, Group, Rect } from 'react-konva'
import { 
  createWizardZombieState, 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  type WizardZombieState 
} from '@/lib/wizardZombie'
import type { VocabularyItem } from '@/store/useGameStore'
import { useSound } from '@/hooks/useSound'

interface WizardZombieGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: any) => void
}

export function WizardZombieGame({ vocabulary, onComplete }: WizardZombieGameProps) {
  const { playSound } = useSound() 
  const [gameState, setGameState] = useState<WizardZombieState | null>(null)
  
  // Dimensions for responsive canvas
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 })

  useEffect(() => {
     if (vocabulary.length > 0) {
        setGameState(createWizardZombieState(vocabulary))
     }
  }, [vocabulary])

    useEffect(() => {
      if (!containerRef.current) return
  
      const updateDimensions = () => {
        if (!containerRef.current) return
        const { width, height } = containerRef.current.getBoundingClientRect()
        
        if (width === 0 || height === 0) return
  
        const scaleX = width / GAME_WIDTH
        const scaleY = height / GAME_HEIGHT
        const scale = Math.min(scaleX, scaleY)
        
        setDimensions({ width, height, scale })
      }
  
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
           // Use contentRect for precise observer updates
           const { width, height } = entry.contentRect
           if (width > 0 && height > 0) {
               const scaleX = width / GAME_WIDTH
               const scaleY = height / GAME_HEIGHT
               const scale = Math.min(scaleX, scaleY)
               setDimensions({ width, height, scale })
           }
        }
      })
      
      observer.observe(containerRef.current)
      
      // Aggressive Polling for 2 seconds to catch any layout shifts
      const interval = setInterval(updateDimensions, 200)
      const timeout = setTimeout(() => clearInterval(interval), 2000)
  
      // Immediate check
      updateDimensions()
  
      return () => {
          observer.disconnect()
          clearInterval(interval)
          clearTimeout(timeout)
      }
    }, [])
  
    return (
      <div 
          ref={containerRef} 
          style={{ minHeight: '300px' }}
          className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10 touch-none md:aspect-video md:h-auto"
      >
          {!gameState ? (
              <div className="flex h-full items-center justify-center">
                   <div className="text-white">Loading...</div>
              </div>
          ) : (
              <>
                  {/* HUD Overlay */}
                  <div className="absolute top-4 left-4 z-10 text-white font-bold text-lg pointer-events-none">
                      HP: {Math.ceil(gameState.player.hp)}
                  </div>
                  <div className="absolute top-4 right-4 z-10 text-white font-bold text-lg pointer-events-none">
                      Score: {gameState.score}
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm pointer-events-none">
                      <span className="text-white/70 mr-2">Find:</span>
                      <span className="text-xl font-bold text-yellow-400">{gameState.targetWord}</span>
                  </div>
  
                  {/* Canvas */}
                  <Stage width={dimensions.width} height={dimensions.height} data-testid="stage">
                      <Layer 
                          scaleX={dimensions.scale} 
                          scaleY={dimensions.scale}
                          x={(dimensions.width - GAME_WIDTH * dimensions.scale) / 2}
                          y={(dimensions.height - GAME_HEIGHT * dimensions.scale) / 2}
                      >
                          {/* Background Area (Clipping mask/Background color) */}
                          <Rect 
                              width={GAME_WIDTH} 
                              height={GAME_HEIGHT} 
                              fill="#334155" 
                          />                            
                            <Group>
                                {/* Player */}
                                <Circle 
                                   x={gameState.player.x} 
                                   y={gameState.player.y} 
                                   radius={gameState.player.radius} 
                                   fill="#3b82f6" // blue-500
                                   name="player"
                                />
                                
                                {/* Orbs */}
                                {gameState.orbs.map(orb => (
                                    <Group key={orb.id} x={orb.x} y={orb.y}>
                                        <Circle 
                                            radius={orb.radius} 
                                            fill={orb.isCorrect ? "#eab308" : "#94a3b8"} 
                                            name="orb"
                                        />
                                        <Text 
                                            text={orb.translation} 
                                            fontSize={14} 
                                            fill="white" 
                                            offsetX={orb.radius} 
                                            offsetY={7}
                                            width={orb.radius * 2}
                                            align="center"
                                        />
                                    </Group>
                                ))}
                            </Group>
                        </Layer>
                    </Stage>
                </>
            )}
        </div>
      )
    }