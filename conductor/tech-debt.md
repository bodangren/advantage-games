# Technical Debt

## Identified Issues

### High Priority
- griffin-sky-joust: `any` type usage in game logic (line 94) - **RESOLVED 2026-04-08** (component `any` type at line 151 fixed)
- difficulty.ts: `extreme` tier wordCount.max=12 exceeds DIFFICULTY_GUARDRAILS.maxWordCount=10 (semantic inconsistency)
- gameDataArrays.test.ts: gryphon-patrol has only 3 sentences in route (needs >=10); haunted-library default.json has 0 valid sentences
- difficulty.test.ts: `validateDifficultyConfig` function exported from test file instead of main module

### Medium Priority
- gryphon-patrol/GryphonPatrolGame.tsx: Uses `<Bird>` (lucide-react SVG icon) as Konva child (line 220) — will not render in canvas context
- gryphon-patrol/gryphonPatrol.ts: `Math.random()` used directly instead of injectable RNG param (makes deterministic testing impossible)
- Multiple games: Duplicate camera/ResizeObserver/dimension tracking code — should be extracted to shared hook (e.g., useGameCamera)
- dragon-flight, magic-defense: Missing hook dependencies in useEffect/useCallback
- griffin-rider, realm-carver: TypeScript `any` usage in tests (Konva mock in test files)
- realm-carver: 75.51% coverage below 80% threshold (GameEndScreen, VirtualDPad, useSound not fully tested)
- remotion/: Multiple unused imports in WizardZombiePromo.tsx and WizardZombieGameRenderer.tsx (missing deps in useMemo)

### Low Priority (Warnings Only)
- griffin-sky-joust, storm-castle-tower: Unescaped entities warnings (not errors, lint passes)
- griffin-sky-joust page: Unescaped `'` in JSX (react/no-unescaped-entities)

### Known Issues (from lessons-learned)
- Callback naming inconsistency: `onComplete` vs `onEnd` across games
- High `any` usage in page tests
- Some games use non-standard difficulty levels (e.g., devourerSlime uses easy/medium/hard)

## Resolution Plan
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
