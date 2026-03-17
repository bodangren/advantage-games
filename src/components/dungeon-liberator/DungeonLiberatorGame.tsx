'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Text, Group, Rect, Circle, Line, Ring } from 'react-konva'
import {
  createDungeonLiberatorState,
  advanceDungeonLiberatorTime,
  advanceToNextLevel,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_RADIUS,
  PRISONER_RADIUS,
  MONSTER_RADIUS,
  PORTAL_RADIUS,
  type DungeonLiberatorState,
} from '@/lib/dungeonLiberator'
import type { VocabularyItem } from '@/store/useGameStore'
import { useInterval } from '@/hooks/useInterval'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { VirtualDPad } from '@/components/ui/VirtualDPad'
import { calculateXP } from '@/lib/xp'
import { GameEndScreen } from '@/components/game/GameEndScreen'
import { GameStartScreen } from '@/components/game/GameStartScreen'
import { Shield, Sword, Users, AlertTriangle } from 'lucide-react'

export type DungeonLiberatorGameResult = {
  xp: number
  accuracy: number
}

interface DungeonLiberatorGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: DungeonLiberatorGameResult) => void
}

export function DungeonLiberatorGame({ vocabulary, onComplete }: DungeonLiberatorGameProps) {
  const { input, setVirtualInput } = useDirectionalInput()
  const [gameState, setGameState] = useState<DungeonLiberatorState | null>(null)
  const [gamePhase, setGamePhase] = useState<'start' | 'playing' | 'ended'>('start')
  const [results, setResults] = useState<DungeonLiberatorGameResult | null>(null)
  const hasReportedRef = useRef(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const resetGame = useCallback(() => {
    if (vocabulary.length > 0) {
      setGameState(createDungeonLiberatorState(vocabulary))
      setResults(null)
      setTotalXP(0)
      setTotalCorrect(0)
      setTotalAttempts(0)
      hasReportedRef.current = false
    }
  }, [vocabulary])

  useEffect(() => {
    if (vocabulary.length > 0 && gamePhase === 'start') {
      resetGame()
    }
  }, [vocabulary, gamePhase, resetGame])

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

  const [totalXP, setTotalXP] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  useInterval(() => {
    if (gameState && gameState.phase === 'playing' && gamePhase === 'playing') {
      const nextState = advanceDungeonLiberatorTime(gameState, 50, { dx: input.dx, dy: input.dy })
      
      if (nextState.phase === 'victory') {
        const levelCorrect = nextState.correctWords
        const levelAttempts = nextState.totalAttempts
        const levelXP = calculateXP(levelCorrect, levelCorrect, levelAttempts)
        
        setTotalXP(prev => prev + levelXP)
        setTotalCorrect(prev => prev + levelCorrect)
        setTotalAttempts(prev => prev + levelAttempts)
        
        const nextLevelState = advanceToNextLevel(nextState, vocabulary)
        setGameState(nextLevelState)
      } else if (nextState.phase === 'defeat') {
        const levelCorrect = nextState.correctWords
        const levelAttempts = nextState.totalAttempts
        
        setTotalCorrect(prev => prev + levelCorrect)
        setTotalAttempts(prev => prev + levelAttempts)
        
        const finalAccuracy = (totalCorrect + levelCorrect) > 0 
          ? (totalCorrect + levelCorrect) / (totalAttempts + levelAttempts)
          : 0
        const finalResults = { xp: totalXP, accuracy: finalAccuracy }
        setResults(finalResults)
        if (!hasReportedRef.current) {
          onComplete(finalResults)
          hasReportedRef.current = true
        }
        setGamePhase('ended')
      } else {
        setGameState(nextState)
      }
    }
  }, gameState?.phase === 'playing' && gamePhase === 'playing' ? 50 : null)

  const scale = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return 1
    const scaleX = dimensions.width / GAME_WIDTH
    const scaleY = dimensions.height / GAME_HEIGHT
    return Math.min(scaleX, scaleY, 1)
  }, [dimensions])

  const offsetX = useMemo(() => {
    if (dimensions.width === 0) return 0
    return (dimensions.width - GAME_WIDTH * scale) / 2
  }, [dimensions, scale])

  const offsetY = useMemo(() => {
    if (dimensions.height === 0) return 0
    return (dimensions.height - GAME_HEIGHT * scale) / 2
  }, [dimensions, scale])

  if (gamePhase === 'start') {
    return (
      <div
        ref={containerRef}
        className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10 touch-none md:aspect-video md:h-auto"
      >
        <GameStartScreen
          gameTitle="Dungeon Liberator"
          gameSubtitle="Rescue the Prisoners"
          vocabulary={vocabulary}
          instructions={[
            { step: 1, text: 'Collect prisoners in the correct word order to build your rescue party.', icon: Users },
            { step: 2, text: 'Wrong prisoner? They panic and flee. Monster hits your trail? The tail gets cut off!', icon: AlertTriangle },
            { step: 3, text: 'Guide everyone to the exit portal to complete the sentence and escape!', icon: Shield },
          ]}
          proTip="Read the Thai translation at the top to figure out which word comes next. Monsters get faster each level!"
          controls={[
            { label: 'Move', keys: 'Arrows / WASD', color: 'bg-amber-500' },
          ]}
          startButtonText="Enter the Dungeon"
          icon={Sword}
          onStart={() => {
            resetGame()
            setGamePhase('playing')
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{ minHeight: '400px' }}
      className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10 touch-none md:aspect-video md:h-auto"
    >
      {gamePhase === 'playing' && gameState && (
        <>
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 text-white font-bold text-lg pointer-events-none drop-shadow-md">
            <div className="flex items-center gap-2">
              Lives: {Array(gameState.player.maxLives).fill(0).map((_, i) => (
                <span key={i} className={i < gameState.player.lives ? "text-red-400" : "text-white/30"}>❤️</span>
              ))}
            </div>
            <div className="text-sm text-amber-400">
              Rescued: {gameState.trail.length} / {gameState.words.length}
            </div>
            <div className="text-sm text-purple-400">
              Level: {gameState.level}
            </div>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm pointer-events-none max-w-[90%]">
            <div className="text-white/70 text-xs mb-1 text-center">{gameState.sentence.translation}</div>
            <div className="flex flex-wrap gap-2 justify-center min-h-[28px]">
              {gameState.trail.map((segment) => (
                <span
                  key={segment.id}
                  className="px-2 py-1 rounded text-sm font-bold bg-emerald-500/30 text-emerald-300"
                >
                  {segment.word}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 z-20">
            <VirtualDPad onInput={setVirtualInput} />
          </div>

          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer scaleX={scale} scaleY={scale} x={offsetX} y={offsetY}>
              <Rect x={0} y={0} width={GAME_WIDTH} height={GAME_HEIGHT} fill="#1a1a2e" />

              <Rect
                x={0}
                y={0}
                width={100}
                height={GAME_HEIGHT}
                fill="#0f0f1a"
              />
              <Rect
                x={GAME_WIDTH - 100}
                y={0}
                width={100}
                height={GAME_HEIGHT}
                fill="#0f0f1a"
              />

              {gameState.portal && (
                <Group x={gameState.portal.x} y={gameState.portal.y}>
                  <Ring
                    innerRadius={PORTAL_RADIUS - 10}
                    outerRadius={PORTAL_RADIUS + 10}
                    fill="#8b5cf6"
                    opacity={0.3}
                  />
                  <Circle
                    radius={PORTAL_RADIUS}
                    fill="#4c1d95"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />
                  <Text
                    text="EXIT"
                    fontSize={12}
                    fill="white"
                    fontStyle="bold"
                    offsetX={12}
                    offsetY={6}
                  />
                </Group>
              )}

              {gameState.prisoners
                .filter((p) => !p.collected)
                .map((prisoner) => {
                  const isWrong = prisoner.fleeing
                  return (
                    <Group key={prisoner.id} x={prisoner.x} y={prisoner.y}>
                      <Circle
                        radius={PRISONER_RADIUS}
                        fill={isWrong ? '#ef4444' : '#64748b'}
                        stroke="#ffffff"
                        strokeWidth={1}
                        opacity={isWrong ? 0.5 : 1}
                      />
                      <Text
                        text={prisoner.word}
                        fontSize={10}
                        fill="white"
                        fontStyle="bold"
                        offsetX={prisoner.word.length * 2.5}
                        offsetY={4}
                      />
                    </Group>
                  )
                })}

              {gameState.trail.map((segment, i) => {
                const prevX = i === 0 ? gameState.player.x : gameState.trail[i - 1].x
                const prevY = i === 0 ? gameState.player.y : gameState.trail[i - 1].y
                
                const ropePoints: number[] = []
                const ropeSegments = 3
                for (let j = 0; j <= ropeSegments; j++) {
                  const t = j / ropeSegments
                  ropePoints.push(
                    prevX + (segment.x - prevX) * t,
                    prevY + (segment.y - prevY) * t
                  )
                }

                return (
                  <Group key={segment.id}>
                    <Line
                      points={ropePoints}
                      stroke="#8b5a2b"
                      strokeWidth={4}
                      opacity={0.8}
                      lineCap="round"
                      lineJoin="round"
                    />
                    <Line
                      points={ropePoints}
                      stroke="#d4a574"
                      strokeWidth={2}
                      opacity={0.6}
                      lineCap="round"
                      lineJoin="round"
                    />
                    <Circle
                      x={segment.x}
                      y={segment.y}
                      radius={12}
                      fill="#22c55e"
                      stroke="#86efac"
                      strokeWidth={2}
                    />
                    <Text
                      text={segment.word}
                      fontSize={8}
                      fill="white"
                      fontStyle="bold"
                      offsetX={segment.word.length * 2}
                      offsetY={3}
                      x={segment.x}
                      y={segment.y}
                    />
                  </Group>
                )})}

              {gameState.player && (
                <Group x={gameState.player.x} y={gameState.player.y}>
                  <Circle
                    radius={PLAYER_RADIUS}
                    fill={gameState.player.invulnerabilityTime > 0 ? '#60a5fa' : '#3b82f6'}
                    stroke="#93c5fd"
                    strokeWidth={3}
                  />
                  <Text
                    text="KNIGHT"
                    fontSize={8}
                    fill="white"
                    fontStyle="bold"
                    offsetX={14}
                    offsetY={3}
                  />
                </Group>
              )}

              {gameState.monsters.map((monster) => (
                <Group key={monster.id} x={monster.x} y={monster.y}>
                  <Circle
                    radius={MONSTER_RADIUS}
                    fill="#dc2626"
                    stroke="#fca5a5"
                    strokeWidth={2}
                  />
                  <Text
                    text="👹"
                    fontSize={16}
                    offsetX={8}
                    offsetY={8}
                  />
                </Group>
              ))}
            </Layer>
          </Stage>
        </>
      )}

      {gamePhase === 'ended' && gameState && results && (
        <GameEndScreen
          status="defeat"
          title="Overwhelmed!"
          subtitle="The dungeon claimed another hero..."
          score={totalCorrect * 10}
          xp={results.xp}
          accuracy={results.accuracy}
          customStats={[
            { label: 'Words Rescued', value: totalCorrect, icon: Users },
            { label: 'Level Reached', value: gameState.level },
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
