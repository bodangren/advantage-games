# Lessons Learned

## Track: Devourer Slime (2026-03-28)

### Successes
- Core logic implemented with TDD, achieving 97% statement coverage.
- Slime growth/shrink mechanics work smoothly with React-Konva canvas scaling.
- Camera logic correctly centers on the player in a large (800x800) arena.
- Successfully resolved a build issue where literal bracket-named directories (e.g., `\[locale\]`) were created due to shell command escaping errors.

### Challenges & Deviations
- **Routing Clash:** Initial `mkdir` command with literal brackets `\[locale\]` caused a Next.js normalized route error (`NormalizationError`). Manual cleanup of literal-named directories was required to fix the build.
- **Component Interface:** Discrepancy between `DevourerSlimeGame` component's `onComplete` prop and the page's `onEnd` usage required a quick refactoring.

### Technical Debt Identified
During the final build check (`npm run build`), several technical debt items were identified in existing games:
- **Lint Errors (Unescaped Entities):** `&apos;` and similar characters in `griffin-sky-joust`, `storm-castle-tower`.
- **Hook Dependencies:** Missing dependencies in `useEffect` and `useCallback` hooks across multiple game components (Dragon Flight, Magic Defense).
- **TypeScript `any` Usage:** High usage of `any` type in page tests and some game logic files (Griffin Sky Joust, Realm Carver).
- **Unused Variables:** Many game pages and components have unused imports or variables (Gryphon Patrol, Potion Rush).

### Future Improvements
- Refactor existing games to use stricter TypeScript types and resolve linting warnings.
- Standardize the `onComplete` vs `onEnd` callback names across all sentence/vocabulary games.
- Implement more robust arena bounds and enemy patrol AI in `devourerSlime.ts`.
