# What's new from Config 2026

Config 2026 ran June 23–25, 2026 at Moscone Center, SF. Six releases, all about
making the canvas more expressive and closing the design↔code gap.

## Figma Motion — Open Beta
Native, timeline-based animation inside the design file. Preset animations,
keyframe-based custom motion, easing curves, and spring animations. The Figma agent
can generate initial keyframes from a text description. **Animated components**
maintain consistency across a motion system using **timing and easing variables**.
Dev Mode gives read-only timeline inspection; code exports to **CSS, JSON, or
React**. Video exports to **MP4, GIF, WEBM, Animated SVG**. (Full detail in the
other reference files.)

## Custom Shader Effects and Fills — Open Beta
Generate custom **WebGPU-based** shader effects and fills via **text prompts**, no
coding. They behave as **native properties with on-canvas controls**, and **every
shader-exposed property is keyframeable on the Motion timeline** — this is the big
tie-in with Motion. Save/reuse shaders. Authoring is on paid plans; Figma-created
shaders render on all plans.

## Weave Tools in Figma Design — Open Beta
AI image generation built into design files behind a simple interface. Handles
background replacement, logo application, aspect-ratio adjustment. Weave workflows
are shareable on Figma Community as reusable templates or standalone tools.

## Figma Agent Updates — Open Beta
- Create **custom skills** for the agent.
- **Web search** from within the agent.
- Connect **external tools via MCP** (Model Context Protocol).
- Attach files: Figma files, images, code, PDFs, spreadsheets.
- As of **June 23, 2026**, new conversation threads are **organization-visible by
  default**.

## Generative Plugins — Open Beta
Build reusable, native-feeling plugins **through prompts** (no traditional coding):
layer reordering, consistent spacing, find-and-replace, etc. Plugins start inside a
file and sync across the user's design files.

## Code Layers — Closed Beta
Embed **working code directly on the canvas as layers**. Side-by-side design↔code
iteration, convert between code and design layers, and **GitHub repository
integration** to prototype from existing components.

## Why this matters together
Motion + keyframeable shaders + Code Layers + agent-via-MCP point at one thing:
animation and code are becoming first-class canvas citizens. A Figma Motion file is
no longer a throwaway prototype — it's an inspectable, exportable, MCP-shareable
source of truth that flows straight into production via `get_motion_context`.
