# Implementation Plan: Shadow Gate Dungeon

This plan outlines the steps to build "Shadow Gate Dungeon" using **React-Konva (Canvas)** with strict TDD methodology.

## Phase 1: Setup & Infrastructure
**Assets Required:** None (can start immediately)

- [ ] Task: Create configuration file `src/lib/games/shadowGateDungeonConfig.ts` with all balance values
- [ ] Task: Define game state types in `src/lib/games/shadowGateDungeon.ts`
- [ ] Task: Create route and page structure at `src/app/[locale]/(student)/student/games/sentence/shadow-gate-dungeon/`
- [ ] Task: Create `ShadowGateDungeonGame` container component with React-Konva Stage
- [ ] Task: Write initial tests for state creation and configuration

## Phase 2: Core Game Logic
**Assets Required:** None (logic only)

- [ ] Task: Implement `createShadowGateDungeonState()` initialization function
- [ ] Task: Implement `tickShadowGateDungeon()` game loop update function
- [ ] Task: Implement player movement logic (position, velocity, bounds)
- [ ] Task: Implement word crystal spawning and positioning
- [ ] Task: Implement word collection logic (correct/wrong detection)
- [ ] Task: Implement shadow creature AI (pursuit behavior)
- [ ] Task: Implement collision detection (player-crystal, player-creature, player-gate)
- [ ] Task: Implement health system (damage, invincibility)
- [ ] Task: Implement win/lose condition detection
- [ ] Task: Implement gate unlock logic (when sentence complete)
- [ ] Task: Write comprehensive tests for all game logic (>80% coverage)

## Phase 3: Rendering
**Assets Required:** None (using Konva primitives for MVP)

- [ ] Task: Implement dungeon background rendering (gradient floor)
- [ ] Task: Implement exit gate rendering (portal with translation text)
- [ ] Task: Render word crystals with text labels and glow effects
- [ ] Task: Render player (circle/sprite)
- [ ] Task: Render shadow creature (circle with trail effect)
- [ ] Task: Implement visual feedback (damage flash, collection sparkle)

## Phase 4: Input & Controls
**Assets Required:** VirtualDPad component (reuse from DungeonLiberator)

- [ ] Task: Integrate VirtualDPad component for mobile controls
- [ ] Task: Implement keyboard support (arrow keys)
- [ ] Task: Ensure 44×44px minimum touch targets for DPad
- [ ] Task: Implement difficulty selection UI
- [ ] Task: Implement opponent selection UI

## Phase 5: UI & HUD
**Assets Required:** None

- [ ] Task: Implement health bar display
- [ ] Task: Implement collected words display (sentence progress)
- [ ] Task: Implement score/XP display
- [ ] Task: Implement timer display

## Phase 6: Game States
**Assets Required:** None (uses shared GameStartScreen/GameEndScreen)

- [ ] Task: Implement start screen with difficulty and opponent selection
- [ ] Task: Implement victory state and XP display
- [ ] Task: Implement defeat state
- [ ] Task: Wire state transitions (start → playing → ended)

## Phase 7: Polish & Integration
**Assets Required:** Sound effects (optional)

- [ ] Task: Add visual feedback and juice (particles, screen shake)
- [ ] Task: Add sound effects using useSound hook (optional)
- [ ] Task: Balance tuning based on playtesting
- [ ] Task: Create API routes: `/api/v1/games/shadow-gate-dungeon/sentences` and `/api/v1/games/shadow-gate-dungeon/complete`
- [ ] Task: Register game in gameCards.ts
- [ ] Task: Final integration test

---

## Configuration Reference

```typescript
const SHADOW_GATE_DUNGEON_CONFIG = {
  // Arena
  arenaWidth: 390,
  arenaHeight: 700,
  gateWidth: 100,
  gateHeight: 60,
  
  // Player
  playerSpeed: 120,
  playerRadius: 20,
  initialHealth: 100,
  invincibilityDuration: 1000,
  
  // Word Crystals
  crystalRadius: 25,
  crystalSpawnMargin: 50,
  
  // Creature
  creatureSpeeds: {
    'goblin-scout': 60,
    'orc-hunter': 90,
    'shadow-dragon': 120
  },
  creatureRadius: 25,
  
  // Damage
  wrongWordDamage: 20,
  creatureCollisionDamage: 25,
  
  // XP
  xpPerCorrectWord: 1,
  accuracyBonus: 1,
  speedBonusThreshold: 30000,
  speedBonus: 1,
  survivalBonusThreshold: 50,
  survivalBonus: 1,
  maxXP: 10,
  
  // Difficulties
  difficulties: {
    easy: { name: 'Dark Cell', wordCount: 4 },
    normal: { name: 'Forgotten Crypt', wordCount: 5 },
    hard: { name: 'Abyssal Chamber', wordCount: 6 }
  }
};
```

## Technical Notes
- Follow architecture patterns from existing Konva games (DungeonLiberator, SpellweaversRun)
- Use pure state object with tick function for game logic
- Mobile-first: test on 390×844 viewport
- All text minimum 16px, touch targets minimum 44×44px
- Sentence games use `VocabularyItem[]` with full sentences
- Reuse VirtualDPad component from DungeonLiberator

## Task Summary
- **Phase 1**: 5 tasks - Setup & Infrastructure
- **Phase 2**: 11 tasks - Core Game Logic
- **Phase 3**: 6 tasks - Rendering
- **Phase 4**: 5 tasks - Input & Controls
- **Phase 5**: 4 tasks - UI & HUD
- **Phase 6**: 4 tasks - Game States
- **Phase 7**: 6 tasks - Polish & Integration
- **Total**: 41 tasks
