# Figma Motion — condensed reference

Figma Motion is native, timeline-based animation inside the design file, shipped in
**open beta at Config 2026** (June 23–25, 2026). Motion lives on Figma's core
platform, so an **animated component travels across every screen, file, and
collaborator** the way fills and typography do.

## Access & gating
- Toggle the toolbar to **Motion** (needs `can edit`). Open beta on **all plans**.
- A **paid Full seat** gates: publishing animated components, agent-generated
  keyframes, and high-resolution video export.
- New animations default to **2000 ms**.

## The 5 fundamentals
Timing · Sequencing · Easing · Transformation · Exaggeration. Most "feels off"
problems are easing + sequencing, not duration.

## Creating motion (three ways)
1. **Presets** — select layers → **+** in the Animations panel → pick a type
   (fade/move/scale). Stack to play together; drag apart to sequence.
2. **Manual keyframes** — keyframe position/scale/rotation/opacity (and shader props)
   independently; **auto-keyframe** records changes while the playhead moves.
3. **Figma agent** — describe the motion; it writes real keyframes (Full seat).

## Animatable properties
Position, scale, rotation, opacity (independent tracks) · **trim paths** (spinners /
draw-on) · **masks** (reveals, lossy on export) · **every shader-exposed property**
(unlocks spatial: card flips, perspective menus, depth).

## Easing
8 Bézier presets: Linear · Ease In · Ease Out · Ease In and Out · Ease In/Out Back
(×3) · Hold. Rule: **arrivals ease-out, departures ease-in, internal ease-in-out,
mechanical linear.** Custom curve editor = 4 values / 2 control points (x=time,
y=progress; outside 0–1 = overshoot). **Custom Bézier curves save as variables;
custom springs do NOT** (copy/paste numbers).

## Springs
Presets: Gentle · Quick · Bouncy · Slow. Params: Stiffness (bounces) · Damping
(spring level) · Mass (speed + height; edits duration) · Bounce.

## Systematize
Bind timing (ms) + easing (curve/spring) to **variables with modes** — switch a mode
to re-time the whole product. Animate the **component, not the instance**.

## Handoff & export
Dev Mode Motion tab = read-only full timeline (real values, no interpretation). Copy
**CSS / JSON / React (`motion/react`)**; export **MP4 / GIF / WEBM / Animated SVG**;
or share over **MCP** (preserves full motion context via `get_motion_context`).

## Limitations
No saved custom presets · custom springs not variable-able · weak video layers ·
**Motion ≠ Prototype mode** (prototypes still use Instant/Dissolve/Smart Animate) ·
open beta perf · text/path/mask/variant exports can be lossy.

## Code extraction (Figma → code)
A **two-tool, node-id merge — not a file pull**:
- `get_design_context` → structure, asset **URLs**, placement markers.
- `get_motion_context(recursive, cap 500)` → source of truth: `codeSnippets`
  (CSS `@keyframes` + motion.dev — **verbatim, never regenerate**),
  `keyframeBindings` (fallback), `fallbackNodeId`, `timelineCohorts`
  (once/loop/boomerang).
- Merge each motion node to design by **exact `data-node-id`** (fallback id only if
  exact fails, so per-instance motion stays separate); convert plain elements to
  `motion.{tag}`/wrappers. Assets are referenced by URL — don't download to read
  (except inline SVG for path-trim). Honor `prefers-reduced-motion`; factor repeats
  into `variants`; validate one animation end-to-end before batching.

## Other Config 2026 releases
Custom Shaders (WebGPU, prompt-made, every prop keyframeable) · Weave AI image tools ·
Figma Agent updates (custom skills / web search / MCP / file attach) · Generative
Plugins · Code Layers (closed beta, code-as-canvas + GitHub).
