# Technical Debt

## Identified Issues

### High Priority
- babel-architect: Zero implementation — no component, logic, page, API route, tests, or assets exist. Registered as 'playable' in gameCards.ts (incorrect status). Requires full implementation track.
- astral-mage: Zero implementation — no component, logic, page, API route, tests, or assets exist. Registered as 'coming-soon' in gameCards.ts. Requires full implementation track.
- astral-mage: Cover image at wrong path (`cover-astral-mage.png` instead of `astral-mage-cover.png`)

### Medium Priority
- dragon-flight, magic-defense: Missing hook dependencies in useEffect/useCallback
- griffin-rider, realm-carver: TypeScript `any` usage in tests (Konva mock in test files)
- Multiple games: Duplicate camera/ResizeObserver/dimension tracking code — extracted to useGameDimensions hook, WizardZombieGame migrated - **PARTIALLY RESOLVED**

### Low Priority (Warnings Only)
- griffin-sky-joust, storm-castle-tower: Unescaped entities warnings (not errors, lint passes)
- griffin-sky-joust page: Unescaped `'` in JSX (react/no-unescaped-entities)

### Known Issues
- Callback naming inconsistency: `onComplete` vs `onEnd` across games
- High `any` usage in page tests

## Resolution Plan
- astral-mage: Create dedicated implementation track for full game build
- griffin-sky-joust/ storm-castle-tower: `&apos;` warnings are lint warnings, not errors - cosmetic only
- All other issues to be fixed when encountered during respective phases

---

## Devourer Slime Compliance Audit (2026-04-26)

### Resolved
- Missing GameStartScreen/GameEndScreen — added with full integration
- Raw score XP — replaced with shared `calculateXP` from `@/lib/xp`
- Missing accessibility settings — added `useAccessibilitySettings` with touch target scaling
- Missing i18n/session hooks — added `useScopedI18n` and `useSession` to page.tsx
- Missing off-screen indicators — added target orb indicators
- E2E mock API shape mismatch — fixed `vocabulary` → `sentences` in mock response

### Remaining
- No custom assets needed (procedural rendering), asset directory spec is N/A

---

## Griffin Riders Escape Compliance Audit (2026-04-26)

### Resolved
- Missing useGameFullscreen — integrated with enter/exit on phase changes
- Missing useAccessibilitySettings — added text scaling via getEffectiveTextSize
- Text size below 16px — changed text-xs to text-base with accessibility scaling
- calculateXP not 1-10 scale — added game-specific function with bonuses capped at 10
- Difficulty 'normal' instead of 'medium' — renamed in config and default state
- ESLint hook dependency warnings — fixed by restructuring effect conditions
- Missing i18n/session hooks — added useScopedI18n, useCurrentLocale, useSession
- Missing cover image — copied background asset to cover path

### Remaining
- SentenceItem[] typing: game uses VocabularyItem[] with identical {term, translation} shape. Type name differs from spec but runtime behavior is correct.
