# Keyframes, variants & stagger

These three are the code analog of Figma's timeline keyframes, presets/animated
components, and sequencing.

## Keyframes (multi-stop = a timeline track)
An array value animates through each stop in order:
```jsx
<motion.div animate={{ x: [0, 100, 50, 0] }} transition={{ duration: 2 }} />
```
- **`times`** — position of each stop on 0→1 (must match the array length):
  ```jsx
  animate={{ x: [0, 100, 0], transition: { times: [0, 0.3, 1] } }}
  ```
- **Per-segment easing** — an array of eases, one per transition between stops:
  ```jsx
  animate={{ x: [0, 100, 0], transition: { ease: ["easeOut", "easeIn"] } }}
  ```
- A leading `null` keyframe (`x: [null, 100]`) starts from the current value.
- This is exactly Figma's per-property independent keyframe track with per-segment
  easing — `times` is where the keyframes sit, `ease[]` is the line between them.

## Variants (presets + animated components)
Named state objects, passed once and referenced by label. The code form of a Figma
preset / animated component:
```jsx
const card = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.2 } },
}
<motion.div variants={card} initial="hidden" animate="visible" />
```
- **Propagation:** a parent's `initial`/`animate`/`while*` label flows to children
  with `variants` — children don't need their own `animate`. This is what powers
  stagger.
- **Dynamic variants** — a variant can be a function of `custom`:
  ```jsx
  const item = { visible: (i) => ({ opacity: 1, transition: { delay: i * 0.1 } }) }
  <motion.li custom={index} variants={item} />
  ```

## Stagger & orchestration
On the **parent** variant's transition:
```jsx
import { stagger } from "motion/react"

const list = {
  visible: {
    transition: {
      delayChildren: stagger(0.1, { startDelay: 0.2, from: "first" }),
    },
  },
}
// legacy/equivalent shorthand:
const list2 = { visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
```
- `stagger(each, { from: "first" | "last" | "center" | <index>, startDelay })` — the
  offset between each child. `from: "center"` ripples outward.
- This is Figma's sequencing/stagger: offset each track start by a constant.
- `when: "beforeChildren"` makes the parent animate before its staggered kids.

### Full pattern (list reveal)
```jsx
const list = { hidden: {}, visible: { transition: { delayChildren: stagger(0.08) } } }
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

<motion.ul variants={list} initial="hidden" animate="visible">
  {items.map((it) => <motion.li key={it.id} variants={item}>{it.label}</motion.li>)}
</motion.ul>
```
One shared `variants` object, rendered from `.map()` — never paste the transition per
item (the `/figma-implement-motion` "factor repeats into variants" rule).
