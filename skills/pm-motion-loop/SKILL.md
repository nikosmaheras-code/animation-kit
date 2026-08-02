---
name: pm-motion-loop
description: >-
  Self-learning optimization loop for editing UI motion timelines live in Figma Motion
  against the production Polymarket app kit (pm-app-motion). Runs a lint → edit → verify →
  learn cycle: deterministic linter scores every spring/duration/track against the app's
  damping census and timing laws, edits go through use_figma, cheap export_video renders
  verify, and every run appends verified findings to LEARNINGS.md so the next run starts
  smarter. Use whenever tuning, reviewing, or optimizing a Figma Motion timeline that must
  feel like the Polymarket app.
---

# pm-motion-loop — Figma Motion ⇄ Production App optimization loop

Companion skills (load them, don't reason from memory): **pm-app-motion** (the constants),
**figma-use** + **figma-use-motion** (before ANY `use_figma` call), **figma-motion** (concepts).
Production Figma files ↔ app code map: `~/creative-ops/livetrade-treatments/figma-production-map.md`.

The loop in one line: **SNAPSHOT → LINT → EDIT → VERIFY → LEARN, repeat until lint-clean + visual pass.**

---

## Phase 0 · PRIME (every run, no exceptions)

1. Read `LEARNINGS.md` in this skill dir top-to-bottom — it is the accumulated memory of every prior run.
2. Read `pm-app-motion/SKILL.md` for the target interaction's spec section (§1–§9).
3. Probe the motion flag: `figma.motion.figmaAnimationStyles()` in try/catch via `use_figma`.
   If any motion property throws `"<name>" is not a supported API`, **bail** — authoring isn't enabled.
4. Create a run dir: `runs/YYYY-MM-DD-<nodeid>/` under this skill (git-ignored ok). Everything lands there.

## Phase 1 · SNAPSHOT

1. Parse `fileKey` + `nodeId` from the shared URL.
2. `get_motion_context(fileKey, nodeId, recursive=true)` (cap 500 nodes) → save the RAW JSON
   to `runs/<run>/context-before.json`. This is the lint input and the rollback reference.
3. `get_design_context` for structure if the frame is unfamiliar.
4. **If editing: duplicate the frame first — never animate or mutate the base**
   (design-variants rule + baked-fills landmine both demand it).

## Phase 2 · LINT (deterministic — never eyeball springs)

```bash
node <skill-dir>/scripts/motion-lint.mjs runs/<run>/context-before.json          # human report
node <skill-dir>/scripts/motion-lint.mjs runs/<run>/context-before.json --json   # machine
```

Rules live in `kit-constants.json` (single source; edit it, not the script):
- **damping-census** — every spring's ζ must land in 0.78–0.92, or in the bounce band
  0.5–0.65 ONLY for money moments (linter can't know intent — it WARNs; you decide).
- **timing windows** — 150–250 ms micro / 300–500 ms transitions / 550 ms hard max.
- **render-landmine** — `fills`/`effects` tracks FAIL: server renders ignore them.
- **preset matching** — springs near snappy/smooth/bouncy and durations near named app
  moves PASS with the kit name, so you know what an existing timeline was going for.

Triage: fix FAILs; for each WARN decide money-moment-or-not from the pm-app-motion spec.

## Phase 3 · EDIT (via use_figma, on the duplicate)

- Load **figma-use + figma-use-motion** first. Whole-object track assignment
  (`node.manualKeyframeTracks = {...}`), never `applyManualKeyframeTrack` with `field`.
- `SCALE_XY` values are `{type:"VECTOR", value:{x,y}}`. `loadFontAsync` before cloning text.
- **After ANY color-track removal: re-assert static `fills` explicitly and read them back**
  (the baked-fills landmine — see LEARNINGS 2026-07-16).
- Snap constants to the kit spec section for the interaction, not to "close enough":
  carry stiffness/damping verbatim from `kit-constants.json`.

## Phase 4 · VERIFY

1. Re-dump: `get_motion_context` → `runs/<run>/context-after.json` → lint again. Must be
   0 FAIL; every remaining WARN must have a written money-moment justification.
2. Render cheap: `export_video` on the TOP-LEVEL frame — `WIDTH 320–480, quality "low",
   fps 5–10` → poll jobId → `runs/<run>/anim.mp4`.
3. `ffmpeg -ss <t> -i anim.mp4 -frames:v 1` strips of 4–6 phase frames (or crop+vstack for
   a region). Batch ALL fixes before any re-render; never re-render to inspect a new region.
4. Compare feel against the kit annotation for the interaction
   (e.g. `[bet-fly: arc 500ms · 1→2→0.5 · rot ±4-8° · commit@80% · land-pop 1.15 ζ.55]`).
5. Max **3 render iterations** per region; if still off, stop and report the residual delta.

## Phase 5 · LEARN (what makes this a loop, not a checklist)

At the end of EVERY run, append a dated entry to `LEARNINGS.md` (format is at its top) for
anything in these classes — if the run taught nothing, write nothing (no filler entries):

| Class | Trigger | Also do |
|---|---|---|
| **CONFIRMED / REFUTED** | An API behavior, render-support fact, or prior learning was tested | strike-through refuted entries |
| **NEW-RULE** | A lint false-positive/negative or a new landmine | adjust `kit-constants.json`, cite the entry date in its `$source` |
| **KIT-DRIFT** | Timeline matched the app but lint failed → app source changed | verify against `Polymarket/mobile-app` main, update `pm-app-motion/SKILL.md`, bump its version, `node ~/motion-skills/scripts/build-registry.mjs` |

Drift check heuristic: pm-app-motion cites file paths per section — if the extraction date
is >2 months old or a constant looks wrong, re-check those files before trusting the kit.

## Failure modes to expect (from LEARNINGS — read the full file anyway)

- Editor previews `fills`/`effects` tracks that server renders ignore → design color moves
  as crossfading pre-styled twins.
- `get_screenshot` caches by node id and never shows motion — only `export_video` is proof.
- Phantom "renderer bugs" after touching color tracks = the baked-fills landmine.
