# Figma Motion ↔ motion.dev parity & handoff

This skill is the code-authoring twin of `/figma-motion`. Anything designed in Figma
Motion has a direct `motion/react` expression, because Figma's React export *is*
motion.dev code.

## Full control map
| Figma Motion | motion.dev (`motion/react`) | Ref |
|---|---|---|
| Timeline keyframes (per property, independent) | array values + `transition.times` + `ease[]` | keyframes-variants-stagger |
| Preset animations (fade/move/scale) | `variants` objects | keyframes-variants-stagger |
| Animated components (propagate across uses) | shared `variants` + reusable `motion` components | keyframes-variants-stagger |
| 8 Bézier easings | named eases + `ease:[x1,y1,x2,y2]` | transitions-easing-springs |
| Spring presets + Stiffness/Damping/Mass/**Bounce** | `type:"spring"` `{stiffness,damping,mass,velocity}` or `{bounce,visualDuration}` | transitions-easing-springs |
| Sequencing / stagger | `stagger()` / `staggerChildren` / `delayChildren` | keyframes-variants-stagger |
| Once / Loop / Ping-pong | `repeat` + `repeatType: loop/reverse/mirror` | transitions-easing-springs |
| Trim paths | `motion.path` + `pathLength/pathOffset/pathSpacing` | svg-and-paths |
| Auto-keyframe / scrub | (authoring-time only; no code analog) | — |
| Motion variables + modes | hoist durations/eases into shared constants/theme; swap the object | — |
| Time-based comments, Dev Mode | n/a (review/handoff features) | — |

## `framer-motion` → `motion/react`
Framer Motion was rebranded to Motion. Same author, same API.
- **New code / Figma exports:** `import { motion } from "motion/react"`.
- **Legacy package** `framer-motion` still publishes and works — migrate the import
  when you touch the file; the rest of the API is unchanged.
- Figma's React export sometimes emits `from "framer-motion"` — swap it.

## How the three skills chain
1. **Design** in Figma → `/figma-motion` (timeline, presets, springs, variables).
2. **Export / extract** → `/figma-implement-motion` reads `get_motion_context`,
   returns **motion.dev snippets used verbatim** (CSS too). It owns the node-id merge,
   `transformOrigin`, interleaved transforms, reduced-motion, and the
   factor-into-variants rule.
3. **Author new / extend** → **this skill**. When there's no Figma source, or you're
   hand-writing motion that matches the Figma design language, build it here using the
   same control vocabulary.

Rule of thumb: **if a Figma export exists, consume it verbatim via
`/figma-implement-motion`; only author from scratch here.** Don't regenerate snippets
the tool already produced.

See [[reference-figma-motion-native]] and [[reference-figma-motion-mcp]] for the
Figma-side deep references.
