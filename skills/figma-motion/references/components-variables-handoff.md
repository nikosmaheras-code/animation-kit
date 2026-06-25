# Animated components, motion variables, and handoff

## Animated components — the leverage
Because Motion is built on Figma's platform, motion becomes a **design-system
primitive**. Animate a component **once** and that motion **travels across every
screen, file, and collaborator** — the same way fills and typography propagate.
Update the component's motion → it updates everywhere. (Publishing animated
components requires a Full seat.)

**Rule: animate the component, not the instance.** One-off instance animations
don't propagate and create drift.

## Motion variables
- Bind **timing** and **easing** to **variables**, with **multiple modes**.
- Changing a **mode** updates **every animation that references it** — e.g., a
  "calm" vs "energetic" mode, or per-brand timing.
- **Custom Bézier curves can be saved as variables**; **custom springs cannot**
  (copy/paste their numbers). Build systems on Bézier variables.

## Review with time-based comments
Drop comments at **specific moments** in the animation so the whole team reviews
motion on the canvas, anchored to the frame in question.

## Dev Mode inspection
Switch to **Dev Mode → Motion tab**: the **full timeline is read-only inspectable**
— every timing value, easing curve, and keyframe is readable **without
interpretation**. Developers can scrub at full fidelity.

## Export & handoff formats
- **Code**: copy directly as **CSS**, **JSON**, or **React / motion.dev**.
- **Video/asset**: export **MP4, GIF, WEBM, or Animated SVG** from the file.
  (High-resolution video export requires a Full seat.)
- **MCP**: share the animated frame link with a coding agent; it preserves full
  motion context. This is the same `get_motion_context` channel the
  `/figma-implement-motion` skill consumes — node-id-linked to `get_design_context`
  (see [[reference-figma-motion-mcp]]).

## Handoff checklist
1. Confirm motion lives on the **component**, not instances.
2. Confirm timing/easing are **variables**, not hardcoded per layer.
3. In Dev Mode, **read the real values** — never eyeball a screenshot (resting
   state only) or fabricate timing.
4. Choose the channel: copy code, export video, or MCP link to the coding agent.
5. Downstream code must honor **`prefers-reduced-motion`**.
