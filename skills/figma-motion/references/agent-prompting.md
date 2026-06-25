# Prompting the Figma agent for motion

The Figma agent writes **real keyframes onto the timeline** from a text prompt,
within design-system + accessibility constraints. (Requires a Full seat.) Then you
refine manually or keep prompting. Three workflows: **explore** directions,
**apply** a consistent style across many elements, **refine** with precision bulk
edits.

## Prompt recipe
A strong prompt names some of these (none are mandatory; they give the agent a
starting point):
- **Variant count** — "Create **3** motion variants…" (exploration is cheaper than
  perfecting one attempt).
- **Animation targets** — which layers animate vs. stay static.
- **Emotional intent** — snappy, playful, cinematic, calm, energetic.
- **Motion properties** — which aspects vary: easing, duration, stagger.
- **Constraints** — what stays constant across variants.

Example: *"Create 3 variants of the card list animating in. Cards stagger upward;
keep the header static. Snappy feel. Vary easing and stagger only; total duration
under 800 ms."*

## Applying motion in bulk
Three approaches that work:
1. **Reference an existing animated component** — "match the motion of the
   already-animated chart."
2. **Describe explicitly** — give exact easing curves and timing values.
3. **Provide adaptation rules** — for elements with different structure, tell the
   agent how to adapt (e.g., "stagger by child count").

The agent keeps motion **consistent across a library** by applying one style while
**adapting the animation to each component's structure**.

## The loop
Explore options fast → narrow **from three to one** → then **dial in timing,
easing, and choreography** until it feels exactly right. Getting to one good
candidate beats over-polishing the first idea.

## Note for code-side work
This is *authoring inside Figma*. To have an agent generate motion programmatically
via the plugin API instead, that's `/figma-use-motion`. To pull agent-made motion
into production code, that's `/figma-implement-motion` via `get_motion_context`.
