---
name: motion-dev
description: >-
  Author web/React animation in code with Motion (motion.dev — the `motion/react`
  package, formerly Framer Motion). Use when building or hand-writing animation in a
  React/web codebase: the `motion` component, initial/animate/exit, transitions,
  springs, easing, keyframes, variants, stagger, repeat/loop/mirror, gestures
  (hover/tap/inView/drag), layout animations, AnimatePresence, scroll-linked motion,
  and SVG path drawing (pathLength). This is the CODE-AUTHORING counterpart to the
  Figma Motion design feature — its controls map 1:1, and it is the exact library
  Figma Motion's React export targets. For consuming a Figma export, use
  /figma-implement-motion; for designing in Figma, use /figma-motion.
metadata:
  type: reference
---

# Motion (motion.dev / `motion/react`)

Motion is the React/web animation library at **motion.dev**. It is the **current
form of Framer Motion** — same project and author, spun out and rebranded; the
`framer-motion` npm package is the legacy alias. **Install `motion`, import from
`motion/react`.** It is also the library **Figma Motion's React export emits**, so
this skill is the code-side twin of `/figma-motion`: the controls map 1:1.

```bash
npm i motion
```
```jsx
import { motion, AnimatePresence } from "motion/react"
```

## When to use which of the three motion skills

| You are… | Use |
|---|---|
| Designing/tuning motion **inside Figma** | `/figma-motion` |
| **Consuming** a Figma motion export into a repo | `/figma-implement-motion` (uses snippets verbatim) |
| **Authoring** web/React animation in code from scratch | **this skill** (`motion-dev`) |

If a Figma export exists, prefer `/figma-implement-motion` and **use its snippets
verbatim** — don't re-derive them here. This skill is for original code-side motion.

## The control parity with Figma Motion (why this is the matching library)

| Figma Motion control | `motion/react` |
|---|---|
| Keyframes (timeline) | array values: `animate={{ x: [0, 100, 50] }}` + `transition.times` |
| Presets (fade/move/scale) | `variants` objects |
| 8 Bézier easings | named eases + `ease: [x1,y1,x2,y2]` (Back ↔ `backIn/backOut/backInOut`, Hold ↔ `times` + instant step) |
| Springs (stiffness/damping/mass **+ Bounce**) | `type:"spring"` with `{stiffness,damping,mass,velocity}` **or `{bounce,visualDuration}`** — Figma's Bounce maps to `bounce` |
| Sequencing / stagger | `delayChildren: stagger(0.1)` + `staggerChildren` |
| Once / Loop / Ping-pong | `repeat` + `repeatType: "loop" \| "reverse" \| "mirror"` (mirror = ping-pong) |
| Trim paths (draw-on) | `motion.path` + `pathLength` / `pathOffset` / `pathSpacing` |
| Animated components | `variants` + reusable `motion` components |
| Loop/once/playback | `repeat: Infinity`, `repeatDelay` |

## Minimal mental model

- A `motion.<tag>` element animates between **`initial`** → **`animate`** (and
  **`exit`** under `AnimatePresence`), shaped by **`transition`**.
- **Values** = what changes (x, scale, opacity, color, pathLength…). **Transition**
  = how (type, duration, ease/spring, repeat, stagger).
- **Variants** are named state objects shared across elements — the code analog of
  Figma presets + animated components — and they **propagate to children** (which is
  how stagger works).

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", visualDuration: 0.5, bounce: 0.2 }}
/>
```

## Reference files (load on demand)

- `references/core-api.md` — `motion` component, initial/animate/exit, `transition`,
  `AnimatePresence`, gestures (`whileHover/whileTap/whileInView`), `drag`, layout
  animations, `motion.create`, imperative `useAnimate`.
- `references/transitions-easing-springs.md` — exact spring APIs (bounce/duration &
  physics), the full named-ease list, cubic-bezier arrays, `repeat`/`repeatType`,
  and the Figma-easing → motion mapping.
- `references/keyframes-variants-stagger.md` — keyframe arrays + `times` +
  per-keyframe ease, `variants` + propagation, `stagger()`/`staggerChildren`,
  orchestration (`delayChildren`, `when`).
- `references/svg-and-paths.md` — `motion.path` + `pathLength` = Figma trim paths;
  drawing/spinner patterns; `pathLength="1"` normalization.
- `references/figma-parity-and-handoff.md` — full Figma Motion ↔ motion.dev mapping,
  the `framer-motion`→`motion/react` migration, and how this dovetails with
  `/figma-implement-motion` and [[reference-figma-motion-native]].

## Hard rules

- **Import from `motion/react`.** If code (or a Figma export) imports `framer-motion`,
  it still works, but migrate to `motion/react` — same API.
- **Springs are physics, not curves.** Never approximate a spring as a cubic-bezier;
  use `type:"spring"`. Prefer `bounce`+`visualDuration` for designed feel (it's what
  maps to Figma's Bounce), physics params only when you need exact control.
- **Don't paste the same transition N times** — factor shared motion into a
  `variants` object or a reusable component and vary by `custom`/stagger.
- **Honor `prefers-reduced-motion`** — Motion respects it via `useReducedMotion()` /
  `MotionConfig reducedMotion="user"`; gate or soften animation, don't ship
  unconditional motion.
- **Match the repo's existing stack** — if it already uses GSAP/React Spring, adapt
  rather than adding Motion (mirror of the `/figma-implement-motion` rule).
