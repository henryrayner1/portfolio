import { useEffect, useRef, useState } from 'react'
import styles from './DotLogo.module.css'

// Layout
const DOTS_ACROSS = 62 // default hex-grid columns across the logo's width
const MIN_SPACING = 3.5 // CSS px, so small screens don't get a dense mush
const DOT_RADIUS = 0.36 // fraction of the grid spacing
const INSET = 0.04 // padding around the logo, fraction of the box

// Lighting: each dot is a tiny tilted mirror. The pointer nudges the light,
// so different dots catch it and flash as the cursor moves.
const TILT = 0.9 // spread of the dots' resting tilts
const SHIMMER = 0.035 // idle wobble of each tilt
const LIGHT_NUDGE = 0.6 // how far the pointer moves the light
const EASE = 0.12 // per-frame easing of the light and hover strength
const SPEC_POWER = 120 // sharpness of a dot's flash
const GLOW_POWER = 16 // its near misses
const AQUA = [0.8, 1, 0.97]

// Spotlight: a second light hovering just above the cursor that brightens,
// tints and swells the dots nearby.
const SPOT_RADIUS = 0.15 // falloff radius, fraction of the box width
const SPOT_HEIGHT = 60 // CSS px above the surface
const SPOT_FOLLOW = 0.25 // per-frame easing toward the pointer
const SPOT_MIX = 0.55 // how far dots under the cursor tint toward SPOT_COLOR
const SPOT_SPEC_POWER = 40
const SPOT_SWELL = 0.6 // extra radius at the centre of the spot

// Fade-in: each dot sparkles in after its own random delay.
const FADE_SPREAD = 0.9 // s, range of the per-dot delays
const FADE_DURATION = 0.35 // s, each dot's own fade
const FADE_TOTAL = FADE_SPREAD + FADE_DURATION

// Touch: a quick swipe scrolls the page as usual; holding still this long
// locks the gesture so dragging moves the spotlight instead.
const HOLD_MS = 200
const HOLD_SLOP = 10 // CSS px a finger may drift before the hold is abandoned

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

interface Dots {
  count: number
  radius: number
  spotRadius: number
  x: Float32Array
  y: Float32Array
  rgb: Float32Array // 0..1, sampled from the logo
  tilt: Float32Array // x, y per dot
  wobble: Float32Array // phase, speed per dot
  delay: Float32Array // fade-in delay per dot, s
}

type Rgb = readonly number[] // 0..1

interface Scene {
  light: { x: number; y: number } // -1..1
  spot: { x: number; y: number } // CSS px
  hover: number // 0..1
  time: number // s since mount
  fade: number // s since the fade began; Infinity once done or skipped
  shimmer: boolean
  tint: Rgb // glow and spotlight color
}

interface Bounds {
  x: number
  y: number
  w: number
  h: number
}

const isBackground = (data: Uint8ClampedArray, i: number, whiteIsBackground: boolean) =>
  data[i + 3] < 128 ||
  (whiteIsBackground && Math.min(data[i], data[i + 1], data[i + 2]) > 200)

/** The logo's extent within the image, so empty margins don't shrink it. */
function contentBounds(img: HTMLImageElement, whiteIsBackground: boolean): Bounds {
  const full = { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight }
  const off = document.createElement('canvas')
  off.width = full.w
  off.height = full.h
  const ctx = off.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, full.w, full.h)

  let minX = full.w
  let minY = full.h
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < full.h; y++) {
    for (let x = 0; x < full.w; x++) {
      if (isBackground(data, (y * full.w + x) * 4, whiteIsBackground)) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  return maxX < 0 ? full : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

/** Sample the logo onto a hex grid, keeping the points that land on it. */
function sampleDots(
  img: HTMLImageElement,
  bounds: Bounds,
  w: number,
  h: number,
  whiteIsBackground: boolean,
  dotsAcross: number,
): Dots {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const ctx = off.getContext('2d', { willReadFrequently: true })!
  const scale = Math.min(w / bounds.w, h / bounds.h) * (1 - INSET * 2)
  const iw = bounds.w * scale
  const ih = bounds.h * scale
  ctx.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h, (w - iw) / 2, (h - ih) / 2, iw, ih)
  const { data } = ctx.getImageData(0, 0, w, h)

  const spacing = Math.max(MIN_SPACING, iw / dotsAcross)
  const rowH = (spacing * Math.sqrt(3)) / 2
  const xs: number[] = []
  const ys: number[] = []
  const rgb: number[] = []

  for (let row = 0, y = rowH / 2; y < h; row++, y += rowH) {
    for (let x = row % 2 ? spacing : spacing / 2; x < w; x += spacing) {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4
      // Some logos sit on a white background; skip white and near-white edges too.
      if (isBackground(data, i, whiteIsBackground)) continue
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      xs.push(x)
      ys.push(y)
      rgb.push(r / 255, g / 255, b / 255)
    }
  }

  const count = xs.length
  const tilt = new Float32Array(count * 2)
  const wobble = new Float32Array(count * 2)
  const delay = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    tilt[i * 2] = (Math.random() - 0.5) * TILT
    tilt[i * 2 + 1] = (Math.random() - 0.5) * TILT
    wobble[i * 2] = Math.random() * Math.PI * 2
    wobble[i * 2 + 1] = Math.random()
    delay[i] = Math.random() * FADE_SPREAD
  }

  return {
    count,
    radius: spacing * DOT_RADIUS,
    spotRadius: w * SPOT_RADIUS,
    x: Float32Array.from(xs),
    y: Float32Array.from(ys),
    rgb: Float32Array.from(rgb),
    tilt,
    wobble,
    delay,
  }
}

function drawDots(ctx: CanvasRenderingContext2D, dots: Dots, scene: Scene) {
  // Light from the upper left, nudged by the pointer; viewer straight on.
  let lx = -0.45 + scene.light.x * LIGHT_NUDGE
  let ly = -0.55 + scene.light.y * LIGHT_NUDGE
  let lz = 1
  const ll = Math.hypot(lx, ly, lz)
  lx /= ll
  ly /= ll
  lz /= ll
  const hl = Math.hypot(lx, ly, lz + 1)
  const hx = lx / hl
  const hy = ly / hl
  const hz = (lz + 1) / hl

  const { width, height } = ctx.canvas
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.restore()

  const spotR2 = dots.spotRadius * dots.spotRadius
  const fading = scene.fade < FADE_TOTAL

  for (let i = 0; i < dots.count; i++) {
    let appear = 1
    if (fading) {
      appear = Math.min(Math.max((scene.fade - dots.delay[i]) / FADE_DURATION, 0), 1)
      if (appear === 0) continue
      appear = easeOutCubic(appear)
    }

    let tx = dots.tilt[i * 2]
    let ty = dots.tilt[i * 2 + 1]
    if (scene.shimmer) {
      const phase = dots.wobble[i * 2]
      const speed = dots.wobble[i * 2 + 1]
      tx += SHIMMER * Math.sin(scene.time * (0.7 + speed) + phase)
      ty += SHIMMER * Math.cos(scene.time * (0.9 + speed) + phase)
    }
    const inv = 1 / Math.sqrt(tx * tx + ty * ty + 1)
    const nx = tx * inv
    const ny = ty * inv
    const nz = inv

    const ndh = Math.max(nx * hx + ny * hy + nz * hz, 0)
    const spec = ndh ** SPEC_POWER
    const glow = ndh ** GLOW_POWER * 0.18
    const shade = 0.62 + 0.45 * Math.max(nx * lx + ny * ly + nz * lz, 0)

    const tint = scene.tint
    let r = dots.rgb[i * 3] * shade + tint[0] * glow + spec * 1.6
    let g = dots.rgb[i * 3 + 1] * shade + tint[1] * glow + spec * 1.6
    let b = dots.rgb[i * 3 + 2] * shade + tint[2] * glow + spec * 1.6
    let radius = dots.radius * (1 + 0.35 * spec)

    // Spotlight around the cursor.
    if (scene.hover > 0.01) {
      const dx = dots.x[i] - scene.spot.x
      const dy = dots.y[i] - scene.spot.y
      const k = scene.hover * Math.exp(-(dx * dx + dy * dy) / spotR2)
      if (k > 0.01) {
        // A point light just above the cursor, so its angle to each dot
        // changes across the spot and the flashes ring around the cursor.
        const px = -dx
        const py = -dy
        const pz = SPOT_HEIGHT
        const pl = Math.hypot(px, py, pz)
        const h2l = Math.hypot(px / pl, py / pl, pz / pl + 1)
        const ndh2 = Math.max((nx * px / pl + ny * py / pl + nz * (pz / pl + 1)) / h2l, 0)
        const spec2 = ndh2 ** SPOT_SPEC_POWER * k * 1.2

        const mix = k * SPOT_MIX
        r += (tint[0] - r) * mix + spec2
        g += (tint[1] - g) * mix + spec2
        b += (tint[2] - b) * mix + spec2
        radius *= 1 + SPOT_SWELL * k
      }
    }

    // Each dot flashes white and grows as it sparkles in.
    if (appear < 1) {
      const flash = (1 - appear) * 0.5
      r += flash
      g += flash
      b += flash
      radius *= 0.4 + 0.6 * appear
    }

    ctx.globalAlpha = appear
    ctx.fillStyle = `rgb(${Math.min(r, 1) * 255} ${Math.min(g, 1) * 255} ${Math.min(b, 1) * 255})`
    ctx.beginPath()
    ctx.arc(dots.x[i], dots.y[i], radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

interface Props {
  src: string
  label: string
  /** Treat white pixels as background (for logos without transparency). */
  whiteIsBackground?: boolean
  /** Dot columns across the logo's width; higher keeps finer detail. */
  dotsAcross?: number
  /** Glow and spotlight color, 0..1 RGB. */
  tint?: Rgb
  className?: string
}

/** A logo drawn in dots that glint and swell as the pointer moves over them. */
export function DotLogo({
  src,
  label,
  whiteIsBackground = false,
  dotsAcross = DOTS_ACROSS,
  tint = AQUA,
  className = '',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const reducedMotion = prefersReducedMotion()
    const start = performance.now()
    const pointer = { x: 0, y: 0, px: 0, py: 0, inside: false }
    const scene: Scene = {
      light: { x: 0, y: 0 },
      spot: { x: 0, y: 0 },
      hover: 0,
      time: 0,
      fade: reducedMotion ? Infinity : 0,
      shimmer: !reducedMotion,
      tint,
    }
    let fadeStart: number | null = null // set the first time the logo is on screen
    let dots: Dots | null = null
    let img: HTMLImageElement | null = null
    let bounds: Bounds | null = null
    let visible = false
    let frame = 0

    const draw = (now: number) => {
      if (!dots) return
      scene.time = (now - start) / 1000
      if (!reducedMotion) scene.fade = fadeStart === null ? 0 : (now - fadeStart) / 1000
      drawDots(ctx, dots, scene)
    }

    const build = () => {
      if (!img || !bounds) return
      const { width, height } = wrap.getBoundingClientRect()
      const w = Math.round(width)
      const h = Math.round(height)
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = sampleDots(img, bounds, w, h, whiteIsBackground, dotsAcross)
      draw(performance.now())
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      scene.light.x += (pointer.x - scene.light.x) * EASE
      scene.light.y += (pointer.y - scene.light.y) * EASE
      scene.hover += ((pointer.inside ? 1 : 0) - scene.hover) * EASE
      scene.spot.x += (pointer.px - scene.spot.x) * SPOT_FOLLOW
      scene.spot.y += (pointer.py - scene.spot.y) * SPOT_FOLLOW
      draw(now)
    }

    // Without the loop (reduced motion), the effects snap to the pointer.
    const snap = () => {
      scene.light.x = pointer.x
      scene.light.y = pointer.y
      scene.hover = pointer.inside ? 1 : 0
      scene.spot.x = pointer.px
      scene.spot.y = pointer.py
      draw(performance.now())
    }

    const track = (clientX: number, clientY: number) => {
      const rect = wrap.getBoundingClientRect()
      pointer.px = clientX - rect.left
      pointer.py = clientY - rect.top
      pointer.x = (pointer.px / rect.width) * 2 - 1
      pointer.y = (pointer.py / rect.height) * 2 - 1
      // Entering fresh: start the spot under the cursor rather than sliding in.
      if (scene.hover < 0.05) {
        scene.spot.x = pointer.px
        scene.spot.y = pointer.py
      }
      pointer.inside = true
      if (reducedMotion) snap()
    }

    // Touch press-and-hold state.
    let held = false
    let holdTimer = 0
    const holdStart = { x: 0, y: 0 }
    const cancelHold = () => {
      clearTimeout(holdTimer)
      holdTimer = 0
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return track(e.clientX, e.clientY)
      cancelHold()
      holdStart.x = e.clientX
      holdStart.y = e.clientY
      holdTimer = window.setTimeout(() => {
        holdTimer = 0
        held = true
        track(holdStart.x, holdStart.y)
      }, HOLD_MS)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || held) return track(e.clientX, e.clientY)
      // Moving before the hold completes means the finger is scrolling.
      if (Math.hypot(e.clientX - holdStart.x, e.clientY - holdStart.y) > HOLD_SLOP) cancelHold()
      else {
        holdStart.x = e.clientX
        holdStart.y = e.clientY
      }
    }
    const onPointerLeave = () => {
      cancelHold()
      held = false
      pointer.x = 0
      pointer.y = 0
      pointer.inside = false
      if (reducedMotion) snap()
    }
    // Once held, stop the drag from scrolling. Needs a non-passive listener;
    // touch-action can't be changed mid-gesture.
    const onTouchMove = (e: TouchEvent) => {
      if (held) e.preventDefault()
    }
    // Long-pressing would otherwise open the image/selection menu.
    const onContextMenu = (e: Event) => {
      if (held || holdTimer) e.preventDefault()
    }

    const resizeObserver = new ResizeObserver(build)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && fadeStart === null) fadeStart = performance.now()
      if (reducedMotion) draw(performance.now())
    })

    const image = new Image()
    image.onload = () => {
      img = image
      bounds = contentBounds(image, whiteIsBackground)
      build()
      resizeObserver.observe(wrap)
      intersectionObserver.observe(wrap)
      if (!reducedMotion) frame = requestAnimationFrame(loop)
    }
    image.onerror = () => setFailed(true)
    image.src = src

    // Touch fires pointerleave when the finger lifts, and pointercancel when
    // the browser takes the gesture to scroll.
    wrap.addEventListener('pointerdown', onPointerDown)
    wrap.addEventListener('pointermove', onPointerMove)
    wrap.addEventListener('pointerleave', onPointerLeave)
    wrap.addEventListener('pointercancel', onPointerLeave)
    wrap.addEventListener('touchmove', onTouchMove, { passive: false })
    wrap.addEventListener('contextmenu', onContextMenu)

    return () => {
      image.onload = null
      image.onerror = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      cancelHold()
      wrap.removeEventListener('pointerdown', onPointerDown)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      wrap.removeEventListener('pointercancel', onPointerLeave)
      wrap.removeEventListener('touchmove', onTouchMove)
      wrap.removeEventListener('contextmenu', onContextMenu)
    }
    // tint is read once; callers pass a constant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, whiteIsBackground, dotsAcross])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={`${styles.wrap} ${failed ? styles.failed : ''} ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden className={styles.canvas} />
    </div>
  )
}
