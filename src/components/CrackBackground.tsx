import { useEffect, useRef, type RefObject } from 'react'
import styles from './CrackBackground.module.css'

/** Elements marked with this attribute (the name, nav links) are kept clear of cracks. */
export const AVOID_ATTR = 'data-crack-avoid'

// Pattern: a Voronoi tiling of jittered seeds, drawn as wobbly cracks.
const CELL = 118 // CSS px between seeds where the pattern is densest
const SPARSE_GROWTH = 1.7 // extra spacing (in cells) at the sparsest point, top centre
const SPARSE_DEPTH = 380 // CSS px down from the top over which cells return to normal
const SPARSE_WIDTH = 0.44 // fraction of the window width, either side of centre, ditto
const GAP_CHANCE = 0.07 // share of cell edges left out, so the network isn't perfect
const WOBBLE_CAP = 18 // CSS px; caps an edge's bow so long edges can't swing into text
const TEXT_MARGIN = 16 // CSS px a crack stops short of avoided elements
const MIN_PIECE = 45 // CSS px; shorter visible leftovers of a trimmed crack are dropped
const SEED = 20261105

// Look
const REST_WIDTHS = [2.2, 1.4, 0.8] // CSS px, per crack weight
const LIT_WIDTHS = [2.6, 1.7, 1]
const GLOW_WIDTH = 4 // soft halo under lit cracks
const GLOW_BLUR = 4
const GLOW_ALPHA = 0.55
const HAZE_ALPHA = 0.08 // faint white haze around the cursor

// Light
const LIGHT_RADIUS = 260 // CSS px
const PANEL_REACH = 1.35 // over the panel, the light grows by this × distance to its edge
const FOLLOW = 0.07 // per-frame easing toward the pointer
const FADE = 0.06 // per-frame easing of the light's size and strength

interface Pt {
  x: number
  y: number
}

interface Box {
  left: number
  top: number
  right: number
  bottom: number
}

interface Crack {
  weight: number // index into the width lists
  pts: Pt[]
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Small seeded PRNG, so the pattern is the same on every visit at a given size. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

const inBox = (p: Pt, b: Box, margin = 0) =>
  p.x > b.left - margin && p.x < b.right + margin && p.y > b.top - margin && p.y < b.bottom + margin

/**
 * Kintsugi-style crack network covering a w × h window. Cells grow gradually
 * larger toward the top centre; cracks heading into an avoided box end a
 * little before it.
 */
function buildCracks(w: number, h: number, avoid: Box[], panel: Box | null): Crack[] {
  const rand = mulberry32(SEED)
  const rowH = CELL * 0.866

  // 0 at the sides and lower down, rising smoothly to 1 at the top centre.
  const sparse = (p: Pt) =>
    smoothstep(1 - p.y / SPARSE_DEPTH) * smoothstep(1 - Math.abs(p.x - w / 2) / (w * SPARSE_WIDTH))
  const minGap = (p: Pt) => CELL * SPARSE_GROWTH * sparse(p)

  // A jittered hex grid, visited in random order so thinning has no direction.
  const grid: (Pt & { key: number })[] = []
  for (let r = -2; r * rowH < h + 2 * CELL; r++) {
    for (let c = -2; c * CELL < w + 2 * CELL; c++) {
      grid.push({
        x: c * CELL + (r % 2 ? CELL / 2 : 0) + (rand() - 0.5) * CELL * 0.7,
        y: r * rowH + (rand() - 0.5) * CELL * 0.7,
        key: rand(),
      })
    }
  }
  grid.sort((a, b) => a.key - b.key)

  // Where the pattern should be sparse, keep a seed only if it's far enough
  // from those already kept.
  const seeds: Pt[] = []
  for (const p of grid) {
    const gapP = minGap(p)
    const spaced = seeds.every((q) => {
      const need = Math.max(gapP, minGap(q))
      return need === 0 || Math.hypot(p.x - q.x, p.y - q.y) > need
    })
    if (spaced) seeds.push(p)
  }

  // Each seed's cell: a big square clipped by the bisector with every nearby
  // seed. Each edge remembers which neighbour cut it, so shared edges are
  // collected once.
  const reach = 6 * CELL
  const edges: [Pt, Pt][] = []
  seeds.forEach((si, i) => {
    let poly: Pt[] = [
      { x: si.x - reach, y: si.y - reach },
      { x: si.x + reach, y: si.y - reach },
      { x: si.x + reach, y: si.y + reach },
      { x: si.x - reach, y: si.y + reach },
    ]
    let cutBy = [-1, -1, -1, -1]
    seeds.forEach((sj, j) => {
      const nx = sj.x - si.x
      const ny = sj.y - si.y
      if (j === i || nx * nx + ny * ny > reach * reach) return
      const mx = (si.x + sj.x) / 2
      const my = (si.y + sj.y) / 2
      const side = (p: Pt) => (p.x - mx) * nx + (p.y - my) * ny
      const out: Pt[] = []
      const outCutBy: number[] = []
      for (let k = 0; k < poly.length; k++) {
        const a = poly[k]
        const b = poly[(k + 1) % poly.length]
        const da = side(a)
        const db = side(b)
        const cross = () => {
          const t = da / (da - db)
          return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
        }
        if (da <= 0) {
          out.push(a)
          outCutBy.push(cutBy[k])
          if (db > 0) {
            out.push(cross())
            outCutBy.push(j)
          }
        } else if (db <= 0) {
          out.push(cross())
          outCutBy.push(cutBy[k])
        }
      }
      poly = out
      cutBy = outCutBy
    })
    for (let k = 0; k < poly.length; k++) {
      if (cutBy[k] <= i) continue
      const a = poly[k]
      const b = poly[(k + 1) % poly.length]
      if (Math.max(a.x, b.x) < -30 || Math.min(a.x, b.x) > w + 30) continue
      if (Math.max(a.y, b.y) < -30 || Math.min(a.y, b.y) > h + 30) continue
      edges.push([a, b])
    }
  })

  const blocked = (p: Pt) => avoid.some((b) => inBox(p, b, TEXT_MARGIN))
  const shows = (p: Pt) => !panel || !inBox(p, panel)
  const cracks: Crack[] = []

  for (const [a, b] of edges) {
    if (rand() < GAP_CHANCE) continue
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy)
    if (len < 1) continue

    // Wobble perpendicular to the edge: a bow plus two waves, pinned to zero
    // at both ends so cracks still meet at the junctions.
    const px = -dy / len
    const py = dx / len
    const steps = Math.max(2, Math.round(len / 8))
    const bow = (rand() - 0.5) * Math.min(len * 0.14, WOBBLE_CAP)
    const amp = Math.min(5, len * 0.035)
    const f1 = 1 + rand() * 2
    const p1 = rand() * Math.PI * 2
    const f2 = 3 + rand() * 3
    const p2 = rand() * Math.PI * 2
    const pts: Pt[] = [a]
    for (let s = 1; s <= steps; s++) {
      const t = s / steps
      const env = Math.sin(Math.PI * t)
      const off =
        env *
        (bow +
          amp * Math.sin(Math.PI * 2 * f1 * t + p1) +
          amp * 0.5 * Math.sin(Math.PI * 2 * f2 * t + p2) +
          (rand() - 0.5) * 1.2)
      pts.push({ x: a.x + dx * t + px * off, y: a.y + dy * t + py * off })
    }
    const w3 = rand()
    const weight = w3 < 0.25 ? 0 : w3 < 0.7 ? 1 : 2

    // Keep the runs that stay clear of the text. A trimmed crack can leave
    // short pieces that read as stray marks, so those need enough showing
    // beside the panel; untrimmed cracks are always kept whole.
    const trimmed = pts.some(blocked)
    let run: Pt[] = []
    const keep = () => {
      if (run.length < 2) return
      let visible = 0
      for (let k = 1; k < run.length; k++) {
        if (shows(run[k]) && shows(run[k - 1])) {
          visible += Math.hypot(run[k].x - run[k - 1].x, run[k].y - run[k - 1].y)
        }
      }
      if (!trimmed || visible > MIN_PIECE) cracks.push({ weight, pts: run })
    }
    for (const p of pts) {
      if (blocked(p)) {
        keep()
        run = []
      } else {
        run.push(p)
      }
    }
    keep()
  }
  return cracks
}

function strokeCracks(
  ctx: CanvasRenderingContext2D,
  cracks: Crack[],
  widths: number[],
  color: string,
) {
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  widths.forEach((width, weight) => {
    ctx.lineWidth = width
    ctx.beginPath()
    for (const c of cracks) {
      if (c.weight !== weight) continue
      ctx.moveTo(c.pts[0].x, c.pts[0].y)
      for (let k = 1; k < c.pts.length; k++) ctx.lineTo(c.pts[k].x, c.pts[k].y)
    }
    ctx.stroke()
  })
}

function addFalloff(g: CanvasGradient) {
  g.addColorStop(0, 'rgba(255, 255, 255, 1)')
  g.addColorStop(0.45, 'rgba(255, 255, 255, 0.55)')
  g.addColorStop(1, 'rgba(255, 255, 255, 0)')
  return g
}

interface Props {
  /** The content panel: cracks behind it are hidden, and the light reaches past it. */
  panelRef: RefObject<HTMLElement | null>
}

/**
 * A fixed full-window crack pattern behind the page. Near the cursor the
 * cracks light up white; over the content panel the light widens so moving
 * there still lights the cracks around the panel's edges.
 */
export function CrackBackground({ panelRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Offscreen layers: cracks at rest, cracks lit, and a scratch layer where
    // the lit cracks are cut to the light's falloff each frame.
    const rest = document.createElement('canvas')
    const lit = document.createElement('canvas')
    const scratch = document.createElement('canvas')
    const restCtx = rest.getContext('2d')
    const litCtx = lit.getContext('2d')
    const scratchCtx = scratch.getContext('2d')
    if (!restCtx || !litCtx || !scratchCtx) return

    const reducedMotion = prefersReducedMotion()
    const size = { w: 0, h: 0, dpr: 1 }
    let panel: Box | null = null
    const light = { x: 0, y: 0, r: LIGHT_RADIUS, level: 0 }
    const target = { ...light }
    let frame = 0

    const build = () => {
      size.w = window.innerWidth
      size.h = window.innerHeight
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      for (const c of [canvas, rest, lit, scratch]) {
        c.width = Math.max(1, Math.round(size.w * size.dpr))
        c.height = Math.max(1, Math.round(size.h * size.dpr))
      }
      const p = panelRef.current?.getBoundingClientRect()
      panel = p ? { left: p.left, top: p.top, right: p.right, bottom: p.bottom } : null
      const avoid = [...document.querySelectorAll(`[${AVOID_ATTR}]`)]
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0)
      const cracks = buildCracks(size.w, size.h, avoid, panel)

      const restColor = getComputedStyle(canvas).getPropertyValue('--crack').trim() || '#e8c2ad'
      restCtx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
      strokeCracks(restCtx, cracks, REST_WIDTHS, restColor)

      litCtx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
      litCtx.save()
      litCtx.globalAlpha = GLOW_ALPHA
      litCtx.shadowColor = '#fff'
      litCtx.shadowBlur = GLOW_BLUR * size.dpr
      strokeCracks(litCtx, cracks, [GLOW_WIDTH, GLOW_WIDTH, GLOW_WIDTH], '#fff')
      litCtx.restore()
      strokeCracks(litCtx, cracks, LIT_WIDTHS, '#fff')
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(rest, 0, 0)
      if (light.level < 0.01) return

      const { dpr } = size
      const x = light.x * dpr
      const y = light.y * dpr
      const r = light.r * dpr

      ctx.globalAlpha = HAZE_ALPHA * light.level
      ctx.fillStyle = addFalloff(ctx.createRadialGradient(x, y, 0, x, y, r))
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
      ctx.globalAlpha = 1

      scratchCtx.globalCompositeOperation = 'source-over'
      scratchCtx.clearRect(0, 0, scratch.width, scratch.height)
      scratchCtx.globalAlpha = light.level
      scratchCtx.fillStyle = addFalloff(scratchCtx.createRadialGradient(x, y, 0, x, y, r))
      scratchCtx.fillRect(x - r, y - r, r * 2, r * 2)
      scratchCtx.globalAlpha = 1
      scratchCtx.globalCompositeOperation = 'source-in'
      scratchCtx.drawImage(lit, 0, 0)
      ctx.drawImage(scratch, 0, 0)
    }

    const tick = () => {
      frame = 0
      light.x += (target.x - light.x) * FOLLOW
      light.y += (target.y - light.y) * FOLLOW
      light.r += (target.r - light.r) * FADE
      light.level += (target.level - light.level) * FADE
      draw()
      const settled =
        Math.abs(target.x - light.x) < 0.2 &&
        Math.abs(target.y - light.y) < 0.2 &&
        Math.abs(target.r - light.r) < 0.5 &&
        Math.abs(target.level - light.level) < 0.005
      if (!settled) frame = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const x = e.clientX
      const y = e.clientY
      // Over the panel the cracks are hidden, so widen the light by the
      // distance to the panel's nearest edge to keep it reaching the border.
      const over = panel && inBox({ x, y }, panel)
      const depth = over && panel ? Math.min(x - panel.left, panel.right - x, y - panel.top) : 0
      // Coming back from dark, start the light at the cursor rather than
      // sweeping it over from where it faded out.
      if (light.level < 0.01) {
        light.x = x
        light.y = y
      }
      Object.assign(target, { x, y, r: LIGHT_RADIUS + depth * PANEL_REACH, level: 1 })
      wake()
    }
    const onLeave = () => {
      target.level = 0
      wake()
    }

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 150)
    }

    build()
    // Fonts change the text boxes the cracks avoid.
    document.fonts?.ready.then(build)
    window.addEventListener('resize', onResize)
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove)
      document.documentElement.addEventListener('mouseleave', onLeave)
      window.addEventListener('blur', onLeave)
    }

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [panelRef])

  return <canvas ref={canvasRef} aria-hidden className={styles.canvas} />
}
