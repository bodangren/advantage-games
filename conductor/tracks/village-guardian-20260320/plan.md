# Implementation Plan: Village Guardian

This plan outlines the steps to build "Village Guardian" using **React-Konva (Canvas)** with strict TDD methodology.

## Phase 1: Setup & Infrastructure [checkpoint: complete]
**Assets Required:** None (can start immediately)

- [x] Task: Create configuration file `src/lib/games/villageGuardianConfig.ts` with all balance values
- [x] Task: Define game state types in `src/lib/games/villageGuardian.ts`
- [x] Task: Create route and page structure at `src/app/[locale]/(student)/student/games/sentence/village-guardian/`
- [x] Task: Create `VillageGuardianGame` container component with React-Konva Stage
- [x] Task: Write initial tests for state creation and configuration

## Phase 2: Core Game Logic
**Assets Required:** None (logic only)

- [ ] Task: Implement `createVillageGuardianState()` initialization function
- [ ] Task: Implement `tickVillageGuardian()` game loop update function
- [ ] Task: Implement knight movement system (8-directional)
- [ ] Task: Implement villager spawning with word assignment
- [ ] Task: Implement trailing line mechanics (villagers follow knight)
- [ ] Task: Implement word selection and sequence validation
- [ ] Task: Implement wrong selection penalty (timer increase)
- [ ] Task: Implement monster AI (patrol, chase, hunt behaviors)
- [ ] Task: Implement collision detection (knight-monster, trail-monster)
- [ ] Task: Implement win/lose condition detection
- [ ] Task: Implement town square sanctuary zone
- [ ] Task: Write comprehensive tests for all game logic (>80% coverage)

## Phase 3: Rendering
**Assets Required:** None (using Konva primitives for MVP)

- [ ] Task: Implement village background rendering
- [ ] Task: Implement knight sprite with direction-based rotation
- [ ] Task: Render villagers with word bubbles
- [ ] Task: Implement trailing line rendering (villagers following knight)
- [ ] Task: Render monsters with different visual styles per type
- [ ] Task: Implement town square sanctuary zone visual
- [ ] Task: Implement visual feedback (correct/wrong selection effects)
- [ ] Task: Implement translation display at top

## Phase 4: Input & Controls
**Assets Required:** None

- [ ] Task: Implement VirtualDPad component for mobile control
- [ ] Task: Implement keyboard arrow keys for desktop
- [ ] Task: Ensure smooth diagonal movement
- [ ] Task: Implement difficulty selection UI
- [ ] Task: Implement opponent type selection UI

## Phase 5: UI & HUD
**Assets Required:** None

- [ ] Task: Implement timer display
- [ ] Task: Implement collected words display
- [ ] Task: Implement health/lives display (villagers remaining)
- [ ] Task: Implement score/XP display

## Phase 6: Game States
**Assets Required:** None (uses shared GameStartScreen/GameEndScreen)

- [ ] Task: Implement start screen with difficulty and opponent selection
- [ ] Task: Implement victory state and XP display
- [ ] Task: Implement defeat state
- [ ] Task: Wire state transitions (start → playing → ended)

## Phase 7: Polish & Integration
**Assets Required:** Sound effects (optional)

- [ ] Task: Add visual feedback and juice (particles, screen shake) (optional)
- [ ] Task: Add sound effects using useSound hook (optional)
- [ ] Task: Balance tuning based on playtesting (optional)
- [ ] Task: Create API routes: `/api/v1/games/village-guardian/sentences` and `/api/v1/games/village-guardian/complete`
- [ ] Task: Register game in gameCards.ts
- [ ] Task: Final integration test

---

## Configuration Reference

```typescript
const VILLAGE_GUARDIAN_CONFIG = {
  // Arena
  arenaWidth: 390,
  arenaHeight: 700,
  
  // Knight
  knightSpeed: 3,
  knightSize: 32,
  
  // Villagers
  villagerSize: 28,
  trailSpacing: 24,
  
  // Monsters
  monsterSize: 36,
  monsterSpeeds: {
    bandits: 1.5,
    goblins: 2.5,
    dragons: 3.5
  },
  
  // Timers
  timerDurations: {
    easy: 30000,
    normal: 25000,
    hard: 20000
  },
  
  // Penalties
  wrongWordTimePenalty: 2000,
  
  // XP
  xpPerCorrectWord: 1,
  accuracyBonusThreshold: 0.9,
  accuracyBonus: 2,
  speedBonusThreshold: 0.5,
  speedBonus: 1,
  survivalBonusThreshold: 3,
  survivalBonus: 1,
  maxXP: 10,
  
  // Difficulties
  difficulties: {
    easy: { name: 'Scout Party', wordCount: 4, timer: 30000, monsterSpeed: 1.5 },
    normal: { name: 'War Band', wordCount: 6, timer: 25000, monsterSpeed: 2.5 },
    hard: { name: 'Full Siege', wordCount: 8, timer: 20000, monsterSpeed: 3.5 }
  }
};
```

## Technical Notes
- Follow architecture patterns from existing Konva games (DungeonLiberator, ShadowGateDungeon)
- Use pure state object with tick function for game logic
- Mobile-first: test on 390×844 viewport
- All text minimum 16px, touch targets minimum 44×44px
- Sentence games use `VocabularyItem[]` with full sentences
- Trailing line uses position history or offset-based following

## Task Summary
- **Phase 1**: 5 tasks - Setup & Infrastructure
- **Phase 2**: 12 tasks - Core Game Logic
- **Phase 3**: 8 tasks - Rendering
- **Phase 4**: 5 tasks - Input & Controls
- **Phase 5**: 4 tasks - UI & HUD
- **Phase 6**: 4 tasks - Game States
- **Phase 7**: 6 tasks - Polish & Integration
- **Total**: 44 tasks
