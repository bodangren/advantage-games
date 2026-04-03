# Implementation Plan: Games QA/QC - E2E Testing and Validation

## Phase 0: Playwright Setup and Infrastructure

- [x] Task: Install Playwright and dependencies
    - [x] Install @playwright/test package
    - [x] Install Playwright browsers (chromium)
    - [x] Add Playwright scripts to package.json
    - [x] Create playwright.config.ts with mobile-first viewport (390×844)
- [x] Task: Create shared test utilities
    - [x] Create tests/e2e/fixtures/gameFixtures.ts with mock vocabulary/sentence data
    - [x] Create tests/e2e/helpers/gameHelpers.ts with common game interactions
    - [x] Create tests/e2e/helpers/screenshotHelpers.ts for screenshot capture
- [x] Task: Create base game test template
    - [x] Create tests/e2e/gameTemplate.spec.ts with reusable test patterns
- [x] Task: Verify Playwright setup
    - [x] Run test template to confirm Playwright works
    - [x] Verify screenshot directory creation works
- [x] Task: Conductor - User Manual Verification 'Phase 0: Playwright Setup and Infrastructure' (Protocol in workflow.md)

- Note: the phase-0 smoke template validates `archers-revenge` as the canonical single-game target and writes a screenshot to `public/games/archers-revenge/`.

## Phase 1: archers-revenge (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPatterns="archers-revenge|archersRevenge" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/archers-revenge/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- Note: `npm run build` is still blocked by pre-existing lint errors in unrelated files outside the archers-revenge slice.
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/vocabulary/archers-revenge.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Game component renders after vocabulary loads
    - [x] Test: Basic game interaction (start game)
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/archers-revenge/
- [ ] Task: Conductor - User Manual Verification 'Phase 1: archers-revenge' (Protocol in workflow.md)

## Phase 2: dragon-flight (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="dragon-flight|dragonFlight" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80% (94.74% coverage - exceeds threshold)
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/dragon-flight/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix (none found)
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/vocabulary/dragon-flight.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Game component renders after vocabulary loads
    - [x] Test: Basic game interaction (start game)
    - [x] Test: Vocabulary preview displays
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/dragon-flight/
- [ ] Task: Conductor - User Manual Verification 'Phase 2: dragon-flight' (Protocol in workflow.md)

## Phase 3: dragon-rider (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPatterns="dragon-rider|dragonRider" --coverage`
    - [x] Fix any failing unit tests (none failing)
    - [x] Document coverage gaps if <80% (94.57% coverage - exceeds threshold)
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/dragon-rider/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix (no any usage found)
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps) - 3 non-blocking warnings
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/vocabulary/dragon-rider.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Game component renders after vocabulary loads
    - [x] Test: Basic game interaction (start game)
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/dragon-rider/
- [ ] Task: Conductor - User Manual Verification 'Phase 3: dragon-rider' (Protocol in workflow.md)

## Phase 4: enchanted-library (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] 7 suites, 90 tests, 90.94% coverage (exceeds 80% threshold)
- [x] Task: Props/API validation
    - [x] API routes correct: `/api/v1/games/enchanted-library/*`
    - [x] No `any` usage, no lint errors
- [x] Task: Write E2E tests (tests/e2e/games/vocabulary/enchanted-library.spec.ts)
- [x] Task: Capture screenshots (public/games/enchanted-library/)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: enchanted-library'

## Phase 5: magic-defense (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] 1 suite, 2 tests, 96.94% coverage (exceeds 80% threshold)
- [x] Task: Props/API validation
    - [x] API routes correct: `/api/v1/games/magic-defense/*`
    - [x] No `any` usage, no lint errors
- [x] Task: Write E2E tests (tests/e2e/games/vocabulary/magic-defense.spec.ts)
- [x] Task: Capture screenshots (public/games/magic-defense/)
- [ ] Task: Conductor - User Manual Verification 'Phase 5: magic-defense'

## Phase 6: paladins-twin-soul (Vocabulary Game)

- [~] Task: Run unit tests and verify coverage
    - [x] Tests executed
    - [ ] 3 failing tests (mock issue - custom hooks not mocked)
    - [x] Coverage: 54.98% - BELOW THRESHOLD (documented as tech debt)
    - Note: Unit test failures due to missing `useDPad` and `useKeyboard` hook mocks
- [x] Task: Props/API validation
    - [x] API routes correct: `/api/v1/games/paladins-twin-soul/*`
    - [x] No `any` usage, no lint errors
- [x] Task: Write E2E tests (tests/e2e/games/vocabulary/paladins-twin-soul.spec.ts)
- [x] Task: Capture screenshots (public/games/paladins-twin-soul/)
- [ ] Task: Conductor - User Manual Verification 'Phase 6: paladins-twin-soul'

## Phase 7: rpg-battle (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="rpg-battle|rpgBattle|RPGBattle" --coverage`
    - [x] Fix any failing unit tests (all pass)
    - [x] Coverage: 92.76% (exceeds 80% threshold)
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/rpg-battle/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix (fixed in page.test.tsx)
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps) - minor warnings only
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/vocabulary/rpg-battle.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Game component renders after vocabulary loads
    - [x] Test: Basic game interaction (start game)
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/rpg-battle/
- [x] Task: Conductor - User Manual Verification 'Phase 7: rpg-battle' (Protocol in workflow.md)

## Phase 8: rune-match (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="rune-match|runeMatch" --coverage`
    - [x] Fix any failing unit tests (all pass)
    - [x] Coverage: 88.35% (exceeds 80% threshold)
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/rune-match/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix (none found)
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps) - minor warning only
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/vocabulary/rune-match.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Game component renders after vocabulary loads
    - [x] Test: Basic game interaction (start game)
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/rune-match/
- [x] Task: Conductor - User Manual Verification 'Phase 8: rune-match' (Protocol in workflow.md)

## Phase 9: wizard-vs-zombie (COMPLETE) (Vocabulary Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="wizard-vs-zombie|wizardZombie" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/wizard-vs-zombie/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/vocabulary/wizard-vs-zombie.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Game component renders after vocabulary loads
    - [x] Test: Basic game interaction (start game)
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/wizard-vs-zombie/
- [x] Task: Conductor - User Manual Verification 'Phase 9: wizard-vs-zombie' (Protocol in workflow.md)

## Phase 10: (COMPLETE) abyssal-well (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="abyssal-well|abyssalWell" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/abyssal-well/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/abyssal-well.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/abyssal-well/
- [x] Task: Conductor - User Manual Verification 'Phase 10: abyssal-well' (Protocol in workflow.md)

## Phase 11: (COMPLETE) castle-defense (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="castle-defense|castleDefense" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/castle-defense/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/castle-defense.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/castle-defense/
- [x] Task: Conductor - User Manual Verification 'Phase 11: castle-defense' (Protocol in workflow.md)

## Phase 12: (COMPLETE) devourer-slime (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="devourer-slime|devourerSlime" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/devourer-slime/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/devourer-slime.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/devourer-slime/
- [x] Task: Conductor - User Manual Verification 'Phase 12: devourer-slime' (Protocol in workflow.md)

## Phase 13: (COMPLETE) dungeon-liberator (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="dungeon-liberator|dungeonLiberator" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/dungeon-liberator/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/dungeon-liberator.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/dungeon-liberator/
- [x] Task: Conductor - User Manual Verification 'Phase 13: dungeon-liberator' (Protocol in workflow.md)

## Phase 14: (COMPLETE) griffin-riders-escape (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="griffin-riders-escape|griffinRidersEscape" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/griffin-riders-escape/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/griffin-riders-escape.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/griffin-riders-escape/
- [x] Task: Conductor - User Manual Verification 'Phase 14: griffin-riders-escape' (Protocol in workflow.md)

## Phase 15: (COMPLETE) griffin-sky-joust (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="griffin-sky-joust|griffinkyJoust" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/griffin-sky-joust/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps) - Note: Known issue with unescaped entities
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/griffin-sky-joust.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/griffin-sky-joust/
- [x] Task: Conductor - User Manual Verification 'Phase 15: griffin-sky-joust' (Protocol in workflow.md)

## Phase 16: (COMPLETE) gryphon-patrol (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="gryphon-patrol|gryphonPatrol" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/gryphon-patrol/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps) - Note: Known issue with unused variables
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/gryphon-patrol.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/gryphon-patrol/
- [x] Task: Conductor - User Manual Verification 'Phase 16: gryphon-patrol' (Protocol in workflow.md)

## Phase 17: (COMPLETE) haunted-library (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="haunted-library|hauntedLibrary" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/haunted-library/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/haunted-library.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/haunted-library/
- [x] Task: Conductor - User Manual Verification 'Phase 17: haunted-library' (Protocol in workflow.md)

## Phase 18: (COMPLETE) labyrinth-goblin-king (Sentence Game)

- [x] Task: Run unit tests and verify coverage
    - [x] Run `npm test -- --testPathPattern="labyrinth-goblin-king|labyrinthGoblinKing" --coverage`
    - [x] Fix any failing unit tests
    - [x] Document coverage gaps if <80%
- [x] Task: Props/API validation
    - [x] Verify page.tsx uses correct API routes `/api/v1/games/labyrinth-goblin-king/*`
    - [x] Verify component props match expected types
    - [x] Check for TypeScript `any` usage and fix
    - [x] Check for lint errors (unescaped entities, unused vars, hook deps)
- [x] Task: Write E2E tests
    - [x] Create tests/e2e/games/sentence/labyrinth-goblin-king.spec.ts
    - [x] Test: Page loads without errors
    - [x] Test: Loading state displays correctly
    - [x] Test: Insufficient sentences warning displays when needed
    - [x] Test: Game component renders after sentences load
- [x] Task: Capture gameplay screenshots
    - [x] Add screenshot capture during E2E test
    - [x] Save to public/games/labyrinth-goblin-king/
- [x] Task: Conductor - User Manual Verification 'Phase 18: labyrinth-goblin-king' (Protocol in workflow.md)

## Phase 19: potion-rush (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="potion-rush|potionRush" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/potion-rush/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps) - Note: Known issue with unused variables
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/potion-rush.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/potion-rush/
- [ ] Task: Conductor - User Manual Verification 'Phase 19: potion-rush' (Protocol in workflow.md)

## Phase 20: realm-carver (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="realm-carver|realmCarver" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/realm-carver/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix - Note: Known issue with `any` usage
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps)
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/realm-carver.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/realm-carver/
- [ ] Task: Conductor - User Manual Verification 'Phase 20: realm-carver' (Protocol in workflow.md)

## Phase 21: rune-forge-chamber (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="rune-forge-chamber|runeForgeChamber" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/rune-forge-chamber/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps)
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/rune-forge-chamber.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/rune-forge-chamber/
- [ ] Task: Conductor - User Manual Verification 'Phase 21: rune-forge-chamber' (Protocol in workflow.md)

## Phase 22: shadow-gate-dungeon (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="shadow-gate-dungeon|shadowGateDungeon" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/shadow-gate-dungeon/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps)
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/shadow-gate-dungeon.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/shadow-gate-dungeon/
- [ ] Task: Conductor - User Manual Verification 'Phase 22: shadow-gate-dungeon' (Protocol in workflow.md)

## Phase 23: spellweavers-run (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="spellweavers-run|spellweaversRun" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/spellweavers-run/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps)
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/spellweavers-run.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/spellweavers-run/
- [ ] Task: Conductor - User Manual Verification 'Phase 23: spellweavers-run' (Protocol in workflow.md)

## Phase 24: squires-gauntlet (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="squires-gauntlet|squiresGauntlet" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/squires-gauntlet/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps)
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/squires-gauntlet.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/squires-gauntlet/
- [ ] Task: Conductor - User Manual Verification 'Phase 24: squires-gauntlet' (Protocol in workflow.md)

## Phase 25: storm-castle-tower (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="storm-castle-tower|stormCastleTower" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/storm-castle-tower/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps) - Note: Known issue with unescaped entities
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/storm-castle-tower.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/storm-castle-tower/
- [ ] Task: Conductor - User Manual Verification 'Phase 25: storm-castle-tower' (Protocol in workflow.md)

## Phase 26: village-guardian (Sentence Game)

- [ ] Task: Run unit tests and verify coverage
    - [ ] Run `npm test -- --testPathPattern="village-guardian|villageGuardian" --coverage`
    - [ ] Fix any failing unit tests
    - [ ] Document coverage gaps if <80%
- [ ] Task: Props/API validation
    - [ ] Verify page.tsx uses correct API routes `/api/v1/games/village-guardian/*`
    - [ ] Verify component props match expected types
    - [ ] Check for TypeScript `any` usage and fix
    - [ ] Check for lint errors (unescaped entities, unused vars, hook deps)
- [ ] Task: Write E2E tests
    - [ ] Create tests/e2e/games/sentence/village-guardian.spec.ts
    - [ ] Test: Page loads without errors
    - [ ] Test: Loading state displays correctly
    - [ ] Test: Insufficient sentences warning displays when needed
    - [ ] Test: Game component renders after sentences load
- [ ] Task: Capture gameplay screenshots
    - [ ] Add screenshot capture during E2E test
    - [ ] Save to public/games/village-guardian/
- [ ] Task: Conductor - User Manual Verification 'Phase 26: village-guardian' (Protocol in workflow.md)
