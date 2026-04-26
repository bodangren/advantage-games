# Lessons Learned

## Track: Spellweaver's Run Compliance Audit (2026-04-26)
- Result: 25/25 passing after fixes (13 at start, 12 failures)
- Fixes: fullscreen, accessibility, text sizes, calculateSpellweaversRunXP, difficulty tiers, SentenceItem typing, API factories, useSession, component tests, hook deps, unused imports, asset dir
- Coverage: 88.37% overall
- **Key Learnings:**
  - Adding useGameFullscreen + useAccessibilitySettings to an existing rAF game is straightforward
  - calculateSpellweaversRunXP reuses standard bonus pattern (accuracy + survival + speed + progression)
  - 6 component tests raise coverage from 0% to 80% efficiently

**Previous audits (condensed):** Village Guardian, Dungeon Liberator, Potion Rush, Rune Match, Castle Defense, Alchemists Synthesis, Wizard vs Zombie, RPG Battle, Magic Defense, Archer's Revenge, Griffin Sky-Joust, Realm Carver, Paladin's Twin-Soul, Dragon Rider, Storm Castle Tower, Abyssal Well, Labyrinth Goblin King, Gryphon Patrol, Griffin Riders Escape.
