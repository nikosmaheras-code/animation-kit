# The Figma Motion timeline & keyframes

The timeline appears at the bottom of the screen when Motion mode is on. It is
where you set keyframes, place/length animations, and preview.

## Playback & duration
- **Play / pause**: click Play or press **Spacebar**.
- **Default duration**: a new animation is **2000 ms** long. Change it by typing a
  value or dragging the **right-side handle** of the track.
- **Time unit**: toggle between **seconds and milliseconds**.
- **Current time** indicator shows the playhead position; click to jump to a moment.
- **Scrub**: drag the playhead to preview any single moment.

## Playback modes
Click the playback control to cycle:
- **Once** — plays a single time.
- **Loop** — repeats continuously.
- **Ping-pong** — plays forward, then backward.

(These map to the `timelineCohorts` once/loop/boomerang groups exposed by
`get_motion_context` — see [[reference-figma-motion-mcp]].)

## Layer tracks
- Animating an object groups its animations under a **layer track**.
- **Reposition** a track by dragging it (changes when it plays = sequencing).
- **Adjust an object's whole duration** by dragging the handles on either side of
  its track.
- Collapse layers and minimize the timeline to reclaim canvas space.

## Keyframes
- Keyframe **position, scale, rotation, and opacity independently** — each property
  gets its own keyframes, so a layer can, e.g., finish moving before it finishes
  fading.
- Shader-exposed properties are also keyframeable (Config 2026 shaders tie-in).
- **Manual keyframing**: set keyframes yourself for precise control.
- **Auto-keyframe**: toggle on, then every change you make to an object **while the
  playhead is moving** is recorded as a keyframe automatically. Great for fast
  blocking; turn off when you want surgical control.

## Navigation / zoom
- Zoom with the **right-side slider**, **trackpad gestures**, or **modifier +
  mouse wheel** (**Cmd** on Mac, **Ctrl** on Windows).

## Practical sequencing tip
Sequencing (the order things play) is set by *where tracks/keyframes sit on the
timeline*, not by separate settings. To stagger a list, offset each item's track
start by a constant (e.g., 60–100 ms) — that constant is the "stagger."
