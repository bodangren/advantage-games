# Plan: Magic Defense Refactor

## Phase 1: Structural Refactor (Completed)
- [x] Task: Create `src/app/games/magic-defense` and move game components [commit: 6ec4b3a]
- [x] Task: Create Main Menu page with navigation to Magic Defense [commit: 2d118de]
- [x] Task: Update `useGameStore` to support game resets and navigation [commit: 36e1430]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Structural Refactor' (Protocol in workflow.md) [commit: 211b45c]

## Phase 2: RPG Theming and Assets (Completed)
- [x] Task: Update GameEngine to render Castles (Health) and Magician avatar [commit: 7cb6ab1]
- [x] Task: Replace Missile component with "Enemy" component (Skull/Meteor visual) [commit: ef16aa7]
- [x] Task: Implement explosion animations using Framer Motion [commit: ce9887c]
- [x] Task: Conductor - User Manual Verification 'Phase 2: RPG Theming and Assets' (Protocol in workflow.md) [commit: 0b5efe7]

## Phase 3: Tuning and Logic (In Progress)
- [x] Task: Tune difficulty: Slower initial spawn rate (5000ms) and longer fall duration (15s) [commit: 0de5b00]
- [x] Task: Implement new XP formula: `(Score / 10) * Accuracy` [commit: 0de5b00]
- [x] Task: Implement Space Bar shooting mechanic in InputController [commit: 8996b39]
- [x] Task: Implement Magic Bolt animation (Wizard -> Enemy) [commit: 8ae72e7]
- [x] Task: Update Health Visuals to destroy Right -> Left -> Center [commit: e3e0a9e]
- [x] Task: Implement HUD for Score and Accuracy [commit: aeb6fee]
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Tuning and Logic' (Protocol in workflow.md)