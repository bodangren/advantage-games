# Technical Debt

## Resolved (all audited games)
- fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets.

## Remaining
- VocabularyItem[] vs SentenceItem[] naming consistency (Griffin Riders Escape, Gryphon Patrol).

---

## Realm Carver Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added getEffectiveTextSize for all text
- Text size below 16px — increased base fontSize from 10/14 to 16px
- Missing calculateXP — implemented 1-10 scale with accuracy/speed/survival bonuses
- Difficulty 'normal' → 'medium', added easy/medium/hard presets
- Hook dependencies — fixed using destructured primitives (targetWordIndex, playerHp)
- API routes — switched to createSentencesRoute / createCompleteRoute
- Missing i18n/session — added useCurrentLocale, useSession to page.tsx
- Component tests — expanded to 7 tests; logic tests 24 tests (100% logic coverage)
- Assets — created asset directory at public/games/sentence/realm-carver/

### Remaining
- None

---

## Paladin's Twin-Soul Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added getEffectiveTextSize for all text
- Text size below 16px — increased base fontSize from 12/14 to 16px
- Missing calculateXP — implemented 1-10 scale with accuracy/speed/survival bonuses
- Difficulty 'normal' → 'medium', removed 'extreme' tier
- Hook dependencies — fixed using destructured primitives (playerHp, wave)
- Unused imports/vars — removed Zap, setSelectedDifficulty, locale
- Missing i18n/session — added useCurrentLocale, useSession to page.tsx
- Component tests — added calculateXP tests (26 total tests, 92.5% coverage)
- Assets — created asset directory and cover image symlink

### Remaining
- None
