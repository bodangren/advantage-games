# Technical Debt

## Resolved (all audited games)
- fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets.

## Remaining
- VocabularyItem[] vs SentenceItem[] naming consistency (Griffin Riders Escape, Gryphon Patrol).

---

## Rune Match Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, MONSTER_DIFFICULTY mapping, GameStartScreen/GameEndScreen, useCurrentLocale, useSession, hook deps, unused imports, removed StartScreen.tsx, added 51 tests

### Remaining
- RuneMatchGame.tsx coverage at 73.33% (below 80% target) — Konva rendering branches hard to test
- page.tsx coverage at 71.15% — API error handling branches uncovered

---

## Castle Defense Compliance Audit (2026-04-26)

### Resolved
- rAF loop, useGameFullscreen, useAccessibilitySettings, text sizes, calculateXP, difficulty naming, SentenceItem typing, useSession, component tests, hook deps, duplicate test file

### Remaining
- None

---

## RPG Battle Compliance Audit (2026-04-26)

### Resolved
- useGameFullscreen, useCurrentLocale, useSession, text sizes, GameEndScreen, removed unused imports

### Remaining
- DOM architecture non-compliant with React-Konva spec (accepted deviation)
- page.tsx coverage at 70% (below 80% target) — extract game logic to hook
