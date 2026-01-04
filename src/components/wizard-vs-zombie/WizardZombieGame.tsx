'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Circle, Text, Group, Rect } from 'react-konva'
import { 
  createWizardZombieState, 
  advanceWizardZombieTime,
  GAME_WIDTH, 
  GAME_HEIGHT, 
  type WizardZombieState 
} from '@/lib/wizardZombie'
import type { VocabularyItem } from '@/store/useGameStore'
import { useSound } from '@/hooks/useSound'
import { useInterval } from '@/hooks/useInterval'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { VirtualDPad } from '@/components/ui/VirtualDPad'

interface WizardZombieGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: any) => void
}

export function WizardZombieGame({ vocabulary, onComplete }: WizardZombieGameProps) {
  const { playSound } = useSound() 
  const { input, setVirtualInput } = useDirectionalInput()
  const [gameState, setGameState] = useState<WizardZombieState | null>(null)
  
  // Dimensions for responsive canvas
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
    // Camera State
    const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })
  
    // Game Loop
    useInterval(() => {
      if (gameState && gameState.status === 'playing') {
          // 1. Advance Game State
          const nextState = advanceWizardZombieTime(gameState, 50, input)
          setGameState(nextState)
  
          // 2. Update Camera (Follow Player)
          if (dimensions.width > 0 && dimensions.height > 0) {
               // Determine scale: On desktop, fit world. On mobile, zoom in (min scale 0.8?)
               // Let's try to maintain a reasonable view area.
               // If screen is narrow (mobile), we want scale ~0.8-1.0 to see details.
               // If screen is wide (desktop), we might fit height.
               
               // Strategy: Fit Height, but enforce max zoom out.
               const scaleY = dimensions.height / GAME_HEIGHT
               // On mobile portrait, scaleY might be small (e.g. 0.5). We don't want that.
               // We want scale >= 0.8 usually.
               const targetScale = Math.max(scaleY, 0.8) 
               // Or simply fixed scale 1.0 for pixel art look? Let's try adaptive.
               
               const scale = targetScale
  
               // Center on player
               let camX = (dimensions.width / 2) - (nextState.player.x * scale)
               let camY = (dimensions.height / 2) - (nextState.player.y * scale)
  
               // Clamp to bounds
               // Max x is 0 (left edge aligned)
               // Min x is dimensions.width - GAME_WIDTH * scale (right edge aligned)
               const minX = dimensions.width - (GAME_WIDTH * scale)
               const minY = dimensions.height - (GAME_HEIGHT * scale)
               
               // If world is smaller than screen, center it
               if (minX > 0) camX = (dimensions.width - GAME_WIDTH * scale) / 2
               else camX = Math.max(minX, Math.min(0, camX))
  
               if (minY > 0) camY = (dimensions.height - GAME_HEIGHT * scale) / 2
               else camY = Math.max(minY, Math.min(0, camY))
  
               setCamera({ x: camX, y: camY, scale })
          }
      }
    }, gameState?.status === 'playing' ? 50 : null)
  
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
        
        setDimensions({ width, height })
      }
  
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
           const { width, height } = entry.contentRect
           if (width > 0 && height > 0) {
               setDimensions({ width, height })
           }
        }
      })
      
      observer.observe(containerRef.current)
      
      const interval = setInterval(updateDimensions, 200)
      const timeout = setTimeout(() => clearInterval(interval), 2000)
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
  
                  {/* Virtual Controls (Visible on all form factors as requested) */}
                  <div className="absolute bottom-8 right-8 z-20">
                      <VirtualDPad onInput={setVirtualInput} />
                  </div>
  
                  {/* Canvas */}
                  <Stage width={dimensions.width} height={dimensions.height} data-testid="stage"><Layer scaleX={camera.scale} scaleY={camera.scale} x={camera.x} y={camera.y}><Rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="#334155" /><Group><Circle x={gameState.player.x} y={gameState.player.y} radius={gameState.player.radius} fill="#3b82f6" name="player" />{gameState.zombies.map(zombie => (<Circle key={zombie.id} x={zombie.x} y={zombie.y} radius={zombie.radius} fill="#22c55e" name="zombie" />))}{gameState.orbs.map(orb => (<Group key={orb.id} x={orb.x} y={orb.y}><Circle radius={orb.radius} fill={orb.isCorrect ? "#eab308" : "#94a3b8"} name="orb" /><Text text={orb.translation} fontSize={14} fill="white" offsetX={orb.radius} offsetY={7} width={orb.radius * 2} align="center" /></Group>))}</Group></Layer></Stage>
              </>
          )}
      </div>
    )
  }