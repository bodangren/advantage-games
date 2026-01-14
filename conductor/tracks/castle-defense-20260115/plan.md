# Plan: Castle Defense

## Phase 1: Infrastructure & Scene Setup [checkpoint: 6326506]
- [x] Task: Create `CastleDefenseState` types and configuration (`src/lib/castleDefense.ts`).
- [x] Task: Implement `useCastleDefenseStore` for game state management (`src/store/useCastleDefenseStore.ts`).
- [x] Task: Create `src/app/games/castle-defense` route and basic game container.
- [x] Task: Implement **Game Map** with "Road" path and "Tower Slot" foundations using React-Konva.
- [x] Task: Implement **Player Movement** (WASD/Arrows) and sprite rendering.
- [x] Task: Register game in Main Menu (using placeholder cover).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Scene Setup' (Protocol in workflow.md)

## Phase 2: Vocabulary & Collection Engine
- [ ] Task: Implement **Word Spawning** logic (scatter words in the field).
- [ ] Task: Implement **Target Sentence** display and **Progress UI** (Collection Queue).
- [ ] Task: Implement **Word Collection** logic (Walking over words adds to queue).
- [ ] Task: Implement **Tower Activation Trigger**: Proximity check to Tower Slots.
- [ ] Task: Implement **Activation Success/Failure Logic**: 
    - Success: Build tower.
    - Failure: "Erupt" words back to random field positions.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Vocabulary & Collection Engine' (Protocol in workflow.md)

## Phase 3: Enemy Waves & Base Health
- [ ] Task: Implement **Enemy Pathing** (Enemies follow the fixed road path).
- [ ] Task: Implement **Wave Spawning** logic (Soldiers and periodic Bosses).
- [ ] Task: Implement **Base Health** and **Damage** logic (Enemies reaching the end of the road).
- [ ] Task: Implement **Game Over** state when hearts reach zero.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Enemy Waves & Base Health' (Protocol in workflow.md)

## Phase 4: Combat System
- [ ] Task: Implement **Tower Shooting** logic (Find nearest enemy in range, fire projectile).
- [ ] Task: Implement **Projectile Physics** (Track target, collision detection).
- [ ] Task: Implement **Enemy Health & Death** logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Combat System' (Protocol in workflow.md)

## Phase 5: Visuals & Polish
- [ ] Task: Replace placeholders with final assets (Castle, Soldiers, Bosses, Player).
- [ ] Task: Add "Juice": Screen shake on word eruption, impact effects, and animations.
- [ ] Task: Integrate XP calculation and `useGameStore`.
- [ ] Task: Implement Victory/Defeat screens.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Polish & Integration' (Protocol in workflow.md)
