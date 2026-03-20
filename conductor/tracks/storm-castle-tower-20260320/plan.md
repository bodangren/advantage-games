# Implementation Plan: Storm the Castle Tower

This plan outlines the steps to build "Storm the Castle Tower" using **React-Konva (Canvas)** with strict TDD methodology.

## Phase 1: Setup & Infrastructure
**Assets Required:** None (can start immediately)

- [ ] Task: Create configuration file `src/lib/games/stormCastleTowerConfig.ts` with all balance values
- [ ] Task: Define game state types in `src/lib/games/stormCastleTower.ts`
- [ ] Task: Create `src/app/[locale]/(student)/student/games/sentence/storm-castle-tower` route and page structure
- [ ] Task: Create `StormCastleTowerGame` container component with React-Konva Stage

## Phase 2: Core Game Logic
**Assets Required:** None (logic only)

- [ ] Task: Implement `createStormCastleTowerState()` initialization function
- [ ] Task: Implement grid system (4 columns, scrolling rows)
- [ ] Task: Implement player movement (up/down/left/right on grid)
- [ ] Task: Implement window placement and word assignment
- [ ] Task: Implement word collection mechanics (correct order tracking)
- [ ] Task: Implement win/lose condition detection (lives system, tower top)

## Phase 3: Rendering
**Assets Required:** Basic shapes (rectangles, circles) - can use Konva primitives initially

- [ ] Task: Render castle wall background with grid
- [ ] Task: Render player rogue character
- [ ] Task: Render windows with word labels
- [ ] Task: Render target word highlight (golden glow)
- [ ] Task: Render scrolling effect as player climbs

## Phase 4: Hazards
**Assets Required:** None

- [ ] Task: Implement boiling oil hazard (column-based falling)
- [ ] Task: Implement falling rocks hazard
- [ ] Task: Implement hazard collision detection
- [ ] Task: Implement hazard warning indicators

## Phase 5: Input & Controls
**Assets Required:** None

- [ ] Task: Implement touch/swipe controls for movement
- [ ] Task: Implement tap-to-collect on windows
- [ ] Task: Implement keyboard controls (arrow keys)
- [ ] Task: Ensure 44×44px minimum touch targets

## Phase 6: UI & HUD
**Assets Required:** None (can use text/shapes)

- [ ] Task: Implement translation display at top
- [ ] Task: Implement lives indicator
- [ ] Task: Implement current target word display
- [ ] Task: Implement climb progress indicator

## Phase 7: Game States
**Assets Required:** None

- [ ] Task: Implement start/title screen with difficulty and guard selection
- [ ] Task: Implement victory state and XP display
- [ ] Task: Implement defeat state
- [ ] Task: Wire up game phase transitions

## Phase 8: Polish & Integration
**Assets Required:** None (can use existing sounds)

- [ ] Task: Add visual feedback (correct/wrong collection, hazard hits)
- [ ] Task: Add sound effects (collect, hit, victory, defeat)
- [ ] Task: Balance tuning
- [ ] Task: Register game in gameCards.ts
- [ ] Task: Add cover image placeholder

---

## Configuration Reference
```typescript
const stormCastleTowerConfig = {
  gameWidth: 390,
  gameHeight: 700,
  columns: 4,
  cellSize: 60,
  
  player: {
    moveSpeed: 150,
    lives: 3,
  },
  
  hazards: {
    oilInterval: 3000,
    rockInterval: 4000,
    shutterWarning: 2000,
  },
  
  difficulty: {
    easy: { wordsPerSentence: 4, hazardSpeed: 0.7 },
    normal: { wordsPerSentence: 5, hazardSpeed: 1.0 },
    hard: { wordsPerSentence: 6, hazardSpeed: 1.3 },
  },
  
  xp: {
    perCorrectWord: 1,
    accuracyBonus: 2,
    maxXP: 10,
  },
}
```

## Technical Notes
- Grid-based movement with smooth scrolling
- Windows spawn ahead of player viewport
- Hazards have warning indicators before appearing
- Mobile-first: test on 390×844 viewport
- All text minimum 16px, touch targets minimum 44×44px
