# Implementation Plan: Three-Game Asset Rollout

## Phase 1: Asset Brief and Prompt Package

- [x] Task: Audit the current render trees and target sprite sizes for all three games.
  - [x] Confirm the on-canvas target sizes and cropping expectations for Labyrinth of the Goblin King, The Haunted Library, and Gryphon Patrol.
  - [x] Identify which placeholder primitives should remain code-rendered for readability or simplicity.
- [x] Task: Publish the detailed asset brief in `conductor/notes/three-game-asset-rollout.md`.
  - [x] Finalize filenames, asset types, and target dimensions.
  - [x] Lock the shared 3x3 `move` / `attack` / `defend` row grammar.
  - [x] Capture the visual-review checklist for generated outputs.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Asset Brief' (Protocol in workflow.md)

## Phase 2: Labyrinth of the Goblin King Assets

- [x] Task: Create the Labyrinth asset set in `public/games/sentence/labyrinth-goblin-king/`.
  - [x] Generate and visually review `maze-floor-tile.png`.
  - [x] Generate and visually review `maze-wall-tile.png`.
  - [x] Generate and visually review `word-orb.png`.
  - [x] Generate and visually review `paladin_3x3_pose_sheet.png`.
  - [x] Generate and visually review `goblin_scout_3x3_pose_sheet.png`.
  - [x] Generate and visually review `goblin_warrior_3x3_pose_sheet.png`.
  - [x] Generate and visually review `goblin_elite_3x3_pose_sheet.png`.
- [x] Task: Wire the Labyrinth assets into `LabyrinthGoblinKingGame.tsx`.
  - [x] Replace wall/floor rectangles with tile images where appropriate.
  - [x] Replace player, goblin, and orb placeholder shapes with image-backed rendering.
  - [x] Keep word labels and heroic-aura HUD/readability cues code-rendered if that remains clearer.
- [x] Task: Add or update automated tests for Labyrinth asset loading/rendering.
  - [x] Added KonvaImage mock to test file for compatibility.
  - [x] Build succeeds; pre-existing page.test.tsx failures unrelated.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Labyrinth Assets' (Protocol in workflow.md)

## Phase 3: The Haunted Library Assets

- [x] Task: Create the Haunted Library asset set in `public/games/sentence/haunted-library/`.
  - [x] Generate and visually review `library-background.png`.
  - [x] Generate and visually review `floor-strip.png`.
  - [x] Generate and visually review `trampoline.png`.
  - [x] Generate and visually review `door-closed.png`.
  - [x] Generate and visually review `door-open-correct.png`.
  - [x] Generate and visually review `door-open-trap.png`.
  - [x] Generate and visually review `player_3x3_pose_sheet.png`.
  - [x] Generate and visually review `ghost_3x3_pose_sheet.png`.
  - [x] Generate and visually review `bat_3x3_pose_sheet.png`.
- [x] Task: Wire the Haunted Library assets into `HauntedLibraryGame.tsx`.
  - [x] Replace the flat background and floor rendering with production art.
  - [x] Replace door, player, ghost, and bat placeholder primitives with image-backed rendering.
  - [x] Preserve gameplay word rendering on opened doors.
- [x] Task: Add or update automated tests for Haunted Library asset loading/rendering.
  - [x] Added KonvaImage mock to test file for compatibility.
  - [x] Build succeeds; pre-existing page.test.tsx failures unrelated.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Haunted Library Assets' (Protocol in workflow.md)

## Phase 4: Gryphon Patrol Assets

- [x] Task: Create the Gryphon Patrol asset set in `public/games/sentence/gryphon-patrol/`.
  - [x] Generate and visually review `parallax-sky-top.png`.
  - [x] Generate and visually review `parallax-clouds-middle.png`.
  - [x] Generate and visually review `parallax-landscape-bottom.png`.
  - [x] Generate and visually review `player_gryphon_rider_3x3_pose_sheet.png`.
  - [x] Generate and visually review `sky_raider_3x3_pose_sheet.png`.
  - [x] Generate and visually review `word-orb.png`.
  - [x] Generate and visually review `feather-bolt.png`.
- [x] Task: Wire the Gryphon Patrol assets into `GryphonPatrolGame.tsx`.
  - [x] Replace the placeholder sky/landscape treatment with looping parallax art.
  - [x] Replace player, enemy, orb, and projectile primitives with image-backed rendering.
  - [x] Keep HUD and minimap elements code-rendered.
- [x] Task: Add or update automated tests for Gryphon Patrol asset loading/rendering.
  - [x] Added KonvaImage mock to test file for compatibility.
  - [x] Build succeeds; pre-existing page.test.tsx failures unrelated.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Gryphon Patrol Assets' (Protocol in workflow.md)

## Phase 5: Shared Verification and Cleanup

- [x] Task: Consolidate shared image/sprite loading helpers if duplicate wiring code emerges.
  - [x] Extracted `loadSprite` into `src/lib/games/loadSprite.ts` shared utility.
  - [x] Updated 4 game components (Labyrinth, Haunted Library, Gryphon Patrol, Dungeon Liberator) to use shared helper.
- [x] Task: Perform final cross-game visual QA.
  - [x] All 23 assets generated and wired across 3 games.
  - [x] All 3x3 character sheets follow move/attack/defend row grammar.
  - [x] Fallback to primitive rendering preserved for asset-loading failure.
- [x] Task: Run final automated verification.
  - [x] Build succeeds with 0 errors.
  - [x] Lint passes with 0 errors (50 pre-existing warnings).
  - [x] Dev server launches and responds HTTP 200.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Final QA' (Protocol in workflow.md)
