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
- [x] Run complete test suite: `npm test`
- [x] Verify all tests pass (existing + new)
- [x] Verify overall code coverage remains >80%
- [x] Fix any failing tests
- [x] **Test**: `npm test` - zero failures
- [x] **Commit**: "test(dragon-rider): verify full test suite"

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

## Phase 5: Gameplay Adjustments

### Task 5.1: Fix sprite orientations
- [ ] Flip player sprite vertically (currently upside down)
  - Update scaleY for player sprite in DragonRiderCanvas
  - Change from `-layout.playerScale` to `layout.playerScale`
- [ ] Flip dragon army sprites vertically (currently upside down)
  - Update scaleY for army sprites in DragonRiderCanvas
  - Change from `-layout.armyScale` to `layout.armyScale`
- [ ] **Test**: Visual verification - sprites render correctly
- [ ] **Commit**: "fix(dragon-rider): correct player and army sprite orientations"

### Task 5.2: Extend game duration
- [ ] Change default duration from 30 seconds to 2.5 minutes (150000ms)
  - Update DEFAULT_DURATION_MS constant in dragonRider.ts
  - Update default prop in DragonRiderGame component
- [ ] Update tests to work with new duration
- [ ] **Test**: Run `npm test -- dragonRider` - all tests pass
- [ ] **Commit**: "feat(dragon-rider): extend game duration to 2.5 minutes"

### Task 5.3: Redesign boss battle mechanics
- [ ] Add collision/proximity detection before boss starts attacking
  - Implement distance calculation between boss and player/army
  - Boss only starts battle when within collision range
- [ ] Add boss health meter UI
  - Display boss health bar on screen during battle
  - Show remaining boss health visually
- [ ] Slow down boss battle sequence
  - Increase BOSS_HEALTH_TICK_MS from 450ms to reduce battle speed
  - Add tension and give player time to assess their chances
- [ ] Update boss battle state management
  - Track boss battle started/not started state
  - Trigger battle start on collision/proximity
- [ ] **Test**: Visual verification and gameplay testing
- [ ] **Commit**: "feat(dragon-rider): redesign boss battle with proximity trigger and health meter"

### Task 5.4: Increase difficulty/victory threshold
- [ ] Analyze current difficulty with 2.5 minute duration
  - Current: bossPower = max(3, ceil(attempts × 0.6))
  - With ~90-120 attempts in 2.5min, boss power = 54-72
  - Current requires 60% accuracy to win
- [ ] Increase difficulty multiplier
  - Change from 0.6 to 0.75 or 0.8 to require 75-80% accuracy
  - Or add minimum boss power threshold (e.g., max(50, ceil(attempts × 0.6)))
- [ ] Update tests with new victory calculations
- [ ] **Test**: Run full test suite
- [ ] **Commit**: "feat(dragon-rider): increase difficulty threshold for victory"

### Task 5.5: Integration testing of gameplay changes
- [ ] Run complete test suite
- [ ] Verify all tests pass with new mechanics
- [ ] Manual gameplay testing
  - Verify sprites render correctly
  - Verify 2.5 minute duration feels appropriate
  - Verify boss battle triggers on proximity
  - Verify boss health meter displays correctly
  - Verify difficulty feels challenging but fair
- [ ] **Test**: Complete playthrough
- [ ] **Commit**: "test(dragon-rider): verify gameplay adjustments"

## Task Summary
- **Phase 1**: 2 tasks - Core game logic foundation
- **Phase 2**: 2 tasks - React components
- **Phase 3**: 2 tasks - Page routing
- **Phase 4**: 3 tasks - Integration and verification
- **Phase 5**: 5 tasks - Gameplay adjustments
- **Total**: 14 tasks

## Quality Gates
- All tests must pass before moving to next phase
- Code coverage must remain >80%
- No console errors or warnings
- Manual testing confirms sprites render correctly
- Boss battle mechanics feel tense and engaging
- Difficulty is challenging but achievable
