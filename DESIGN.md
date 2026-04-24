---
version: 2.0.0
name: Obsidian Grimoire
colors:
  primary: "#FFFFFF"
  primary-foreground: "#000000"
  secondary: "#1A1A1A"
  secondary-foreground: "#FFFFFF"
  background: "#000000"
  foreground: "#FFFFFF"
  card: "#000000"
  card-foreground: "#FFFFFF"
  popover: "#0A0A0B"
  popover-foreground: "#FFFFFF"
  muted: "#1A1A1A"
  muted-foreground: "#A1A1AA"
  accent: "#FFD700"
  accent-foreground: "#000000"
  destructive: "#FF0000"
  border: "#FFFFFF"
  input: "#000000"
  ring: "#FFD700"
typography:
  display-lg:
    fontFamily: serif
    fontSize: 64px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: "-0.05em"
  display-md:
    fontFamily: serif
    fontSize: 48px
    fontWeight: 900
    lineHeight: 1.0
  headline-lg:
    fontFamily: serif
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1.1
  headline-md:
    fontFamily: serif
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.1
  title-lg:
    fontFamily: monospace
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
    textTransform: uppercase
  title-md:
    fontFamily: monospace
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    textTransform: uppercase
  body-lg:
    fontFamily: monospace
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.0
  label-md:
    fontFamily: monospace
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.0
spacing:
  0: 0px
  4: 4px
  8: 8px
  16: 16px
  24: 24px
  32: 32px
  48: 48px
  64: 64px
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  full: 0px
---

# Obsidian Grimoire Design System

## Philosophy
The Obsidian Grimoire is a brutalist, high-contrast visual identity designed to feel like a digital artifact—a mix of a medieval woodcut grimoire and a high-voltage command terminal. It rejects the softness of modern UI in favor of raw impact, aggressive typography, and absolute clarity.

## Color Palette: High-Voltage Monochrome
We use a strictly limited palette to maintain maximum tension and focus.

- **Obsidian Black (#000000):** The void. Used for all backgrounds and "ink" elements.
- **Bone White (#FFFFFF):** The etchings. Used for borders, text, and primary UI outlines.
- **Electric Gold (#FFD700):** The spark. Used sparingly for interactive highlights, critical focus, and achievements.
- **Dried Blood (#FF0000):** The warning. Reserved strictly for destructive actions and errors.

## Typography: The Scribe's Interface
Contrast is achieved by pitting archaic serifs against technical monospaced fonts.

- **The Woodcut (Serif):** Used for all major headers. It must be heavy, high-contrast, and feel physically etched into the screen.
- **The Terminal (Monospace):** Used for all UI labels, body text, and data. It provides a cold, technical counterpoint to the dramatic headers.

## Structural Mandates
- **Borders:** Every container MUST have a solid border. Standard weight is 3px Bone White.
- **Sharpness:** Rounded corners are strictly forbidden. Every element is a hard rectangle.
- **Shadows:** No blurs. Use hard, 100% opaque 4px offset shadows in Bone White or Electric Gold to communicate depth.
- **Negative Space:** Large, intentional blocks of Obsidian Black to create a sense of scale and focus.

## Component Guidelines
- **Buttons:** Sharp rectangles with 3px borders. On hover, invert the colors immediately (no transitions).
- **Cards:** Heavy borders with a 4px hard shadow.
- **Inputs:** Simple black boxes with a bottom border that turns Electric Gold when focused.

## Do's and Don'ts
- **Do:** Use absolute black and white.
- **Do:** Over-exaggerate font sizes for display titles.
- **Do:** Use thick, uncompromising borders.
- **Don't:** Use gradients, blurs, or transparencies.
- **Don't:** Use border-radius.
- **Don't:** Use "clean" or "modern" as justification for any design decision.
