# Gameplay Usability Bug Fixes Specification

## Overview

This track fixes playability and usability bugs found across three gameplay audit passes. The earlier compliance-audit tracks checked platform requirements such as fullscreen, shared screens, API factories, and coverage. This track is narrower and stricter: a game must make sense when played, respond predictably, end correctly, and keep educational text readable under the project's two canvas sizing strategies.

The work is a bug-fix track, not a new-game track. If a card is listed as `playable`, it must load a playable game route. If a game is actually unfinished, the registry must say `coming-soon` until a separate implementation track completes it.

## Global Definitions

- **Playable route:** A `gameCards` entry with `status: 'playable'` must have a working page under `src/app/[locale]/(student)/student/games/...`, a renderable component under `src/components/games/...`, and the required API routes for its mode.
- **Readable text:** Text must be readable in actual screen pixels, not only in virtual canvas coordinates. HUD labels must render at least 16 CSS pixels. Vocabulary words, sentence words, targets, and translations must render at least 18 CSS pixels.
- **Canvas strategy 1, scale-down:** If the entire canvas scales to fit the viewport, word/HUD text must compensate so its final rendered size remains readable.
- **Canvas strategy 2, scrolling viewport:** If the canvas world scrolls under a fixed viewport, HUD and target text should remain unscaled or otherwise maintain the readable text minimum.
- **Victory path:** A finite lesson game must show a success end screen and call `onComplete` when its assigned sentence/vocabulary content is finished.
- **Endless mode:** A game may loop levels forever only if the start screen and HUD explicitly describe it as endless/survival and the end screen reports survival progress. Otherwise, looping after completion is a bug.

## Functional Requirements

### GPLAY-001: Registry Truthfulness for Missing Games

Current evidence:
- `src/lib/gameCards.ts` lists `babel-architect` as `playable`.
- No `babel-architect` component/page/API files are present under `src/components/games`, `src/app/[locale]/(student)/student/games`, or `src/app/api/v1/games`.
- `astral-mage` and `sorcerer-ziggurat` are `coming-soon`; those entries are truthful and should remain non-playable until implemented.

Required behavior:
- `babel-architect` must not appear as a playable card unless its route, component, and API routes exist and can be smoke-tested.
- For this bug-fix track, change `babel-architect` to `coming-soon` unless a full playable implementation already exists by the time the task is started.
- Add a registry consistency test that fails for any `playable` card whose route/component/API surface is missing.

### GPLAY-002: The Abyssal Well Player Position and Tunnel Controls

Current evidence:
- The game is a Tempest-style tube/tunnel adaptation.
- `src/components/games/sentence/abyssal-well/AbyssalWellGame.tsx` renders the player using `getLanePosition(gameState.player.lane, 1)`.
- `src/lib/games/abyssalWell.ts` defines `depth: 1` as the rim/reached position, but `getLanePosition(..., 1)` draws near the lower part of the viewport, making the player feel like they are at the bottom of the well instead of at the top/rim of the tunnel.

Required behavior:
- The player must be visibly stationed at the near rim/top side of the tunnel, matching the intended arcade reference: the player guards the rim while enemies climb through the tunnel.
- Left/right movement must rotate or move the player around the rim without vertical drift or inverted direction.
- Firing must originate at the player/rim and travel into the tunnel toward enemies.
- Enemy breach/life loss must remain coherent after the visual orientation change.

### GPLAY-003: Storm Castle Tower Inverted Climbing

Current evidence:
- `StormCastleTowerGame` describes a climbing game.
- The player currently feels positioned at the top/incorrect edge and ArrowUp/WASD-up movement reads as moving the wrong way.

Required behavior:
- Player starts at the bottom of the tower wall.
- ArrowUp/W moves the climber visually upward; ArrowDown/S moves downward.
- Row/coordinate math, hazard spawning, window adjacency, and win condition must agree with the visual direction.
- The first manual play should communicate "climb upward" without needing code knowledge.

### GPLAY-004: Griffin Rider's Escape Game Loop Stops After One Tick

Current evidence:
- In `src/components/games/sentence/griffin-riders-escape/GriffinRidersEscapeGame.tsx`, the main game-loop effect schedules `requestAnimationFrame(loop)` once, but the `loop` function does not schedule the next frame before returning.
- The visual lane lerp continues separately, which can make the game appear partially alive while object/gameplay logic has stopped.

Required behavior:
- While `gamePhase === 'playing'`, the gameplay tick must continue on every animation frame until victory, defeat, pause, or unmount.
- Tests must prove at least two consecutive ticks happen without remounting.

### GPLAY-005: Rune Match Term/Translation/Power-Word Mismatch

Current evidence:
- The Rune Match component and logic track `wordId`, displayed term/translation, and `powerWord` in different places.
- Audit finding: `wordId` term vs `powerWord` translation mismatch can break power matching, correct counting, and accuracy.

Required behavior:
- A rune's identity, displayed learner-facing text, matching group, and target/power-word comparison must use one explicit source of truth.
- Matching a correct group must increment correct counts and damage the monster.
- Matching a visually/semantically wrong group must not count as correct.
- The power-word display must match the thing the player is expected to identify.

### GPLAY-006: Gryphon Patrol Movement and Collision Stability

Current evidence:
- `GryphonPatrolGame` applies input every frame in the component loop.
- Audit finding: player velocity can accumulate or stale collision checks can use old player state rather than the final post-input/post-tick state.

Required behavior:
- Holding a direction must produce bounded, predictable speed; velocity must not grow unbounded with frame count.
- Collision checks must use the same final player position that is rendered for the frame.
- Projectile direction must remain predictable when the player is idle or moving vertically.

### GPLAY-007: Potion Rush Completion and Invalid Drop Handling

Current evidence:
- `PotionRushGame` shows victory when the store reaches an ended state with `reputation > 0`, but the underlying completion condition must be verified against elapsed day/time and served orders.
- Audit finding: blocked cauldron drops can delete ingredients before rejecting the drop.

Required behavior:
- A player who survives until day/time completion with positive reputation must reach a victory end screen and trigger `onComplete` once.
- Dropping an ingredient onto a blocked/unavailable cauldron must leave the ingredient recoverable or reject the drop before removing it from the conveyor/hand.
- Tests must cover both successful day completion and blocked-drop preservation.

### GPLAY-008: Sentence Games With Missing or Suppressed Victory Screens

Current evidence:
- `RuneForgeChamberGame` only renders a defeat end screen even though the logic can complete a sentence and advance levels.
- `VillageGuardianGame` only renders a defeat end screen; copy implies a win condition but the game loops levels.
- `LabyrinthGoblinKing` has victory copy, but completing the word set advances to the next sentence modulo the list instead of ending.
- `DungeonLiberatorGame` converts `phase === 'victory'` into `advanceToNextLevel(...)`, so the player never sees the success end screen for finite assigned content.

Required behavior:
- Each finite sentence game must have a visible victory path when all assigned content is completed.
- If the desired design is multi-level survival, the start/end copy must explicitly say so, and there must still be a successful completion state for the lesson/session when the assigned sentence set is exhausted.
- `onComplete` must be called exactly once on final victory or final defeat.
- XP and accuracy must include all completed levels/sentences without double counting.

### GPLAY-009: Archer's Revenge Victory Is Unreachable

Current evidence:
- `ArchersRevengeGame` renders a victory end screen when `gameState.status === "victory"`.
- The logic includes `status: "victory"` in the type, but audit found no reachable path that sets it during normal play.

Required behavior:
- Normal play must be able to reach victory by clearing the required wave/vocabulary target set.
- If the game is intended to be endless defense, update the type/copy/end screen to represent survival and remove misleading victory UI.
- This track should prefer a finite vocabulary-completion victory because the product awards XP at game completion.

### GPLAY-010: Realm Carver Out-of-Order Captures Can Make the Sentence Unwinnable

Current evidence:
- `src/lib/games/realmCarver.ts` can remove captured words from `nextWords` even when the captured word is a future required word.
- If a future word is removed out of order, the player may be unable to complete the sentence later.

Required behavior:
- Capturing the current target word should advance progress and remove that word from the field.
- Capturing a future required word out of order must not remove it permanently.
- Wrong/future captures may penalize HP, score, or time, but they must leave the sentence completable.

### GPLAY-011: Haunted Library Repeated Collision Damage

Current evidence:
- Audit finding: ghost collision can decrement lives every tick while overlapping.
- Previous test evidence expected lives to remain at 3 after one protected overlap but observed 2.

Required behavior:
- A ghost collision can cost at most one life per collision window.
- After damage, the player must enter invulnerability/stun long enough to move away.
- Tests must assert sustained overlap does not drain multiple lives across consecutive ticks.

### GPLAY-012: Devourer Slime Viewport and Repeated Damage

Current evidence:
- The game uses a fixed 390x844 reference viewport.
- Audit finding: vertical camera clamp is broken because arena height can be smaller than the viewport, and enemy contact can cause repeated damage too quickly.

Required behavior:
- Camera clamp must handle worlds smaller than the viewport without drifting, blank bands, or impossible vertical movement.
- Player/enemy overlap must apply damage through a cooldown/invulnerability window, not every tick.
- Text and HUD must remain readable at 390x844 and on smaller scaled viewports.

### GPLAY-013: Spellweaver's Run Missed-Word Penalty

Current evidence:
- The start copy says wrong words drain mana.
- Audit finding: missed orbs can fall away/respawn without a meaningful penalty, so the player can ignore required timing.

Required behavior:
- Missing the current target word should cost mana, combo, score, or another visible resource.
- Missing a decoy may be neutral or lightly rewarded only if that is clear from the rules.
- Tests must distinguish target-word miss from decoy miss.

### GPLAY-014: Magic Defense Focus and End-State Semantics

Current evidence:
- Audit finding: desktop typing can fail if the input/game area does not hold focus.
- The game-over semantics are score/defense oriented and may not expose a finite vocabulary victory path.

Required behavior:
- Desktop keyboard input must work immediately after starting the game and after clicking the canvas/game area.
- Losing and winning must be represented distinctly; a score-based game over must not be submitted as success unless the lesson objective was completed.
- Add a regression test for initial focus or explicit input capture.

### GPLAY-015: Wizard vs Zombie Restart and Completion Regression

Current evidence:
- Earlier pass found a "Play Again" reset/onComplete issue.
- After the pull, shared `GameStartScreen`/`GameEndScreen` changed, so this must be rechecked rather than assumed fixed.

Required behavior:
- Victory or defeat calls `onComplete` exactly once.
- Restart resets player, enemies, score/progress, and phase without submitting another completion.
- Starting after restart must resume playable controls and music without stale state.

### GPLAY-016: Dragon Flight and Dragon Rider Difficulty Fairness

Current evidence:
- Audit finding: boss/threshold tuning is punitive rather than outright broken.

Required behavior:
- Keep this as lower-priority tuning after blockers are fixed.
- Verify early-game thresholds give the player enough time to read terms/translations and make a correction.
- Add tests around threshold constants or pure scoring helpers where available.

## Non-Functional Requirements

- Follow the project's Measure workflow: write failing tests before each fix, then implement the minimal code to pass.
- Prefer pure logic tests in `src/lib/games/*.test.ts` or `src/lib/games/__tests__/*.test.ts` for gameplay rules.
- Use component tests only where the failure is specifically React/browser behavior: rAF loop continuity, focus capture, route rendering, or end-screen rendering.
- Avoid broad visual refactors. Fix gameplay semantics and readability with small, localized changes.
- Do not reduce accessibility or existing test coverage. New or touched gameplay logic should maintain >80% coverage.

## Acceptance Criteria

- Every `playable` card in `src/lib/gameCards.ts` has a working page/component/API surface or is downgraded to `coming-soon`.
- The listed P0 blockers are fixed: Abyssal Well orientation, Storm Castle Tower movement, Griffin Rider's Escape loop, false playable routes, unreachable finite victories, and repeated-damage drains.
- Each listed bug has at least one regression test that would have failed before the fix.
- All finite games under this track have clear victory/defeat behavior and call `onComplete` exactly once.
- In-game words, target words, translations, and HUD text are readable at 390x844 and remain readable under both scale-down and scrolling viewport strategies.
- A manual smoke checklist exists for every touched game with exact start, input, success, failure, and restart checks.

## Out of Scope

- Building brand-new full games for `astral-mage`, `babel-architect`, or `sorcerer-ziggurat`.
- Replacing React-Konva or the shared screen system.
- Cosmetic asset redesign unless required to restore readability or clarify gameplay.
- Rebalancing every difficulty curve beyond the Dragon Flight/Rider fairness checks listed above.
