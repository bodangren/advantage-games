# Implementation Plan: Potion Rush Gameplay Refinements

This plan outlines the refactoring and enhancement of Potion Rush gameplay mechanics, focusing on word spawning, cauldron management, and the reputation system.

## Phase 1: Logic & State Refactoring [checkpoint: fa256dc]
**Goal:** Update the Zustand store to handle the new word pool logic, reputation score, and dynamic belt speed.

- [x] **Task 1.1: Update State Interfaces** [e253d3b]
    - [x] Modify `PotionRushState` to replace `lives` with `reputation` (0-100).
    - [x] Add `baseBeltSpeed` and `completedSentences` to track progression.
    - [x] Add `activeWordPool` to store words from current customers.
- [x] **Task 1.2: Refactor `spawnCustomer` & `activeWordPool`** [e253d3b]
    - [x] Update `spawnCustomer` to append the words of the new request to `activeWordPool`.
    - [x] Implement a helper to remove words from `activeWordPool` when a customer is served or leaves.
- [x] **Task 1.3: Implement Dynamic Speed Logic** [e253d3b]
    - [x] Update `handleServeCustomer` to increment `completedSentences`.
    - [x] Update `tick` or a selector to calculate `currentSpeed` based on `baseBeltSpeed * (1.1 ^ completedSentences)`.
- [x] **Task 1.4: Reputation & Penalty Logic** [e253d3b]
    - [x] Update `tick` to reduce `reputation` by 25 when a customer leaves angry.
    - [x] Trigger game over when `reputation <= 0`.
- [x] **Task 1.5: Write Unit Tests for Store Logic** [e253d3b]
    - [x] Test `activeWordPool` updates on customer spawn/despawn.
    - [x] Test reputation decrease and game over trigger.
    - [x] Test speed increment calculation.

- [x] Task: Conductor - User Manual Verification 'Phase 1: Logic & State Refactoring' (Protocol in workflow.md) [fa256dc]

## Phase 2: Refined Spawning & Cauldron Reset
**Goal:** Implement the intelligent word spawner and the cauldron-to-trash drag logic.

- [x] **Task 2.1: Intelligent `spawnIngredient`** [1668788]
    - [x] Modify `spawnIngredient` to pick words only from `activeWordPool`.
    - [x] Ensure it handles cases where `activeWordPool` is empty (e.g., no customers).
- [x] **Task 2.2: Cauldron Reset Logic** [77ec302]
    - [x] Update `handleDumpCauldron` (or create a new action) specifically for resetting from the trash.
    - [x] Update `CauldronStation.tsx` to allow dragging a "WARNING" or "BREWING" cauldron to the trash.
- [x] **Task 2.3: Write Tests for Spawning and Reset** [77ec302]
    - [x] Verify `spawnIngredient` only pulls from the pool.
    - [x] Verify `handleDumpCauldron` resets state to `IDLE` immediately.

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refined Spawning & Cauldron Reset' (Protocol in workflow.md)

## Phase 3: HUD & Visual Feedback
**Goal:** Update the UI to reflect reputation and sentence progress, and add the red flash/shake effects.

- [ ] **Task 3.1: Sentence Progress Display**
    - [ ] Update `CauldronStation.tsx` to display the `targetSentence` words below the cauldron, highlighting those in `currentWords`.
- [ ] **Task 3.2: Reputation HUD**
    - [ ] Update `PotionRushGame.tsx` HUD to display "Reputation" as a percentage.
- [ ] **Task 3.3: Penalty Effects (Flash/Shake)**
    - [ ] Create a `ScreenEffect` component or update `PotionRushEffectsLayer.tsx`.
    - [ ] Add a state trigger for `lastPenaltyTime`.
    - [ ] Use `framer-motion` to trigger a red flash or camera shake when `reputation` drops.
- [ ] **Task 3.4: Manual UI Verification**
    *   Verify HUD labels.
    *   Verify sentence text visibility below cauldrons.

- [ ] Task: Conductor - User Manual Verification 'Phase 3: HUD & Visual Feedback' (Protocol in workflow.md)

## Phase 4: Final Balancing & Polish
**Goal:** Apply the 50% speed reduction and perform final integration tests.

- [ ] **Task 4.1: Adjust Base Constants**
    - [ ] Set default `beltSpeed` to 50% of the original value.
    - [ ] Ensure fixed interval spawning matches the slower belt speed for good pacing.
- [ ] **Task 4.2: Integration Testing**
    - [ ] Playtest full loops to ensure the 10% speed increase per sentence feels balanced.
    - [ ] Verify right-to-left flow is consistent.

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Balancing & Polish' (Protocol in workflow.md)
