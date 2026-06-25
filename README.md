# Motion Skills

A pair of [Claude Code](https://claude.com/claude-code) **skills** for working with
motion across the design↔code boundary: **Figma Motion** (the native timeline
animation feature shipped at Config 2026) and **Motion** (`motion.dev` /
`motion/react`, formerly Framer Motion) — the library Figma Motion's React export
targets. The two are built as a matched pair: their controls map **1:1**.

## What's in here

```
skills/
├── figma-motion/      design & reason about animation INSIDE Figma Motion
│   ├── SKILL.md
│   └── references/    config-2026 · timeline-and-keyframes · easing-and-springs ·
│                      presets-and-properties · agent-prompting ·
│                      components-variables-handoff · motion-dev-react-export ·
│                      advanced-and-limits
└── motion-dev/        author web/React animation in code with motion.dev
    ├── SKILL.md
    └── references/    core-api · transitions-easing-springs ·
                       keyframes-variants-stagger · svg-and-paths ·
                       figma-parity-and-handoff
docs/
└── figma-motion-reference.md   condensed standalone reference
```

## The motion workflow these cover

| Layer | Skill | Direction |
|---|---|---|
| **Design / understand** the native Motion feature | `figma-motion` | concept |
| **Author** motion in code (React/web) | `motion-dev` | code-native |
| **Author** motion *onto* the Figma canvas via `use_figma` | `figma-use-motion`¹ | code → Figma |
| **Extract** Figma motion *out to* production code | `figma-implement-motion`¹ | Figma → code |

¹ Ships with the official Figma MCP plugin — not included here; referenced for routing.

## Figma Motion ↔ motion.dev control parity

| Figma Motion control | `motion/react` |
|---|---|
| Timeline keyframes (per property) | array values + `transition.times` + `ease[]` |
| Presets / animated components | `variants` objects |
| 8 Bézier easings | named eases + `ease:[x1,y1,x2,y2]` (Back ↔ `backIn/backOut/backInOut`) |
| Springs (stiffness/damping/mass + **Bounce**) | `type:"spring"` `{stiffness,damping,mass}` or `{bounce,visualDuration}` |
| Sequencing / stagger | `stagger()` / `staggerChildren` / `delayChildren` |
| Once / Loop / Ping-pong | `repeat` + `repeatType: loop/reverse/mirror` |
| Trim paths | `motion.path` + `pathLength/pathOffset/pathSpacing` |

## Install

Drop a skill into your Claude Code skills directory:

```bash
# user-level (all projects)
cp -R skills/figma-motion skills/motion-dev ~/.claude/skills/

# or project-level
cp -R skills/figma-motion skills/motion-dev .claude/skills/
```

Claude auto-invokes a skill when a task matches its description; you can also call it
explicitly (`/figma-motion`, `/motion-dev`).

## Sources

Built from Figma Learn's Motion documentation set + the Figma Config 2026 announcement
and the [motion.dev](https://motion.dev) docs (API verified against current docs).

## License

MIT
