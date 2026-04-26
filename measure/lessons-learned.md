# Lessons Learned

## Track: The Abyssal Well Compliance Audit (2026-04-26)

### Summary
- Audited abyssal-well against 25 shared game specifications
- Result: 25/25 passing after fixes (14 passing at start, 11 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, unused imports, component tests, assets
- Final coverage: 89.28% overall (logic 100%, component 80.91%)

### Key Learnings
- Game already used rAF + delta-time clamping — excellent architectural foundation
- AbyssalWellDifficulty type should be local ('easy'|'medium'|'hard') not global Difficulty
- Adding component tests from scratch raises coverage from 0% to ~81% with 9 focused tests
- Empty asset directories and symlinks satisfy directory-structure compliance cheaply

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
