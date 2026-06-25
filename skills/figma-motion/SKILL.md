---
name: figma-motion
description: >-
  Design and reason about animation natively in Figma Motion — the timeline-based
  animation feature shipped in open beta at Config 2026 (June 2026). Use whenever
  the user wants to create, tune, review, or hand off motion built INSIDE a Figma
  design file: the Motion toolbar mode, the timeline/playhead, keyframing position/
  scale/rotation/opacity, preset animations, easing curves, spring animations,
  auto-keyframe, animated components, motion variables, prompting the Figma agent
  for keyframes, or Dev Mode motion inspection/export (CSS/JSON/React, MP4/GIF/
  WEBM/Animated SVG). Also the reference for "what's new from Config 2026."
metadata:
  type: reference
---

# Figma Motion (Config 2026)

Figma Motion adds a **timeline to the design canvas** so you can build
production-ready animations without leaving the design file. It shipped in **open
beta at Config 2026** (Moscone SF, June 23–25, 2026). Motion lives on Figma's core
platform, which is the whole point: **an animated component travels across every
screen, file, and collaborator the same way fills and typography do.**

## When to use this skill vs the other two motion skills

There are three distinct motion jobs. Pick by direction of work:

| You are… | Use | Why |
|---|---|---|
| Designing/tuning animation **inside a Figma file** (timeline, keyframes, presets, agent) | **this skill** (`figma-motion`) | native Motion-mode product knowledge |
| Authoring motion **programmatically via the `use_figma` plugin API** | `/figma-use-motion` (load with `/figma-use`) | scripted node mutation; gated behind `metronome_plugin_api` |
| Pulling an existing Figma animation **out into production code** | `/figma-implement-motion` | `get_motion_context` → motion.dev/CSS/SwiftUI |

The bridge between them: **`get_motion_context` and `get_design_context` are linked
by node id** (see [[reference-figma-motion-mcp]]). Figma Motion files inspected in
Dev Mode / shared over MCP feed straight into the implement-motion flow.

## Access & gating

- Toggle the toolbar to **Motion** in any file you have **`can edit`** on.
- Open beta is on **all plans**. A **paid Full seat** is required only for:
  **publishing animated components**, **agent-generated keyframes**, and
  **high-resolution video export**.
- The timeline appears at the bottom; minimize it to reclaim canvas.

## The 5 fundamentals (the lens for every motion decision)

1. **Timing** — how fast/slow it moves (speed + duration).
2. **Sequencing** — the order multiple animations play (choreography/stagger).
3. **Easing** — how it accelerates/decelerates (the "feel").
4. **Transformation** — which layer properties change over time.
5. **Exaggeration** — pushing past realism for personality/expressiveness.

Motion that "feels right" is almost always an easing + sequencing problem, not a
duration problem. Tune easing and stagger before reaching for raw ms.

## Three ways to create motion

1. **Presets** — select layers → **+** in the **Animations** section of the right
   sidebar → pick a type (fade, move, scale…). Fastest path; stack to play
   together or drag apart on the timeline to sequence.
2. **Manual keyframes** — keyframe **position, scale, rotation, opacity**
   independently for full control. Toggle **auto-keyframe** to record every change
   you make while the playhead is moving.
3. **Figma agent** — describe the motion in words; the agent writes real keyframes
   onto the timeline, within design-system + accessibility constraints. Then refine
   manually or keep prompting. (Requires Full seat.)

## Default workflow

1. **Block it out** with a preset or an agent prompt to get motion on the timeline fast.
2. **Set the structure**: which layers move, in what order (sequencing), total
   duration (new animations default to **2000 ms**).
3. **Tune the feel**: apply easing per keyframe / per animation; use springs where
   physical bounce helps.
4. **Systematize**: bind timing + easing to **variables**; promote reused motion to
   an **animated component**.
5. **Review**: leave **time-based comments** at specific moments; preview with
   Play/Spacebar; set playback to Loop/Once/Ping-pong.
6. **Hand off**: Dev Mode Motion tab → copy **CSS/JSON/React**, or **export
   MP4/GIF/WEBM/Animated SVG**, or share the frame over **MCP** to a coding agent.

## Reference files (load on demand)

- `references/config-2026.md` — every Config 2026 announcement (Motion, Shaders,
  Weave, Agent, Generative Plugins, Code Layers) with what each does.
- `references/timeline-and-keyframes.md` — timeline mechanics, tracks, playhead,
  auto-keyframe, playback modes, zoom/navigation, duration handles.
- `references/easing-and-springs.md` — the 8 Bézier presets + when to use each, the
  curve editor (4 values / 2 control points), the 4 spring presets, spring params
  (stiffness/damping/mass/bounce), and the arrivals/departures/internal rule.
- `references/presets-and-properties.md` — preset animations, keyframeable
  properties, shader-exposed properties, stacking vs sequencing.
- `references/agent-prompting.md` — prompt recipe (variants/targets/intent/
  properties/constraints), bulk-apply strategies, the explore→refine loop.
- `references/components-variables-handoff.md` — animated components, motion
  variables + modes, Dev Mode inspection, export formats, MCP handoff.
- `references/motion-dev-react-export.md` — the Dev Mode **React** export to
  `motion/react` (motion.dev): exact code shape (`motion` + variants), the
  `framer-motion`→`motion/react` import swap, Figma Sites / Figma Make surfaces.
- `references/advanced-and-limits.md` — full-capacity leverage (trim paths, masks,
  timing-vs-easing variables + modes, shader-driven spatial motion) **and** the
  hard limitations (no saved custom presets, springs not variable-able, weak video
  layers, Motion ≠ Prototype mode, lossy exports). Read this for "use it fully."

## Hard rules

- **Easing carries the feel** — arrivals ease-out, departures ease-in, internal
  movement ease-in-out, mechanical/looping linear. Default to these before custom.
- **Custom Bézier curves are saveable as variables; custom springs are NOT** —
  copy/paste the numeric spring values to replicate. Plan systems around Bézier
  variables.
- **Animate the component, not the instance** — motion as a design-system primitive
  is the leverage. One component update propagates everywhere.
- **Honor `prefers-reduced-motion` downstream** — when this Motion gets implemented
  in code, the reduced-motion guard is mandatory (see `/figma-implement-motion`).
- **Never fabricate timing/easing values** when implementing — read them from Dev
  Mode / `get_motion_context`, don't eyeball a screenshot (resting state only).
