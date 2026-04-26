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

## Track: Gryphon Patrol Compliance Audit (2026-04-26)

### Summary
- Audited gryphon-patrol against 25 shared game specifications
- Result: 22/25 passing after fixes (14 passing at start, 11 failures)
- Fixes: rAF game loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, i18n/session, component tests, assets
- Final coverage: 89.9% overall (logic 98.25%, component 81.89%)

### Key Learnings
- setInterval(16ms) game loops must be refactored to requestAnimationFrame + delta clamping
- Mocking `containerRef` with stable object prevents infinite resize loops in tests
- Adding 8 component tests raises coverage from 0% to ~82% with minimal effort
- Difficulty 'normal' → 'medium' rename must touch type, state default, and all UI arrays
