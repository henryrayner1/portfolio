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

- **All site copy lives in `src/data/content.ts`** (profile, education, jobs, projects, certifications, resumes) along with its types. Content edits usually belong there, not in components. Optional `image` fields fall back to grey `ImagePlaceholder` boxes.
- **Navigation is not page scrolling.** `html`/`body` don't scroll. `App` renders every section stacked in a fixed-height `main` panel with `overflow: hidden`; `useSectionNavigation` scrolls that panel to the chosen section, syncs the URL hash, and marks all other sections `inert`. Each `Section` scrolls internally and shows a bottom fade while more content is below. Adding a section means adding its id to `SectionId` and `sections` in `content.ts` (which drives the nav bar) and rendering it in `App.tsx`.
- **Canvas effects:**
  - `DotLogo` redraws a logo image as a hex grid of dots on a 2D canvas, lit like tilted mirrors with a cursor spotlight. Tuned per logo via `dotsAcross`, `tint`, `whiteIsBackground`. On touch, a 200ms press-and-hold locks the gesture for the spotlight so quick swipes still scroll.
  - `GlitterBackground` is a fixed full-window WebGL Voronoi glitter shader behind everything (visible beside the panel). Its colours are hard-coded in the fragment shader and matched to the header's `--bg-outer`; its `data-glitter-calm` support is currently unused.
  - Both honour `prefers-reduced-motion`.
- **Styling:** theme colours, fonts and layout sizes are CSS variables in `src/styles/global.css`; `src/components/shared.module.css` holds the subtitle, subheading and ✱-bullet styles reused across sections. Mobile breakpoint is `max-width: 800px` throughout.
