# Sentence Practice Game Concepts

**Core Mechanic:** A sentence translation is shown on screen. Words to form the English sentence are scattered in the game area and must be collected in the correct order. Score is tracked and converted to 1-10 XP at game end.

**Required Features:**
- Translation display (sentence in target language)
- Words scattered in game world
- Collection in correct sequence
- Difficulty and/or opponent choice screens
- RPG theme

---

## Snake-Style "Trailing Line" Games

Player collects words which trail behind them in a growing line. Classic snake mechanics with RPG rescue theme.

### 1. Dungeon Liberator

**Theme:** Knight rescuing prisoners from monster-infested dungeon

**Mechanic:**
- Control knight through dungeon chambers (overhead view)
- Prisoners have word bubbles above them, scattered throughout
- Collect in correct order—rescued villagers trail behind in a line
- Wrong villager = they break free and flee (lose life)
- Guide entire party to exit portal to complete sentence
- Monster collision = lose trailing villager from back

**Difficulty Choice:** Dungeon depth
- Cellar (4 words, slow)
- Catacombs (6 words, medium)
- Abyss (8 words, fast)

**Opponent Choice:** Warden type
- Goblin Jailer (slow patrol)
- Orc Captain (medium, chases)
- Demon Lord (fast, aggressive hunter)

**Controls:** DPad movement

---

### 2. Village Guardian

**Theme:** Knight defending village during monster siege

**Mechanic:**
- Overhead village map with burning buildings
- Trapped villagers cry out with word bubbles
- Rescue in correct order—villagers form protective procession behind you
- Monsters roam streets—collision costs villagers from back of line
- Lead everyone to town square sanctuary
- Wrong villager = they panic and hide again (timer penalty)

**Difficulty Choice:** Raid size
- Scout Party (4 villagers)
- War Band (6 villagers)
- Full Siege (8 villagers)

**Opponent Choice:** Invader type
- Bandits (wander, avoid player)
- Goblins (chase player)
- Dragons (hunt player aggressively)

**Controls:** DPad movement, optional shield bash to stun

---

### 3. Royal Convoy

**Theme:** Knight escorting nobles through dangerous wilderness

**Mechanic:**
- Forest path with branching routes
- Lost nobles scattered along way with word crests
- Collect in sequence—they join caravan procession
- Wrong noble = insult to house (reputation/life loss)
- Bandit ambushes—dodge or lose caravan members
- Reach castle with full convoy to deliver royal decree (sentence)

**Difficulty Choice:** Journey length
- Short Pass (3 words)
- Long Road (5 words)
- Perilous Route (7 words)

**Opponent Choice:** Highwayman gang
- Thieves Guild (avoidance)
- Orc Raiders (chase)
- Dark Knights (hunt)

**Controls:** DPad movement, speed boost button

---

## Runner-Style Games

Side-scrolling or forward-moving collection games.

### 4. Spellweaver's Run

**Theme:** Enchanted forest runner

**Mechanic:**
- Side-scrolling magical corridor
- Floating scroll shows translation
- Word orbs appear in 3 lanes—tap/arrow to collect in order
- Wrong word = mana loss
- Zero mana = game over
- Complete sentence to pass level

**Difficulty Choice:** Environment
- Whisper Woods (slow, forgiving)
- Mystic Mountain (medium)
- Void Passage (fast, punishing)

**Opponent Choice:** None—pure survival against environment

**Controls:** Arrow keys/tap lanes, spacebar confirm

---

## Survival/Escape Games

Collect words while evading threats in enclosed arena.

### 5. Shadow Gate Dungeon

**Theme:** Dark fantasy dungeon escape

**Mechanic:**
- Trapped in dungeon chamber with magical exit gate
- Gate displays sentence translation
- Glowing word crystals scatter floor
- Shadow creature stalks you—collect words in correct order to unlock gate
- Escape before caught

**Difficulty Choice:** Creature speed + word count
- Easy (slow, 4 words)
- Normal (medium, 5 words)
- Hard (fast, 6 words)

**Opponent Choice:** Pursuer type
- Goblin Scout (slow)
- Orc Hunter (medium)
- Shadow Dragon (fast)

**Controls:** DPad movement, auto-collect on touch

---

## Puzzle Games

Timed word collection with puzzle elements.

### 6. Rune Forge Chamber

**Theme:** Ancient rune-carving sanctuary

**Mechanic:**
- Central rune stone displays translation
- Word fragments float in magical circles around chamber
- Click circles in correct sequence before forge cools (timer)
- Wrong fragment = rune cracks (life loss)
- Complete sentence to forge powerful rune artifact

**Difficulty Choice:** Complexity
- Apprentice (3 words, 15s)
- Journeyman (5 words, 12s)
- Master (7 words, 10s)

**Opponent Choice:** Rune type
- Common Stone (simple words)
- Rare Crystal (complex words)
- Void Essence (arcane vocabulary)

**Controls:** Click/tap word circles

---

## Dragon/Serpent Variants

Classic snake with fantasy creature theme.

### 7. Dragon's Glyph Run

**Theme:** Ancient temple corridors

**Mechanic:**
- Control growing dragon serpent through temple hallways
- Translation at top of screen
- Word orbs scattered—collect in correct order
- Wrong word = lose tail segment (lives)
- Hit wall/self = damage
- Complete sentence = advance to next chamber

**Difficulty Choice:**
- Hatchling (slow, short words)
- Wyrm (medium)
- Elder Dragon (fast, long sentences)

**Opponent Choice:** Temple Guardian
- Stone Golem (slow patrol)
- Fire Elemental (medium)
- Void Wraith (fast, tracks player)

**Controls:** DPad arrows, continuous movement

---

### 8. Spirit Serpent Grove

**Theme:** Enchanted forest with glowing spirit serpent

**Mechanic:**
- Spirit serpent winds through mystical grove
- Word flowers bloom on ground—collect in order
- Wrong flower = spirit fades (health loss)
- Complete sentence to purify grove, unlock next area

**Difficulty Choice:**
- Moonlit Path (easy)
- Sunlit Clearing (medium)
- Starlit Depths (hard)

**Opponent Choice:** Forest spirit
- Will-o-wisps (distract)
- Shadow Sprites (block)
- Corrupted Treants (chase)

**Controls:** DPad movement

---

## Recommended Implementation Order

1. **Dungeon Liberator** - Cleanest implementation of trailing-line mechanic, strong RPG theme
2. **Spellweaver's Run** - Different mechanic (runner), broadens game variety
3. **Shadow Gate Dungeon** - Survival variant, high tension gameplay

---

## Technical Notes

All sentence games should:
- Use `VocabularyItem[]` with full sentences, not just words
- Display complete translation during gameplay
- Track: correct words, total attempts, time
- XP formula: `Math.floor(correctWords * accuracy)`
- Support both touch (DPad/VirtualDPad) and keyboard

### Vocabulary File Format

```json
[
  {
    "term": "The cat sits on the mat",
    "translation": "Le chat est assis sur le tapis"
  }
]
```

### Word Display

- Each word should be visually distinct (bubble, orb, card)
- Show word order hint subtly (number, glow intensity)
- Wrong selection feedback: shake, flash red, sound
- Correct selection feedback: sparkle, chime, word joins trail
