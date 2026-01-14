# Spec: Potion Rush

## Overview
**Potion Rush** is a high-speed "Cloze" (fill-in-the-blank) game where players must select the correct missing word from a conveyor belt of ingredients to brew a potion before a monster breaks through the door.

## Visual Layout (2D Side View)

### Background Scene (The Threat)
*   **Left Side:** A large Monster (Ogre/Troll) standing outside.
*   **Center/Right:** A heavy Dungeon Door separating the monster from the lab.
*   **Action:** The monster continuously bangs on the door. The door visually cracks/shakes as the timer counts down.

### Foreground (The Lab)
*   **Top Center:** The **Recipe Scroll**. Displays the target sentence with a blank (e.g., *"The cat is ____ on the mat"*).
*   **Bottom:** A moving **Conveyor Belt** spanning the width of the screen.
*   **Bottom Right:** A bubbling **Cauldron**.
*   **Above Door:** The **Countdown Timer** (30s).

## Gameplay Loop

### 1. The Challenge
*   A sentence with a missing word appears.
*   **Ingredient Bags** move along the conveyor belt from Left to Right.
*   Each bag is labeled with a word (mix of the correct answer and distractors from other sentences).

### 2. Player Action
*   **Tap/Click a Bag:**
    *   **Correct:** The bag flies into the Cauldron. A splash effect plays. The **Potion Meter** fills by 10%. A new sentence appears immediately.
    *   **Incorrect:** The Cauldron explodes (screen shake, smoke). The **Potion Meter** resets to 0%. The current sentence remains.

### 3. Win/Loss Conditions
*   **Win:** Fill the Potion Meter (10 correct answers) before time runs out. The wizard throws the potion at the monster, turning it into something harmless (e.g., a frog) or blasting it away.
*   **Loss:** Timer reaches 0. The Door shatters, and the Monster roars (Game Over).

## Mechanics Details
*   **Timer:** Starts at 30 seconds.
*   **Conveyor Speed:**
    *   Increases slightly with each correct answer to build tension.
    *   Speed range: 100px/s to 300px/s.
*   **Word Selection:**
    *   Target word is hidden programmatically.
    *   Distractors are chosen from the *current* vocabulary list to ensure relevance.

## Technical approach
*   **Engine:** React-Konva (Canvas) for performance (handling moving belt, bags, monster animation).
*   **State:** Standard Game Loop (requestAnimationFrame).
