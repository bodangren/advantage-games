'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Group, Layer, Rect, Stage, Text, Circle } from 'react-konva'
import { AnimatePresence } from 'framer-motion'
import {
  createGriffinRidersEscapeState,
  tickGriffinRidersEscape,
  switchLane,
  type GriffinRiderState,
  type Lane,
} from '@/lib/games/griffinRidersEscape'
import { GAME_WIDTH, GAME_HEIGHT, GRIFFIN_RIDERS_ESCAPE_CONFIG } from '@/lib/games/griffinRidersEscapeConfig'
import type { VocabularyItem, Difficulty } from '@/store/useGameStore'
import { useSound } from '@/hooks/useSound'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { GameEndScreen } from '@/components/games/game/GameEndScreen'
import { GameStartScreen } from '@/components/games/game/GameStartScreen'
import { calculateXP } from '@/lib/xp'
import { Heart } from 'lucide-react'

type GameProps = {
  vocabulary: VocabularyItem[]
  onComplete?: (results: { accuracy: number; xp: number }) => void
}

type GamePhase = 'start' | 'playing' | 'ended'

export function GriffinRidersEscapeGame({ vocabulary, onComplete }: GameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [gameState, setGameState] = useState<GriffinRiderState | null>(null)
  const [gamePhase, setGamePhase] = useState<GamePhase>('start')
  const [selectedDifficulty] = useState<Difficulty>('normal')
  const [playerVisualX, setPlayerVisualX] = useState(GAME_WIDTH / 2)
  const [shake, setShake] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  
  const { playSound } = useSound()
  const { input } = useDirectionalInput()
  const lastInputDx = useRef(0)

  // Measure stage dimensions
  useEffect(() => {
    if (!containerRef.current) return
    const updateDimensions = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      if (width > 0 && height > 0) setDimensions({ width, height })
    }
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)
    updateDimensions()
    return () => observer.disconnect()
  }, [])

  const resetGame = useCallback(() => {
    if (vocabulary.length > 0) {
      setGameState(createGriffinRidersEscapeState(vocabulary, { difficulty: selectedDifficulty }))
      setPlayerVisualX(GAME_WIDTH / 2)
    }
  }, [vocabulary, selectedDifficulty])

  useEffect(() => {
    if (gamePhase === 'start') resetGame()
  }, [gamePhase, resetGame])

  // Game Loop
  const lastFrameRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (gamePhase !== 'playing' || !gameState) return

    const loop = (timestamp: number) => {
      const delta = lastFrameRef.current ? timestamp - lastFrameRef.current : 16
      lastFrameRef.current = timestamp
      const clampedDelta = Math.min(delta, 50)

      setGameState(prev => {
        if (!prev || prev.status !== 'playing') return prev
        const next = tickGriffinRidersEscape(prev, vocabulary, clampedDelta)
        
        // Detect state changes for feedback
        if (next.lives < prev.lives) {
          setShake(10)
          setFlash('rgba(239, 68, 68, 0.4)') // red-500
          playSound('error')
          setTimeout(() => setFlash(null), 150)
        }
        if (next.targetIndex > prev.targetIndex) {
          setFlash('rgba(16, 185, 129, 0.4)') // emerald-500
          playSound('success')
          setTimeout(() => setFlash(null), 150)
        }
        
        return next
      })

      setShake(s => Math.max(0, s - 1))
      // Flash decay is handled in useEffect or just by setting it once
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastFrameRef.current = 0
    }
  }, [gamePhase, gameState, vocabulary, playSound])

  // Player movement animation (Lerp)
  useEffect(() => {
    if (gamePhase !== 'playing' || !gameState) return
    
    const targetX = GAME_WIDTH / 2 + GRIFFIN_RIDERS_ESCAPE_CONFIG.laneX[gameState.playerLane]
    const lerpSpeed = 0.2
    
    const animLoop = () => {
      setPlayerVisualX(prev => prev + (targetX - prev) * lerpSpeed)
      rafRef.current = requestAnimationFrame(animLoop)
    }
    
    const rafId = requestAnimationFrame(animLoop)
    return () => cancelAnimationFrame(rafId)
  }, [gamePhase, gameState])

  // Input Handling
  useEffect(() => {
    if (gamePhase !== 'playing' || !gameState) return

    if (input.dx !== 0 && input.dx !== lastInputDx.current) {
      if (input.dx < 0) setGameState(prev => prev ? switchLane(prev, 'left') : null)
      if (input.dx > 0) setGameState(prev => prev ? switchLane(prev, 'right') : null)
    }
    lastInputDx.current = input.dx
  }, [input.dx, gamePhase, gameState])

  // Result Handling
  useEffect(() => {
    if (gameState?.status === 'victory' || gameState?.status === 'defeat') {
      setTimeout(() => setGamePhase('ended'), 1000)
    }
  }, [gameState?.status])

  useEffect(() => {
    if (gamePhase === 'ended' && gameState) {
      const accuracy = gameState.totalAttempts > 0 ? gameState.correctAnswers / gameState.totalAttempts : 0
      const xp = calculateXP(gameState.score, gameState.correctAnswers, gameState.totalAttempts)
      onComplete?.({ accuracy, xp })
    }
  }, [gamePhase, gameState, onComplete])

  const handleStart = useCallback(() => {
    resetGame()
    setGamePhase('playing')
  }, [resetGame])

  const handleRestart = useCallback(() => {
    setGamePhase('start')
  }, [])

  if (!gameState) return null

  // Projection Helpers
  const getProjectedX = (lane: Lane, z: number) => {
    const laneX = GRIFFIN_RIDERS_ESCAPE_CONFIG.laneX[lane]
    const scale = 1.0 / (z / 20 + 1)
    return GAME_WIDTH / 2 + (laneX * scale)
  }

  const getProjectedY = (z: number) => {
    const scale = 1.0 / (z / 20 + 1)
    const horizonY = GRIFFIN_RIDERS_ESCAPE_CONFIG.horizonY
    const verticalSpan = GAME_HEIGHT - horizonY
    return horizonY + (verticalSpan * scale)
  }

  const getProjectedScale = (z: number) => {
    return 1.0 / (z / 20 + 1)
  }

  const scale = Math.min(dimensions.width / GAME_WIDTH, dimensions.height / GAME_HEIGHT)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70vh] min-h-[600px] overflow-hidden rounded-3xl border border-sky-800 bg-sky-950 shadow-2xl"
    >
      {gamePhase !== 'start' && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          scaleX={scale}
          scaleY={scale}
          x={(dimensions.width - GAME_WIDTH * scale) / 2 + (Math.random() - 0.5) * shake}
          y={(Math.random() - 0.5) * shake}
        >
          <Layer>
            {/* Background Clouds (Simplified for now) */}
            <Rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="#0ea5e9" />
            
            {/* Flash Effect */}
            {flash && (
              <Rect width={GAME_WIDTH} height={GAME_HEIGHT} fill={flash} opacity={0.5} />
            )}
            
            {/* Perspective Lines */}
            <Group opacity={0.3}>
                <Circle x={GAME_WIDTH/2} y={GRIFFIN_RIDERS_ESCAPE_CONFIG.horizonY} radius={5} fill="white" />
                <Rect x={GAME_WIDTH/2 - 1} y={GRIFFIN_RIDERS_ESCAPE_CONFIG.horizonY} width={2} height={GAME_HEIGHT} fill="white" />
            </Group>

            {/* World Objects */}
            {gameState.objects.map(obj => {
              const x = getProjectedX(obj.lane, obj.z)
              const y = getProjectedY(obj.z)
              const objScale = getProjectedScale(obj.z)
              
              return (
                <Group key={obj.id} x={x} y={y} scaleX={objScale} scaleY={objScale}>
                  {obj.type === 'gate' ? (
                    <Group x={-60} y={-80}>
                      <Rect width={120} height={100} fill={obj.orderIndex === gameState.targetIndex ? "#fbbf24" : "#94a3b8"} cornerRadius={10} stroke="white" strokeWidth={2} />
                      <Text
                        text={obj.word}
                        width={120}
                        height={100}
                        align="center"
                        verticalAlign="middle"
                        fontSize={20}
                        fontStyle="bold"
                        fill="black"
                      />
                    </Group>
                  ) : (
                    <Circle radius={40} fill="#ef4444" opacity={0.8} />
                  )}
                </Group>
              )
            })}

            {/* Player (Griffin) */}
            <Group x={playerVisualX} y={GRIFFIN_RIDERS_ESCAPE_CONFIG.playerY}>
                <Circle radius={30} fill="#f8fafc" stroke="#334155" strokeWidth={4} />
                <Text text="🦅" x={-15} y={-15} fontSize={30} />
            </Group>
          </Layer>
        </Stage>
      )}

      {/* UI Overlay */}
      {gamePhase === 'playing' && (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-start">
             <div className="flex gap-2">
                {Array.from({ length: GRIFFIN_RIDERS_ESCAPE_CONFIG.initialLives }).map((_, i) => (
                  <Heart key={i} className={`w-8 h-8 ${i < gameState.lives ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                ))}
             </div>
             <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-xl border border-white/20">
                <div className="text-xs text-white/60 uppercase">Score</div>
                <div className="text-2xl font-bold text-white leading-tight">{gameState.score}</div>
             </div>
          </div>

          <div className="mt-4 w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
             <div className="text-xs text-amber-300 uppercase font-bold tracking-wider mb-1">Translate</div>
             <div className="text-xl text-white font-medium">{gameState.currentSentence.translation}</div>
          </div>

          <div className="mt-auto mb-12 flex flex-wrap gap-2 justify-center">
            {gameState.words.map((word, i) => (
              <span key={i} className={`px-3 py-1 rounded-lg text-sm font-bold border ${i < gameState.targetIndex ? 'bg-emerald-500/80 border-emerald-400 text-white' : 'bg-black/40 border-white/10 text-white/40'}`}>
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {gamePhase === 'start' && (
        <GameStartScreen
          gameTitle="Griffin Rider's Escape"
          gameSubtitle="Soar through magical gates to complete the sentence!"
          vocabulary={vocabulary}
          instructions={[
            { step: 1, text: 'Swipe left or right to change lanes.' },
            { step: 2, text: 'Fly through the gate with the next word in the sentence.' },
            { step: 3, text: 'Avoid storm clouds and wrong words to keep your lives!' },
          ]}
          proTip="Use the translation banner at the top to plan your route."
          controls={[
            { label: 'Switch Lane', keys: 'Left/Right Arrows or Swipe', color: 'bg-sky-500' }
          ]}
          onStart={handleStart}
        />
      )}

      <AnimatePresence>
        {gamePhase === 'ended' && (
          <GameEndScreen
            status={gameState.status === 'victory' ? 'victory' : 'defeat'}
            score={gameState.score}
            xp={calculateXP(gameState.score, gameState.correctAnswers, gameState.totalAttempts)}
            accuracy={gameState.totalAttempts > 0 ? gameState.correctAnswers / gameState.totalAttempts : 0}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
