# Easing & spring animations

Easing replicates physical logic — it controls whether motion accelerates,
decelerates, or both. It is the single biggest lever on how motion *feels*.

## Applying easing
- **Per animation/preset**: click the animation → choose from the **Easing** menu.
- **Per segment**: click the **line between two keyframes** → choose an easing type.
  This lets one layer ease differently between each pair of keyframes.

## The 8 Bézier presets and when to use each
| Preset | Behavior | Use for |
|---|---|---|
| **Linear** | uniform speed throughout | mechanical elements, spinners, looping |
| **Ease In** | accelerates toward the end | objects **leaving** the screen |
| **Ease Out** | starts fast, decelerates | objects **entering** the screen |
| **Ease In and Out** | smooth depart + arrive | movement **within** the screen |
| **Ease In Back** | winds up backward first | anticipation before a leaving move |
| **Ease Out Back** | overshoots, then settles | energetic landing of an entering object |
| **Ease In and Out Back** | wind-up + overshoot | expressive, characterful transitions |
| **Hold** | jumps instantly to final value | discrete steps in a multi-step sequence |

### The arrivals / departures / internal rule (default before going custom)
- **Arrivals (entering)** → **Ease Out** — quick to position, settles in.
- **Departures (leaving)** → **Ease In** — decisive exit.
- **Internal (mid-screen) movement** → **Ease In and Out**.
- **Mechanical / continuous loops** → **Linear**.

## The custom Bézier curve editor
- A Bézier curve is defined by **four values = two control points**, each with an
  **x and y** coordinate.
- **x-axis = time progression**, **y-axis = animation progress**.
- Values **outside 0–1** produce **wind-up (negative) / overshoot (>1)** — that is
  how the "Back" feel is built.
- **Custom curves CAN be saved as variables** for design-system reuse — this is how
  a brand-specific "feel" gets standardized.

## Spring animations
Springs model real spring physics instead of a fixed curve. Four presets:
| Preset | Feel | Good for |
|---|---|---|
| **Gentle** | minimal overshoot, slow settle | subtle scaling |
| **Quick** | fast response, short settle | notifications, taps |
| **Bouncy** | high energy, visible oscillation | playful motion |
| **Slow** | long settle, minimal overshoot | large/fullscreen content |

### Spring parameters (custom)
- **Stiffness** — number of "bounces"; adjust by dragging the graph.
- **Damping** — level of spring/oscillation; adjust from the graph.
- **Mass** — speed of the animation + bounce height; edit the **Mass** field
  manually. Changing mass **also changes the duration (ms)** value.
- **Bounce** — a single simplified knob for overall bounciness.

### Critical limitation
**Custom spring settings CANNOT be saved as variables** (only custom Bézier curves
can). To reuse a tuned spring, **copy/paste the numeric values** between
animations. Architect motion systems around **Bézier variables**, and reserve
springs for one-off expressive moments — otherwise they drift out of sync.
