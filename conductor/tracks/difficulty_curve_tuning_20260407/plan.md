# Implementation Plan: Unified Difficulty Curves and Spawn Tuning

## Phase 1: Baseline and Model Definition

- [x] Task: Inventory difficulty knobs in active games.
  - [x] Identify spawn-rate, speed, health, and score multipliers per game.
  - [x] Capture current defaults in a single matrix.
- [x] Task: Define shared curve tiers.
  - [x] Specify tier thresholds and parameter ranges.
  - [x] Document fallback defaults for missing values.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Baseline and Model Definition' (Protocol in workflow.md)

## Phase 2: Integrate and Validate

- [ ] Task: Apply curve presets to representative games.
  - [ ] Update one vocabulary game configuration.
  - [ ] Update one sentence game configuration.
- [ ] Task: Add regression checks.
  - [ ] Add tests/assertions for parameter bounds and deterministic behavior.
  - [ ] Run targeted game tests and smoke checks.
- [ ] Task: Publish tuning playbook for future tracks.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integrate and Validate' (Protocol in workflow.md)

