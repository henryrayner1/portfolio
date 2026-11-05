# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Henry Rayner's personal portfolio: a single-page React 19 + TypeScript site built with Vite, styled with CSS Modules, no other runtime dependencies.

## Commands

- `npm run dev` — Vite dev server (served at `/`)
- `npm run build` — type-check (`tsc -b`) then build to `dist/`; this is the check to run after changes
- `npm run lint` — oxlint (`.oxlintrc.json`)
- `npm run preview` — serve the production build (served at `/portfolio/`)

There is no test suite.

## Deployment

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml` (live at https://henryrayner1.github.io/portfolio/). Vite's `base` is `/portfolio/` for builds only, so files in `public/` (resume PDFs, signature) must be referenced through `publicUrl()` / `import.meta.env.BASE_URL` in `src/data/content.ts` — never a root-absolute `/file`, which works in dev but breaks on Pages. Images in `src/assets/` are imported and are fine as-is.

## Architecture

- **All site copy lives in `src/data/content.ts`** (profile, education, jobs, projects, certifications, resumes) along with its types. Content edits usually belong there, not in components. Optional `image` fields fall back to grey `ImagePlaceholder` boxes. A project's optional `details` (overview, screenshots, flow diagrams, hosting, highlights) adds a "Learn more" button that opens `ProjectDialog`, a native modal `<dialog>`; its diagrams are `FlowDiagram` stages defined as data. Project screenshots live in `src/assets/projects/`. The Home Video ones use made-up sample tags, because the real catalog holds family names.
- **Navigation is not page scrolling.** `html`/`body` don't scroll. `App` renders every section stacked in a fixed-height `main` panel with `overflow: hidden`; `useSectionNavigation` scrolls that panel to the chosen section, syncs the URL hash, and marks all other sections `inert`. Each navigation resets the target section's own scroller (`[data-section-scroller]`) to the top; picking the current section scrolls it back up. Each `Section` scrolls internally and shows a bottom fade while more content is below. Adding a section means adding its id to `SectionId` and `sections` in `content.ts` (which drives the nav bar) and rendering it in `App.tsx`.
- **Canvas effects:**
  - `DotLogo` redraws a logo image as a hex grid of dots on a 2D canvas, lit like tilted mirrors with a cursor spotlight. Tuned per logo via `dotsAcross`, `tint`, `whiteIsBackground`. On touch, a 200ms press-and-hold locks the gesture for the spotlight so quick swipes still scroll.
  - `CrackBackground` is a fixed full-window 2D canvas behind everything (the header is transparent, the panel opaque). It draws a seeded Voronoi crack network in `--crack`, with cells growing larger toward the top centre. Cracks stop short of elements marked with its `AVOID_ATTR` (`data-crack-avoid`: the name, signature and nav row) and are rebuilt on resize. Near a mouse cursor the cracks light up white; over the panel the light widens by the distance to the panel's edge so it still reaches the border. The soft background glow is the canvas's CSS background (`--bg-glow` / `--bg-outer` / `--bg-edge`).
  - Both honour `prefers-reduced-motion` (the cracks stay unlit).
- **Styling:** theme colours, fonts and layout sizes are CSS variables in `src/styles/global.css`; `src/components/shared.module.css` holds the subtitle, subheading and ✱-bullet styles reused across sections. Mobile breakpoint is `max-width: 800px` throughout. At that breakpoint the header shrinks to the name alone (`--header-h: 76px`) and `NavBar` collapses into a menu button whose dropdown closes on selection, Esc, an outside tap or widening past the breakpoint. On desktop the header (`--header-h`), its spacing, the name and the nav text shrink with window height through `--shortfall` (how much shorter the window is than 1080px), so laptop screens get a compact header and a 1080p monitor the full size. Content font sizes are in `rem` and the root font size shrinks with `--shortfall` too, so use `rem` (not `px`) for new content text; the header and nav keep their own px-based scaling, and phones set `--shortfall` to 0.
