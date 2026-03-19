# Implementation Plan: Spellweaver's Run

This plan outlines the steps to build "Spellweaver's Run" using **React-Konva (Canvas)** with strict TDD methodology.

## Phase 1: Setup & Infrastructure
**Assets Required:** None (can start immediately)

- [x] Task: Create configuration file `src/lib/games/spellweaversRunConfig.ts` with all balance values <e7808c2>
- [~] Task: Define game state types in `src/lib/games/spellweaversRun.ts`
- [ ] Task: Create `src/app/[locale]/(student)/student/games/sentence/spellweavers-run/` route and page structure
- [ ] Task: Create `SpellweaversRunGame` container component with React-Konva Stage
- [ ] Task: Write initial tests for state creation and configuration

## Phase 2: Core Game Logic
**Assets Required:** None (logic only)

- [ ] Task: Implement `createSpellweaversRunState()` initialization function
- [ ] Task: Implement `tickSpellweaversRun()` game loop update function
- [ ] Task: Implement orb spawning logic (3 lanes, word assignment)
- [ ] Task: Implement orb movement/scrolling
- [ ] Task: Implement word collection and sequence validation
- [ ] Task: Implement mana system (wrong word penalty)
- [ ] Task: Implement win/lose condition detection
- [ ] Task: Implement sentence completion and next sentence logic
- [ ] Task: Write comprehensive tests for all game logic (>80% coverage)

## Phase 3: Rendering
**Assets Required:**
- [ ] /public/games/spellweavers-run/orb.png (word orb sprite)
- [ ] /public/games/spellweavers-run/scroll.png (floating scroll background)
- [ ] /public/games/spellweavers-run/background-*.png (parallax layers)

- [ ] Task: Implement asset preloading
- [ ] Task: Render parallax background layers
- [ ] Task: Render floating scroll with translation text
- [ ] Task: Render word orbs with text labels
- [ ] Task: Render collection zone indicator
- [ ] Task: Render collected words display
- [ ] Task: Implement visual feedback (correct/wrong collection)

## Phase 4: Input & Controls
**Assets Required:** None

- [ ] Task: Implement touch/tap handling for lane selection
- [ ] Task: Implement keyboard support (arrow keys for lanes)
- [ ] Task: Ensure 44×44px minimum touch targets for lanes
- [ ] Task: Implement difficulty selection UI
- [ ] Task: Write tests for input handling

## Phase 5: UI & HUD
**Assets Required:** None

- [ ] Task: Implement mana bar display
- [ ] Task: Implement sentence progress indicator
- [ ] Task: Implement score display
- [ ] Task: Implement combo counter
- [ ] Task: Write tests for UI components

## Phase 6: Game States
**Assets Required:** None (uses shared GameStartScreen/GameEndScreen)

- [ ] Task: Implement start screen with difficulty selection (use GameStartScreen)
- [ ] Task: Implement victory state and XP display (use GameEndScreen)
- [ ] Task: Implement defeat state (use GameEndScreen)
- [ ] Task: Wire state transitions (start → playing → ended)
- [ ] Task: Write tests for state transitions

## Phase 7: Polish & Integration
**Assets Required:** Sound effects (optional)

- [ ] Task: Add visual feedback and juice (particles, screen shake)
- [ ] Task: Add sound effects using useSound hook (optional)
- [ ] Task: Balance tuning based on playtesting
- [ ] Task: Create API routes: `/api/v1/games/spellweavers-run/sentences` and `/api/v1/games/spellweavers-run/complete`
- [ ] Task: Register game in gameCards.ts
- [ ] Task: Final integration test

---

## Configuration Reference

```typescript
const SPELLWEAVERS_RUN_CONFIG = {
  laneCount: 3,
  scrollSpeed: { easy: 60, medium: 90, hard: 120 },
  spawnInterval: { easy: 2000, medium: 1500, hard: 1000 },
  collectionZoneHeight: 80,
  initialMana: 100,
  wrongWordPenalty: 20,
  xpPerSentence: 2,
  xpPerCorrectWord: 1,
  comboMultiplier: 0.1,
  orbRadius: 30,
  orbSpacing: 20,
  scrollHeight: 60,
  difficulties: {
    easy: { name: 'Whisper Woods', scrollSpeed: 60, spawnInterval: 2000, maxWords: 4 },
    medium: { name: 'Mystic Mountain', scrollSpeed: 90, spawnInterval: 1500, maxWords: 6 },
    hard: { name: 'Void Passage', scrollSpeed: 120, spawnInterval: 1000, maxWords: 8 }
  }
};
```

## Technical Notes
- Follow architecture patterns from existing Konva games (DragonFlight, WizardZombie)
- Use pure state object with tick function for game logic
- Mobile-first: test on 390×844 viewport
- All text minimum 16px, touch targets minimum 44×44px
- Sentence games use `VocabularyItem[]` with full sentences

## Task Summary
- **Phase 1**: 5 tasks - Setup & Infrastructure
- **Phase 2**: 9 tasks - Core Game Logic
- **Phase 3**: 7 tasks - Rendering
- **Phase 4**: 5 tasks - Input & Controls
- **Phase 5**: 5 tasks - UI & HUD
- **Phase 6**: 5 tasks - Game States
- **Phase 7**: 6 tasks - Polish & Integration
- **Total**: 42 tasks
