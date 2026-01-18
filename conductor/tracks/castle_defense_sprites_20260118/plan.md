# Implementation Plan - Castle Defense Enemy & Player Sprites

## Phase 1: Sprite Logic Core [checkpoint: 3cebe5e]
- [x] Task: Create `SpriteAnimation` helper or hook. 2b473e9
    - [ ] Create `useSpriteAnimation` hook (or utility function) that manages the 3x3 grid state (Row/Column selection based on Action/Frame).
    - [ ] Implement logic to switch Rows based on state (Idle/Walk -> Row 1, Attack -> Row 2, Death -> Row 3).
    - [ ] Implement frame looping logic (Columns 1-3).
    - [ ] Ensure "Death" state plays once and locks on the final frame.
- [x] Task: Conductor - User Manual Verification 'Sprite Logic Core' (Protocol in workflow.md)

## Phase 2: Player Integration
- [ ] Task: Update `CastleDefenseGame` to use the new `SpriteAnimation` logic for the Player.
    - [ ] Load `player_3x3_pose_sheet.png`.
    - [ ] Replace existing player rendering code with the new sprite rendering.
    - [ ] Verify Row/Col mapping matches the Player asset (Idle vs Walk vs Attack).
- [ ] Task: Conductor - User Manual Verification 'Player Integration' (Protocol in workflow.md)

## Phase 3: Enemy Integration
- [ ] Task: Update `CastleDefenseGame` to support multiple enemy types (Goblin, Orc, Troll).
    - [ ] Update state to include `enemyType` property for enemies.
    - [ ] Load `goblin_3x3_pose_sheet.png`, `orc_3x3_pose_sheet.png`, `troll_3x3_pose_sheet.png`.
- [ ] Task: Update Enemy Rendering Loop.
    - [ ] Render the correct sprite sheet based on `enemyType`.
    - [ ] Apply the standard 3x3 animation logic (Row 1: Walk, Row 2: Attack, Row 3: Death).
- [ ] Task: Update Spawner Logic.
    - [ ] Randomize `enemyType` when spawning new enemies (Goblin, Orc, Troll).
- [ ] Task: Conductor - User Manual Verification 'Enemy Integration' (Protocol in workflow.md)
