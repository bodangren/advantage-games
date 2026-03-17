# Game Templates

Copy these templates to create a new vocabulary game.

## Quick Start

1. Replace all instances of:
   - `game-name` → your game slug (kebab-case, e.g., `dragon-flight`)
   - `GameName` → your game name (PascalCase, e.g., `DragonFlight`)
   - `gameName` → your game name (camelCase, e.g., `dragonFlight`)
   - `Game Name` → your display title (e.g., `Dragon Flight`)

2. Create directories and files:
   ```
   src/
   ├── app/games/[game-name]/
   │   └── page.tsx              # From page.tsx.template
   ├── components/[game-name]/
   │   └── [GameName]Game.tsx    # From GameNameGame.tsx.template
   └── lib/
       └── [gameName].ts         # From gameName.ts.template
   ```

3. Create vocabulary file:
   ```
   public/vocab/[game-name].json
   ```

4. Create asset directory:
   ```
   public/games/[game-name]/
   ├── player-3x3-sheet.png
   ├── enemy-3x3-sheet.png
   └── background.png
   ```

## File Checklist

- [ ] `src/app/games/[game-name]/page.tsx`
- [ ] `src/components/[game-name]/[GameName]Game.tsx`
- [ ] `src/lib/[gameName].ts`
- [ ] `public/vocab/[game-name].json`
- [ ] `public/games/[game-name]/` (assets)

## Template Files

| Template | Output | Purpose |
|----------|--------|---------|
| `GameNameGame.tsx.template` | `components/[game-name]/[GameName]Game.tsx` | Main game component with Konva canvas |
| `gameName.ts.template` | `lib/[gameName].ts` | Game logic (pure functions) |
| `page.tsx.template` | `app/games/[game-name]/page.tsx` | Page wrapper with vocabulary loading |

## Key Patterns

### Game Phase State Machine
```tsx
type GamePhase = 'start' | 'playing' | 'ended'
const [phase, setPhase] = useState<GamePhase>('start')
```

### Asset Loading
```tsx
const ASSETS = {
  player: withBasePath('/games/game-name/player-3x3-sheet.png'),
}
```

### Sprite Grid (3x3 sheets)
```tsx
const buildSpriteGrid = (width: number, height: number): SpriteGrid => { ... }
const getSpriteCrop = (grid: SpriteGrid, col: number, row: number) => ({ ... })
```

### Responsive Canvas
```tsx
const [stageSize, setStageSize] = useState<StageSize>(DEFAULT_STAGE)
useEffect(() => {
  const observer = new ResizeObserver(measureStage)
  observer.observe(containerRef.current)
  return () => observer.disconnect()
}, [])
```

### Input Controls
```tsx
const { input, setVirtualInput, consumeCast } = useDirectionalInput()
// input.dx, input.dy, input.cast
```

### Game Tick Loop
```tsx
useInterval(() => {
  setState((prev) => advanceTime(prev, TICK_MS))
}, state.status === 'running' && phase === 'playing' ? TICK_MS : null)
```

### Results Calculation
```tsx
const results = getGameResults(state)
onComplete?.(results)
```

## Pre-Ship Checklist

- [ ] Vocabulary loads from JSON
- [ ] GameStartScreen shows instructions + vocab preview
- [ ] GameEndScreen shows XP + accuracy
- [ ] Touch input works (DPad or VirtualDPad)
- [ ] Keyboard input works (arrows + WASD)
- [ ] Canvas resizes responsively
- [ ] All magic numbers in config/constants
- [ ] `npm run build` succeeds
- [ ] No console errors at runtime
- [ ] Restart works cleanly (test 3x)
