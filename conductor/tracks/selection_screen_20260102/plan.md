# Implementation Plan - RPG Battle Selection Scene

This plan adds a mandatory pre-battle selection flow for hero, location, and enemy, and applies enemy multipliers to HP, damage range, and XP.

## Phase 1: Data Model & Selection State
- [x] Task: Define selection configuration for heroes, locations, and enemies (labels, assets, multipliers). [commit: e3bc010]
- [x] Task: Extend RPGBattle store to track selection step state and enforce the selection order. [commit: 39577c5]
- [x] Task: Reset selection state on battle start/rematch. [commit: 38f0ba3]
- [x] Task: Add unit tests for selection state transitions and resets. [commit: 38f0ba3]
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Model & Selection State' (Protocol in workflow.md)

## Phase 2: Selection UI (Modal Flow)
- [ ] Task: Build modal-based selection UI for hero, location, and enemy.
- [ ] Task: Gate battle start until all selections are confirmed; no back navigation.
- [ ] Task: Add component tests for selection UI behavior (step locking and confirmation).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Selection UI' (Protocol in workflow.md)

## Phase 3: Enemy Scaling (HP, Damage, XP)
- [ ] Task: Apply enemy multiplier to base enemy HP and initialize scaled current/max values.
- [ ] Task: Update enemy damage calculation to scale the upper bound by the multiplier.
- [ ] Task: Multiply base XP by the enemy multiplier and round to nearest integer.
- [ ] Task: Add unit tests for HP scaling, damage range scaling, and XP scaling.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Enemy Scaling' (Protocol in workflow.md)

## Phase 4: Backgrounds & Responsive Behavior
- [ ] Task: Wire location selection to background assets.
- [ ] Task: Ensure mobile portrait view uses a centered background slice (center-crop).
- [ ] Task: Add UI tests for background selection mapping (desktop + mobile styles where feasible).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Backgrounds & Responsive Behavior' (Protocol in workflow.md)
