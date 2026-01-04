# Implementation Plan: Rune Match

This plan outlines the steps to build the "Rune Match" match-3 RPG vocabulary game using **React-Konva (Canvas)** for high-performance rendering.

## Phase 1: Setup & Infrastructure
*   [x] Task: Create configuration file `src/lib/runeMatchConfig.ts` with all balance values. a20e9c0
*   [x] Task: Define `RuneMatchState`, `Monster`, `Rune`, and related types in `src/lib/runeMatch.ts`. d10c86e
*   [x] Task: Create `src/app/games/rune-match` route and page structure. 0d293b3
*   [x] Task: Create `RuneMatchGame` container component with React-Konva Stage. 3c2ce4d
*   [x] Task: Register game in Main Menu (using placeholder cover image). 8f35e75
*   [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup & Infrastructure'

## Phase 2: Monster Selection Screen
*   [ ] Task: Implement Monster Selection UI with 4 difficulty options.
*   [ ] Task: Display monster stats (HP, Attack, XP reward) for each option.
*   [ ] Task: Implement selection logic and transition to game screen.
*   [ ] Task: Conductor - User Manual Verification 'Phase 2: Monster Selection Screen'

## Phase 3: Grid & Match-3 Core
*   [ ] Task: Implement grid initialization with vocabulary runes (infinite stack model).
*   [ ] Task: Implement tile swap mechanic (tap two adjacent tiles).
*   [ ] Task: Implement match detection (3+ horizontal/vertical, L-shapes, T-shapes).
*   [ ] Task: Implement tile clearing and gravity (tiles fall from top).
*   [ ] Task: Implement cascade detection (chain reactions after gravity).
*   [ ] Task: Implement invalid swap reversion.
*   [ ] Task: Conductor - User Manual Verification 'Phase 3: Grid & Match-3 Core'

## Phase 4: Combat System
*   [ ] Task: Implement player HP and monster HP state.
*   [ ] Task: Implement damage calculation from matches (3/4/5/L/T + cascades).
*   [ ] Task: Implement monster attack timer (every 5 seconds).
*   [ ] Task: Implement random damage (1 to monster ATK stat).
*   [ ] Task: Implement screen shake on monster attack.
*   [ ] Task: Implement Power Word system (target term, bonus damage for matching).
*   [ ] Task: Implement Power Word rotation (changes every 5 sec with attack).
*   [ ] Task: Conductor - User Manual Verification 'Phase 4: Combat System'

## Phase 5: Power-Up Runes
*   [ ] Task: Implement Heal rune spawning (configurable spawn rate).
*   [ ] Task: Implement Shield rune spawning.
*   [ ] Task: Implement Heal effect (restore HP on match).
*   [ ] Task: Implement Shield effect (block next attack).
*   [ ] Task: Implement visual feedback for power-up activation.
*   [ ] Task: Conductor - User Manual Verification 'Phase 5: Power-Up Runes'

## Phase 6: UI & HUD
*   [ ] Task: Implement Player HP bar display.
*   [ ] Task: Implement Monster HP bar display.
*   [ ] Task: Implement Power Word display panel.
*   [ ] Task: Implement damage numbers / combo indicators.
*   [ ] Task: Implement monster sprite display with state animations.
*   [ ] Task: Conductor - User Manual Verification 'Phase 6: UI & HUD'

## Phase 7: Game States & Polish
*   [ ] Task: Implement Victory state (monster HP = 0, show XP earned).
*   [ ] Task: Implement Defeat state (player HP = 0, game over).
*   [ ] Task: Implement match explosion effects.
*   [ ] Task: Implement monster attack/hurt/death animations.
*   [ ] Task: Final balance tuning (adjust config values based on playtesting).
*   [ ] Task: Conductor - User Manual Verification 'Phase 7: Game States & Polish'

---

## Configuration Reference

All balance values are stored in `src/lib/runeMatchConfig.ts` for easy tuning:

```typescript
export const RUNE_MATCH_CONFIG = {
  player: {
    maxHp: 100,
  },
  monsters: {
    goblin:   { hp: 50,  attack: 2,  xp: 3  },
    skeleton: { hp: 80,  attack: 4,  xp: 6  },
    orc:      { hp: 120, attack: 6,  xp: 9  },
    dragon:   { hp: 160, attack: 8,  xp: 12 },
  },
  combat: {
    attackIntervalMs: 5000,
    match3Damage: 10,
    match4Damage: 20,
    match5Damage: 30,
    lShapeDamage: 25,
    cascadeBonus: 5,
    powerRuneMultiplier: 2,
  },
  powerUps: {
    healAmount: 5,
    shieldDuration: 1, // blocks 1 attack
    spawnRate: 0.10,
  },
  grid: {
    columns: 6,
    rows: 8,
  },
};
```

---

## Technical Notes

* Follow architecture patterns from DragonFlight and WizardZombie games.
* Use pure state object with `advanceTime` / `tick` function for game logic.
* React-Konva for canvas rendering (performance with many tiles).
* All runes use identical visual design - text is the only differentiator.
