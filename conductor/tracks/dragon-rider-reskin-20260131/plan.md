# Implementation Plan: Dragon Rider Reskin

## Phase 1: Foundation - Core Game Logic

### Task 1.1: Create dragonRider game logic module
- [x] Copy `src/lib/dragonFlight.ts` to `src/lib/dragonRider.ts`
- [x] Update type names: `DragonFlightResults` → `DragonRiderResults`
- [x] Update function names: `calculateDragonFlightXP` → `calculateDragonRiderXP`
- [x] Update comments and documentation to reference "Dragon Rider"
- [x] **Test**: All type exports work correctly
- [x] **Commit**: "feat(dragon-rider): add core game logic module"

### Task 1.2: Create dragonRider logic tests
- [x] Copy `src/lib/dragonFlight.test.ts` to `src/lib/dragonRider.test.ts`
- [x] Update imports to use `dragonRider` module
- [x] Update test descriptions to reference "Dragon Rider"
- [x] **Test**: Run `npm test -- dragonRider.test.ts` - all tests pass
- [x] **Coverage**: Verify >80% coverage for dragonRider.ts
- [x] **Commit**: "test(dragon-rider): add game logic tests"

## Phase 2: React Components

### Task 2.1: Create DragonRiderGame component
- [x] Copy `src/components/dragon-flight/DragonFlightGame.tsx` to `src/components/dragon-rider/DragonRiderGame.tsx`
- [x] Update component name: `DragonFlightGame` → `DragonRiderGame`
- [x] Update asset paths to `/games/dragon-rider/` directory
- [x] Update sprite references for new asset orientations:
  - Player: Use `player-3x3-sheet-facing-camera.png`
  - Army: Use `dragon-army-3x3-sheet-facing-up.png`
  - Boss: Use `boss-3x3-sheet-facing-up.png`
  - Gates: Use `gates-3x3-sheet-facing-up.png`
  - Parallax: Use new parallax-*.png files
- [x] Update imports to use `dragonRider` logic module
- [x] **Test**: Component exports correctly
- [x] **Commit**: "feat(dragon-rider): add DragonRiderGame component"

### Task 2.2: Create DragonRiderGame component tests
- [x] Copy `src/components/dragon-flight/DragonFlightGame.test.tsx` to `src/components/dragon-rider/DragonRiderGame.test.tsx`
- [x] Update imports to use DragonRiderGame component
- [x] Update test descriptions to reference "Dragon Rider"
- [x] **Test**: Run `npm test -- DragonRiderGame.test.tsx` - all tests pass
- [x] **Coverage**: Verify >80% coverage for DragonRiderGame.tsx
- [x] **Commit**: "test(dragon-rider): add component tests"

## Phase 3: Page Route

### Task 3.1: Create dragon-rider page component
- [x] Copy `src/app/games/dragon-flight/page.tsx` to `src/app/games/dragon-rider/page.tsx`
- [x] Update component name to `DragonRiderPage`
- [x] Update imports to use DragonRiderGame component
- [x] Update title: "Dragon Flight" → "Dragon Rider"
- [x] Update description to reflect dragon rider theme
- [x] Update vocabulary loading: `loadVocabulary('dragon-flight')` → `loadVocabulary('dragon-rider')`
- [x] Update type imports: `DragonFlightResults` → `DragonRiderResults`
- [x] **Test**: Page exports correctly
- [x] **Commit**: "feat(dragon-rider): add game page route"

### Task 3.2: Create page component tests
- [x] Copy `src/app/games/dragon-flight/page.test.tsx` to `src/app/games/dragon-rider/page.test.tsx`
- [x] Update imports to reference dragon-rider page
- [x] Update test descriptions to reference "Dragon Rider"
- [x] **Test**: Run `npm test -- games/dragon-rider/page.test.tsx` - all tests pass
- [x] **Coverage**: Verify >80% coverage for dragon-rider page.tsx
- [x] **Commit**: "test(dragon-rider): add page tests"

## Phase 4: Integration & Verification

### Task 4.1: Full test suite verification
- [ ] Run complete test suite: `npm test`
- [ ] Verify all tests pass (existing + new)
- [ ] Verify overall code coverage remains >80%
- [ ] Fix any failing tests
- [ ] **Test**: `npm test` - zero failures
- [ ] **Commit**: "test(dragon-rider): verify full test suite"

### Task 4.2: Manual testing and visual verification
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `/games/dragon-rider`
- [ ] Verify page loads without errors
- [ ] Verify all dragon-rider assets display correctly:
  - Player sprite (facing camera)
  - Dragon army sprites (facing up)
  - Boss sprite (facing up)
  - Gates (facing up)
  - Parallax backgrounds (all three layers)
  - Loading screen background
- [ ] Play through a complete game session
- [ ] Verify vocabulary questions load correctly
- [ ] Verify XP calculation and results tracking
- [ ] Test on mobile viewport (responsive behavior)
- [ ] **Test**: Game plays identically to Dragon Flight
- [ ] **Commit**: "chore(dragon-rider): manual testing complete"

### Task 4.3: Final cleanup
- [ ] Review all code for consistency
- [ ] Remove any leftover "dragon-flight" references in dragon-rider code
- [ ] Verify no console errors or warnings
- [ ] Update conductor plan status
- [ ] **Test**: Final review passes
- [ ] **Commit**: "chore(dragon-rider): final cleanup and polish"

## Task Summary
- **Phase 1**: 2 tasks - Core game logic foundation
- **Phase 2**: 2 tasks - React components
- **Phase 3**: 2 tasks - Page routing
- **Phase 4**: 3 tasks - Integration and verification
- **Total**: 9 tasks

## Quality Gates
- All tests must pass before moving to next phase
- Code coverage must remain >80%
- No console errors or warnings
- Manual testing confirms visual and functional parity with Dragon Flight
