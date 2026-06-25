# Contributing a skill

This is a **curated registry** — every shared skill is vetted before it's marked
`approved`. The goal: anyone can clone this repo, install the approved set, and trust
it works.

## Add a skill (the flow)

1. **Create the folder** under `skills/<id>/` (kebab-case id == folder name):
   ```
   skills/<id>/
   ├── SKILL.md          # the skill itself (YAML frontmatter: name, description)
   ├── skill.json        # registry metadata (see schema below)
   └── references/       # optional progressive-disclosure docs (*.md)
   ```
2. **Write `skill.json`** (schema below). Start with `"status": "draft"`.
3. **Regenerate the registry:**
   ```bash
   node scripts/build-registry.mjs        # rewrites registry.json + REGISTRY.md
   ```
4. **Validate** before committing:
   ```bash
   node scripts/build-registry.mjs --check
   ```
5. When it clears the approval bar, set `"status": "approved"`, re-run the script,
   commit.

## `skill.json` schema

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | kebab-case, must equal the folder name |
| `title` | ✅ | human-readable name |
| `description` | ✅ | one-paragraph "what + when to use" |
| `version` | ✅ | semver; bump on meaningful change |
| `status` | ✅ | `approved` \| `draft` \| `experimental` \| `deprecated` |
| `category` | ✅ | grouping, e.g. `animation` |
| `tags` | ✅ | array of search keywords |
| `entry` | ✅ | the skill file, normally `SKILL.md` |
| `owner` | — | GitHub handle |
| `updated` | — | `YYYY-MM-DD` |
| `sources` | — | array of URLs the content was verified against |

`references/` is auto-counted by the build script — don't list refs in `skill.json`.

## The approval bar (what `approved` means)

A skill is `approved` only when **all** hold:

- [ ] `SKILL.md` has valid frontmatter (`name`, `description`) and a clear "when to use".
- [ ] Claims are **verified against the listed `sources`**, not memory. No fabricated APIs/values.
- [ ] Uses **progressive disclosure** — SKILL.md stays lean; depth lives in `references/`.
- [ ] Cross-links related skills instead of duplicating them.
- [ ] `node scripts/build-registry.mjs --check` passes.
- [ ] No proprietary/confidential content (this registry is shareable).

Anything not meeting the bar stays `draft` or `experimental` — still in the repo, just
not installed by the default `./scripts/install.sh`.

## Conventions

- One concept per reference file; keep `SKILL.md` to routing + essentials.
- Prefer editing an existing skill over forking a near-duplicate.
- Record the date relative dates resolve to (absolute `YYYY-MM-DD`) in `updated`.
