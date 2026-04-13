# Technical Debt

## Identified Issues

### High Priority
- griffinSkyJoust.test.ts line 92: "should handle collision from above with wrong word" expects HP=2 but gets HP=3 — game logic bug in collision detection (pre-existing) - **RESOLVED 2026-04-13 (tests pass - was stale)**
- difficulty.ts: `extreme` tier wordCount.max=12 exceeds DIFFICULTY_GUARDRAILS.maxWordCount=10 (semantic inconsistency) - **RESOLVED 2026-04-13**
- gameDataArrays.test.ts: gryphon-patrol has only 3 sentences in route (needs >=10); haunted-library default.json has 0 valid sentences
- difficulty.test.ts: `validateDifficultyConfig` function exported from test file instead of main module

### Medium Priority
- griffin-sky-joust: `any` type usage in game logic (line 94) - **RESOLVED 2026-04-08**
- griffin-sky-joust: `Math.random().toString(36).substr(2,9)` for enemy IDs in createEnemies - **RESOLVED 2026-04-08**
- gryphon-patrol/GryphonPatrolGame.tsx: Replaced `<Bird>` lucide SVG with Konva Rect (was rendering SVG in canvas context)
- gryphon-patrol/gryphonPatrolGame.ts: `Math.random()` used directly instead of injectable RNG param (makes deterministic testing impossible)
- villageGuardian.test.ts: Trail-following test was flaky due to monster spawning near trail via Math.random() — fixed by moving monster far away + adding invulnerability
- Multiple games: Duplicate camera/ResizeObserver/dimension tracking code — should be extracted to shared hook (e.g., useGameCamera)
- dragon-flight, magic-defense: Missing hook dependencies in useEffect/useCallback
- gryphon-patrol/GryphonPatrolGame.tsx: useEffect onComplete has missing deps (collectedWords.length, sentence.length) — potential stale closure
- griffin-rider, realm-carver: TypeScript `any` usage in tests (Konva mock in test files)
- realm-carver: 75.51% coverage below 80% threshold (GameEndScreen, VirtualDPad, useSound not fully tested)
- remotion/WizardZombieGameRenderer.tsx: useMemo missing deps (eslint-disable added — intentional for Remotion frame-based state)

### Low Priority (Warnings Only)
- griffin-sky-joust, storm-castle-tower: Unescaped entities warnings (not errors, lint passes)
- griffin-sky-joust page: Unescaped `'` in JSX (react/no-unescaped-entities)

### Known Issues (from lessons-learned)
- Callback naming inconsistency: `onComplete` vs `onEnd` across games
- High `any` usage in page tests
- Some games use non-standard difficulty levels (e.g., devourerSlime uses easy/medium/hard)

## Resolution Plan
- griffin-sky-joust: any type and Math.random() for enemy IDs resolved 2026-04-08
- paladins-twin-soul: Unit tests now passing (3 suites, 20 tests) - removed from high priority
- griffin-sky-joust/ storm-castle-tower: &apos; warnings are lint warnings, not errors - cosmetic only
- All other issues to be fixed when encountered during respective phases

---

## Mobile Performance Hardening Pass (2026-04-08)

### Remediated Hotspots
- VirtualDPad: Memoized component + useCallback handlers + ref-based onInput callback
- WizardZombieGame: Eliminated Math.random() from Layer render (was causing re-renders every frame)
- DungeonLiberatorGame: CSS transform-only positioning for indicators (no layout reflow), useMemo for indicators

### Remaining Opportunities
- Batch state updates in game loops across games
- Add performance regression checks (smoke tests for FPS)
- Profile memory allocation in game loops

---

## XP Leaderboard (2026-04-09)

### Completed
- Phase 1: Storage layer - types (LeaderboardState, SessionRecord, GameHighScore) and useLeaderboard hook
- Phase 2: /student/leaderboard page with cumulative XP, high scores table, session history, clear history
- Phase 3: Session auto-recording in GameEndScreen - records session when game ends with XP > 0

---

## Shared Accessibility and Input Assist Layer (2026-04-10)

### Completed
- Phase 1: Created shared accessibility settings module with localStorage persistence
- Types: AccessibilitySettings (textSizeMultiplier, touchTargetMultiplier, assistMode, reduceMotion)
- Hook: useAccessibilitySettings with getEffectiveTextSize(), getEffectiveTouchTarget(), updateSettings(), resetSettings()
- Tests: 17 tests with 98% coverage

### Phase 2 Integration Complete
- WizardZombieGame (vocabulary): touchTargetMultiplier applied to CAST button and VirtualDPad; textSizeMultiplier applied to start screen text
- DungeonLiberatorGame (sentence): touchTargetMultiplier applied to VirtualDPad via CSS transform scale()

### Integration Points
- Games consume settings via useAccessibilitySettings hook
- Settings persisted to localStorage under 'advantage-games-accessibility' key
- Both getEffectiveTextSize() and getEffectiveTouchTarget() require baseSize argument

---

## Content Rotation Schema (2026-04-11)

### Completed
- Phase 1: Created contentPackSchema.ts with v1-legacy and v2 format support
- Types: ContentPackMetadata, VocabularyItem, PackFormat, ContentPackValidationResult
- Validation: detectPackFormat, validateVocabularyItem, validateContentPackMetadata, validateContentPack
- Tests: 36 tests with 94.33% coverage

### Phase 2 Complete (2026-04-12)
- Created packRotation.ts with RotationManager for active pack management
- Operations: setActivePacks, addActivePack, removeActivePack, rollback, saveStablePacks
- Rollback tracks history and marks activation records as consumed
- Utilities: validatePackAvailability, mergePacksFromIds for pack merging
- Tests: 26 tests, all passing
- Runbook: docs/rotation-runbook.md with weekly rotation procedures