# Advanced leverage & limitations

## Motion variables: timing vs easing (the system layer)
Two variable types, both with **modes** (like any Figma variable collection):
- **Timing variables** — time values in **milliseconds**; define how long an
  animation takes (duration/delay). Ensures every animation uses the same approved
  durations instead of arbitrary numbers.
- **Easing variables** — an **easing curve OR a spring**; control how a property
  progresses (accelerate / decelerate / bounce).

Because they carry **modes**, you can define e.g. a `calm` vs `energetic` mode (or
per-brand timing), and switching the mode **re-times every animation that
references the variable** at once. This is the real "motion system" — change one
mode, the whole product's motion personality shifts.

Caveat (repeat of the springs gotcha): **custom Bézier curves save as variables;
custom springs do NOT.** Build the system on Bézier easing variables + timing
variables; keep bespoke springs as local one-offs.

## Animated components (the propagation layer)
Animate a component once → the motion behaves like any published library asset:
it travels to every instance, screen, file, and collaborator, and a single edit
updates them all. **Publishing animated components requires a Full seat.** This is
the highest-leverage move in Motion — animate the *component*, never the instance.

## Shader-driven spatial motion (the expressive ceiling)
With Config 2026 shaders in the same file, every shader property is keyframeable,
so you can prototype **card flips, perspective menus, depth/parallax transitions** —
3D-feeling motion that was impossible in Figma before. Reach here when flat
transform/opacity motion can't express the idea.

## The agent as a force-multiplier, not a starting gun
Use the agent for **breadth**: "create 3 variants" to explore directions, then
apply one consistent style across many elements, then bulk-refine. Don't use it to
hand-keyframe one element you could do faster yourself. (Full detail in
`agent-prompting.md`.)

## Limitations — know these before you commit a workflow
- **No saved custom presets** — you can't save a bespoke preset for reuse yet.
  Systematize via animated components + variables instead.
- **Custom springs aren't variable-able** — copy/paste the numeric values.
- **Video layers are weak** — videos in carousels may not auto-play within an
  animation; complex video work still needs an external tool (After Effects /
  Remotion).
- **Motion ≠ Prototype mode.** Interactive prototypes still use the older
  transition types (**Instant, Dissolve, Smart Animate**) and are more limited than
  the Motion timeline. Motion is for *authoring animation/video*; prototype mode is
  for *clickable interaction flows*. Don't expect Motion keyframes to drive
  prototype navigation.
- **Open beta** — features may change and you may hit performance issues on heavy
  files. Keep timelines scoped.
- **Some properties don't export cleanly** — text animations, path animations,
  masks/booleans, and variant/transition flows can be lossy on code export; verify
  in Dev Mode and check the implement-motion lint rules
  (`/figma-implement-motion` → `references/unsupported-and-fallbacks.md` +
  `motion-lint-rules.md`).

## "Full capacity" checklist
1. Block with **presets** or an **agent prompt** (3 variants).
2. Keyframe the **right properties** — including **trim paths** (spinners) and
   **masks** (reveals), not just x/y/scale/opacity.
3. Tune **easing per segment** (arrivals out / departures in / internal in-out /
   mechanical linear); use **springs** for expressive bounce.
4. Get **sequencing/stagger** right by offsetting track starts.
5. **Systematize**: timing + easing **variables with modes**; promote to an
   **animated component**.
6. Reach for **shader-driven** motion for spatial/3D ideas.
7. **Review** with time-based comments; preview Once/Loop/Ping-pong.
8. **Hand off** via Dev Mode (CSS/JSON/React), export (MP4/GIF/WEBM/SVG), or MCP —
   reading real values, honoring reduced-motion downstream.
