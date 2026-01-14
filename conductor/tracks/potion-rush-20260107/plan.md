# Plan: Potion Rush

## Phase 1: Infrastructure & Scene Setup
- [ ] Task: Create `PotionRushState` types and configuration (`src/lib/potionRush.ts`).
- [ ] Task: Create `src/app/games/potion-rush` route and game container.
- [ ] Task: Implement the **Game Loop** and basic **React-Konva Stage** setup (Responsive).
- [ ] Task: Register game in Main Menu (using placeholder cover).
- [ ] Conductor - User Manual Verification 'Phase 1: Infrastructure & Scene Setup'

## Phase 2: The Conveyor Belt Engine
- [ ] Task: Implement `ConveyorBelt` component (looping texture + rotating gears).
- [ ] Task: Implement `IngredientBag` spawning logic (carrying Correct vs Distractor words).
- [ ] Task: Implement "Physics" (Bags moving right, wrapping/despawning).
- [ ] Conductor - User Manual Verification 'Phase 2: The Conveyor Belt Engine'

## Phase 3: Gameplay Interaction (The "Rush")
- [ ] Task: Implement **Click-to-Throw** logic (Bag animates to Cauldron).
- [ ] Task: Implement **Correct Answer** logic (Fill meter + Splash + New Sentence).
- [ ] Task: Implement **Incorrect Answer** logic (Reset meter + Explosion effect).
- [ ] Task: Implement **Sentence/Cloze Generation** (Hide 1 word from input data).
- [ ] Conductor - User Manual Verification 'Phase 3: Gameplay Interaction'

## Phase 4: The Threat (Visuals)
- [ ] Task: Implement **Monster Animation** (Idle/Attack states) synced to a timer beat?
- [ ] Task: Implement **Door Damage States** (Changing sprite based on Timer).
- [ ] Task: Implement **Timer** display and Game Over trigger (0s).
- [ ] Conductor - User Manual Verification 'Phase 4: The Threat'

## Phase 5: Polish & Integration
- [ ] Task: Add Screen Shake effect (on Door Hit and Explosion).
- [ ] Task: Implement Victory/Defeat Screens.
- [ ] Task: Integrate XP calculation and `useGameStore`.
- [ ] Task: Final Asset Polish (Replace placeholders with final specs).
- [ ] Conductor - User Manual Verification 'Phase 5: Polish & Integration'
