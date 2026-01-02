# Plan: Magic Defense Refactor

## Phase 1: Structural Refactor [checkpoint: 211b45c]
- [x] Task: Create `src/app/games/magic-defense` and move game components [commit: 6ec4b3a]
- [x] Task: Create Main Menu page with navigation to Magic Defense [commit: 2d118de]
- [x] Task: Update `useGameStore` to support game resets and navigation [commit: 36e1430]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Structural Refactor' (Protocol in workflow.md)

## Phase 2: RPG Theming and Assets [checkpoint: 0b5efe7]
- [x] Task: Update GameEngine to render Castles (Health) and Magician avatar [commit: 7cb6ab1]
- [x] Task: Replace Missile component with "Enemy" component (Skull/Meteor visual) [commit: ef16aa7]
- [x] Task: Implement explosion animations using Framer Motion [commit: ce9887c]
- [x] Task: Conductor - User Manual Verification 'Phase 2: RPG Theming and Assets' (Protocol in workflow.md)

## Phase 3: Tuning and Logic
- [ ] Task: Tune difficulty: Slower initial spawn rate (5000ms) and longer fall duration (15s)
- [ ] Task: Implement new XP formula: `(Score / 10) * Accuracy`
- [ ] Task: Implement HUD for Score and Accuracy
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Tuning and Logic' (Protocol in workflow.md)
