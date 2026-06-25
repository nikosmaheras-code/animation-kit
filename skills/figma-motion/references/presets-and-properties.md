# Preset animations & keyframeable properties

## Keyframeable properties
- **Position, scale, rotation, opacity** — the four core transforms, each keyframed
  **independently** (its own track), so a layer can finish one transform before
  another.
- **Trim paths** — animate the start/end of a vector stroke so a path draws on,
  grows, and shrinks. This is how you build a **spinner / loading indicator** that
  grows and shrinks as it rotates. (Exports as `PATH_TRIM` / `stroke-dasharray` /
  `motion.path` — see `/figma-implement-motion` SVG-path handling.)
- **Masks** — animating a mask (or the masked layer behind it) produces **reveal /
  wipe** effects non-destructively (the masked pixels are hidden, not deleted).
  Note: masks are among the features that **don't always export cleanly** — verify
  on handoff.
- **Shader-exposed properties** (Config 2026 custom shaders) — **every** property a
  shader exposes (anything with a slider/input) is keyframeable. This is what
  unlocks **spatial interactions previously impossible in Figma**: card flips,
  perspective menus, depth-based transitions.

## Applying a preset
1. Select the layer(s) to animate.
2. Click the **+** in the **Animations** section of the **right sidebar**.
3. Choose an animation type. **Available settings vary by type.**

Common preset types referenced by Figma: **fade, move, scale.**

## Stacking vs sequencing
- **Stack** multiple presets on one layer to play **simultaneously** (e.g., fade +
  move = a slide-in-and-appear).
- **Sequence** them by dragging their tracks apart on the timeline so one follows
  another.

## Customizing after applying
Select the animation (on the timeline or in the sidebar) and adjust:
- **Animation type**
- **Type-specific settings**
- **Duration**
- **Easing**

## Working pattern
Presets are the fastest way to get *something* moving so you can judge timing and
sequencing in context. Block with presets → then replace/refine with manual
keyframes only where the preset can't express what you need. Don't hand-keyframe a
plain fade that a preset already nails.
