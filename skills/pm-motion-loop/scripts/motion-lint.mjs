#!/usr/bin/env node
// motion-lint — score a Figma Motion timeline dump against the Polymarket app motion kit.
//
//   node motion-lint.mjs <dump.json> [--json]
//
// <dump.json> = raw output of get_motion_context (recursive) saved to disk, OR any JSON
// containing node.manualKeyframeTracks / spring params / CSS codeSnippets. The walker is
// schema-tolerant: it hunts for spring shapes, keyframe arrays, track keys, and CSS strings
// anywhere in the tree, so it survives MCP schema drift.
//
// Exit code: 0 = clean, 1 = warnings only, 2 = failures.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = JSON.parse(readFileSync(join(HERE, "..", "kit-constants.json"), "utf8"));

const file = process.argv[2];
if (!file) { console.error("usage: motion-lint.mjs <dump.json> [--json]"); process.exit(2); }
const asJson = process.argv.includes("--json");
const data = JSON.parse(readFileSync(file, "utf8"));

const findings = [];
const add = (level, rule, where, msg) => findings.push({ level, rule, where, msg });

const zeta = (s) => {
  const mass = s.mass ?? 1;
  if (!s.stiffness || !s.damping) return null;
  return s.damping / (2 * Math.sqrt(s.stiffness * mass));
};
const nearestPreset = (s) => {
  let best = null, bestD = Infinity;
  for (const [name, p] of Object.entries(KIT.springs)) {
    if (!p.stiffness || !p.damping) continue;
    const d = Math.abs(p.stiffness - s.stiffness) / p.stiffness + Math.abs(p.damping - s.damping) / p.damping;
    if (d < bestD) { bestD = d; best = name; }
  }
  return bestD < 0.12 ? best : null;
};

function checkSpring(s, where) {
  const z = zeta(s);
  if (z == null) {
    // UIKit-style dampingRatio expressed directly (0..1-ish)
    if (typeof s.dampingRatio === "number") return checkZeta(s.dampingRatio, where);
    return;
  }
  const preset = nearestPreset(s);
  const label = `${s.stiffness}/${s.damping}${s.mass && s.mass !== 1 ? `/m${s.mass}` : ""} (ζ${z.toFixed(2)})`;
  if (preset) add("PASS", "spring-preset", where, `spring ${label} ≈ kit "${preset}"`);
  else checkZeta(z, where, label);
}

function checkZeta(z, where, label = `ζ${z.toFixed(2)}`) {
  const { min, max } = KIT.dampingCensus;
  const b = KIT.bounceBand;
  if (z >= min && z <= max) add("PASS", "damping-census", where, `${label} in census band ${min}–${max}`);
  else if (z >= b.min && z <= b.max) add("WARN", "bounce-reserved", where, `${label} is in the bounce band — ${b.reservedFor}. Confirm this IS a money moment; otherwise raise toward ζ0.8.`);
  else if (z > max && z <= 1.05) add("WARN", "overdamped-edge", where, `${label} slightly above census max ${max} — will read a touch sluggish vs app.`);
  else if (z > 1.05) add("FAIL", "overdamped", where, `${label} overdamped/critically damped — no kit motion lives here. Nearest kit feel: gridZoom ζ0.92.`);
  else add("FAIL", "underdamped", where, `${label} bouncier than even money moments (kit floor ζ${b.min}). Off-brand wobble.`);
}

function checkDuration(ms, where) {
  const t = KIT.timingMs;
  const known = Object.entries({ ...t.knownFastOutliers, ...KIT.knownDurationsMs })
    .find(([, v]) => Math.abs(v - ms) <= 15);
  if (known) return add("PASS", "known-duration", where, `${ms}ms ≈ kit "${known[0]}" (${known[1]}ms)`);
  if (ms >= t.micro[0] && ms <= t.micro[1]) return add("PASS", "micro-window", where, `${ms}ms in micro window ${t.micro[0]}–${t.micro[1]}ms`);
  if (ms >= t.transition[0] && ms <= t.transition[1]) return add("PASS", "transition-window", where, `${ms}ms in transition window ${t.transition[0]}–${t.transition[1]}ms`);
  if (ms > t.micro[1] && ms < t.transition[0]) return add("WARN", "gray-zone", where, `${ms}ms falls between micro (≤${t.micro[1]}) and transition (≥${t.transition[0]}) windows — pick a lane.`);
  if (ms > t.hardMax) return add("FAIL", "too-slow", where, `${ms}ms exceeds kit hard max ${t.hardMax}ms — nothing in the app animates this long.`);
  if (ms < t.micro[0] && ms > 15) return add("WARN", "too-fast", where, `${ms}ms below micro window (fastest kit values: press 50ms / release 100ms). Intentional?`);
}

function checkTrackKey(key, where) {
  if (KIT.renderLandmines.unsupportedTracks.includes(key))
    add("FAIL", "render-landmine", where, `"${key}" track present — ${KIT.renderLandmines.note}`);
}

// ---- tolerant deep walk ----------------------------------------------------
const seenSprings = new Set();
function walk(node, path) {
  if (Array.isArray(node)) {
    // keyframe array? compute time span
    const times = node.map((k) => k && typeof k === "object" ? (k.time ?? k.progress ?? k.offset) : null)
      .filter((v) => typeof v === "number");
    if (times.length >= 2 && node.every((k) => k && typeof k === "object" && ("value" in k || "values" in k))) {
      const span = Math.max(...times) - Math.min(...times);
      if (span > 0) {
        const ms = span <= 20 ? span * 1000 : span; // seconds vs ms heuristic
        if (Math.max(...times) > 1.0001 || span > 1.0001) checkDuration(Math.round(ms), path);
        // progress-normalized (0..1) spans need timeline duration — handled via CSS/duration keys instead
      }
    }
    node.forEach((v, i) => walk(v, `${path}[${i}]`));
    return;
  }
  if (!node || typeof node !== "object") return;

  // spring shape
  if (typeof node.stiffness === "number" && typeof node.damping === "number") {
    const sig = `${path}|${node.stiffness}|${node.damping}`;
    if (!seenSprings.has(sig)) { seenSprings.add(sig); checkSpring(node, path); }
  } else if (typeof node.dampingRatio === "number") {
    checkZeta(node.dampingRatio, path);
  }

  // explicit duration keys
  for (const k of ["duration", "durationMs", "timelineDuration", "totalDuration"]) {
    if (typeof node[k] === "number") {
      const ms = node[k] <= 20 ? node[k] * 1000 : node[k];
      checkDuration(Math.round(ms), `${path}.${k}`);
    }
  }

  // track containers (manualKeyframeTracks: { fills: {...}, effects: {...}, ... })
  if (node.manualKeyframeTracks && typeof node.manualKeyframeTracks === "object")
    for (const k of Object.keys(node.manualKeyframeTracks)) checkTrackKey(k, `${path}.manualKeyframeTracks`);

  // CSS / code snippets: pull animation durations + spring() notations
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string" && /animation|keyframes|transition|spring/i.test(v) && v.length > 20) {
      for (const m of v.matchAll(/(?:animation(?:-duration)?|transition(?:-duration)?)\s*:\s*[^;]*?(\d+(?:\.\d+)?)(ms|s)\b/g)) {
        const ms = m[2] === "s" ? parseFloat(m[1]) * 1000 : parseFloat(m[1]);
        checkDuration(Math.round(ms), `${path}.${k} (css)`);
      }
      for (const m of v.matchAll(/spring\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d+(?:\.\d+)?))?\s*\)/g)) {
        checkSpring({ stiffness: +m[1], damping: +m[2], mass: m[3] ? +m[3] : 1 }, `${path}.${k} (css spring)`);
      }
    }
    if (v && typeof v === "object" && k !== "manualKeyframeTracks") walk(v, `${path}.${k}`);
  }
  if (node.manualKeyframeTracks) walk(node.manualKeyframeTracks, `${path}.manualKeyframeTracks`);
}

walk(data, "$");

// ---- report -----------------------------------------------------------------
const order = { FAIL: 0, WARN: 1, PASS: 2 };
findings.sort((a, b) => order[a.level] - order[b.level]);
const counts = findings.reduce((c, f) => ((c[f.level] = (c[f.level] || 0) + 1), c), {});

if (asJson) {
  console.log(JSON.stringify({ counts, findings }, null, 2));
} else {
  for (const f of findings) console.log(`${f.level.padEnd(4)} [${f.rule}] ${f.where}\n     ${f.msg}`);
  console.log(`\n${counts.FAIL || 0} fail · ${counts.WARN || 0} warn · ${counts.PASS || 0} pass`);
  if (!findings.length) console.log("no springs, durations, or tracks found — is this a motion-context dump?");
}
process.exit(counts.FAIL ? 2 : counts.WARN ? 1 : 0);
