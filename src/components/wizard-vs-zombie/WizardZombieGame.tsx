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
import { calculateIndicators } from '@/lib/wizardZombieIndicators'

interface WizardZombieGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: any) => void
}

export function WizardZombieGame({ vocabulary, onComplete }: WizardZombieGameProps) {
  const { playSound } = useSound() 
  const { input, setVirtualInput, triggerCast, consumeCast } = useDirectionalInput()
  const [gameState, setGameState] = useState<WizardZombieState | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })

  // Calculate indicators
  const indicators = gameState && dimensions.width > 0 ? calculateIndicators(
      gameState.orbs,
      camera,
      dimensions
  ) : []

  // Game Loop
  useInterval(() => {
    if (gameState && gameState.status === 'playing') {
        const nextState = advanceWizardZombieTime(gameState, 50, input, vocabulary)
        setGameState(nextState)

        // Reset cast input after processing
        if (input.cast) {
            consumeCast()
            playSound('success') // Placeholder sound for cast
        }

        if (dimensions.width > 0 && dimensions.height > 0) {
             const scaleY = dimensions.height / GAME_HEIGHT
             const scale = Math.max(scaleY, 0.8) 

             let camX = (dimensions.width / 2) - (nextState.player.x * scale)
             let camY = (dimensions.height / 2) - (nextState.player.y * scale)

             const minX = dimensions.width - (GAME_WIDTH * scale)
             const minY = dimensions.height - (GAME_HEIGHT * scale)
             
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
      if (width > 0 && height > 0) setDimensions({ width, height })
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
         const { width, height } = entry.contentRect
         if (width > 0 && height > 0) setDimensions({ width, height })
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
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 text-white font-bold text-lg pointer-events-none">
                    <div>HP: {Math.ceil(gameState.player.hp)}</div>
                    <div className="text-blue-400 text-sm">
                        SHOCKWAVE: {Array(gameState.player.maxShockwaveCharges).fill(0).map((_, i) => (
                            <span key={i} className={i < gameState.player.shockwaveCharges ? "opacity-100" : "opacity-30"}>
                                ⚡
                            </span>
                        ))}
                    </div>
                </div>
                <div className="absolute top-4 right-4 z-10 text-white font-bold text-lg pointer-events-none">
                    Score: {gameState.score}
                </div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm pointer-events-none">
                    <span className="text-white/70 mr-2">Find:</span>
                    <span className="text-xl font-bold text-yellow-400">{gameState.targetWord}</span>
                </div>

                {/* Off-screen Indicators */}
                {indicators.map(ind => (
                    <div 
                        key={ind.orb.id}
                        className="absolute z-10 flex items-center justify-center pointer-events-none"
                        style={{
                            left: ind.x,
                            top: ind.y,
                            transform: `translate(-50%, -50%) rotate(${ind.rotation}deg)`
                        }}
                    >
                        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-yellow-400 animate-pulse" />
                    </div>
                ))}
                
                {/* Text Labels for Indicators */}
                {indicators.map(ind => (
                    <div 
                        key={`label-${ind.orb.id}`}
                        className="absolute z-10 pointer-events-none text-xs font-bold text-white bg-black/60 px-2 py-1 rounded whitespace-nowrap"
                        style={{
                            left: ind.x,
                            top: ind.y,
                            transform: `translate(-50%, -50%) translate(${Math.cos(ind.rotation * Math.PI / 180) * -35}px, ${Math.sin(ind.rotation * Math.PI / 180) * -35}px)`
                        }}
                    >
                        {ind.orb.translation}
                    </div>
                ))}

                {/* Virtual Controls */}
                <div className="absolute bottom-8 right-8 z-20 flex flex-row items-end gap-6">
                    <button 
                        onClick={() => triggerCast()}
                        disabled={gameState.player.shockwaveCharges === 0}
                        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center font-bold transition-all active:scale-95 ${
                            gameState.player.shockwaveCharges > 0 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                            : 'bg-slate-800 border-slate-700 text-slate-500 opacity-50'
                        }`}
                    >
                        CAST
                    </button>
                    <VirtualDPad onInput={setVirtualInput} />
                </div>

                {/* Canvas */}
                <Stage width={dimensions.width} height={dimensions.height} data-testid="stage"><Layer scaleX={camera.scale} scaleY={camera.scale} x={camera.x} y={camera.y}><Rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="#334155" /><Group><Circle x={gameState.player.x} y={gameState.player.y} radius={gameState.player.radius} fill="#3b82f6" name="player" />{gameState.zombies.map(zombie => (<Circle key={zombie.id} x={zombie.x} y={zombie.y} radius={zombie.radius} fill="#22c55e" name="zombie" />))}{gameState.orbs.map(orb => (<Group key={orb.id} x={orb.x} y={orb.y}><Circle radius={orb.radius} fill={orb.isCorrect ? "#eab308" : "#94a3b8"} name="orb" /><Text text={orb.translation} fontSize={14} fill="white" offsetX={orb.radius} offsetY={7} width={orb.radius * 2} align="center" /></Group>))}</Group></Layer></Stage>
            </>
        )}
    </div>
  )
}
