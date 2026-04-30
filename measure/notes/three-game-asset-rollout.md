# Three-Game Asset Rollout - Asset Brief

## Shared Standards

- **Target visual language:** painterly fantasy, bright but readable, consistent with Dragon Flight, Dragon Rider, Enchanted Library, Wizard vs Zombie, and RPG Battle.
- **Audience fit:** adventurous and magical, never grim or horror-heavy.
- **Output format:** PNG.
- **Transparency:** required for character sheets, enemy sheets, props, projectiles, and pickups.
- **No embedded gameplay text:** words and sentence prompts remain code-rendered unless explicitly called out.
- **Readability first:** silhouettes must hold up at mobile portrait sizes.
- **Pose-sheet grammar:** every new 3x3 character sheet uses:
  - Row 1: move
  - Row 2: attack
  - Row 3: defend

## Visual Review Checklist

Reject and regenerate any output that fails one or more of these checks:

1. The silhouette is muddy or hard to read at target size.
2. The asset style looks photoreal, anime, pixel-art, or flat-vector instead of painterly fantasy game art.
3. A tileable background has visible seams.
4. Transparent assets include solid backgrounds or unusable edge halos.
5. Attack and defend rows do not read differently from the move row.
6. The asset bakes in text that should remain rendered in code.
7. The composition is too busy for the gameplay labels and HUD that sit above it.

## Labyrinth of the Goblin King

### Canvas and Gameplay Constraints

- **Stage size:** 390 x 700
- **Maze tile size:** 32 x 32
- **Player size target:** 28 x 28
- **Goblin size target:** 28 x 28
- **Orb size target:** 24 x 24
- **Camera:** full-board fixed view, so seam-safe tiles matter more than scenic one-off backgrounds

### Required Assets

#### `public/games/labyrinth-goblin-king/maze-floor-tile.png`

- **Type:** tiled background
- **Target size:** 128 x 128 or 256 x 256
- **Description:** top-down dungeon floor tile with worn stone, moss, subtle cracks, and warm/cool magical bounce light
- **Must do:** tile cleanly, stay darker than the word orbs

#### `public/games/labyrinth-goblin-king/maze-wall-tile.png`

- **Type:** tiled background
- **Target size:** 128 x 128 or 256 x 256
- **Description:** top-down labyrinth wall tile with chunky stone blocks, slight bevel lighting, and readable edge definition
- **Must do:** tile cleanly, clearly contrast from floor at a glance

#### `public/games/labyrinth-goblin-king/word-orb.png`

- **Type:** pickup / prop
- **Target size:** 256 x 256 source for downscaling
- **Description:** glowing magical orb with a soft halo and a bright readable core
- **Must do:** leave visual room for overlaid word labels in code

#### `public/games/labyrinth-goblin-king/paladin_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** top-down heroic paladin with silver armor, blue accents, readable shield/sword silhouette, compact proportions
- **Rows:** move / attack / defend
- **Must do:** defend row should read as shield-first protection, not another attack

#### `public/games/labyrinth-goblin-king/goblin_scout_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** lean green scout goblin with lighter gear and quick-footed movement
- **Rows:** move / attack / defend

#### `public/games/labyrinth-goblin-king/goblin_warrior_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** sturdier goblin warrior with heavier armor and a melee silhouette
- **Rows:** move / attack / defend

#### `public/games/labyrinth-goblin-king/goblin_elite_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** intimidating elite goblin with stronger contrast, richer armor accents, and a commanding silhouette
- **Rows:** move / attack / defend

### Wiring Notes

- The maze should continue to render on the existing logical tile grid.
- Word labels, target glow, and heroic-aura timers should remain code-driven unless readability improves without regression.
- If all three goblin sheets prove too costly to maintain visually, a single base sheet plus two clearly differentiated recolor variants is acceptable only if the three classes remain instantly distinguishable.

## The Haunted Library

### Canvas and Gameplay Constraints

- **Stage size:** 390 x 844
- **Player size target:** 48 x 64
- **Ghost size target:** 48 x 48
- **Bat size target:** current logic uses bat width/height values from state and should stay readable at that scale
- **Camera:** fixed portrait stage with stacked floors

### Required Assets

#### `public/games/haunted-library/library-background.png`

- **Type:** full background
- **Target size:** 390 x 844 at minimum; larger source okay if cropped safely
- **Description:** tall magical library interior with stacked shelves, moonlit windows, warm lantern pools, and strong negative space around playable lanes
- **Must do:** support floor overlays and door sprites without making the scene too busy

#### `public/games/haunted-library/floor-strip-tile.png`

- **Type:** tiled strip / floor overlay
- **Target size:** 256 x 64 or similar
- **Description:** side-view haunted-library floor plank or stone strip with subtle depth and clean top edge
- **Must do:** tile horizontally without obvious seams

#### `public/games/haunted-library/trampoline-pad.png`

- **Type:** prop
- **Target size:** 256 x 128 source for downscaling
- **Description:** magical springboard or enchanted cushion that clearly reads as bounce-enabled

#### `public/games/haunted-library/door-closed.png`

- **Type:** prop
- **Description:** spooky wooden library door with iron fittings and a readable center panel for optional word overlay

#### `public/games/haunted-library/door-open-correct.png`

- **Type:** prop
- **Description:** opened or glowing friendly door state with green/magical success cues

#### `public/games/haunted-library/door-open-trap.png`

- **Type:** prop
- **Description:** opened trap/wrong door state with red or cursed cues, still kid-safe

#### `public/games/haunted-library/player_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** young scholar/adventurer with lantern-and-book energy, readable from side view, brave rather than frightened
- **Rows:** move / attack / defend
- **Note:** attack can read as door-opening magic pulse or wand/lantern action; defend can read as ducking, warding, or bracing

#### `public/games/haunted-library/ghost_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** spectral library ghost with soft translucency and expressive silhouette
- **Rows:** move / attack / defend
- **Note:** defend row can become stunned/ethereal-guard

#### `public/games/haunted-library/bat_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** stylized haunted-library bat, readable from side view, not grotesque
- **Rows:** move / attack / defend
- **Note:** defend row may read as wing-wrap or evasive fold

### Wiring Notes

- Keep the floor logic, door logic, and collision system unchanged.
- Words revealed on open doors should likely remain text overlays rendered in Konva for clarity.
- The background should be decorative, while floors and doors carry the strongest gameplay readability.

## Gryphon Patrol

### Canvas and Gameplay Constraints

- **Viewport:** 390 x 844
- **World width:** 2000
- **Player size target:** 40 x 40
- **Enemy size target:** 32 x 32
- **Orb size target:** 24 x 24
- **Camera:** horizontal wraparound world with looping parallax

### Required Assets

#### `public/games/gryphon-patrol/parallax-top-tiling.png`

- **Type:** parallax background
- **Description:** distant cloud wisps and upper sky texture
- **Must do:** tile seamlessly horizontally and stay sparse

#### `public/games/gryphon-patrol/parallax-middle-tiling.png`

- **Type:** parallax background
- **Description:** mid-distance cloud banks, floating ruins, or mountain silhouettes
- **Must do:** tile seamlessly and avoid crowding the play lane

#### `public/games/gryphon-patrol/parallax-bottom-tiling.png`

- **Type:** parallax background
- **Description:** nearest terrain, cliffs, or lower cloud shelf with the strongest contrast
- **Must do:** tile seamlessly and support a sense of speed

#### `public/games/gryphon-patrol/player_gryphon_rider_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** heroic gryphon rider in side view with strong wing silhouette and clear rider profile
- **Rows:** move / attack / defend
- **Note:** defend row can read as shielded glide, barrel-roll, or wing-guard

#### `public/games/gryphon-patrol/sky_raider_3x3_pose_sheet.png`

- **Type:** 3x3 pose sheet
- **Description:** hostile airborne raider or corrupted flier, clearly distinct from the player silhouette
- **Rows:** move / attack / defend

#### `public/games/gryphon-patrol/word-orb.png`

- **Type:** pickup / prop
- **Description:** bright floating word orb that reads against both sky and cloud layers

#### `public/games/gryphon-patrol/feather-bolt.png`

- **Type:** projectile
- **Description:** magical feather-bolt or sky-lance shot with bright core and directional read

### Wiring Notes

- Preserve the current wraparound world math and minimap behavior.
- The parallax layers must be sized and cropped to work with repeated horizontal placement.
- The word labels on enemies and orbs may remain code-rendered if that stays clearer than baked art.
