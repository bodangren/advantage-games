# Implementation Plan - RPG Battle Vocabulary Game

This plan outlines the steps to build a 2D side-view turn-based RPG vocabulary game. The development follows a Test-Driven Development (TDD) approach, focusing on a robust state machine and a responsive user interface.

## Phase 1: Game State & Core Logic
Focuses on defining the state machine and turn-based mechanics using Zustand.

- [x] Task: Define `RPGBattleStore` state and types (Zustand). (bef34fd)
- [x] Task: Implement `useRPGBattleStore` actions for turn management (Player/Enemy turn transitions). (d460fdb)
- [ ] Task: Implement health management logic (damage calculation and death checks).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Game State & Core Logic' (Protocol in workflow.md)

## Phase 2: UI Foundation & Components
Creating the visual structure and individual UI elements.

- [ ] Task: Create the `BattleScene` layout (2D side-view container).
- [ ] Task: Implement the `HealthBar` component with animated health changes.
- [ ] Task: Implement the `ActionMenu` component with the typing input field.
- [ ] Task: Implement the `BattleLog` component to track combat history.
- [ ] Task: Create simple sprites/placeholders for Player and Enemy using the 3×3 grid layout.
- [ ] Task: Implement a `Sprite` component that handles UV mapping/positioning for the 3×3 pose sheet and supports horizontal flipping.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Foundation & Components' (Protocol in workflow.md)

## Phase 3: Combat Mechanics & Vocabulary Integration
Wiring the typing logic and word difficulty mapping into the battle system.

- [ ] Task: Implement the word selection algorithm (mapping known/new words to attack power).
- [ ] Task: Implement typing verification logic with the 2-second error feedback loop.
- [ ] Task: Implement pose-switching logic (e.g., switch to 'Hurt' on damage, 'Attack' on success).
- [ ] Task: Implement enemy AI (simple automated attack logic during enemy turn).
- [ ] Task: Add attack animations and screen shake effects using Framer Motion.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Combat Mechanics & Vocabulary Integration' (Protocol in workflow.md)

## Phase 4: XP, Results & App Integration
Finalizing the game loop and connecting it to the main application.

- [ ] Task: Implement XP calculation logic based on efficiency and streaks.
- [ ] Task: Create the `BattleResults` screen (Victory/Defeat summary).
- [ ] Task: Integrate the RPG Battle game into the Next.js app router (`/games/rpg-battle`).
- [ ] Task: Add final polish (sound effects, transitions, responsive fixes).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: XP & Finalization' (Protocol in workflow.md)
