# pm-motion-loop — LEARNINGS (append-only)

The self-learning store. **Read this top-to-bottom at the start of every loop run** (Phase 0).
Append a dated entry at the END of every run that discovered, confirmed, or refuted something.
Never delete entries — strike through refuted ones with `~~...~~ REFUTED <date>: <why>`.

Entry format:

```
## YYYY-MM-DD · <file/node or context>
- **<CONFIRMED|REFUTED|NEW-RULE|KIT-DRIFT>** — <one line>. Why: <cause>. Apply: <what to do next time>.
```

When an entry changes a lint threshold or kit constant → also edit `kit-constants.json`
and cite the entry date in the JSON `$source` note. KIT-DRIFT entries (app source changed)
→ also update `pm-app-motion/SKILL.md` and bump its version.

---

## 2026-07-16 · MLS Livetrade timeline (seed — verified before this loop existed)

- **CONFIRMED** — Removing/rewriting `fills` color tracks BAKES values into static paints (glass 8% pill → solid white). Why: the plugin API writes through to the paint when tracks are destructured off. Apply: after any color-track removal, re-assert the node's static `fills` explicitly and read them back.
- **CONFIRMED** — Server `export_video` renders: ✅ TRANSLATION_X/Y/XY, SCALE_XY (groups/frames/nested), PATH_TRIM_START/END (vectors), OPACITY on TEXT/ELLIPSE leaves. ❌ `fills[i]` COLOR and `effects[i]` tracks — editor previews them, server ignores them. Apply: color/glow changes = layer crossfades or scale pop-ins of pre-styled twins.
- **CONFIRMED** — `applyManualKeyframeTrack({type:"INDEXED_ITEM", ..., field})` is rejected ("Unrecognized key(s): 'field'"). Apply: whole-object assignment `node.manualKeyframeTracks = { fills: {0:{keyframes}}, ... }`.
- **CONFIRMED** — `SCALE_XY` keyframe values must be `{type:"VECTOR", value:{x,y}}`, not FLOAT. Cloning nodes with text requires `loadFontAsync` for every font before `appendChild`.
- **CONFIRMED** — Working method: duplicate the design frame first (never animate the base); loop seams via HOLD-easing reset keyframes while elements are scaled out; verify cheap (480w/fps10/low ≈ 1 min) then ffmpeg crop+vstack strips of the region under test — never re-render a paid export to inspect a different region.
- **CONFIRMED** — `get_screenshot` caches by node id and ignores plugin-API mutations; it never shows motion. Only `export_video` proves animation.

## 2026-07-22 · Kit extraction (seed)

- **NEW-RULE** — Damping census: everything in the app lives at ζ0.78–0.92; ζ0.55–0.6 is reserved for money moments (bet landing pop, cash-out collapse). Anything else is off-brand — this is the #1 lint signal.
- **NEW-RULE** — Kit "bouncy" odometer preset (300/22) computes to ζ0.64 — inside the bounce band by design. A bouncy odometer style on a money value is legit; don't "fix" it to census.
- **NEW-RULE** — Linter cannot distinguish progress-normalized keyframe times (0–1) from sub-second time values; keyframe spans ≤1.0 are skipped. Duration truth comes from `timelineDuration`/`duration` keys or CSS snippets. Apply: always save the dump with timeline duration included (recursive get_motion_context does).

## 2026-07-22 · Live Trade bet-flight timeline (PERFORMANCE FACTORY ShvGOrzgCABguzqXsJaW1w, dup 14671:1264)

- **CONFIRMED** — Full kit §1+§2+§3 choreography (press 0.96 → 500ms arc flight 1→2→0.5 rot+6° → twin crossfade commit@80% → pop 1.15 ζ0.55) authored via whole-object `manualKeyframeTracks` and rendered correctly by server `export_video` in ONE render pass. Crossfade-twins for the odometer works exactly as designed.
- **NEW-RULE** — Appending overlay nodes (flight clones, crossfade twins) to an AUTO-LAYOUT root frame sucks them into the flow and can collapse them (text label came back 804×1 at the stack bottom). Why: auto-layout owns child geometry. Apply: set `layoutPositioning = "ABSOLUTE"` on each overlay BEFORE setting x/y/resize; cost one repair call this run.
- **CONFIRMED** — `figma.motion.physicalSpringToNormalized({mass:1, stiffness:256, damping:17.6})` (= kit ζ0.55, ω0 16) → `bounce: 0.45`. Kit ζ→bounce data point for CUSTOM_SPRING easings.
- **CONFIRMED** — Chained `detachInstance()` (top-level instance, then nested instance inside it) on a production-file DUPLICATE is the clean path to make instance-internal text/buttons keyframeable. (Instance-children keyframing resolved below — hard-rejected.)
- **CONFIRMED** — HOLD-easing step keyframes work server-side (source-label hide: 1 → HOLD 0 → linear fade back). First-keyframe-holds-back-to-t0 semantics render as documented — no redundant t=0 keyframes needed.
- **CONFIRMED** — `export_video` can return `downloadUrl` directly with no jobId polling round (beta behavior improved vs 07-16 session; don't hard-code the poll loop, branch on response shape).
- **NEW-RULE** — `node.clone()` on a page-level frame via `use_figma` parents the clone to `figma.currentPage` (which resets to the file's FIRST page every call), NOT to the source's page. The dup landed on a delivery page two pages away and survived unnoticed through the whole edit+render cycle (motion tracks work fine from any page). Apply: after cloning, explicitly `sourcePage.appendChild(clone)` — and verify `clone.parent.id === base.parent.id` in the same script.

## 2026-07-22 · Live Trade chart draw-on (same dup, second lap)

- **CONFIRMED** — Instance sublayers HARD-REJECT track writes: `Error: in set_manualKeyframeTracks: Cannot write animations to instance sublayers via the plugin API`. Clean throw, no silent failure — safe to try/catch with a detach fallback in one atomic script. Detach is mandatory, not just prudent.
- **CONFIRMED** — `PATH_TRIM_END` 0→1 draws this chart vector left→right and renders server-side (re-verified on a 1363px-wide path). Gotcha: trim fraction ≠ visible fraction when the path extends beyond the frame — 48% of this path sits off-canvas left, so the visible draw-on starts ~halfway through the trim window. Time the trim to the VISIBLE span, or accept the delay.
- **CONFIRMED** — `physicalSpringToNormalized` census data point: ζ0.80 (m1 k256 c25.6) → `bounce 0.2`. With 07-22 entry: ζ0.55→0.45, ζ0.80→0.2.
- **CONFIRMED** — Chip "new tick" pattern: TRANSLATION_Y −14px on the head chip with census spring reads as a live data tick without touching the path; offset ≤ chip radius keeps the line head visually inside the disc, so the detachment is invisible.

## 2026-07-22 · Live Trade ambient "live" loop (dup 14680:1264, third lap)

- **NEW-RULE** — **Comet-sweep pattern** for "live data flowing" on a chart: clone the line vector in place, restroke solid white ~0.45 opacity, animate PATH_TRIM_START trailing PATH_TRIM_END by ~0.2s (both 0→1 LINEAR), reset both to 0 with HOLD keyframes while invisible (END==START) → seamless loop, renders server-side. Two sweeps per 4s loop reads calm; the trim window IS the comet.
- **CONFIRMED** — Seamless ambient loops: make every track's t=0 value equal its t=duration value (heartbeat bobs 0→−5→0 ×2, scale 1→1.03→1 ×2, EASE_IN_AND_OUT). Loop/boomerang PLAYBACK mode is not settable via the plugin API surface (only duration is) — set it in Motion mode's playback control in the editor.
- **CONFIRMED** — First-party animation-style inventory (this account, 2026-07-22): exactly 6 presets — position, scale, rotation, size, opacity, path ("replaces and subsumes Path Draw and Path Travel"). No marketplace/third-party styles. Manual keyframes remain the tool for kit-exact constants; presets are convenience wrappers over the same fields.
- **CONFIRMED** — `clone()` of a NESTED node (vector inside a frame) parents to the source's parent correctly — the first-page gotcha applies only to page-level frames.

## 2026-08-02 · Kit refresh — Squads wave absorbed (KIT-DRIFT)

- **KIT-DRIFT** — Squads UI wave (mobile-app PRs #2625/#2647/#2671, merged 07-23→28) added three patterns, all census-conforming (ζ 0.78): avatar-bubble pop-in 0.4s ζ0.78 v0.4 / pop-out 0.18s ease-out; avatar flair entry 0.4s ζ0.78 from scale 0.92 / exit 0.22s ease-in; scroll-morph settings header (cluster keyframe 0→0.5, title 0.1→1, snap at flick 0.3 pt/ms else midpoint). New `ambientDrift` + `scrollMorphHeader` blocks added to kit-constants.json; pm-app-motion SKILL.md §10 + native-motion-kit.md updated.
- **NEW-RULE** — Dormant ambient drift (USSquadsAvatarBubbleGroup) is the house recipe for "alive but idle": dual-sine Lissajous, base 0.45 rad/s, amplitude min(0.48×minGap, 0.053×height)/√2, cluster swell 0.027×height, golden-ratio-seeded phases, amplitude ease 2.5/s. OFF by default and hard-gated on Reduce Motion — replicate both gates in any web/Figma port.
