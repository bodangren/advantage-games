# Plan: Reading Advantage Games Migration

## Pre-Implementation Checklist

Before starting, ensure:
1. Reading-advantage repo is available at `../reading-advantage/`
2. Current tests pass: `CI=true npm test`
3. Current build succeeds: `CI=true npm run build`

---

## Phase 1: Infrastructure Setup

### Task 1.1: Create directory structure
- [x] Sub-task: Create `src/app/games/vocabulary/`
- [x] Sub-task: Create `src/app/games/sentence/`
- [x] Sub-task: Create `src/app/api/v1/games/`
- [x] Sub-task: Create `src/components/games/vocabulary/`
- [x] Sub-task: Create `src/components/games/sentence/`
- [x] Sub-task: Create `src/components/games/game/`
- [x] Sub-task: Create `src/lib/games/`
- [x] Sub-task: Create `src/hooks/`
- [x] Sub-task: Create `src/locales/`
- [x] Sub-task: Verify directories exist with `ls -la`
- [x] **Commit**: "chore: create reading-advantage-compatible directory structure"

### Task 1.2: Create i18n stubs
- [x] Sub-task: Create `src/locales/en.ts` with extracted UI strings from games page
- [x] Sub-task: Create `src/locales/client.ts` exporting useScopedI18n, useCurrentLocale
- [x] Sub-task: Create `src/hooks/useScopedI18n.ts` - returns key lookup function
- [x] Sub-task: Create `src/hooks/useCurrentLocale.ts` - returns 'en'
- [x] Sub-task: Write tests in `src/locales/client.test.ts`
- [x] Sub-task: Run tests: `CI=true npm test src/locales/`
- [x] **Commit**: "feat: add i18n stub infrastructure"

### Task 1.3: Create session stub
- [x] Sub-task: Create `src/hooks/useSession.ts` returning mock session
- [x] Sub-task: Write tests in `src/hooks/useSession.test.ts`
- [x] Sub-task: Run tests: `CI=true npm test src/hooks/useSession.test.ts`
- [x] **Commit**: "feat: add useSession stub for reading-advantage compatibility"

### Task 1.4: Update useGameStore
- [x] Sub-task: Add `missedWords: VocabularyItem[]` to state
- [x] Sub-task: Add `combo: number` to state
- [x] Sub-task: Add `mana: number` to state
- [x] Sub-task: Add `Difficulty` type with 'extreme' option
- [x] Sub-task: Add `addMissedWord`, `incrementCombo`, `resetCombo`, `addMana`, `spendMana` actions
- [x] Sub-task: Update existing tests for new fields
- [x] Sub-task: Run tests: `CI=true npm test src/store/`
- [x] **Commit**: "feat: extend useGameStore with reading-advantage features"

- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure Setup' (Protocol in workflow.md)

---

## Phase 2: Import Shared Components

### Task 2.1: Import shared game components
- [x] Sub-task: Copy `reading-advantage/web/components/games/game/*` to `src/components/games/game/`
- [x] Sub-task: Review and update any reading-advantage-specific imports
- [x] Sub-task: Copy associated test files
- [x] Sub-task: Run tests: `CI=true npm test src/components/games/game/`
- [x] **Commit**: "feat: import shared game screen components from reading-advantage"

### Task 2.2: Import shared UI components (if needed)
- [x] Sub-task: Compare `reading-advantage/web/components/games/ui/` with `src/components/ui/`
- [x] Sub-task: Copy any missing components
- [x] Sub-task: Copy associated test files
- [x] Sub-task: Run tests: `CI=true npm test src/components/ui/`
- [x] **Commit**: "feat: import additional UI components from reading-advantage"

- [x] Task: Conductor - User Manual Verification 'Phase 2: Import Shared Components' (Protocol in workflow.md)

---

## Phase 3: Import Vocabulary Games

### Task 3.1: Import dragon-flight
- [ ] Sub-task: Copy `reading-advantage/web/app/[locale]/(student)/student/games/vocabulary/dragon-flight/` to `src/app/games/vocabulary/dragon-flight/`
- [ ] Sub-task: Copy `reading-advantage/web/components/games/vocabulary/dragon-flight/` to `src/components/games/vocabulary/dragon-flight/`
- [ ] Sub-task: Copy `reading-advantage/web/lib/games/dragonFlight*.ts` to `src/lib/games/`
- [ ] Sub-task: Update navigation links: `/student/games` → `/games`
- [ ] Sub-task: Update imports to use local paths
- [ ] Sub-task: Create `src/app/api/v1/games/dragon-flight/vocabulary/route.ts`
- [ ] Sub-task: Create `src/app/api/v1/games/dragon-flight/complete/route.ts`
- [ ] Sub-task: Copy test files and update imports
- [ ] Sub-task: Run tests: `CI=true npm test -- dragon-flight`
- [ ] Sub-task: Manual test: game loads and plays
- [ ] **Commit**: "feat: import dragon-flight from reading-advantage"

### Task 3.2: Import dragon-rider
- [ ] Sub-task: Copy page to `src/app/games/vocabulary/dragon-rider/`
- [ ] Sub-task: Copy components to `src/components/games/vocabulary/dragon-rider/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import dragon-rider from reading-advantage"

### Task 3.3: Import enchanted-library
- [ ] Sub-task: Copy page to `src/app/games/vocabulary/enchanted-library/`
- [ ] Sub-task: Copy components to `src/components/games/vocabulary/enchanted-library/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import enchanted-library from reading-advantage"

### Task 3.4: Import magic-defense
- [ ] Sub-task: Copy page to `src/app/games/vocabulary/magic-defense/`
- [ ] Sub-task: Copy components to `src/components/games/vocabulary/magic-defense/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import magic-defense from reading-advantage"

### Task 3.5: Import rpg-battle
- [ ] Sub-task: Copy page to `src/app/games/vocabulary/rpg-battle/`
- [ ] Sub-task: Copy components to `src/components/games/vocabulary/rpg-battle/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import rpg-battle from reading-advantage"

### Task 3.6: Import rune-match
- [ ] Sub-task: Copy page to `src/app/games/vocabulary/rune-match/`
- [ ] Sub-task: Copy components to `src/components/games/vocabulary/rune-match/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import rune-match from reading-advantage"

### Task 3.7: Import wizard-vs-zombie
- [ ] Sub-task: Copy page to `src/app/games/vocabulary/wizard-vs-zombie/`
- [ ] Sub-task: Copy components to `src/components/games/vocabulary/wizard-vs-zombie/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import wizard-vs-zombie from reading-advantage"

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Import Vocabulary Games' (Protocol in workflow.md)

---

## Phase 4: Import Sentence Games

### Task 4.1: Import castle-defense
- [ ] Sub-task: Copy page to `src/app/games/sentence/castle-defense/`
- [ ] Sub-task: Copy components to `src/components/games/sentence/castle-defense/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create `src/app/api/v1/games/castle-defense/sentences/route.ts`
- [ ] Sub-task: Create `src/app/api/v1/games/castle-defense/complete/route.ts`
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import castle-defense from reading-advantage"

### Task 4.2: Import potion-rush
- [ ] Sub-task: Copy page to `src/app/games/sentence/potion-rush/`
- [ ] Sub-task: Copy components to `src/components/games/sentence/potion-rush/`
- [ ] Sub-task: Copy lib files to `src/lib/games/`
- [ ] Sub-task: Update navigation and imports
- [ ] Sub-task: Create mock API routes (sentences, complete)
- [ ] Sub-task: Copy and update tests
- [ ] Sub-task: Run tests and manual verify
- [ ] **Commit**: "feat: import potion-rush from reading-advantage"

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Import Sentence Games' (Protocol in workflow.md)

---

## Phase 5: Port dungeon-liberator

### Task 5.1: Restructure dungeon-liberator page
- [ ] Sub-task: Create `src/app/games/vocabulary/dungeon-liberator/`
- [ ] Sub-task: Create page.tsx with reading-advantage patterns (API fetch, i18n)
- [ ] Sub-task: Create `src/app/api/v1/games/dungeon-liberator/vocabulary/route.ts`
- [ ] Sub-task: Create `src/app/api/v1/games/dungeon-liberator/complete/route.ts`
- [ ] Sub-task: Update navigation: `/games/` → `/games/`
- [ ] **Commit**: "feat: create dungeon-liberator page with reading-advantage structure"

### Task 5.2: Restructure dungeon-liberator components
- [ ] Sub-task: Create `src/components/games/vocabulary/dungeon-liberator/`
- [ ] Sub-task: Move DungeonLiberatorGame.tsx to new location
- [ ] Sub-task: Add GameStartScreen wrapper
- [ ] Sub-task: Add GameEndScreen wrapper
- [ ] Sub-task: Update imports
- [ ] **Commit**: "feat: restructure dungeon-liberator components"

### Task 5.3: Move dungeon-liberator lib
- [ ] Sub-task: Move `src/lib/dungeonLiberator.ts` to `src/lib/games/dungeonLiberator.ts`
- [ ] Sub-task: Update all imports
- [ ] Sub-task: Move tests to `src/lib/games/dungeonLiberator.test.ts`
- [ ] Sub-task: Run tests: `CI=true npm test -- dungeon-liberator`
- [ ] **Commit**: "feat: move dungeon-liberator lib to games directory"

### Task 5.4: Add dungeon-liberator to game cards
- [ ] Sub-task: Update `src/lib/gameCards.ts` with new path
- [ ] Sub-task: Add cover image if needed
- [ ] Sub-task: Manual test from main menu
- [ ] **Commit**: "feat: add dungeon-liberator to game cards"

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Port dungeon-liberator' (Protocol in workflow.md)

---

## Phase 6: Update Main Menu & Cleanup

### Task 6.1: Update main menu
- [ ] Sub-task: Update `src/app/page.tsx` with new game paths
- [ ] Sub-task: Update `src/lib/gameCards.ts` with vocabulary/sentence structure
- [ ] Sub-task: Ensure all game cards link to correct paths
- [ ] Sub-task: Manual test all links work
- [ ] **Commit**: "feat: update main menu for new game structure"

### Task 6.2: Remove old flat-structure pages
- [ ] Sub-task: Delete `src/app/games/castle-defense/` (old flat)
- [ ] Sub-task: Delete `src/app/games/dragon-flight/` (old flat)
- [ ] Sub-task: Delete `src/app/games/dragon-rider/` (old flat)
- [ ] Sub-task: Delete `src/app/games/dungeon-liberator/` (old flat)
- [ ] Sub-task: Delete `src/app/games/enchanted-library/` (old flat)
- [ ] Sub-task: Delete `src/app/games/magic-defense/` (old flat)
- [ ] Sub-task: Delete `src/app/games/potion-rush/` (old flat)
- [ ] Sub-task: Delete `src/app/games/rpg-battle/` (old flat)
- [ ] Sub-task: Delete `src/app/games/rune-match/` (old flat)
- [ ] Sub-task: Delete `src/app/games/wizard-vs-zombie/` (old flat)
- [ ] **Commit**: "chore: remove old flat-structure game pages"

### Task 6.3: Remove old flat-structure components
- [ ] Sub-task: Delete `src/components/castle-defense/`
- [ ] Sub-task: Delete `src/components/dragon-flight/`
- [ ] Sub-task: Delete `src/components/dragon-rider/`
- [ ] Sub-task: Delete `src/components/dungeon-liberator/`
- [ ] Sub-task: Delete `src/components/enchanted-library/`
- [ ] Sub-task: Delete `src/components/potion-rush/`
- [ ] Sub-task: Delete `src/components/rpg-battle/`
- [ ] Sub-task: Delete `src/components/rune-match/`
- [ ] Sub-task: Delete `src/components/wizard-vs-zombie/`
- [ ] Sub-task: Delete `src/components/game/` (old shared, replaced by games/game/)
- [ ] **Commit**: "chore: remove old flat-structure game components"

### Task 6.4: Remove old flat-structure lib files
- [ ] Sub-task: Delete `src/lib/castleDefense.ts`
- [ ] Sub-task: Delete `src/lib/dragonFlight.ts`
- [ ] Sub-task: Delete `src/lib/dragonRider.ts`
- [ ] Sub-task: Delete `src/lib/dungeonLiberator.ts`
- [ ] Sub-task: Delete `src/lib/enchantedLibrary.ts`
- [ ] Sub-task: Delete `src/lib/potionRushEffects.ts`
- [ ] Sub-task: Delete `src/lib/rpgBattleScaling.ts`
- [ ] Sub-task: Delete `src/lib/rpgBattleSelection.ts`
- [ ] Sub-task: Delete `src/lib/gameCards.ts` (moved if needed)
- [ ] Sub-task: Delete `src/lib/vocabLoader.ts` (replaced by API)
- [ ] **Commit**: "chore: remove old flat-structure lib files"

### Task 6.5: Final verification
- [ ] Sub-task: Run full test suite: `CI=true npm test`
- [ ] Sub-task: Run build: `CI=true npm run build`
- [ ] Sub-task: Manual test all 10 games load and play
- [ ] Sub-task: Verify no console errors
- [ ] **Commit**: "test: verify migration complete"

- [ ] Task: Conductor - User Manual Verification 'Phase 6: Update Main Menu & Cleanup' (Protocol in workflow.md)

---

## Summary

**Track Goals:**
1. Match reading-advantage directory structure (vocabulary/sentence split)
2. Create mock API routes for data loading
3. Add i18n and session stubs
4. Import 9 games from reading-advantage
5. Port dungeon-liberator to new structure
6. Remove old flat-structure code

**Task Counts:**
- Phase 1: 4 tasks (Infrastructure)
- Phase 2: 2 tasks (Shared Components)
- Phase 3: 7 tasks (Vocabulary Games)
- Phase 4: 2 tasks (Sentence Games)
- Phase 5: 4 tasks (Port dungeon-liberator)
- Phase 6: 5 tasks (Cleanup)
- **Total: 24 tasks**

**Quality Gates:**
- All tests pass after each task
- Build succeeds after each phase
- Manual verification required for each phase
- No console errors
