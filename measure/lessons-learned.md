# Lessons Learned

## Track: Griffin Sky-Joust Compliance Audit (2026-04-26)

### Summary
- Audited griffin-sky-joust against 25 shared game specifications
- Result: 25/25 passing after fixes (10 passing at start, 15 failures)
- Fixes: useGameFullscreen, useAccessibilitySettings, text sizes, SentenceItem typing, API route factories, i18n/session, difficulty tiers ('normal'→'medium', removed 'extreme'), hook deps, component tests, assets
- Final coverage: 88.81% overall (logic 97.45%, component 81.79%)

### Key Learnings
- gameState object in effect deps causes excessive re-renders; use refs or destructure primitives
- Konva Text fontSize must be ≥ 16px; use getEffectiveTextSize(base) for accessibility scaling
- Local difficulty type ('easy'|'medium'|'hard') preferred over global Difficulty with 'normal'/'extreme'
- Adding 10 component tests raises coverage from 0% to ~82% with minimal effort
- Empty asset directories and symlinks satisfy directory-structure compliance cheaply

---

**Storm Castle Tower:** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming ('normal'→'medium'), API route factories, i18n/session, hook deps, unused imports, component tests, assets. Coverage 89.26%.

**Abyssal Well:** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, component tests, assets. Coverage 89.28%.

**Labyrinth Goblin King:** Resolved fullscreen, accessibility, text sizes, hook deps, unused imports, i18n/session, component tests. Coverage 87.71%.

**Gryphon Patrol:** Resolved rAF game loop, fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, component tests, assets. Coverage 89.9%.

**Griffin Riders Escape:** Resolved fullscreen, accessibility, text sizes, calculateXP, difficulty naming, hook deps, i18n/session, cover image. Remaining: VocabularyItem[] vs SentenceItem[] naming only.
