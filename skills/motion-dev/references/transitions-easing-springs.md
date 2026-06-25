# Transitions, easing & springs

The `transition` object controls *how* values animate. Two big families: **tween**
(duration + easing curve) and **spring** (physics). Plus **inertia** (for drag).

## Tween easing
```jsx
transition={{ duration: 0.4, ease: "easeOut" }}
transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}   // cubic-bezier (x1,y1,x2,y2)
```
Named eases:
`"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`, `"circIn"`, `"circOut"`,
`"circInOut"`, `"backIn"`, `"backOut"`, `"backInOut"`, `"anticipate"`.

### Figma easing → motion mapping
| Figma Bézier preset | motion `ease` |
|---|---|
| Linear | `"linear"` |
| Ease In | `"easeIn"` |
| Ease Out | `"easeOut"` |
| Ease In and Out | `"easeInOut"` |
| Ease In Back | `"backIn"` |
| Ease Out Back | `"backOut"` |
| Ease In and Out Back | `"backInOut"` |
| Hold | no smooth ease — hold then snap (use `times` with a flat segment, or `repeatType` stepping) |
| Custom curve (4 values) | `ease: [x1, y1, x2, y2]` — copy the four control points verbatim |

Figma's "arrivals ease-out / departures ease-in / internal ease-in-out / mechanical
linear" rule applies identically here.

## Springs (physics — the default for natural motion)
Two ways to specify the **same** spring:

**Designed feel (preferred — maps to Figma's Bounce):**
```jsx
transition={{ type: "spring", visualDuration: 0.5, bounce: 0.25 }}
```
- `bounce` 0 → no overshoot (critically damped); higher → more oscillation. This is
  the direct analog of Figma's spring **Bounce** parameter.
- `visualDuration` = the perceived time to reach the target (more intuitive than raw
  duration for springs).

**Physics constants (exact control):**
```jsx
transition={{ type: "spring", stiffness: 50, damping: 30, mass: 0.5, velocity: 2 }}
```
- `stiffness` ↑ = faster/snappier. `damping` ↑ = less oscillation (too low = endless
  bounce). `mass` ↑ = slower, heavier, bigger overshoot. `velocity` = initial speed.
- Maps to Figma's spring Stiffness / Damping / Mass.

> Never approximate a spring as a cubic-bezier — the physics feel is lost. If a Figma
> export gives a spring, keep it a spring.

## Repeat / loop / playback
```jsx
transition={{
  repeat: Infinity,           // or a finite count
  repeatType: "loop",         // "loop" | "reverse" (ping-pong) | "mirror"
  repeatDelay: 0.5,
}}
```
| Figma playback | motion |
|---|---|
| Once | (no `repeat`) |
| Loop | `repeat: Infinity, repeatType: "loop"` |
| Ping-pong | `repeat: Infinity, repeatType: "reverse"` (or `"mirror"` to ease symmetrically) |

## Orchestration knobs (on the parent transition)
- `delay` — wait before starting.
- `when: "beforeChildren" | "afterChildren"` — parent finishes before/after kids.
- `delayChildren`, `staggerChildren` — see `keyframes-variants-stagger.md`.

## Inertia (drag throw)
```jsx
transition={{ type: "inertia", velocity: 50, power: 0.8, timeConstant: 700 }}
```
Used with `drag` / momentum; decelerates from a release velocity.
