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
- Some games use non-standard difficulty levels (e.g., devourerSlime uses easy/medium/hard)

## Resolution Plan
- astral-mage: Create dedicated implementation track for full game build
- griffin-sky-joust/ storm-castle-tower: `&apos;` warnings are lint warnings, not errors - cosmetic only
- All other issues to be fixed when encountered during respective phases
