# Technical Debt

## Identified Issues

### High Priority
- griffin-sky-joust: Unescaped entities (`&apos;`) lint errors
- storm-castle-tower: Unescaped entities (`&apos;`) lint errors
- griffin-sky-joust: `any` type usage in game logic (line 94)

### Medium Priority
- dragon-flight, magic-defense: Missing hook dependencies in useEffect/useCallback
- griffin-rider, realm-carver: TypeScript `any` usage in tests (Konva mock in test files)
- gryphon-patrol: Unused variables (resolved partial 2026-04-07)
- realm-carver: 75.51% coverage below 80% threshold (GameEndScreen, VirtualDPad, useSound not fully tested)
- remotion/: Multiple unused imports in WizardZombiePromo.tsx and WizardZombieGameRenderer.tsx (missing deps in useMemo)
- labyrinth-goblin-king: unused function `getEntrancePositions` (line 166)
- shadow-gate-dungeon: unused `_rng` assignment (line 189)

### Known Issues (from lessons-learned)
- Callback naming inconsistency: `onComplete` vs `onEnd` across games
- High `any` usage in page tests

## Resolution Plan
- paladins-twin-soul: Unit tests now passing (3 suites, 20 tests) - removed from high priority
- All other issues to be fixed when encountered during respective phases
