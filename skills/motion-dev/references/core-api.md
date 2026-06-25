# Motion core API (`motion/react`)

```jsx
import { motion, AnimatePresence } from "motion/react"
```

## The motion component
A `motion.<tag>` exists for every HTML/SVG element (`motion.div`, `motion.button`,
`motion.circle`, `motion.path`…). It animates without triggering React re-renders
(values are written straight to the DOM each frame).

```jsx
<motion.div className="box" animate={{ scale: 2 }} />
```

### initial / animate / exit
- **`initial`** — starting visual state (set `initial={false}` to skip the mount
  animation and start at `animate`).
- **`animate`** — target state; changing it re-animates.
- **`exit`** — state to animate to on unmount; requires an `AnimatePresence` ancestor.

```jsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    />
  )}
</AnimatePresence>
```
`AnimatePresence` notes: direct children need a stable unique `key`; use `mode="wait"`
to finish the outgoing exit before the incoming enters; `popLayout` to pop exiting
elements from layout flow.

### transition
Per-element or per-value timing (see `transitions-easing-springs.md`):
```jsx
<motion.div animate={{ scale: 1.2 }} transition={{ type: "spring" }} />
```
Per-value override:
```jsx
animate={{ x: 100, opacity: 1, transition: { opacity: { duration: 0.2 } } }}
```

## Gestures (animate on interaction)
```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
<motion.div whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} />
```
- `whileHover` / `whileTap` / `whileFocus` / `whileDrag` / `whileInView`
- Callbacks: `onHoverStart/End`, `onTap/onTapStart/onTapCancel`, `onViewportEnter/Leave`
- These accept a variant **label** too: `whileHover="hovered"`.

## Drag
```jsx
<motion.div drag dragConstraints={{ left: 0, right: 300, top: 0, bottom: 0 }}
  dragElastic={0.2} dragMomentum />
```
Props: `drag` (`true | "x" | "y"`), `dragConstraints`, `dragElastic`, `dragMomentum`,
`dragDirectionLock`, `whileDrag`.

## Layout animations (FLIP — animate layout changes automatically)
```jsx
<motion.div layout />                 {/* animates size/position changes */}
<motion.div layoutId="pill" />        {/* shared-element transition across components */}
```
`layout` animates when the element's layout changes; `layoutId` morphs between two
elements that share the id (tabs, expanding cards). Wrap reordering lists so siblings
slide.

## Custom components
```jsx
const MotionCard = motion.create(Card)   // Card must forward ref to its animated DOM node
```

## Imperative / sequenced control
```jsx
import { useAnimate } from "motion/react"
const [scope, animate] = useAnimate()
// animate(scope.current, { x: 100 }, { duration: 0.4 })
// sequence: await animate([[".a", {opacity:1}], [".b", {x:0}, {at: "-0.2"}]])
```
`useAnimate` is the code analog of scrubbing a timeline — explicit sequences with
relative `at` offsets. Use for orchestration that variants/stagger can't express.

## Reduced motion
```jsx
import { useReducedMotion, MotionConfig } from "motion/react"
const reduce = useReducedMotion()      // boolean
// or wrap the tree: <MotionConfig reducedMotion="user">…</MotionConfig>
```
