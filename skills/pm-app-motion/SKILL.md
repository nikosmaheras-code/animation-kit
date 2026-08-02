---
name: pm-app-motion
description: >-
  Polymarket app native motion kit — the exact spring, timing, scale, and haptic
  constants from the production iOS app, organized by action (button press, price
  odometer, fast-tap bet flight, cash out, phase/screen transitions, grid morph).
  Use whenever making a design, motion comp, prototype, or creative feel like the
  Polymarket app: annotating static frames with motion specs, authoring Figma
  Motion springs, choosing timings/damping for app-style animation, or matching
  the app's haptic language.
---

# Polymarket App — Native Motion Kit

Extracted 2026-07-22 from `Polymarket/mobile-app` source (exact constants, not eyeballed); Squads wave (§10) absorbed 2026-08-02 from PRs #2625/#2647/#2671.
Use these to annotate static designs so they ship feeling like the app.
Companion docs: `figma-screen-map.md`, `figma-production-map.md`.

**Stack**: all native (UIKit `UIViewPropertyAnimator` + `UISpringTimingParameters`, Metal for particles/gradients, Compose on Android). Lottie only for 3 canned assets (checkmark, logo loader, progress). **Rive was tried and removed** (PR #2377). No Figma-motion pipeline.

---

## 0 · Global laws (docs/guides/ui-conventions.md — enforced in design review §6)

- **Timing windows**: 0.15–0.25 s micro-interactions · 0.3–0.5 s transitions
- UIKit springs = `UISpringTimingParameters(mass:stiffness:damping:)`; SwiftUI mirrors with matching `.interpolatingSpring`
- Never animate off-screen (`window != nil` gate); apply instantly instead
- **Haptic map** (`CUITheme.Haptic`): tap/row/card `.light` · toggle/tab/scrub `.selection` · trade confirmed `.success` · failure `.error` · validation `.warning` · long-press `.heavy` · staggered entrance beats `.light` per beat · auth rejected `.doubleTap`. **`.soft` and `.medium` are banned.**

## 1 · Button press (every button/card) — `CUIScalablePressInteraction.swift`

| Param | Value |
|---|---|
| Press-down scale | **0.96** |
| Press-down duration | **0.05 s** |
| Release duration | **0.10 s** |
| Haptic | `.light` on **release** (none on press-down by default) |

Static-design annotation: `[press: scale .96 · 50ms in / 100ms out · haptic .light]`

## 2 · Value/price changes (the odometer) — `CUIAnimatedLabel+AnimationStyle.swift`

Transition types: `scale` · `rolling` (odometer digits) · `slide`.

| Style | mass | stiffness | damping | stagger/char | fade |
|---|---|---|---|---|---|
| **snappy** (= default) | 1 | 350 | 30 | 0.015 s | 0.15 s |
| smooth | 1 | 170 | 26 | 0.05 s | 0.20 s |
| bouncy | 1 | 300 | 22 | 0.04 s | 0.18 s |

Characters animate individually with the per-character stagger — that's the ripple.
Micro-controls (radio/checkbox border): spring stiffness **600**.

## 3 · LiveTrade fast-tap bet placement — `USLiveTradeBetPlacementAnimator.swift` + `LabelFlightDirector.swift`

The signature interaction. Choreography when you tap $25/$50/$100:

1. A **copy of the tapped label** detaches and flies a quadratic arc to the position `$` display. Source label hides, fades back after 0.08 s (0.08 s fade).
2. **Flight: 0.5 s**, scale envelope **1.0 → 2.0 (peak) → 0.5** (`betFlight`), random peak rotation **4–8°**, arc midpoint inset 0–80 pt, edge padding 12.
3. Opacity: 1.0 until t=0.6, fades to 0 over t=0.6→0.95.
4. Position value **commits ~0.1 s before landing** (t≈0.8) so the odometer pops in sync with the arrival.
5. Landing pop on the destination label: scale **1.15** then settle, spring damping **0.55** (the bounciest spring in the app).
6. Can't afford → no flight, `.error` haptic immediately.
7. Overlapping flights allowed (rapid taps stack).

Annotation: `[bet-fly: arc 500ms · 1→2→0.5 · rot ±4-8° · commit@80% · land-pop 1.15 ζ.55]`

## 4 · Cash out — `USLiveTradeCashOutAnimator.swift`

1. Action button **scrunches to 0.9**, then collapses to **scale 0.6 + fade out**, spring damping **0.6**.
2. Position value **enlarges 1.14**; PnL label appears at center.
3. Balance label flies with **`cashOutFlight` envelope 1.0 → 0.6 → 0.2** down to the wallet; peak-balance label rest scale = **15/68 ≈ 0.22** (it lands into the 15 pt wallet line from the 68 pt hero size).
4. Restore springs at damping **0.85**. Haptic `.success` on confirmation.

## 5 · Phase transitions (intro ↔ pick-a-side ↔ trading) — `USLiveTradePhaseTransitionAnimator.swift`

| Beat | Duration |
|---|---|
| Pick-a-side exit | 0.25 s |
| Pick → trading (main) | **0.42 s** |
| Pick → trading settle | 0.28 s |
| Cleanup delay | 0.30 s |
| Intro enter | 0.30 s (after 0.20 s delay) |
| Intro exit | 0.20 s |
| Trading → intro exit | 0.24 s (enter delay 0.06 s) |
| Button exit transform | scale **0.85** |

## 6 · Screen transitions — `USLiveTradePresentTransition.swift` / `USLiveTradeSlideTransition.swift`

**Present (modal zoom)**: 0.34 s in / 0.28 s out · spring damping **0.88**, velocity 1.0 · chrome fades starting at 40% progress · background fade 0.25 s.
**Slide (card sheet)**: **0.48 s present / 0.36 s dismiss** · damping 0.86–0.88 · corner radius **28** · shadow opacity 0.28, radius 24, offset (0,10) · programmatic dismiss initial velocity dy **4.6** · backdrop fade distance 200 pt.

## 7 · Grid mode morph (card ↔ grid) — `USLiveTradeGridCoordinator.swift` / `GridMorph.swift`

Release spring **0.55 s** (min 0.25 s) at damping **0.8** · zoom 0.32 s at damping **0.92** · gesture: reveal at 150 pt drag, retract at 130 pt, commit at 60% progress · pager snap spring damping 0.82.

## 8 · Spring damping census (what "feels like the app" numerically)

Almost everything lives in **ζ 0.78–0.92**: bottom bar 0.9 · root/trading 0.85–0.88 · pager 0.82 · grid release 0.8 · grid zoom 0.92 · modal present 0.88 · Squads avatar bubbles/flair 0.78 (reconfirmed 2026-07-28 wave). The two intentional outliers: **flight landing pop 0.55** and **cash-out collapse 0.6** — bounce is reserved for money moments.

## 9 · Ambient/celebration layers

- **Mesh gradient**: Metal, 30 fps, speed 1.6, amplitude 0.55 (see the treatments generator — same math)
- **Coin explosion**: Metal particles (`USLiveTradeCoinExplosion.metal`) + rocket trail + `CoinBurstHapticPlayer` (haptics choreographed to particles)
- **Chart spike**: `ChartSpikeHapticPlayer` — haptic follows the graph
- **Trade flurry**: team-colored (`ETrade+CUITeamTradeFlurry`), tinted per matchup

## 10 · Squads wave (PRs #2625/#2647/#2671, merged 2026-07-23→28)

Three new house patterns; the census law (§8) holds — every new spring sits at ζ 0.78.

### 10a · Avatar bubble group — `USSquadsAvatarBubbleGroup.swift`
- Content change / bubble pop-in: spring **0.4 s · ζ 0.78 · initial velocity 0.4**
- Bubble pop-out: **0.18 s ease-out**
- **Dormant ambient drift** (`isDormantMotionEnabled`, **off by default**): `UIUpdateLink`-driven dual-sine Lissajous per bubble.
  - Base speed **0.45 rad/s**; per-bubble variance X ×0.85–1.15 / Y ×0.80–1.12, phases seeded via golden ratio (0.618034) so no two bubbles sync.
  - Amplitude = **min(0.48 × smallest rest gap, 0.053 × height) / √2** — the 0.48 gap-share guarantees neighbors never touch (two at 0.48 close ≤96% of their gap).
  - Whole-cluster swell **0.027 × height** at 0.32/0.26 rad/s — shared translation, so it can't change spacing; zero when layout is full-bleed.
  - Each axis mixes two sines **0.62/0.38** with incommensurate frequency multipliers (×1.87/×2.13 per bubble; ×1.93/×2.31 swell) — never visibly loops.
  - Amplitude eases toward target at **2.5/s** (new/re-slotted bubbles ramp in, never jump).
  - Hard gates: `window != nil`, **Reduce Motion honored**, transforms reset to identity on stop.
- Annotation: `[dormant-drift: 0.45rad/s · amp min(.48gap, .053h)/√2 · swell .027h · reduce-motion off]`

### 10b · Avatar flair entry/exit — `CUIAvatar.swift`
- Entry: from scale **0.92** + alpha 0 → identity, spring **0.4 s · ζ 0.78 · v 0.4**
- Exit: **0.22 s ease-in** → scale 0.92 + alpha 0
- Textbook house easing law: arrivals spring, departures ease-in.

### 10c · Scroll-morph header (settings) — `SquadsSettingsNavigationHeader.swift` + `USSquadsSettingsViewController.swift`
- Progress = `contentOffset / collapseDistance`, clamped 0–1. **Staggered keyframes: cluster morphs over 0→0.5 of progress, title follows over 0.1→1** — the shrinking cluster leads, the title docks behind it.
- Collapsed cluster **32 pt**, cluster→title gap 8 pt · divider alpha = progress · shadow opacity **0.08 × progress** (radius 8, offset (0,2)) · change-name link fully faded by progress **1/3**.
- **Never rest mid-morph**: on drag end, flick |velocity| > **0.3 pt/ms** commits in the flick's direction; slower release steers deceleration to the nearest end (midpoint rule). Snap is skipped entirely when content is too short to complete the collapse.
- Annotation: `[scroll-morph: cluster 0→.5 · title .1→1 · snap @.3pt/ms | midpoint]`

## 11 · Using this in static design

- Annotate frames with the bracket convention above; the constants here are the source of truth (file paths cited per section — verify against `main` if it's been months).
- Springs → Figma Motion: use spring curves with the same stiffness/damping (Figma Motion accepts spring params directly; see ~/.claude/skills/figma-motion).
- For motion comps in code: `~/motion-skills` (animation-kit) can take these as presets — the damping census (§8) is the house feel.
- Android mirrors everything: `ui/components/animations/`, `CUIHaptics.kt`, `CUISheetMotion.kt`.
