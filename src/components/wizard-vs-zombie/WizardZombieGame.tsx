'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Text, Group, Rect, Image as KonvaImage } from 'react-konva'
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
import { withBasePath } from '@/lib/basePath'
import { Skull, Sparkles, Zap } from 'lucide-react'
import { calculateXP } from '@/lib/xp'
import { GameEndScreen } from '@/components/game/GameEndScreen'
import { GameStartScreen } from '@/components/game/GameStartScreen'

export type WizardZombieGameResult = {
  xp: number
  accuracy: number
}

interface WizardZombieGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: WizardZombieGameResult) => void
}

// Sprite Helper
const buildSpriteGrid = (width: number, height: number) => {
  const fw = width / 3
  const fh = height / 3
  return { fw, fh }
}

const getSpriteCrop = (fw: number, fh: number, col: number, row: number) => ({
  x: col * fw,
  y: row * fh,
  width: fw,
  height: fh
})

export function WizardZombieGame({ vocabulary, onComplete }: WizardZombieGameProps) {
  const { playSound } = useSound() 
  const { input, setVirtualInput, triggerCast, consumeCast } = useDirectionalInput()
  const [gameState, setGameState] = useState<WizardZombieState | null>(null)
  const [gamePhase, setGamePhase] = useState<'start' | 'playing' | 'ended'>('start')
  const [results, setResults] = useState<WizardZombieGameResult | null>(null)
  const hasReportedRef = useRef(false)
  
  const [assets, setAssets] = useState<{
      player: HTMLImageElement
      zombie: HTMLImageElement
      orb: HTMLImageElement
      floor: HTMLImageElement
  } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })

  // Animation Frames
  const [playerFrame, setPlayerFrame] = useState(0)
  const [zombieFrame, setZombieFrame] = useState(0)
  const [orbFrame, setOrbFrame] = useState(0)

  // Asset Loading
  useEffect(() => {
      let mounted = true
      const load = async () => {
          const loadImage = (src: string): Promise<HTMLImageElement> => 
              new Promise((res, rej) => {
                  const img = new Image()
                  img.src = withBasePath(src)
                  img.onload = () => res(img)
                  img.onerror = rej
              })
          
          try {
              const [player, zombie, orb, floor] = await Promise.all([
                  loadImage('/games/wizard-vs-zombie/player_3x3_pose_sheet.png'),
                  loadImage('/games/wizard-vs-zombie/zombie_3x3_pose_sheet.png'),
                  loadImage('/games/wizard-vs-zombie/orb_3x3_pose_sheet.png'),
                  loadImage('/games/wizard-vs-zombie/tile-ruins.png'),
              ])
              if (mounted) setAssets({ player, zombie, orb, floor })
          } catch (e) {
              console.error('Failed to load assets', e)
          }
      }
      load()
      return () => { mounted = false }
  }, [])

  const resetGame = useCallback(() => {
    if (vocabulary.length > 0) {
        setGameState(createWizardZombieState(vocabulary))
        setResults(null)
        hasReportedRef.current = false
    }
  }, [vocabulary])

  useEffect(() => {
    resetGame()
    setGamePhase('start')
  }, [resetGame])

  // Animation Loop
  useInterval(() => {
      if (gamePhase === 'playing') {
          setPlayerFrame(f => (f + 1) % 3)
          setZombieFrame(f => (f + 1) % 3)
          setOrbFrame(f => (f + 1) % 3)
      }
  }, 150)

  // Calculate indicators
  const indicators = gameState && dimensions.width > 0 ? calculateIndicators(
      gameState.orbs,
      camera,
      dimensions
  ) : []

  // Game Loop
  useInterval(() => {
    if (gameState && gameState.status === 'playing' && assets && gamePhase === 'playing') {
        const nextState = advanceWizardZombieTime(gameState, 50, input, vocabulary)
        setGameState(nextState)

        if (input.cast) {
            consumeCast()
            playSound('success') 
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
  }, gameState?.status === 'playing' && gamePhase === 'playing' ? 50 : null)

  useEffect(() => {
    if (!gameState || gameState.status !== 'gameover') return
    const accuracy =
      gameState.totalAttempts > 0
        ? gameState.correctAnswers / gameState.totalAttempts
        : 0
    const xp = calculateXP(gameState.score, gameState.correctAnswers, gameState.totalAttempts)
    const nextResults = { xp, accuracy }
    setResults(nextResults)
    if (!hasReportedRef.current) {
      onComplete(nextResults)
      hasReportedRef.current = true
    }
    setGamePhase('ended')
  }, [gameState, onComplete])

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      if (width > 0 && height > 0) setDimensions({ width, height })
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
         if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
             setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height })
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

  // Memoize sprite grids
  const grids = useMemo(() => {
      if (!assets) return null
      return {
          player: buildSpriteGrid(assets.player.width, assets.player.height),
          zombie: buildSpriteGrid(assets.zombie.width, assets.zombie.height),
          orb: buildSpriteGrid(assets.orb.width, assets.orb.height)
      }
  }, [assets])

  if (!assets) {
    return (
        <div 
            ref={containerRef}
            className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 md:aspect-video md:h-auto"
        >
             <div className="text-white animate-pulse font-mono tracking-widest uppercase">Initializing Grimoire...</div>
        </div>
    )
  }

  return (
    <div 
        ref={containerRef} 
        style={{ minHeight: '400px' }}
        className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10 touch-none md:aspect-video md:h-auto"
    >
        {gamePhase === 'start' && (
            <GameStartScreen
                gameTitle="Wizard vs Zombie"
                gameSubtitle="Horde Survival"
                vocabulary={vocabulary}
                instructions={[
                    { step: 1, text: 'Collect the correct healing orb to restore HP.', icon: Sparkles },
                    { step: 2, text: 'Wrong orbs reshuffle the field and cost points.', icon: Skull },
                    { step: 3, text: 'Build shockwave charges and blast zombies back.', icon: Zap },
                ]}
                proTip="Use Shockwave when surrounded to create space for an escape."
                controls={[
                    { label: 'Move', keys: 'Arrows / WASD', color: 'bg-amber-500' },
                    { label: 'Cast', keys: 'Space / Enter', color: 'bg-emerald-500' },
                ]}
                startButtonText="Start Survival"
                icon={Skull}
                onStart={() => {
                    resetGame()
                    setGamePhase('playing')
                }}
            />
        )}

        {gamePhase === 'playing' && gameState && grids && (
            <>
                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 text-white font-bold text-lg pointer-events-none drop-shadow-md">
                    <div>HP: {Math.ceil(gameState.player.hp)}</div>
                    <div className="text-blue-400 text-sm flex items-center gap-1">
                        SHOCKWAVE: {Array(gameState.player.maxShockwaveCharges).fill(0).map((_, i) => (
                            <span key={i} className={i < gameState.player.shockwaveCharges ? "opacity-100" : "opacity-30"}>
                                ⚡
                            </span>
                        ))}
                    </div>
                </div>
                <div className="absolute top-4 right-4 z-10 text-white font-bold text-lg pointer-events-none drop-shadow-md">
                    Score: {gameState.score}
                </div>
                
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm pointer-events-none">
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
                        className="absolute z-10 pointer-events-none text-xs font-bold text-white bg-black/60 px-2 py-1 rounded whitespace-nowrap shadow-lg border border-white/10"
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
                <Stage width={dimensions.width} height={dimensions.height} data-testid="stage">
                    <Layer scaleX={camera.scale} scaleY={camera.scale} x={camera.x} y={camera.y}>
                        {/* Floor Tiling - Using Rect for proper pattern repeat */}
                        <Rect 
                            x={0} y={0} 
                            width={GAME_WIDTH} height={GAME_HEIGHT} 
                            fillPatternImage={assets.floor}
                            fillPatternRepeat="repeat"
                            fillPatternScaleX={0.5}
                            fillPatternScaleY={0.5}
                        />
                        
                        <Group>
                            {/* Player */}
                            <KonvaImage 
                                image={assets.player}
                                name="player"
                                x={gameState.player.x}
                                y={gameState.player.y}
                                width={64}
                                height={64}
                                offsetX={32}
                                offsetY={32}
                                crop={getSpriteCrop(grids.player.fw, grids.player.fh, playerFrame, input.dx === 0 && input.dy === 0 ? 0 : 1)}
                            />
                            
                            {/* Zombies - Offset animation */}
                            {gameState.zombies.map((zombie, i) => (
                                <KonvaImage 
                                    key={zombie.id}
                                    image={assets.zombie}
                                    name="zombie"
                                    x={zombie.x}
                                    y={zombie.y}
                                    width={48}
                                    height={48}
                                    offsetX={24}
                                    offsetY={24}
                                    crop={getSpriteCrop(grids.zombie.fw, grids.zombie.fh, (zombieFrame + i) % 3, 0)}
                                />
                            ))}
                            
                            {/* Orbs - Offset animation */}
                            {gameState.orbs.map((orb, i) => (
                                <Group key={orb.id} x={orb.x} y={orb.y}>
                                    <KonvaImage 
                                        image={assets.orb}
                                        name="orb"
                                        width={orb.radius * 2}
                                        height={orb.radius * 2}
                                        offsetX={orb.radius}
                                        offsetY={orb.radius}
                                        crop={getSpriteCrop(grids.orb.fw, grids.orb.fh, (orbFrame + i) % 3, 0)}
                                    />
                                    <Text 
                                        text={orb.translation} 
                                        fontSize={14} 
                                        fontStyle="bold"
                                        fill="white" 
                                        offsetX={orb.radius} 
                                        offsetY={orb.radius + 20}
                                        width={orb.radius * 2}
                                        align="center"
                                        shadowColor="black"
                                        shadowBlur={4}
                                    />
                                </Group>
                            ))}
                        </Group>
                    </Layer>
                </Stage>
            </>
        )}

        {gamePhase === 'ended' && gameState && results && (
            <GameEndScreen
                status="defeat"
                title="Survival Failed"
                subtitle="The horde has overwhelmed you."
                score={gameState.score}
                xp={results.xp}
                accuracy={results.accuracy}
                customStats={[
                    { label: 'Survival Time', value: `${Math.round(gameState.gameTime / 1000)}s` },
                    { label: 'Correct Orbs', value: gameState.correctAnswers },
                ]}
                onRestart={() => {
                    resetGame()
                    setGamePhase('start')
                }}
                onExit={() => {
                    window.location.href = '/'
                }}
            />
        )}
    </div>
  )
}
