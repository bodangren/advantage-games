# Asset Specification: Potion Rush

## 1. The Threat (Background)

### 1.1 Monster (Ogre/Troll)
**Style:** Large, menacing, cartoon-fantasy.
**Format:** Sprite Sheet or Individual PNGs.

| State | Description | Frames |
|-------|-------------|--------|
| **Idle/Ready** | Standing outside, breathing, looking at door. | 2-3 |
| **Attack** | Smashing the door with club/fist. (Synced with screen shake). | 2-3 |
| **Roar/Win** | Arms raised, roaring (Game Over). | 2 |
| **Defeated** | Turned into a frog OR blasted back. | 1 |

### 1.2 Dungeon Door
**Style:** Heavy wood with iron reinforcements.
**Format:** Individual PNGs (States).

| State | Description |
|-------|-------------|
| **Solid** | Intact door. (Time: 30s - 20s) |
| **Cracked** | Visible wood splinters. (Time: 20s - 10s) |
| **Broken** | Holes appearing, hinges loose. (Time: 10s - 0s) |
| **Shattered** | Debris on floor (Game Over). |

---

## 2. The Lab (Foreground)

### 2.1 Workstation
*   **Conveyor Belt:**
    *   **Belt Tile:** Seamless texture (leather/stone) for looping.
    *   **Gears:** Rotating cogwheels for the ends of the belt.
*   **Cauldron:**
    *   **Empty:** Dark liquid level.
    *   **Filling:** Liquid color (Green/Purple) overlay that scales up.
    *   **Front/Rim:** The "lip" of the cauldron (to mask the liquid rising behind it).

### 2.2 Ingredients (Interactables)
*   **Ingredient Bag:**
    *   **Closed:** Standard burlap sack. Text rendered on top.
    *   **Flying:** Slightly rotated version for the "throw" animation.
*   **Splash Effect:** Droplets rising (when bag hits cauldron).
*   **Explosion Effect:** Smoke puff + Flash (when wrong bag chosen).

### 2.3 Recipe UI
*   **Scroll/Parchment:** Background panel for the sentence text.
*   **Vial/Meter:** A glass tube on the UI showing 0-10 progress (Alternative to looking at Cauldron liquid).

---

## 3. Audio (Suggested)
*   **BGM:** "Hurry Up" style looping track.
*   **SFX:**
    *   Conveyor hum (low volume).
    *   Door Bang (Heavy thud).
    *   Correct (Splash/Chime).
    *   Incorrect (Explosion/Glass Break).
    *   Monster Roar.
