# Three-Game Asset Rollout — Asset Brief

## Overview

Production image assets for three sentence games that currently render with placeholder primitives. All assets must match the repo's established painterly fantasy visual language: luminous, readable, kid-safe, strong silhouettes.

## Shared Standards

### 3x3 Pose Sheet Grammar

All character/enemy sheets follow a 3x3 grid (3 columns × 3 rows = 9 frames):

| Row | Semantic | Frame 1 | Frame 2 | Frame 3 |
|-----|----------|---------|---------|---------|
| 1 | **move** | neutral / idle | locomotion A | locomotion B |
| 2 | **attack** | wind-up / aim | strike / cast / release | recovery / follow-through |
| 3 | **defend** | brace / shield-up | block / barrier / evade peak | recover / landing / stunned |

**Technical:**
- Transparent background (PNG)
- Square canvas (equal width/height)
- Frame dimensions: total sheet ÷ 3
- Target on-canvas size noted per asset

---

## Game 1: Labyrinth of the Goblin King

### Current Render Audit

| Element | Current Primitive | Size on Canvas | Replacement |
|---------|-------------------|----------------|-------------|
| Background | `Rect` fill #1a1a2e | 390×700 | `labyrinth-background.png` |
| Wall tiles | `Rect` fill #3a3a4a | 32×32 | `maze-wall-tile.png` |
| Floor tiles | `Rect` fill #2a2a3a | 32×32 | `maze-floor-tile.png` |
| Player (Paladin) | `Circle` fill #c0c0c0 | 28px diameter | `paladin_3x3_pose_sheet.png` |
| Word orbs | `Circle` fill #4a90d9 / #ffd700 | 24px diameter | `word-orb.png` |
| Goblin (scout) | `Circle` fill #4a8c4a | 28px diameter | `goblin_scout_3x3_pose_sheet.png` |
| Goblin (warrior) | `Circle` fill #4a8c4a | 28px diameter | `goblin_warrior_3x3_pose_sheet.png` |
| Goblin (elite) | `Circle` fill #4a8c4a | 28px diameter | `goblin_elite_3x3_pose_sheet.png` |

**Code-rendered elements to preserve:**
- Translation text at top (code-rendered for i18n)
- Word labels on orbs (code-rendered for dynamic text)
- Lives hearts (emoji ❤️ or code-rendered)
- Heroic aura timer bar (code-rendered)
- HUD text at bottom (code-rendered)

### Asset Specifications

#### 1.1 Maze Floor Tile (`maze-floor-tile.png`)
- **Type:** Seamless tile
- **Size:** 64×64px (scaled to 32×32 on canvas)
- **Style:** Dark dungeon floor, stone tiles, subtle cracks
- **Constraints:** Low contrast, must not compete with orb text readability

#### 1.2 Maze Wall Tile (`maze-wall-tile.png`)
- **Type:** Seamless tile
- **Size:** 64×64px (scaled to 32×32 on canvas)
- **Style:** Dark stone bricks, moss accents, readable boundary
- **Constraints:** Must clearly separate from floor tile at a glance

#### 1.3 Word Orb (`word-orb.png`)
- **Type:** Static prop
- **Size:** 64×64px (scaled to 24×24 on canvas)
- **Style:** Glowing magical orb, blue/crystal, inner light
- **Constraints:** No text baked in; center must remain clear for code-rendered word labels
- **Variants:** Same asset for all orbs; target orb glow handled by engine (tint/opacity)

#### 1.4 Paladin Player 3x3 Sheet (`paladin_3x3_pose_sheet.png`)
- **Type:** Character sprite sheet
- **Sheet Size:** 288×288px (96×96 per frame)
- **On-canvas target:** 28×28px
- **Row 1 (move):** Idle stance → walk left → walk right
- **Row 2 (attack):** Sword raise → slash → follow-through
- **Row 3 (defend):** Shield brace → block flash → recovery
- **Style:** Armored paladin, silver/gold armor, small but readable silhouette

#### 1.5 Goblin Scout 3x3 Sheet (`goblin_scout_3x3_pose_sheet.png`)
- **Type:** Enemy sprite sheet
- **Sheet Size:** 288×288px (96×96 per frame)
- **On-canvas target:** 28×28px
- **Row 1 (move):** Idle → patrol step A → patrol step B
- **Row 2 (attack):** Alert → lunge → recovery
- **Row 3 (defend):** Flee start → fleeing → flee end
- **Style:** Small green goblin, hunched, large ears, simple silhouette

#### 1.6 Goblin Warrior 3x3 Sheet (`goblin_warrior_3x3_pose_sheet.png`)
- **Type:** Enemy sprite sheet
- **Sheet Size:** 288×288px (96×96 per frame)
- **On-canvas target:** 28×28px
- **Row 1 (move):** Idle → heavy step A → heavy step B
- **Row 2 (attack):** Axe raise → chop → recovery
- **Row 3 (defend):** Guard up → block → stagger
- **Style:** Bigger goblin, armor scraps, weapon visible

#### 1.7 Goblin Elite 3x3 Sheet (`goblin_elite_3x3_pose_sheet.png`)
- **Type:** Enemy sprite sheet
- **Sheet Size:** 288×288px (96×96 per frame)
- **On-canvas target:** 28×28px
- **Row 1 (move):** Idle → stalk A → stalk B
- **Row 2 (attack):** Leap wind-up → leap strike → landing
- **Row 3 (defend):** Dodge prep → evade → crouch
- **Style:** Darker goblin, cape or cloak, menacing posture

---

## Game 2: The Haunted Library

### Current Render Audit

| Element | Current Primitive | Size on Canvas | Replacement |
|---------|-------------------|----------------|-------------|
| Background | `Rect` fill #1a1a2e | 390×844 | `library-background.png` |
| Floors | `Rect` fill #4a4a4a | full width × 20px | `floor-strip.png` |
| Trampolines | `Rect` fill #ff4500 | 40×20px | `trampoline.png` |
| Doors (closed) | `Rect` fill #8b4513 | 60×80px | `door-closed.png` |
| Doors (correct) | `Rect` fill #22c55e | 60×80px | `door-open-correct.png` |
| Doors (trap) | `Rect` fill #ef4444 | 60×80px | `door-open-trap.png` |
| Player | `Rect` fill #3b82f6 | 48×64px | `player_3x3_pose_sheet.png` |
| Ghosts | `Circle` rgba(100,150,255,0.6) | 48px diameter | `ghost_3x3_pose_sheet.png` |
| Bats | `Rect` fill #ef4444 | variable | `bat_3x3_pose_sheet.png` |

**Code-rendered elements to preserve:**
- Translation text in HUD (code-rendered)
- Word labels on opened doors (code-rendered)
- Lives counter (code-rendered)
- Score (code-rendered)
- Progress dots (code-rendered)

### Asset Specifications

#### 2.1 Library Background (`library-background.png`)
- **Type:** Full background
- **Size:** 390×844px (or 780×1688 for retina)
- **Style:** Dark magical library, bookshelves, candles, atmospheric
- **Constraints:** Must not interfere with gameplay readability; dark enough for contrast

#### 2.2 Floor Strip (`floor-strip.png`)
- **Type:** Horizontal strip/tile
- **Size:** 128×32px (tileable horizontally)
- **Style:** Old wooden floorboards, dark stain
- **Constraints:** Seamless horizontal tiling

#### 2.3 Trampoline (`trampoline.png`)
- **Type:** Static prop
- **Size:** 80×40px (scaled to 40×20 on canvas)
- **Style:** Magical spring pad, orange glow, coiled energy

#### 2.4 Door Closed (`door-closed.png`)
- **Type:** Static prop
- **Size:** 120×160px (scaled to 60×80 on canvas)
- **Style:** Old wooden door, iron hinges, magical seal

#### 2.5 Door Open Correct (`door-open-correct.png`)
- **Type:** Static prop
- **Size:** 120×160px (scaled to 60×80 on canvas)
- **Style:** Same door, open, green magical light emanating, welcoming

#### 2.6 Door Open Trap (`door-open-trap.png`)
- **Type:** Static prop
- **Size:** 120×160px (scaled to 60×80 on canvas)
- **Style:** Same door, open, red ominous glow, warning feel

#### 2.7 Player 3x3 Sheet (`player_3x3_pose_sheet.png`)
- **Type:** Character sprite sheet
- **Sheet Size:** 384×384px (128×128 per frame)
- **On-canvas target:** 48×64px
- **Row 1 (move):** Idle → walk left → walk right
- **Row 2 (attack):** Reach up → open door → step through
- **Row 3 (defend):** Brace → duck → roll
- **Style:** Young scholar/adventurer, blue cloak, book satchel

#### 2.8 Ghost 3x3 Sheet (`ghost_3x3_pose_sheet.png`)
- **Type:** Enemy sprite sheet
- **Sheet Size:** 384×384px (128×128 per frame)
- **On-canvas target:** 48×48px
- **Row 1 (move):** Float idle → float left → float right
- **Row 2 (attack):** Lunge wind-up → lunge → fade back
- **Row 3 (defend):** Stunned start → stunned loop → recover
- **Style:** Translucent ghost, blue/white, flowing, non-threatening but eerie

#### 2.9 Bat 3x3 Sheet (`bat_3x3_pose_sheet.png`)
- **Type:** Enemy sprite sheet
- **Sheet Size:** 384×384px (128×128 per frame)
- **On-canvas target:** ~32×32px
- **Row 1 (move):** Hover → flap down → flap up
- **Row 2 (attack):** Dive wind-up → dive → pull up
- **Row 3 (defend):** Flinch → dazed hover → recover
- **Style:** Small red bat, cartoonish, readable silhouette

---

## Game 3: Gryphon Patrol

### Current Render Audit

| Element | Current Primitive | Size on Canvas | Replacement |
|---------|-------------------|----------------|-------------|
| Sky background | `Rect` linear gradient | 390×844 | `parallax-sky.png` + gradient fallback |
| Landscape | `Line` polygons | wrap-around | `parallax-landscape.png` |
| Player | `Rect` fill #f1c40f | 40×40px | `player_gryphon_rider_3x3_pose_sheet.png` |
| Enemies | `Circle` fill #e74c3c / #2ecc71 | 32px diameter | `sky_raider_3x3_pose_sheet.png` |
| Orbs | `Circle` fill white | 24px diameter | `word-orb.png` |
| Projectiles | `Rect` fill #f1c40f | small | `feather-bolt.png` |

**Code-rendered elements to preserve:**
- Sentence text in HUD (code-rendered)
- Collected words (code-rendered)
- Mini-map (code-rendered)
- HP bar (code-rendered)

### Asset Specifications

#### 3.1 Parallax Sky Top (`parallax-sky-top.png`)
- **Type:** Tiling background layer
- **Size:** 512×256px (tileable horizontally)
- **Style:** Deep blue sky, distant clouds, atmospheric haze
- **Constraints:** Very low detail, slowest parallax layer

#### 3.2 Parallax Clouds Middle (`parallax-clouds-middle.png`)
- **Type:** Tiling background layer
- **Size:** 512×256px (tileable horizontally)
- **Style:** Fluffy clouds, mid-tone, medium parallax speed
- **Constraints:** Transparent background so sky shows through

#### 3.3 Parallax Landscape Bottom (`parallax-landscape-bottom.png`)
- **Type:** Tiling background layer
- **Size:** 512×256px (tileable horizontally)
- **Style:** Mountain silhouettes, ground reference
- **Constraints:** Bottom-aligned, darker values for depth

#### 3.4 Gryphon Rider Player 3x3 Sheet (`player_gryphon_rider_3x3_pose_sheet.png`)
- **Type:** Character sprite sheet
- **Sheet Size:** 384×384px (128×128 per frame)
- **On-canvas target:** 40×40px
- **Row 1 (move):** Glide neutral → wing flap down → wing flap up
- **Row 2 (attack):** Aim → shoot → recoil
- **Row 3 (defend):** Wing shield → barrel roll → recover
- **Style:** Gryphon (eagle-lion hybrid) with rider, golden feathers, heroic pose

#### 3.5 Sky Raider Enemy 3x3 Sheet (`sky_raider_3x3_pose_sheet.png`)
- **Type:** Enemy sprite sheet
- **Sheet Size:** 384×384px (128×128 per frame)
- **On-canvas target:** 32×32px
- **Row 1 (move):** Hover → fly left → fly right
- **Row 2 (attack):** Dive wind-up → dive → pull up
- **Row 3 (defend):** Shield → evade → recover
- **Style:** Dark flying creature (bat/dragon hybrid), menacing but kid-safe

#### 3.6 Word Orb (`word-orb.png`)
- **Type:** Static prop
- **Size:** 64×64px (scaled to 24×24 on canvas)
- **Style:** Glowing white/crystal orb, floating, magical
- **Constraints:** No text baked in; center clear for code-rendered labels

#### 3.7 Feather Bolt (`feather-bolt.png`)
- **Type:** Static prop
- **Size:** 32×32px (scaled to ~16×16 on canvas)
- **Style:** Golden feather projectile, motion blur, glowing tip
- **Constraints:** Must read as projectile at small size

---

## Visual Review Checklist

Before accepting any generated asset:

- [ ] **Style Match:** Does it fit the repo's painterly fantasy aesthetic?
- [ ] **Readability:** Is the silhouette clear at the target on-canvas size?
- [ ] **Transparency:** Does the PNG have a proper transparent background (except backgrounds)?
- [ ] **No Baked Text:** Does the asset avoid embedding gameplay text labels?
- [ ] **Kid-Safe:** Is the content appropriate (no gore, horror, or mature themes)?
- [ ] **3x3 Grammar:** Do character sheets follow move/attack/defend row order?
- [ ] **Seamless:** Do tileable assets tile without visible seams?

---

## Asset Rollout Order

1. **Labyrinth of the Goblin King** (Phase 2)
2. **The Haunted Library** (Phase 3)
3. **Gryphon Patrol** (Phase 4)

Each phase generates assets, wires them, and adds tests before moving to the next game.

---

## Out of Scope

- Cover art / marketing images
- Shared UI components (start/end screens already themed)
- Re-illustrating games that already have acceptable assets
- Sound effects or music (already handled by Background Music Rollout)
