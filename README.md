# Animation Kit

A **curated [Claude Code](https://claude.com/claude-code) skills registry** for motion
& animation. Clone it, install the approved set, and your agent gains a vetted,
shareable animation toolkit. Built to **grow over time** — add a skill, run one script,
the registry regenerates.

Today it ships the motion design↔code pair:
- **`figma-motion`** — design/reason about animation inside **Figma Motion** (the native
  timeline feature from Config 2026).
- **`motion-dev`** — author web/React animation in code with **Motion** (`motion.dev` /
  `motion/react`, formerly Framer Motion) — the library Figma Motion exports to.

Their controls map **1:1**, so the kit covers the full loop: design in Figma → author or
extract in code.

## Quick start

```bash
git clone <repo-url> && cd animation-kit   # (repo name TBD)

# install all APPROVED skills into ~/.claude/skills
./scripts/install.sh

# or pick specific skills / a project target
./scripts/install.sh figma-motion motion-dev
./scripts/install.sh --target .claude/skills
```

Claude auto-invokes a skill when a task matches its description; you can also call it
explicitly (`/figma-motion`, `/motion-dev`).

## Repository layout

```
.
├── README.md                  ← you are here
├── REGISTRY.md                ← generated index of all skills (status, version, tags)
├── registry.json              ← machine-readable registry (source = each skill.json)
├── CONTRIBUTING.md            ← how to add a skill + the approval bar
├── scripts/
│   ├── build-registry.mjs     ← regenerate registry.json + REGISTRY.md (zero deps)
│   └── install.sh             ← install approved/selected skills into a skills dir
├── skills/
│   └── <id>/
│       ├── SKILL.md           ← the skill (frontmatter: name, description)
│       ├── skill.json         ← registry metadata (status, version, tags, sources)
│       └── references/        ← progressive-disclosure docs
└── docs/
    └── figma-motion-reference.md   ← condensed standalone reference
```

## How the registry works

- **Source of truth** = each `skills/<id>/skill.json`.
- `registry.json` + `REGISTRY.md` are **generated** from those by
  `node scripts/build-registry.mjs` — never hand-edited.
- Every skill carries a **status**; only `approved` skills install by default. That's
  the curation layer that makes this safe to share.

Add a skill → see [CONTRIBUTING.md](CONTRIBUTING.md).

## The motion skill map

| Layer | Skill | In this kit? |
|---|---|---|
| **Design** motion in Figma | `figma-motion` | ✅ |
| **Author** motion in code (React/web) | `motion-dev` | ✅ |
| **Author** motion onto the Figma canvas (`use_figma`) | `figma-use-motion` | ships with Figma MCP plugin |
| **Extract** Figma motion → code | `figma-implement-motion` | ships with Figma MCP plugin |

## Figma Motion ↔ motion.dev control parity

| Figma Motion | `motion/react` |
|---|---|
| Timeline keyframes (per property) | array values + `transition.times` + `ease[]` |
| Presets / animated components | `variants` |
| 8 Bézier easings | named eases + `ease:[x1,y1,x2,y2]` |
| Springs (stiffness/damping/mass + **Bounce**) | `type:"spring"` `{stiffness,damping,mass}` or `{bounce,visualDuration}` |
| Sequencing / stagger | `stagger()` / `staggerChildren` |
| Once / Loop / Ping-pong | `repeat` + `repeatType: loop/reverse/mirror` |
| Trim paths | `motion.path` + `pathLength` |

## License

MIT — see [LICENSE](LICENSE).
