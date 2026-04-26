# Technical Debt

## Resolved (all audited games)
- fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets.

## Remaining
- VocabularyItem[] vs SentenceItem[] naming consistency (Griffin Riders Escape, Gryphon Patrol).

---

## Magic Defense Compliance Audit (2026-04-26)

### Resolved
- useGameFullscreen, useAccessibilitySettings, useCurrentLocale, useSession, difficulty label, lint, asset dir, tests

### Remaining
- React-Konva migration (complete rewrite required)
- Pure state + tick functions (architectural refactor)
- requestAnimationFrame game loop (architectural refactor)
- Shared screens integration (GameStartScreen/GameEndScreen)

---

## Castle Defense Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty naming, SentenceItem typing, useSession, component tests, hook deps, duplicate test file

### Remaining
- None

---

## Alchemists Synthesis Compliance Audit (2026-04-26)

### Resolved
- Created game scaffold, React-Konva canvas, pure tick + rAF loop, useGameFullscreen, useAccessibilitySettings, useCurrentLocale, useSession, GameStartScreen/GameEndScreen, difficulty tiers, API routes, tests, registry update

### Remaining
- Asset directory empty (no sprites/backgrounds)
- Gameplay is minimal (simple matching); could be expanded with alchemy mechanics

---

## RPG Battle Compliance Audit (2026-04-26)

### Resolved
- useGameFullscreen, useCurrentLocale, useSession, text sizes, GameEndScreen, removed unused imports

### Remaining
- DOM architecture non-compliant with React-Konva spec (accepted deviation)
- page.tsx coverage at 70% (below 80% target) — extract game logic to hook
