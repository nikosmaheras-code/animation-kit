# Figma Motion → Motion (motion.dev) React export

`motion.dev` is the React animation library (the evolution of Framer Motion). The
**"React" export** in Figma Motion's Dev Mode emits **production-ready `motion/react`
code** — this is the canonical path from a Figma Motion file to a React app. Source:
https://motion.dev/docs/figma

## Export steps
1. Build/own the animation in **Figma Motion** (timeline, opened via the Motion
   button; add animations with the **+** in the Animations panel).
2. Switch to **Dev Mode**, select the **animated layer**.
3. In the **Motion panel**, choose **React** → generates **fully-valid Motion code
   you can copy-paste**.

## Code shape
Uses the `motion` component with **variants** + `initial`/`animate` states:
```jsx
import { motion } from "motion/react"

<motion.div variants={container} initial="hidden" animate="visible">
```
Variants are the export's native idiom — repeated/staggered motion comes out as a
shared `variants` object, not N inline tweens. (Matches the implement-motion rule:
factor repeats into `variants`, don't paste N times.)

## Gotchas
- **`framer-motion` import** — generated code may import from `"framer-motion"`. It
  still works, but **swap it to `"motion/react"`** (the recommended package). Same
  API, current home.
- **Motion must be pre-installed** in the project before pasting — follow the
  *Motion for React* quick start. The export assumes the runtime exists.
- This is the same fully-valid motion.dev output that `get_motion_context` returns
  as `codeSnippets` — use **verbatim, never regenerate** (see
  [[reference-figma-motion-mcp]] and `/figma-implement-motion`).

## Adjacent Figma↔Motion surfaces
- **Figma Sites** — no-code site builder; Motion powers its animations. Add **Hover**
  / **Press** effects via the **Interactions panel**; no install/setup.
- **Figma Make** — AI code generator (text/image/artboard → React); **auto-includes
  Motion imports** in the components it produces.

## Routing
This is the **code-out** path. For designing the motion in the first place, this
skill's other references. For pulling motion via the agent/MCP into a non-React
target (CSS, SwiftUI), use `/figma-implement-motion`.
