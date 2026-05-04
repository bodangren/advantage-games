# Gameplay Usability Bug Fixes Plan

## Phase 0: Baseline Inventory and Guardrails

- [x] Task: Add playable-card route consistency tests
  - [x] Enhanced existing test to verify every `status: 'playable'` card has page/component/API surface (src/lib/gameCards.test.ts)
  - [x] `babel-architect` already changed to `coming-soon` in previous commit
  - [x] `astral-mage` and `sorcerer-ziggurat` correctly remain `coming-soon`

- [ ] Task: Add a reusable gameplay readability checklist
  - [ ] Document the actual-screen-pixel rule: HUD >= 16 CSS px, words/translations >= 18 CSS px after scaling.
  - [ ] Add tests or test helpers where practical for scale-down components that compute `fontSize` from viewport scale.
  - [ ] Add manual verification steps for the scrolling-canvas strategy where automated pixel-size assertions are impractical.

- [ ] Task: Capture current failing gameplay regressions before implementation
  - [ ] Add or update focused tests for the known blockers listed in the spec.
  - [ ] Each test name must describe the user-facing failure, not just the implementation detail.
  - [ ] Run the focused tests and record the expected red failures in this track's task notes before fixing.

## Phase 1: Input, Loop, Camera, and Orientation Blockers

- [x] Task: Fix The Abyssal Well player orientation and controls
  - [x] Added regression tests proving player (depth=1) renders at top rim and enemies (depth=0) spawn at bottom
  - [x] Fixed `getLanePosition` to swap depth semantics: depth=1 is rim/top with larger radius, depth=0 is far/bottom with smaller radius
  - [x] Left/right rotation via `rotatePlayer` unchanged (lane-based, no vertical drift)
  - [x] Projectiles travel from rim (depth=1) toward center (decreasing depth) - verified in existing tests

- [x] Task: Fix Storm Castle Tower inverted climbing
  - [x] Write tests for initial player row/position and ArrowUp/W movement.
  - [x] Make the player start at the bottom of the tower.
  - [x] Make ArrowUp/W move visually upward and ArrowDown/S move visually downward.
  - [x] Verify window collection, hazards, and victory still use the corrected coordinate convention.

- [x] Task: Fix Griffin Rider's Escape one-frame gameplay loop
  - [x] Write a component test that starts the game and proves two or more gameplay ticks occur from consecutive `requestAnimationFrame` callbacks.
  - [x] Add the missing reschedule inside the main gameplay loop.
  - [x] Confirm the separate lane lerp loop does not mask a stopped gameplay loop.

- [x] Task: Stabilize Gryphon Patrol movement and collision state
  - [x] Write a pure logic test proving held input produces bounded velocity after many frames.
  - [x] Write a collision test proving collisions use the final post-input/post-tick player position.
  - [x] Adjust input handling so velocity is set or clamped rather than accumulated unintentionally.
  - [x] Verify projectile direction while idle, moving horizontally, and moving vertically.

- [x] Task: Fix Devourer Slime camera clamp and repeated enemy damage
  - [x] Write tests for arena smaller than viewport in the vertical axis.
  - [x] Write tests for sustained enemy overlap causing one damage event per cooldown window.
  - [x] Fix camera centering/clamping so no blank impossible movement area appears.
  - [x] Add or reuse invulnerability/cooldown for enemy contact damage.

## Phase 2: Sentence Progression and End-State Correctness

- [x] Task: Fix Rune Forge Chamber finite victory
  - [x] Write a test that completes the assigned sentence/session and expects a victory end screen.
  - [x] Decide in code whether extra levels are survival mode or lesson progression; make the copy match.
  - [x] Ensure `onComplete` fires exactly once with final XP and accuracy.

- [x] Task: Fix Village Guardian finite victory
  - [x] Write a test that rescues the required sentence words and reaches victory instead of looping forever.
  - [x] If multiple sentences are intended, end when the assigned sentence list is exhausted.
  - [x] Ensure defeat remains reachable and distinct from victory.

- [x] Task: Fix Labyrinth Goblin King completion loop
  - [x] Write a test for collecting all required word orbs and expecting final victory.
  - [x] Remove modulo wraparound for finite lesson completion.
  - [x] Keep any heroic aura/paladin state coherent through the final success transition.

- [x] Task: Fix Dungeon Liberator suppressed victory screen
  - [x] Write a test proving `phase === 'victory'` shows a victory end screen for final assigned content.
  - [x] Preserve level advancement only while additional assigned sentences remain.
  - [x] Ensure accumulated XP/correct totals include all completed levels and are not double counted.

- [x] Task: Fix Realm Carver out-of-order word capture
  - [x] Write a pure logic test where a future word is enclosed before the current target.
  - [x] Ensure future required words are not removed permanently when captured out of order.
  - [x] Apply a clear penalty for wrong/future capture if desired, but keep the sentence completable.

- [x] Task: Fix Haunted Library repeated collision damage
  - [x] Write a pure logic test for sustained ghost overlap across consecutive ticks.
  - [x] Add or repair invulnerability/stun so one collision costs at most one life per collision window.
  - [x] Verify victory and defeat events still set the correct end-screen status.

- [x] Task: Fix Spellweaver's Run missed target-word penalty
  - [x] Write a test where the current target orb falls past the collection zone.
  - [x] Apply a visible penalty to mana, combo, score, or another resource.
  - [x] Verify missed decoys do not incorrectly punish the player as target misses.

- [x] Task: Fix Potion Rush day completion and blocked-drop preservation
  - [x] Write a test for surviving until day/time completion with reputation above zero and expecting victory.
  - [x] Write a test for dropping onto a blocked/unavailable cauldron and keeping the ingredient recoverable.
  - [x] Ensure `onComplete` fires exactly once on final victory or defeat.

## Phase 3: Vocabulary Game Semantics

- [x] Task: Fix Rune Match power-word identity mismatch
  - [x] Write tests that distinguish term, translation, `wordId`, displayed rune text, and `powerWord`.
  - [x] Choose one source of truth for matching identity and target display.
  - [x] Verify correct matches damage the monster and wrong matches do not increment accuracy.

- [x] Task: Add Archer's Revenge reachable victory
  - [x] Write a pure logic test that clears the required enemy/wave target set and expects `status: "victory"`.
  - [x] Implement finite victory by vocabulary/wave completion, unless explicitly converting the game to endless survival.
  - [x] Verify the component renders the victory end screen and submits completion once.

- [ ] Task: Fix Magic Defense input focus and success/failure semantics
  - [ ] Write a component test proving keyboard input works immediately after start and after clicking the game area.
  - [ ] Add explicit focus management or event handling to keep typing reliable on desktop.
  - [ ] Verify game-over, victory, and completion submission are not conflated.

- [ ] Task: Verify Wizard vs Zombie restart and completion behavior
  - [ ] Write or update tests proving victory/defeat calls `onComplete` exactly once.
  - [ ] Verify restart clears stale phase, score, enemies, player state, and progress.
  - [ ] Verify shared start/end screen music hooks do not create duplicate completion submissions.

- [ ] Task: Tune Dragon Flight and Dragon Rider early fairness
  - [ ] Add tests around boss/threshold constants or scoring helpers where available.
  - [ ] Adjust thresholds only enough to give players time to read and respond in early play.
  - [ ] Verify existing ranking/result behavior is unchanged except for fairness tuning.

## Phase 4: Cross-Game Readability and Manual Verification

- [ ] Task: Audit text readability in every touched game
  - [ ] For scale-down games, verify final screen-pixel text sizes meet the spec minimums.
  - [ ] For scrolling-canvas games, verify HUD/target text remains fixed or compensated.
  - [ ] Fix any touched game where target words, translations, lives, timers, or instructions are below the minimum.

- [ ] Task: Run focused automated suites
  - [ ] Run all new/changed pure gameplay logic tests.
  - [ ] Run all new/changed component tests for touched games.
  - [ ] Run route/card consistency tests.
  - [ ] Record the exact command and result in the phase notes.

- [ ] Task: Create manual smoke verification matrix
  - [ ] For each touched game, list the route, start action, primary input, expected first success, expected first failure, victory path, defeat path, restart behavior, and text readability check.
  - [ ] Include mobile portrait viewport 390x844 and at least one narrower/shorter viewport.
  - [ ] Include desktop keyboard checks for games with typing or arrow-key controls.

- [ ] Task: Measure - User Manual Verification 'Gameplay Usability Bug Fixes' (Protocol in workflow.md)
  - [ ] Present the manual verification matrix to the user.
  - [ ] Ask for confirmation that the fixed games meet playability expectations.
  - [ ] Create the phase checkpoint only after explicit confirmation.
