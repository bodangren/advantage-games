# Lessons Learned

## Track: Dragon Flight Compliance Audit (2026-04-26)

### Summary
- Audited Dragon Flight against 25 shared game specifications
- Result: 20/27 passing after fixes (was 14/27 at start due to critical bugs)
- Fixed infinite loop caused by unstable `useScopedI18n` function reference in `useMemo` deps
- Added missing hook dependencies, removed unused variables, wrote RankingDialog tests
- Final coverage: 85.74% overall (exceeds 80% threshold)

### Key Learnings
- `useScopedI18n` returns a new function reference on every render — NEVER use it in `useMemo`/`useCallback` dependency arrays
- Stabilize computed configs by using `useState(() => computeConfig(t))` instead of `useMemo(() => computeConfig(t), [t])`
- Custom start/end screens are functional but fail shared-screen compliance — major refactor needed to use GameStartScreen/GameEndScreen
- `useInterval` with fixed TICK_MS is acceptable but not ideal; rAF + delta-time clamping is the spec standard
- Missing test attributes (data-testid, role, aria-label) are easy to fix and prevent test brittleness

---

## Track: Griffin Riders Escape Compliance Audit (2026-04-26)

### Summary
- Audited griffin-riders-escape against 25 shared game specifications
- Result: 24/25 passing after fixes (14 passing at start, 11 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, cover image
- Final coverage: 87.99% overall (logic 98.44%, component 79.11%)

### Key Learnings
- Game loops should avoid `gameState` in effect deps; use functional setState or refs
- `useGameFullscreen` integration pattern: enter on 'playing', exit on 'ended'/'start'
- Accessibility text scaling via `getEffectiveTextSize(base)` preserves base layout
- Difficulty naming inconsistency (`normal` vs `medium`) is easy to miss in config objects
- Cover image absence is a common compliance gap for games with existing assets

---

## Track: Labyrinth of the Goblin King Compliance Audit (2026-04-26)

### Summary
- Audited labyrinth-goblin-king against 25 shared game specifications
- Result: 25/25 passing after fixes (20 passing at start, 5 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, hook deps, i18n/session, unused imports, component tests
- Final coverage: 87.71% overall (logic 85.57%, component 91.04%)

### Key Learnings
- `gameState` object in effect deps causes excessive re-renders; destructure primitives before useEffect
- Konva Text fontSize must be ≥ 16px; use `getEffectiveTextSize(base)` for accessibility scaling
- Adding component tests raises coverage dramatically (0% → 91%)
- Empty asset directories satisfy directory-structure compliance for games without custom sprites
