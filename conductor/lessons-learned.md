# Lessons Learned

## Track: Gryphon Patrol Hook Dependencies Fix (2026-04-17)

### Summary
- Added missing dependencies `gameState.collectedWords.length` and `gameState.sentence.length` to useEffect dependency array in GryphonPatrolGame.tsx

### Key Learnings
- When using values inside useEffect for calculations (like accuracy), all dependencies must be explicitly listed
- Even if the game state won't change after status === 'won'/'lost', ESLint still requires explicit dependencies for values used inside the effect
- Adding nested state properties (like `gameState.collectedWords.length`) directly to deps array is valid and necessary

### Technical Debt Resolved
- gryphon-patrol/GryphonPatrolGame.tsx: useEffect onComplete missing deps

---

## Track: Haunted Library Flaky Tests Fix (2026-04-16)

### Summary
- Made Math.random() injectable via optional rng parameter in createLibraryState
- Fixed flaky tests by ensuring deterministic ghost placement in tests

### Key Learnings
- Ghost spawns on random floor, not player's initial floor — collision distance check can fail if on different floors
- Using deterministic RNG (() => 0.5) ensures consistent spawn positions
- For collision tests, directly set ghost position AFTER createLibraryState to guarantee overlap
- Simply teleporting player to ghost.x, ghost.y doesn't guarantee collision if floors differ

### Technical Debt Resolved
- hauntedLibrary.test.ts: flaky tests due to Math.random() ghost/bat positioning

---

## Track: Gryphon Patrol RNG Injectable (2026-04-15)

### Summary
- Made Math.random() injectable via optional rng parameter in spawnGryphonPatrolEnemies
- Enables deterministic testing by passing mock RNG function

### Key Learnings
- Default parameter `rng: () => number = Math.random` preserves production behavior
- Tests can pass deterministic values like `() => 0.5` to verify specific spawn positions
- Same pattern can be applied to other games with Math.random() in logic

### Technical Debt Resolved
- gryphon-patrol: Math.random() replaced with injectable rng parameter

---

## Track: Haunted Library Test Fix (2026-04-14)

### Summary
- Fixed flaky "should handle victory" test that was failing due to non-deterministic door placement

### Key Learnings
- Math.random() in game logic creates non-deterministic tests when player positioning relies on collision detection
- When game entities use random placement, tests that rely on specific positions should either mock random or manually set controlled positions
- Door collision detection uses 40px vertical threshold from door center - player must be positioned within this range
- Ghost collision can happen multiple times per tick if ghost is very close (distance < 30 triggers once but ghost doesn't move away)

### Technical Debt Resolved
- hauntedLibrary.test.ts: "should handle victory" was flaky due to random door floor assignment

---

## Track: Shared Game Camera Hook (2026-04-14)

### Summary
- Extracted duplicate ResizeObserver dimension tracking into useGameDimensions hook
- Created useGameCamera hook that uses useGameDimensions internally
- Migrated WizardZombieGame to use useGameDimensions

### Key Learnings
- Camera computation varies significantly by game type (player-centered vs world-centered)
- Extracting only the shared dimension tracking (ResizeObserver) is more practical than trying to abstract camera computation
- useGameDimensions reduces ~30 lines of boilerplate per game

### Technical Debt Resolved
- WizardZombieGame: Removed duplicate ResizeObserver code (30 lines)
- Created reusable hooks for future migrations

---

## Track: Content Rotation Phase 2 (2026-04-12)

### Summary
- Created packRotation module with RotationManager for active pack lifecycle management
- Supports rollback through activation history with consumed-record tracking
- 26 tests with full coverage

### Key Learnings
- Rollback history must track consumed records to prevent re-using the same activation
- localStorage mocking in Jest requires careful isolation in beforeEach
- When testing rollback chain, trace through each state change to verify correct record selection
- Activation records are immutable snapshots - rollback creates new records, doesn't modify old ones

### Technical Debt Resolved
- None - new feature infrastructure

---

## Track: Content Rotation Phase 1 (2026-04-11)

### Summary
- Created contentPackSchema module for vocabulary/sentence pack validation
- Supports both v1-legacy (array) and v2 (metadata object) formats
- 36 tests with 94.33% coverage

### Key Learnings
- Legacy v1 packs are auto-converted to v2 with generated packId
- Set<string>([...constArray]) needed for Object.keys() type compatibility
- VocabularyItem.id is optional - validation must not reject items with id field

### Technical Debt Resolved
- None - new infrastructure

---

## Track: Shared Accessibility Integration - Phase 2 Completion (2026-04-11)

### Summary
- Completed Phase 2 validation: all tests pass, build succeeds
- Created rollout_pattern.md documenting integration pattern for future games

### Rollout Pattern Key Points
- Touch target scaling via CSS transform: `scale(getEffectiveTouchTarget(base) / base)`
- Text scaling via inline style: `fontSize: getEffectiveTextSize(base)` (returns pixels directly)
- Both helpers require baseSize argument; returns calculated value, not multiplier

### Technical Debt Resolved
- None - this was completion of existing track

---

---

## Track: Shared Accessibility and Input Assist Layer (2026-04-10)

### Summary
- Created shared accessibility settings module with localStorage persistence
- Settings: textSizeMultiplier (1.0-2.0), touchTargetMultiplier (1.0-2.0), assistMode, reduceMotion
- Hook: useAccessibilitySettings provides getEffectiveTextSize(), getEffectiveTouchTarget()

### Key Learnings
- Deserialization should validate types explicitly (typeof checks) rather than casting to avoid TypeScript errors
- Settings hook pattern follows existing useLeaderboard pattern for consistency
- Effective size helpers (getEffectiveTextSize, getEffectiveTouchTarget) allow base values in components with runtime scaling

### Technical Debt Resolved
- None - this was new feature infrastructure

---

## Track: XP Leaderboard & Session History (2026-04-09)

### Summary
- Implemented persistent localStorage leaderboard with per-game high scores, cumulative XP, and 20-entry session history
- Created /student/leaderboard route with stats display and clear history
- Integrated session recording into shared GameEndScreen component

### Key Learnings
- GameEndScreen useEffect auto-records sessions when xp > 0 and gameId/gameName provided - no per-game integration needed
- Adding gameId/gameName props to GameEndScreen enables leaderboard tracking without modifying game logic
- showLeaderboardLink prop controls optional "View Leaderboard" link display
- 20-session cap uses .slice(0, MAX_SESSIONS) on prepend to keep most recent sessions

### Technical Debt Resolved
- None - this was new feature infrastructure

---

## Track: Griffin Sky-Joust any Type Fix (2026-04-08)

### Summary
- Fixed `any` type in handleFlap callback with proper KonvaEventObject<MouseEvent | TouchEvent> type
- Added null check for stage in event handler

### Key Learnings
- Always add null checks when calling getStage() on Konva event targets
- Import KonvaEventObject from 'konva/lib/Node'

---

## Track: Unified Difficulty Curves and Spawn Tuning (2026-04-07)

### Summary
- Created shared difficulty model with canonical types and guardrails
- Inventory matrix captured across 25+ vocabulary and sentence games
- Published tuning playbook for future game development

### Successes
- Phase 1: Mapped difficulty knobs across all game types (speed, spawn, HP, timers)
- Phase 2: Created reusable difficulty.ts module with guardrail validation
- Published tuning_playbook.md for future tracks

### Key Findings
- Most games already follow easy/normal/hard/extreme pattern
- Guardrails needed: minSpawnInterval 500ms, maxSpeed 200px/s, maxWordCount 10
- Some games (devourerSlime) use non-standard difficulty levels (easy/medium/hard)

### Technical Debt Resolved
- None - this was new infrastructure work

---

## Track: QA/QC COMPLETE (2026-04-07)

### Summary
- All 26 games QA'd: 25 implemented + 1 skipped (squires-gauntlet)
- All E2E tests passing, all builds successful
- Screenshots captured for all implemented games
- Tech debt documented for future fixes

---

## Track: QA/QC Phase 20-26 - Autonomous Completion (2026-04-07)

### Successes
- Completed 7 phases autonomously in single run (Phases 20-26)
- All E2E tests passing for 6 implemented games
- All builds successful
- Screenshots captured for: realm-carver, rune-forge-chamber, shadow-gate-dungeon, spellweavers-run, storm-castle-tower, village-guardian

### Coverage Results
- realm-carver: 75.51% (below threshold, documented in tech-debt)
- rune-forge-chamber: 99.14% (exceeds threshold)
- shadow-gate-dungeon: 98.72% (exceeds threshold)
- spellweavers-run: 100% (exceeds threshold)
- storm-castle-tower: 95.52% (exceeds threshold)
- village-guardian: 97.04% (exceeds threshold)

### Challenges
- squires-gauntlet not implemented - only empty placeholder directory exists
- Mock API response format varies between games (some expect vocabulary, some expect sentences)

### Technical Debt Identified
- realm-carver: 75.51% coverage below 80% threshold (GameEndScreen, VirtualDPad, useSound not fully tested)
- realm-carver: TypeScript `any` usage in Konva mock (test files)

---

## Track: QA/QC Phase 19 - Potion Rush (2026-04-06)

### Successes
- Unit tests: 29 passed, 92.46% coverage exceeds 80% threshold.
- Fixed unused import `PotionRushGameResult` in page.tsx.
- E2E tests created and passing for both normal load and insufficient sentences warning.

### Challenges
- Build errors from missing `export const dynamic = "force-static"` in griffin-riders-escape and devourer-slime API routes.
- Potion-rush GameStartScreen uses "Start Brewing" button text, not generic "Start Game".

### Technical Debt Identified
- Pre-existing: Missing `dynamic = "force-static"` exports in multiple API routes (griffin-riders-escape, devourer-slime).

### Future Improvements
- Fix remaining API routes missing `export const dynamic` for `output: export` compatibility.

---

## Track: Mobile Performance Hardening Pass (2026-04-08)

### Summary
- Phase 1 complete: Baseline performance profile captured with hotspots identified
- Phase 2 started: Key remediations implemented (VirtualDPad, WizardZombieGame, DungeonLiberatorGame)

### Hotspots Identified
- Math.random() in Layer render causing re-renders (WizardZombieGame)
- VirtualDPad re-renders on touch move (missing memoization)
- DOM-based indicators using left/top positioning (causing layout reflow)
- Multiple setState calls in game loops

### Remediations Applied
- VirtualDPad: memo component, useCallback handlers, ref-based onInput callback
- WizardZombieGame: Pre-computed screen shake offset (deterministic, not random per frame)
- DungeonLiberatorGame: CSS transform-only positioning, useMemo for indicators

### Key Learnings
- CSS transform is compositor-only; left/top causes layout reflow
- useMemo prevents recalculation of expensive derived state
- memo() on frequently re-rendered components reduces unnecessary renders
- Math.random() in render = re-render on every frame
