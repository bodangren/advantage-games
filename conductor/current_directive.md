# Current Directive

## Status: IN PROGRESS

## Active Track: Live Content Rotation and Pack Management

### Phase 1: Schema and Validation - COMPLETE
- Created contentPackSchema.ts with v1-legacy and v2 format support
- Types: ContentPackMetadata, VocabularyItem, PackFormat, ContentPackValidationResult
- Validation: detectPackFormat, validateVocabularyItem, validateContentPackMetadata, validateContentPack
- Tests: 36 tests with 94.33% coverage

### Phase 2: Rotation Workflow - COMPLETE
- [x] Implement pack selection/rotation controls
  - RotationManager with setActivePacks, addActivePack, removeActivePack, rollback
  - 26 tests with full coverage
- [x] Verify game integration with rotated packs
  - WizardZombie tests pass, vocabularyRoute tests pass
- [x] Document weekly rotation runbook
  - docs/rotation-runbook.md created

### User Manual Verification (Phase 2)
- [ ] Conductor - User Manual Verification 'Phase 2: Rotation Workflow'

## Completed Tracks (Recent)
- Shared Accessibility and Input Assist Layer (2026-04-11)
- XP Leaderboard & Session History (2026-04-09)
