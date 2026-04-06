# Technical Debt

## Identified Issues

### High Priority
- paladins-twin-soul: 3 failing unit tests (mock issue - custom hooks not mocked), 54.98% coverage below 80% threshold
- griffin-sky-joust: Unescaped entities (`&apos;`) lint errors
- storm-castle-tower: Unescaped entities (`&apos;`) lint errors

### Medium Priority
- dragon-flight, magic-defense: Missing hook dependencies in useEffect/useCallback
- griffin-rider, realm-carver: TypeScript `any` usage in tests
- gryphon-patrol, potion-rush: Unused variables

### Known Issues (from lessons-learned)
- Callback naming inconsistency: `onComplete` vs `onEnd` across games
- High `any` usage in page tests

## Resolution Plan
- Phase 6 (paladins-twin-soul): Tech debt documented - unit test failures need hook mocking solution
- All other issues to be fixed when encountered during respective phases
