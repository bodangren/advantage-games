# Implementation Plan: Live Content Rotation and Pack Management

## Phase 1: Schema and Validation

- [x] Task: Define content-pack schema and IDs.
  - [x] Specify required fields and validation rules.
  - [x] Document versioning and deprecation rules.
- [x] Task: Implement pack validation utilities.
  - [x] Add tests for valid and invalid pack shapes.
  - [x] Add failure messages for missing critical fields.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Schema and Validation' (Protocol in workflow.md)

## Phase 2: Rotation Workflow

- [ ] Task: Implement pack selection/rotation controls.
  - [ ] Add logic to choose active packs.
  - [ ] Add rollback path to previous stable pack set.
- [ ] Task: Verify game integration with rotated packs.
  - [ ] Run targeted loading and gameplay smoke checks.
  - [ ] Confirm no regressions in completion/ranking flows.
- [ ] Task: Document weekly rotation runbook.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Rotation Workflow' (Protocol in workflow.md)

