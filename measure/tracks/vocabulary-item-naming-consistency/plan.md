# Implementation Plan: VocabularyItem vs SentenceItem Naming Consistency

## Phase 1: Griffin Riders Escape
- [x] Task: Read current griffinRidersEscape.ts and identify all VocabularyItem usages.
- [x] Task: Create SentenceItem type (or import from shared location) and replace VocabularyItem.
- [x] Task: Rename variables: vocabulary → sentences where semantically correct.
- [x] Task: Update griffinRidersEscape.test.ts to use SentenceItem.
- [x] Task: Update GriffinRidersEscapeGame.tsx component if it references the type.
- [x] Task: Run tests and verify coverage.
- [x] Task: Commit changes.

## Phase 2: Village Guardian
- [x] Task: Read current villageGuardian.ts and identify all VocabularyItem usages.
- [x] Task: Replace VocabularyItem with SentenceItem.
- [x] Task: Rename variables: vocabulary → sentences where semantically correct.
- [x] Task: Update villageGuardian.test.ts to use SentenceItem.
- [x] Task: Update VillageGuardianGame.tsx component if it references the type.
- [x] Task: Run tests and verify coverage.
- [x] Task: Commit changes.

## Phase 3: Gryphon Patrol
- [ ] Task: Read current gryphonPatrol.ts to understand current string[] sentence approach.
- [ ] Task: Decide whether to introduce SentenceItem typing or keep string[] (document decision).
- [ ] Task: Implement chosen approach.
- [ ] Task: Update gryphonPatrol.test.ts if needed.
- [ ] Task: Update GryphonPatrolGame.tsx component if needed.
- [ ] Task: Run tests and verify coverage.
- [ ] Task: Commit changes.

## Phase 4: Verification & Finalize
- [ ] Task: Run full test suite to confirm no regressions.
- [ ] Task: Run lint on all affected files.
- [ ] Task: Update tracks.md to mark this track complete.
- [ ] Task: Update tech-debt.md to remove resolved item.
- [ ] Task: Final commit and push.
