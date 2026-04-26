# Technical Debt

## Resolved (all audited games)
- fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets.

## Remaining
- VocabularyItem[] vs SentenceItem[] naming consistency (Griffin Riders Escape, Gryphon Patrol).

---

## Wizard vs Zombie Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen, RAF game loop, GameStartScreen/GameEndScreen, difficulty tiers (normal→medium, removed extreme), useCurrentLocale, unused dynamic import, tests

### Remaining
- None

---

## Archer's Revenge Compliance Audit (2026-04-26)

### Resolved
- Hook dependencies — replaced gameState object in useEffect deps with gameStateRef pattern
- Unused vars — removed locale/session assignments with eslint-disable comments

### Remaining
- None

---

## Realm Carver Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, API routes, i18n/session, component tests, assets

### Remaining
- None

---

## Paladin's Twin-Soul Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty tiers, hook deps, unused imports, i18n/session, component tests, assets

### Remaining
- None
