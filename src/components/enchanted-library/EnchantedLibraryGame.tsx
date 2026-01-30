'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Text, Group, Rect, Image as KonvaImage, Circle } from 'react-konva'
import {
  createEnchantedLibraryState,
  advanceEnchantedLibraryTime,
  GAME_WIDTH,
  GAME_HEIGHT,
  type EnchantedLibraryState,
  type DirectionalInput
} from '@/lib/enchantedLibrary'
import type { VocabularyItem } from '@/store/useGameStore'
import { useSound } from '@/hooks/useSound'
import { useInterval } from '@/hooks/useInterval'
import { useDirectionalInput } from '@/hooks/useDirectionalInput'
import { VirtualDPad } from '@/components/ui/VirtualDPad'
import { withBasePath } from '@/lib/basePath'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, BookOpen, Trophy, Target, Sparkles, Home, RotateCcw } from 'lucide-react'
import { calculateXP } from '@/lib/xp'

export type EnchantedLibraryGameResult = {
  xp: number
  accuracy: number
}

interface EnchantedLibraryGameProps {
  vocabulary: VocabularyItem[]
  onComplete: (results: EnchantedLibraryGameResult) => void
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

export function EnchantedLibraryGame({ vocabulary, onComplete }: EnchantedLibraryGameProps) {
  const { playSound } = useSound()
  const { input, setVirtualInput, triggerCast, consumeCast } = useDirectionalInput()
  const [gameState, setGameState] = useState<EnchantedLibraryState | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const [assets, setAssets] = useState<{
      player: HTMLImageElement
      spirit: HTMLImageElement
      book: HTMLImageElement
      floor: HTMLImageElement
  } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 })

  // Animation Frames
  const [playerFrame, setPlayerFrame] = useState(0)
  const [spiritFrame, setSpiritFrame] = useState(0)
  const [bookFrame, setBookFrame] = useState(0)

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
              const [player, spirit, book, floor] = await Promise.all([
                  loadImage('/games/enchanted-library/player_3x3_pose_sheet.png'),
                  loadImage('/games/enchanted-library/spirit_3x3_pose_sheet.png'),
                  loadImage('/games/enchanted-library/book_3x3_pose_sheet.png'),
                  loadImage('/games/enchanted-library/tile-library.png'),
              ])
              if (mounted) setAssets({ player, spirit, book, floor })
          } catch (e) {
              console.error('Failed to load assets', e)
          }
      }
      load()
      return () => { mounted = false }
  }, [])

  const resetGame = useCallback(() => {
    if (vocabulary.length > 0) {
        setGameState(createEnchantedLibraryState(vocabulary))
        setTotalAttempts(0)
        setCorrectAnswers(0)
    }
  }, [vocabulary])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  // Animation Loop
  useInterval(() => {
      if (hasStarted) {
          setPlayerFrame(f => (f + 1) % 3)
          setSpiritFrame(f => (f + 1) % 3)
          setBookFrame(f => (f + 1) % 3)
      }
  }, 150)

  // Game Loop
  useInterval(() => {
    if (gameState && gameState.status === 'playing' && assets && hasStarted) {
        const prevMana = gameState.mana
        const prevVocabProgress = new Map(gameState.vocabularyProgress)

        const nextState = advanceEnchantedLibraryTime(gameState, 50, input)
        setGameState(nextState)

        // Track attempts and accuracy
        if (nextState.mana !== prevMana) {
            // Check if vocabulary progress increased (correct answer)
            let progressIncreased = false
            for (const [word, count] of nextState.vocabularyProgress.entries()) {
                if (count > (prevVocabProgress.get(word) || 0)) {
                    progressIncreased = true
                    break
                }
            }

            if (progressIncreased) {
                setCorrectAnswers(c => c + 1)
                setTotalAttempts(a => a + 1)
            } else if (nextState.mana < prevMana) {
                // Mana decreased but no progress, so it was a wrong answer or spirit hit
                // Check if books collection just happened (books.length changed)
                setTotalAttempts(a => a + 1)
            }
        }

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
  }, gameState?.status === 'playing' && hasStarted ? 50 : null)

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
          spirit: buildSpriteGrid(assets.spirit.width, assets.spirit.height),
          book: buildSpriteGrid(assets.book.width, assets.book.height)
      }
  }, [assets])

  if (!assets) {
    return (
        <div
            ref={containerRef}
            className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center border border-amber-300 md:aspect-video md:h-auto"
        >
             <div className="text-amber-800 animate-pulse font-mono tracking-widest uppercase">Loading Library...</div>
        </div>
    )
  }

  return (
    <div
        ref={containerRef}
        style={{ minHeight: '400px' }}
        className="relative h-[75vh] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100 to-amber-200 shadow-2xl ring-1 ring-amber-300/50 touch-none md:aspect-video md:h-auto"
    >
        <AnimatePresence>
            {!hasStarted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                        <header className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="text-xs uppercase tracking-[0.4em] text-yellow-400 font-bold">Magical Adventure</div>
                                <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Enchanted Library</h2>
                            </div>
                            <div className="px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                Ready to Learn
                            </div>
                        </header>

                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
                                    <h3 className="flex items-center gap-2 font-bold text-lg text-white">
                                        <Shield className="w-5 h-5 text-blue-400" /> How to Play
                                    </h3>
                                    <ul className="space-y-3 text-sm text-slate-300">
                                        <li className="flex gap-3">
                                            <span className="text-yellow-400 font-bold">01.</span>
                                            <span>Collect <b>magic books</b> that match the target word shown at the top.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-yellow-400 font-bold">02.</span>
                                            <span>Correct books give you <b>+10 mana</b> and one <b>shield charge</b>.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-yellow-400 font-bold">03.</span>
                                            <span>Wrong books cost <b>-5 mana</b>. Choose carefully!</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-yellow-400 font-bold">04.</span>
                                            <span>Avoid the <b>library spirits</b>! They drain <b>-10 mana</b> on contact.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-yellow-400 font-bold">05.</span>
                                            <span>Use your <b>shield</b> to bounce spirits away! Press Space or tap the Shield button.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-yellow-400 font-bold">06.</span>
                                            <span>Collect each word <b>twice</b> to complete your studies!</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 font-bold text-lg text-white">
                                        <BookOpen className="w-5 h-5 text-emerald-400" /> Vocabulary List
                                    </h3>
                                    <span className="text-xs text-white/40">{vocabulary.length} Words</span>
                                </div>
                                <div className="max-h-[240px] overflow-y-auto rounded-2xl border border-white/10 bg-black/20 scrollbar-thin scrollbar-thumb-white/10">
                                    {vocabulary.length === 0 ? (
                                        <div className="p-8 text-center text-white/40 italic">No vocabulary loaded...</div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {vocabulary.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 px-4 hover:bg-white/5 transition-colors">
                                                    <span className="font-medium text-white">{item.term}</span>
                                                    <span className="text-slate-300 text-sm">{item.translation}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="p-6 sm:p-8 border-t border-white/10 bg-black/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/50">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Move: Arrows / WASD</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Shield: Space / Enter</div>
                        </div>
                        <button
                            onClick={() => {
                                resetGame()
                                setHasStarted(true)
                            }}
                            className="group relative px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                        >
                            <span className="relative z-10">Start Adventure</span>
                            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        </button>
                    </footer>
                </motion.div>
            )}
        </AnimatePresence>

        {hasStarted && gameState && grids && (
            <>
                {/* Victory Overlay */}
                <AnimatePresence>
                    {gameState.status === 'victory' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="w-full max-w-md bg-gradient-to-b from-yellow-400 to-amber-500 border-4 border-yellow-300 rounded-3xl shadow-2xl p-8 text-center space-y-8"
                            >
                                <header className="space-y-2">
                                    <div className="w-20 h-20 bg-white/30 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-amber-900">Master Wizard!</h2>
                                    <p className="text-amber-800">You've learned all the vocabulary!</p>
                                </header>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/40 rounded-2xl p-4 space-y-1">
                                        <div className="text-xs uppercase tracking-wider text-amber-900 font-bold flex items-center justify-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Mana
                                        </div>
                                        <div className="text-2xl font-bold text-amber-900">{gameState.mana}</div>
                                    </div>
                                    <div className="bg-white/40 rounded-2xl p-4 space-y-1">
                                        <div className="text-xs uppercase tracking-wider text-amber-900 font-bold flex items-center justify-center gap-1">
                                            <Target className="w-3 h-3" /> Accuracy
                                        </div>
                                        <div className="text-2xl font-bold text-amber-900">
                                            {totalAttempts > 0
                                                ? Math.round((correctAnswers / totalAttempts) * 100)
                                                : 0}%
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-white/50 border-2 border-white rounded-2xl p-4 space-y-1">
                                        <div className="text-xs uppercase tracking-wider text-amber-900 font-bold flex items-center justify-center gap-1">
                                            <Trophy className="w-3 h-3" /> XP Gained
                                        </div>
                                        <div className="text-3xl font-black text-amber-900">
                                            +{calculateXP(Math.max(0, gameState.mana), correctAnswers, totalAttempts)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            resetGame()
                                            setHasStarted(true)
                                        }}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Play Again
                                    </button>
                                    <button
                                        onClick={() => {
                                            const results: EnchantedLibraryGameResult = {
                                                xp: calculateXP(Math.max(0, gameState.mana), correctAnswers, totalAttempts),
                                                accuracy: totalAttempts > 0 ? correctAnswers / totalAttempts : 0
                                            }
                                            onComplete(results)
                                            window.location.href = '/'
                                        }}
                                        className="w-full py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Home className="w-5 h-5" /> Exit to Menu
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 text-amber-900 font-bold text-lg pointer-events-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                    <div className="bg-white/80 px-3 py-1 rounded-lg">Mana: {gameState.mana}</div>
                    <div className="bg-white/80 px-3 py-1 rounded-lg text-blue-600 text-sm flex items-center gap-1">
                        SHIELD: {Array(gameState.player.maxShieldCharges).fill(0).map((_, i) => (
                            <span key={i} className={i < gameState.player.shieldCharges ? "opacity-100" : "opacity-30"}>
                                🛡️
                            </span>
                        ))}
                    </div>
                </div>

                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 rounded-full border-2 border-yellow-300 backdrop-blur-sm pointer-events-none shadow-lg">
                    <span className="text-white/90 mr-2 text-sm">Find:</span>
                    <span className="text-2xl font-bold text-white drop-shadow-md">{gameState.targetWord}</span>
                </div>

                {/* Virtual Controls */}
                <div className="absolute bottom-8 right-8 z-20 flex flex-row items-end gap-6">
                    <button
                        onClick={() => triggerCast()}
                        disabled={gameState.player.shieldCharges === 0}
                        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center font-bold transition-all active:scale-95 ${
                            gameState.player.shieldCharges > 0
                            ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-slate-400 border-slate-300 text-slate-600 opacity-50'
                        }`}
                    >
                        SHIELD
                    </button>
                    <VirtualDPad onInput={setVirtualInput} />
                </div>

                {/* Canvas */}
                <Stage width={dimensions.width} height={dimensions.height} data-testid="stage">
                    <Layer scaleX={camera.scale} scaleY={camera.scale} x={camera.x} y={camera.y}>
                        {/* Floor Tiling */}
                        <Rect
                            x={0} y={0}
                            width={GAME_WIDTH} height={GAME_HEIGHT}
                            fillPatternImage={assets.floor}
                            fillPatternRepeat="repeat"
                            fillPatternScaleX={0.5}
                            fillPatternScaleY={0.5}
                        />

                        <Group>
                            {/* Books */}
                            {gameState.books.map((book, i) => (
                                <Group key={book.id} x={book.x} y={book.y}>
                                    <KonvaImage
                                        image={assets.book}
                                        name="book"
                                        width={50}
                                        height={50}
                                        offsetX={25}
                                        offsetY={25}
                                        crop={getSpriteCrop(grids.book.fw, grids.book.fh, (bookFrame + i) % 3, 0)}
                                    />
                                    <Text
                                        text={book.translation}
                                        fontSize={14}
                                        fill="white"
                                        stroke="black"
                                        strokeWidth={2}
                                        align="center"
                                        offsetY={-40}
                                        width={100}
                                        offsetX={50}
                                        fontStyle="bold"
                                    />
                                </Group>
                            ))}

                            {/* Player */}
                            <Group>
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
                                {/* Shield Visual */}
                                {gameState.shieldActive && (
                                    <Circle
                                        x={gameState.player.x}
                                        y={gameState.player.y}
                                        radius={50}
                                        stroke="cyan"
                                        strokeWidth={3}
                                        opacity={0.6}
                                        name="shield"
                                    />
                                )}
                            </Group>

                            {/* Spirits */}
                            {gameState.spirits.map((spirit, i) => (
                                <KonvaImage
                                    key={spirit.id}
                                    image={assets.spirit}
                                    name="spirit"
                                    x={spirit.x}
                                    y={spirit.y}
                                    width={48}
                                    height={48}
                                    offsetX={24}
                                    offsetY={24}
                                    crop={getSpriteCrop(grids.spirit.fw, grids.spirit.fh, (spiritFrame + i) % 3, 0)}
                                    opacity={0.9}
                                />
                            ))}
                        </Group>
                    </Layer>
                </Stage>
            </>
        )}
    </div>
  )
}
