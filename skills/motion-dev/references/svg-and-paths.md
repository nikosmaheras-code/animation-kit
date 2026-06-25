# SVG & path drawing (= Figma trim paths)

Figma's **trim paths** property (spinners, draw-on strokes, loaders) maps to Motion's
**`pathLength`** family on `motion.path` / `motion.circle` / `motion.line` etc.

## Draw-on (stroke reveal)
```jsx
<motion.path
  d="M10 80 Q 95 10 180 80"
  fill="none" stroke="#fff" strokeWidth={4}
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.5, ease: "easeInOut" }}
/>
```
Motion normalizes the path so **`pathLength`, `pathOffset`, `pathSpacing` all run 0→1**
— you don't compute `stroke-dasharray` by hand (it does it under the hood).

- **`pathLength`** — how much of the path is drawn (trim end). `0`→`1` = draw on.
- **`pathOffset`** — where the drawn segment starts along the path (trim start /
  rotate the visible arc).
- **`pathSpacing`** — gap when dashing.

## Spinner / loader (Figma's "grows and shrinks as it spins")
Reproduce the trim-path loader with an animated `pathLength` arc plus rotation on a
wrapper:
```jsx
<motion.svg
  viewBox="0 0 50 50"
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
>
  <motion.circle
    cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth={4}
    animate={{ pathLength: [0.05, 0.8, 0.05], pathOffset: [0, 0.2, 1] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
  />
</motion.svg>
```
Spin (linear, on the wrapper) and trim (the arc growing/shrinking, on the circle) are
separate animations — same split Figma uses.

## Handoff note
When a Figma export's motion targets a vector's path (`PATH_TRIM` / `stroke-dasharray`
/ `motion.path`) but the design renders it as an `<img>`, **inline the SVG and animate
the real `<path>`** — don't leave it behind an image. (Full how-to in
`/figma-implement-motion` → `references/svg-and-path-motion.md`.)

## morphing vs drawing
`pathLength` *draws* a fixed path. To *morph* between different `d` shapes you need a
dedicated tool (GSAP `MorphSVGPlugin`, `flubber`) — Motion doesn't interpolate
arbitrary path data.
