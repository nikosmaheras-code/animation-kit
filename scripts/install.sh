#!/usr/bin/env bash
# Install Animation Kit skills into a Claude Code skills directory.
#
#   ./scripts/install.sh                      # install all APPROVED skills to ~/.claude/skills
#   ./scripts/install.sh all                  # install every skill regardless of status
#   ./scripts/install.sh figma-motion motion-dev   # install specific skills by id
#   ./scripts/install.sh --target .claude/skills    # install into a project instead
#
# Sharing: clone the repo, run this. Nothing else needed.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$REPO_DIR/skills"
TARGET="$HOME/.claude/skills"
SELECT=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --target=*) TARGET="${1#*=}"; shift ;;
    -h|--help) sed -n '2,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) SELECT+=("$1"); shift ;;
  esac
done

# Resolve which skill ids to install.
ids=()
if [[ ${#SELECT[@]} -eq 0 || "${SELECT[0]}" == "approved" ]]; then
  for f in "$SKILLS_DIR"/*/skill.json; do
    grep -q '"status": *"approved"' "$f" && ids+=("$(basename "$(dirname "$f")")")
  done
elif [[ "${SELECT[0]}" == "all" ]]; then
  for d in "$SKILLS_DIR"/*/; do ids+=("$(basename "$d")"); done
else
  ids=("${SELECT[@]}")
fi

if [[ ${#ids[@]} -eq 0 ]]; then echo "No skills matched."; exit 1; fi

mkdir -p "$TARGET"
for id in "${ids[@]}"; do
  src="$SKILLS_DIR/$id"
  if [[ ! -d "$src" ]]; then echo "  ✗ $id (not found, skipping)"; continue; fi
  rm -rf "${TARGET:?}/$id"
  cp -R "$src" "$TARGET/$id"
  echo "  ✓ $id → $TARGET/$id"
done
echo "Installed ${#ids[@]} skill(s) into $TARGET"
