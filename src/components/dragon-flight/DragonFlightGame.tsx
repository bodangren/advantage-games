'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Konva from 'konva'
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text } from 'react-konva'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { withBasePath } from '@/lib/basePath'
import {
  advanceDragonFlightTime,
  calculateBossPower,
  createDragonFlightState,
  getDragonFlightResults,
  selectGate,
} from '@/lib/dragonFlight'
import type {
  DragonFlightResults,
  DragonFlightState,
  GateSide,
} from '@/lib/dragonFlight'
import type { VocabularyItem } from '@/store/useGameStore'
import { useInterval } from '@/hooks/useInterval'
import { useSound } from '@/hooks/useSound'

type DragonFlightAssets = {
  gates: HTMLImageElement
  boss: HTMLImageElement
  player: HTMLImageElement
  army: HTMLImageElement
  parallaxTop: HTMLImageElement
  parallaxMiddle: HTMLImageElement
  parallaxBottom: HTMLImageElement
  loadingBackground: HTMLImageElement | null
}

type DragonFlightGameProps = {
  vocabulary: VocabularyItem[]
  durationMs?: number
  onComplete?: (results: DragonFlightResults) => void
  preloadedAssets?: DragonFlightAssets
}

type GateFeedback = {
  side: GateSide
  outcome: 'correct' | 'incorrect'
}

type SpriteGrid = {
  columns: number[]
  rows: number[]
  columnOffsets: number[]
  rowOffsets: number[]
}

type StageSize = {
  width: number
  height: number
}

type GateLayout = {
  left: number
  top: number
  width: number
  height: number
}

type FlightLayout = {
  leftGate: GateLayout
  rightGate: GateLayout
  gateScale: number
  gateFrameWidth: number
  gateFrameHeight: number
  playerScale: number
  playerFrameWidth: number
  playerFrameHeight: number
  bossScale: number
  bossFrameWidth: number
  bossFrameHeight: number
  armyScale: number
  armyFrameWidth: number
  armyFrameHeight: number
  playerX: number
  playerY: number
  bossX: number
  bossY: number
}

const ASSETS = {
  gates: withBasePath('/games/dragon-flight/gates-3x3-sheet-facing-up.png'),
  boss: withBasePath('/games/dragon-flight/boss-3x3-sheet-facing-up.png'),
  player: withBasePath('/games/dragon-flight/player-3x3-sheet-facing-down.png'),
  army: withBasePath('/games/dragon-flight/dragon-army-3x3-sheet-facing-up.png'),
  parallaxTop: withBasePath('/games/dragon-flight/parallax-top-tiling.png'),
  parallaxMiddle: withBasePath('/games/dragon-flight/parallax-middle-tiling.png'),
  parallaxBottom: withBasePath('/games/dragon-flight/parallax-bottom-tiling.png'),
  loadingBackground: withBasePath('/games/dragon-flight/loading-screen-background.png'),
}

const DEFAULT_STAGE: StageSize = { width: 960, height: 540 }
const TICK_MS = 100
const GATE_ANIM_MS = 160
const PLAYER_ANIM_MS = 120
const BOSS_ANIM_MS = 180
const RESULTS_REVEAL_MS = 900
const PLAYER_BASE_SCALE = 0.22
const BOSS_BASE_SCALE = 0.55
const ARMY_BASE_SCALE = 0.12

const buildSpriteGrid = (width: number, height: number): SpriteGrid => {
  const columnBase = Math.floor(width / 3)
  const rowBase = Math.floor(height / 3)
  const columnRemainder = width % 3
  const rowRemainder = height % 3
  const columns = [0, 1, 2].map((index) => columnBase + (index < columnRemainder ? 1 : 0))
  const rows = [0, 1, 2].map((index) => rowBase + (index < rowRemainder ? 1 : 0))
  const columnOffsets = columns.reduce<number[]>((acc, _value, index) => {
    const nextValue = index === 0 ? 0 : acc[index - 1] + columns[index - 1]
    acc.push(nextValue)
    return acc
  }, [])
  const rowOffsets = rows.reduce<number[]>((acc, _value, index) => {
    const nextValue = index === 0 ? 0 : acc[index - 1] + rows[index - 1]
    acc.push(nextValue)
    return acc
  }, [])

  return { columns, rows, columnOffsets, rowOffsets }
}

const getSpriteCrop = (grid: SpriteGrid, col: number, row: number) => ({
  x: grid.columnOffsets[col] ?? 0,
  y: grid.rowOffsets[row] ?? 0,
  width: grid.columns[col] ?? 0,
  height: grid.rows[row] ?? 0,
})

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load ${src}`))
    image.src = src
  })

const buildAssets = async (): Promise<DragonFlightAssets> => {
  const [
    gates,
    boss,
    player,
    army,
    parallaxTop,
    parallaxMiddle,
    parallaxBottom,
    loadingBackground,
  ] = await Promise.all([
    loadImage(ASSETS.gates),
    loadImage(ASSETS.boss),
    loadImage(ASSETS.player),
    loadImage(ASSETS.army),
    loadImage(ASSETS.parallaxTop),
    loadImage(ASSETS.parallaxMiddle),
    loadImage(ASSETS.parallaxBottom),
    loadImage(ASSETS.loadingBackground),
  ])

  return {
    gates,
    boss,
    player,
    army,
    parallaxTop,
    parallaxMiddle,
    parallaxBottom,
    loadingBackground,
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const buildLayout = (
  stage: StageSize,
  gateGrid: SpriteGrid,
  playerGrid: SpriteGrid,
  bossGrid: SpriteGrid,
  armyGrid: SpriteGrid
): FlightLayout => {
  const gateFrameWidth = gateGrid.columns[0] ?? 1
  const gateFrameHeight = gateGrid.rows[0] ?? 1
  const gateWidth = clamp(stage.width * 0.32, 180, 320)
  const gateScale = gateWidth / gateFrameWidth
  const gateHeight = gateFrameHeight * gateScale
  const gateTop = clamp(stage.height * 0.55 - gateHeight / 2, 120, stage.height * 0.7)

  const leftGate = {
    left: clamp(stage.width * 0.28 - gateWidth / 2, 24, stage.width - gateWidth - 24),
    top: gateTop,
    width: gateWidth,
    height: gateHeight,
  }
  const rightGate = {
    left: clamp(stage.width * 0.72 - gateWidth / 2, 24, stage.width - gateWidth - 24),
    top: gateTop,
    width: gateWidth,
    height: gateHeight,
  }

  const playerFrameWidth = playerGrid.columns[0] ?? 1
  const playerFrameHeight = playerGrid.rows[0] ?? 1
  const playerScale = clamp(stage.width * PLAYER_BASE_SCALE / playerFrameWidth, 0.12, 0.3)

  const bossFrameWidth = bossGrid.columns[0] ?? 1
  const bossFrameHeight = bossGrid.rows[0] ?? 1
  const bossScale = clamp(stage.width * BOSS_BASE_SCALE / bossFrameWidth, 0.25, 0.65)

  const armyFrameWidth = armyGrid.columns[0] ?? 1
  const armyFrameHeight = armyGrid.rows[0] ?? 1
  const armyScale = clamp(stage.width * ARMY_BASE_SCALE / armyFrameWidth, 0.06, 0.18)

  return {
    leftGate,
    rightGate,
    gateScale,
    gateFrameWidth,
    gateFrameHeight,
    playerScale,
    playerFrameWidth,
    playerFrameHeight,
    bossScale,
    bossFrameWidth,
    bossFrameHeight,
    armyScale,
    armyFrameWidth,
    armyFrameHeight,
    playerX: stage.width / 2,
    playerY: stage.height * 0.78,
    bossX: stage.width / 2,
    bossY: stage.height * 0.28,
  }
}

const getGateLabels = (round: DragonFlightState['round']) => {
  const left = round.correctSide === 'left' ? round.correctTranslation : round.decoyTranslation
  const right = round.correctSide === 'right' ? round.correctTranslation : round.decoyTranslation
  return { left, right }
}

export function DragonFlightGame({
  vocabulary,
  durationMs = 30000,
  onComplete,
  preloadedAssets,
}: DragonFlightGameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [stageSize, setStageSize] = useState<StageSize>(DEFAULT_STAGE)
  const [assets, setAssets] = useState<DragonFlightAssets | null>(preloadedAssets ?? null)
  const [isLoading, setIsLoading] = useState(!preloadedAssets)
  const [state, setState] = useState<DragonFlightState>(() =>
    createDragonFlightState(vocabulary, { durationMs })
  )
  const [feedback, setFeedback] = useState<GateFeedback | null>(null)
  const [results, setResults] = useState<DragonFlightResults | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [gateFrame, setGateFrame] = useState(0)
  const [playerFrame, setPlayerFrame] = useState(0)
  const [bossFrame, setBossFrame] = useState(0)
  const { playSound } = useSound()
  const resultsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let isMounted = true
    if (preloadedAssets) {
      setAssets(preloadedAssets)
      setIsLoading(false)
      return () => undefined
    }

    setIsLoading(true)
    buildAssets()
      .then((loadedAssets) => {
        if (!isMounted) return
        setAssets(loadedAssets)
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setAssets(null)
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [preloadedAssets])

  useEffect(() => {
    setState(createDragonFlightState(vocabulary, { durationMs }))
    setFeedback(null)
    setResults(null)
    setShowResults(false)
  }, [vocabulary, durationMs])

  useEffect(() => {
    if (!containerRef.current) return
    if (typeof ResizeObserver === 'undefined') return
    const element = containerRef.current
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        setStageSize({ width, height })
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useInterval(() => {
    setState((prev) => advanceDragonFlightTime(prev, TICK_MS))
  }, state.status === 'running' ? TICK_MS : null)

  useInterval(() => {
    setGateFrame((prev) => (prev + 1) % 3)
  }, GATE_ANIM_MS)

  useInterval(() => {
    setPlayerFrame((prev) => (prev + 1) % 9)
  }, PLAYER_ANIM_MS)

  useInterval(() => {
    setBossFrame((prev) => (prev + 1) % 3)
  }, state.status === 'boss' ? BOSS_ANIM_MS : null)

  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(null), 450)
      return () => clearTimeout(timeout)
    }
    return () => undefined
  }, [feedback])

  useEffect(() => {
    if (resultsTimeoutRef.current) {
      clearTimeout(resultsTimeoutRef.current)
      resultsTimeoutRef.current = null
    }

    if (state.status !== 'boss') {
      setResults(null)
      setShowResults(false)
      return () => undefined
    }

    const nextResults = getDragonFlightResults({
      correctAnswers: state.correctAnswers,
      totalAttempts: state.attempts,
      dragonCount: state.dragonCount,
    })
    setResults(nextResults)
    setShowResults(false)

    if (onComplete) {
      onComplete(nextResults)
    }

    resultsTimeoutRef.current = setTimeout(() => {
      setShowResults(true)
    }, RESULTS_REVEAL_MS)

    return () => {
      if (resultsTimeoutRef.current) {
        clearTimeout(resultsTimeoutRef.current)
        resultsTimeoutRef.current = null
      }
    }
  }, [state.status, state.correctAnswers, state.attempts, state.dragonCount, onComplete])

  const handleGateSelection = (side: GateSide) => {
    if (state.status !== 'running') return

    const isCorrect = side === state.round.correctSide
    playSound(isCorrect ? 'success' : 'error')
    setFeedback({ side, outcome: isCorrect ? 'correct' : 'incorrect' })
    setState((prev) => selectGate(prev, side, vocabulary))
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (state.status !== 'running') return
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        handleGateSelection('left')
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        handleGateSelection('right')
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [state.status, vocabulary])

  const gateLabels = getGateLabels(state.round)

  const statusLabel = showResults ? 'results' : state.status

  if (isLoading) {
    return (
      <div className='relative w-full h-[60vh] min-h-[420px] max-h-[720px] overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${ASSETS.loadingBackground})`,
          }}
        />
        <div className='absolute inset-0 bg-slate-950/60' />
        <div className='relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center text-white'>
          <div className='text-sm uppercase tracking-[0.3em] text-slate-200'>Preparing Flight</div>
          <div className='text-3xl font-semibold'>Summoning the Dragon Gate</div>
        </div>
      </div>
    )
  }

  if (!assets) {
    return (
      <div className='rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-sm text-red-200'>
        Unable to load Dragon Flight assets. Please refresh to try again.
      </div>
    )
  }

  const gateGrid = buildSpriteGrid(assets.gates.width, assets.gates.height)
  const playerGrid = buildSpriteGrid(assets.player.width, assets.player.height)
  const bossGrid = buildSpriteGrid(assets.boss.width, assets.boss.height)
  const armyGrid = buildSpriteGrid(assets.army.width, assets.army.height)
  const layout = buildLayout(stageSize, gateGrid, playerGrid, bossGrid, armyGrid)

  return (
    <div
      ref={containerRef}
      className='relative w-full h-[70vh] min-h-[480px] max-h-[760px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.45)] touch-none select-none'
      data-testid='dragon-flight'
      data-status={statusLabel}
    >
      <DragonFlightCanvas
        stageSize={stageSize}
        assets={assets}
        state={state}
        feedback={feedback}
        layout={layout}
        gateLabels={gateLabels}
        gateFrame={gateFrame}
        playerFrame={playerFrame}
        bossFrame={bossFrame}
        onSelectGate={handleGateSelection}
        showBoss={state.status === 'boss'}
      />

      <div className='absolute inset-0 z-10 pointer-events-none'>
        <div className='flex items-start justify-between p-6'>
          <div className='max-w-[60%] rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur'>
            <div className='text-xs uppercase tracking-[0.2em] text-white/70'>Prompt</div>
            <div className='text-2xl font-semibold text-white'>{state.round.term || '—'}</div>
          </div>
          <div className='flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white backdrop-blur'>
            <Flame className='h-4 w-4 text-amber-300' aria-hidden='true' />
            <span className='text-xs uppercase tracking-[0.2em] text-white/70'>Dragons</span>
            <motion.span
              key={state.dragonCount}
              data-testid='dragon-flight-dragon-count'
              className='text-lg font-semibold'
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {state.dragonCount}
            </motion.span>
          </div>
        </div>

        <div className='absolute left-6 right-6 top-20'>
          <div className='h-2 w-full overflow-hidden rounded-full bg-white/10'>
            <motion.div
              className='h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400'
              initial={{ width: '100%' }}
              animate={{ width: `${Math.max(0, 1 - state.elapsedMs / state.durationMs) * 100}%` }}
              transition={{ duration: 0.2, ease: 'linear' }}
              data-testid='dragon-flight-timer'
            />
          </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {feedback.outcome === 'correct' ? '+1 Dragon' : '-1 Dragon'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='absolute inset-0 z-20 pointer-events-none'>
        <AnimatePresence>
          {state.status === 'boss' && !showResults && (
            <motion.div
              className='absolute inset-x-0 top-24 mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-5 py-2 text-sm uppercase tracking-[0.2em] text-white'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              data-testid='dragon-flight-boss'
            >
              Skeleton King Approaches
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResults && results && (
            <motion.div
              className='absolute inset-0 flex items-center justify-center bg-slate-950/70 px-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              data-testid='dragon-flight-results'
            >
              <div className='w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-white shadow-xl'>
                <div className='text-sm uppercase tracking-[0.2em] text-white/60'>Run Complete</div>
                <div className='mt-2 text-3xl font-semibold'>
                  {results.victory ? 'Victory' : 'Defeat'}
                </div>
                <div className='mt-4 grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <div className='text-white/60'>Dragons</div>
                    <div className='text-lg font-semibold'>{results.dragonCount}</div>
                  </div>
                  <div>
                    <div className='text-white/60'>Boss Power</div>
                    <div className='text-lg font-semibold'>{results.bossPower}</div>
                  </div>
                  <div>
                    <div className='text-white/60'>Accuracy</div>
                    <div className='text-lg font-semibold'>
                      {Math.round(results.accuracy * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className='text-white/60'>XP</div>
                    <div className='text-lg font-semibold'>{results.xp}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type='button'
        className='absolute z-30 bg-transparent'
        style={{
          left: layout.leftGate.left,
          top: layout.leftGate.top,
          width: layout.leftGate.width,
          height: layout.leftGate.height,
        }}
        onClick={() => handleGateSelection('left')}
        aria-label={`Left gate: ${gateLabels.left}`}
        data-testid='dragon-flight-gate-left'
      >
        <span className='sr-only'>{gateLabels.left}</span>
      </button>
      <button
        type='button'
        className='absolute z-30 bg-transparent'
        style={{
          left: layout.rightGate.left,
          top: layout.rightGate.top,
          width: layout.rightGate.width,
          height: layout.rightGate.height,
        }}
        onClick={() => handleGateSelection('right')}
        aria-label={`Right gate: ${gateLabels.right}`}
        data-testid='dragon-flight-gate-right'
      >
        <span className='sr-only'>{gateLabels.right}</span>
      </button>
    </div>
  )
}

type DragonFlightCanvasProps = {
  stageSize: StageSize
  assets: DragonFlightAssets
  state: DragonFlightState
  feedback: GateFeedback | null
  layout: FlightLayout
  gateLabels: { left: string; right: string }
  gateFrame: number
  playerFrame: number
  bossFrame: number
  onSelectGate: (side: GateSide) => void
  showBoss: boolean
}

type ParallaxRefs = {
  topA: Konva.Image | null
  topB: Konva.Image | null
  middleA: Konva.Image | null
  middleB: Konva.Image | null
  bottomA: Konva.Image | null
  bottomB: Konva.Image | null
}

const buildParallaxMetrics = (image: HTMLImageElement, stageWidth: number) => {
  const scale = stageWidth / image.width
  return {
    scale,
    height: image.height * scale,
  }
}

const DragonFlightCanvas = ({
  stageSize,
  assets,
  state,
  feedback,
  layout,
  gateLabels,
  gateFrame,
  playerFrame,
  bossFrame,
  onSelectGate,
  showBoss,
}: DragonFlightCanvasProps) => {
  const backgroundLayerRef = useRef<Konva.Layer | null>(null)
  const parallaxRefs = useRef<ParallaxRefs>({
    topA: null,
    topB: null,
    middleA: null,
    middleB: null,
    bottomA: null,
    bottomB: null,
  })
  const parallaxOffsets = useRef({ top: 0, middle: 0, bottom: 0 })

  const gateGrid = useMemo(() => buildSpriteGrid(assets.gates.width, assets.gates.height), [assets])
  const playerGrid = useMemo(
    () => buildSpriteGrid(assets.player.width, assets.player.height),
    [assets]
  )
  const bossGrid = useMemo(() => buildSpriteGrid(assets.boss.width, assets.boss.height), [assets])
  const armyGrid = useMemo(() => buildSpriteGrid(assets.army.width, assets.army.height), [assets])

  useEffect(() => {
    if (!backgroundLayerRef.current) return

    const topMetrics = buildParallaxMetrics(assets.parallaxTop, stageSize.width)
    const middleMetrics = buildParallaxMetrics(assets.parallaxMiddle, stageSize.width)
    const bottomMetrics = buildParallaxMetrics(assets.parallaxBottom, stageSize.width)

    const animation = new Konva.Animation((frame) => {
      if (!frame) return
      const delta = frame.timeDiff / 1000
      parallaxOffsets.current.top =
        (parallaxOffsets.current.top + delta * 40) % topMetrics.height
      parallaxOffsets.current.middle =
        (parallaxOffsets.current.middle + delta * 28) % middleMetrics.height
      parallaxOffsets.current.bottom =
        (parallaxOffsets.current.bottom + delta * 18) % bottomMetrics.height

      const { topA, topB, middleA, middleB, bottomA, bottomB } = parallaxRefs.current
      if (topA && topB) {
        topA.y(-parallaxOffsets.current.top)
        topB.y(-parallaxOffsets.current.top + topMetrics.height)
      }
      if (middleA && middleB) {
        middleA.y(-parallaxOffsets.current.middle)
        middleB.y(-parallaxOffsets.current.middle + middleMetrics.height)
      }
      if (bottomA && bottomB) {
        bottomA.y(-parallaxOffsets.current.bottom)
        bottomB.y(-parallaxOffsets.current.bottom + bottomMetrics.height)
      }
    }, backgroundLayerRef.current)

    animation.start()
    return () => animation.stop()
  }, [assets, stageSize.width])

  const gateRowLeft = feedback ? (state.round.correctSide === 'left' ? 1 : 2) : 0
  const gateRowRight = feedback ? (state.round.correctSide === 'right' ? 1 : 2) : 0

  const playerRow = Math.floor(playerFrame / 3)
  const playerCol = playerFrame % 3

  const bossPower = calculateBossPower(state.attempts)
  const bossRow = showBoss && state.dragonCount >= bossPower ? 2 : 0
  const bossCol = bossFrame % 3

  const armyCount = Math.min(state.dragonCount, 12)
  const armyItems = Array.from({ length: armyCount }, (_, index) => ({
    index,
    row: Math.floor(index / 3) % 3,
    col: index % 3,
  }))

  const topMetrics = buildParallaxMetrics(assets.parallaxTop, stageSize.width)
  const middleMetrics = buildParallaxMetrics(assets.parallaxMiddle, stageSize.width)
  const bottomMetrics = buildParallaxMetrics(assets.parallaxBottom, stageSize.width)

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer ref={backgroundLayerRef}>
        <KonvaImage
          image={assets.parallaxTop}
          x={0}
          y={0}
          scaleX={topMetrics.scale}
          scaleY={topMetrics.scale}
          ref={(node) => {
            parallaxRefs.current.topA = node
          }}
        />
        <KonvaImage
          image={assets.parallaxTop}
          x={0}
          y={topMetrics.height}
          scaleX={topMetrics.scale}
          scaleY={topMetrics.scale}
          ref={(node) => {
            parallaxRefs.current.topB = node
          }}
        />
        <KonvaImage
          image={assets.parallaxMiddle}
          x={0}
          y={0}
          scaleX={middleMetrics.scale}
          scaleY={middleMetrics.scale}
          ref={(node) => {
            parallaxRefs.current.middleA = node
          }}
        />
        <KonvaImage
          image={assets.parallaxMiddle}
          x={0}
          y={middleMetrics.height}
          scaleX={middleMetrics.scale}
          scaleY={middleMetrics.scale}
          ref={(node) => {
            parallaxRefs.current.middleB = node
          }}
        />
        <KonvaImage
          image={assets.parallaxBottom}
          x={0}
          y={0}
          scaleX={bottomMetrics.scale}
          scaleY={bottomMetrics.scale}
          ref={(node) => {
            parallaxRefs.current.bottomA = node
          }}
        />
        <KonvaImage
          image={assets.parallaxBottom}
          x={0}
          y={bottomMetrics.height}
          scaleX={bottomMetrics.scale}
          scaleY={bottomMetrics.scale}
          ref={(node) => {
            parallaxRefs.current.bottomB = node
          }}
        />
      </Layer>

      <Layer>
        {armyItems.map((army) => {
          const offsetX = (army.index % 4) * (layout.armyFrameWidth * layout.armyScale * 0.9)
          const offsetY = Math.floor(army.index / 4) * (layout.armyFrameHeight * layout.armyScale * 0.6)
          const crop = getSpriteCrop(armyGrid, army.col, army.row)
          return (
            <KonvaImage
              key={`army-${army.index}`}
              image={assets.army}
              crop={crop}
              x={layout.playerX - layout.armyFrameWidth * layout.armyScale + offsetX}
              y={layout.playerY - layout.armyFrameHeight * layout.armyScale - 40 + offsetY}
              width={crop.width}
              height={crop.height}
              scaleX={layout.armyScale}
              scaleY={-layout.armyScale}
              offsetY={crop.height}
              opacity={0.85}
            />
          )
        })}

        <KonvaImage
          image={assets.player}
          crop={getSpriteCrop(playerGrid, playerCol, playerRow)}
          x={layout.playerX}
          y={layout.playerY}
          width={layout.playerFrameWidth}
          height={layout.playerFrameHeight}
          offsetX={layout.playerFrameWidth / 2}
          offsetY={layout.playerFrameHeight / 2}
          scaleX={layout.playerScale}
          scaleY={-layout.playerScale}
        />

        {showBoss && (
          <KonvaImage
            image={assets.boss}
            crop={getSpriteCrop(bossGrid, bossCol, bossRow)}
            x={layout.bossX}
            y={layout.bossY}
            width={layout.bossFrameWidth}
            height={layout.bossFrameHeight}
            offsetX={layout.bossFrameWidth / 2}
            offsetY={layout.bossFrameHeight / 2}
            scaleX={layout.bossScale}
            scaleY={layout.bossScale}
            opacity={0.95}
          />
        )}
      </Layer>

      <Layer>
        <Group
          x={layout.leftGate.left + layout.leftGate.width / 2}
          y={layout.leftGate.top + layout.leftGate.height / 2}
          scaleX={layout.gateScale}
          scaleY={layout.gateScale}
          onPointerDown={() => onSelectGate('left')}
        >
          <KonvaImage
            image={assets.gates}
            crop={getSpriteCrop(gateGrid, gateFrame, gateRowLeft)}
            width={layout.gateFrameWidth}
            height={layout.gateFrameHeight}
            offsetX={layout.gateFrameWidth / 2}
            offsetY={layout.gateFrameHeight / 2}
          />
          <Text
            text={gateLabels.left}
            fontSize={layout.gateFrameWidth * 0.12}
            fontFamily='var(--font-geist-sans)'
            fill='#f8fafc'
            align='center'
            width={layout.gateFrameWidth}
            offsetX={layout.gateFrameWidth / 2}
            y={layout.gateFrameHeight * 0.1}
            shadowColor='rgba(15,23,42,0.7)'
            shadowBlur={6}
          />
          {feedback && (
            <Rect
              width={layout.gateFrameWidth}
              height={layout.gateFrameHeight}
              offsetX={layout.gateFrameWidth / 2}
              offsetY={layout.gateFrameHeight / 2}
              fill={gateRowLeft === 1 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}
            />
          )}
        </Group>

        <Group
          x={layout.rightGate.left + layout.rightGate.width / 2}
          y={layout.rightGate.top + layout.rightGate.height / 2}
          scaleX={layout.gateScale}
          scaleY={layout.gateScale}
          onPointerDown={() => onSelectGate('right')}
        >
          <KonvaImage
            image={assets.gates}
            crop={getSpriteCrop(gateGrid, gateFrame, gateRowRight)}
            width={layout.gateFrameWidth}
            height={layout.gateFrameHeight}
            offsetX={layout.gateFrameWidth / 2}
            offsetY={layout.gateFrameHeight / 2}
          />
          <Text
            text={gateLabels.right}
            fontSize={layout.gateFrameWidth * 0.12}
            fontFamily='var(--font-geist-sans)'
            fill='#f8fafc'
            align='center'
            width={layout.gateFrameWidth}
            offsetX={layout.gateFrameWidth / 2}
            y={layout.gateFrameHeight * 0.1}
            shadowColor='rgba(15,23,42,0.7)'
            shadowBlur={6}
          />
          {feedback && (
            <Rect
              width={layout.gateFrameWidth}
              height={layout.gateFrameHeight}
              offsetX={layout.gateFrameWidth / 2}
              offsetY={layout.gateFrameHeight / 2}
              fill={gateRowRight === 1 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}
            />
          )}
        </Group>
      </Layer>
    </Stage>
  )
}
