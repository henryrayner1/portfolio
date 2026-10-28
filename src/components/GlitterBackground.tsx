import { useEffect, useRef } from 'react'
import styles from './GlitterBackground.module.css'

// Elements marked with this attribute (e.g. <nav data-glitter-calm>) get a quieter patch of glitter behind
// them so their text stays readable.
export const CALM_ATTR = 'data-glitter-calm'
const MAX_CALM = 4

const LIGHT_EASE = 0.12 // per-frame easing of the light toward the pointer
// Pointer travel (CSS px) that sweeps the light from one extreme to the
// other, about one of the reference's cards. Mapping the whole window instead
// made it far too sluggish, so the light sweeps back and forth across it.
const LIGHT_SPAN = 350

// A triangle wave: -1..1 and back over a period of 2.
const bounce = (t: number) => 2 * Math.abs(t - 2 * Math.floor((t + 1) / 2)) - 1

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// Glitter flakes after the card surface on tssongsorter.com: a Voronoi field
// of tiny tilted mirrors, lit from the upper left. The pointer nudges the
// light, so different flakes catch it and flash as it moves.
const FRAGMENT = `
precision highp float;
uniform vec2 u_size;      // CSS px
uniform float u_dpr;
uniform float u_time;     // s
uniform vec2 u_light;     // light offset from the pointer, -1..1
uniform vec4 u_calm[${MAX_CALM}]; // text boxes x, y, w, h (CSS px); w = 0 for none

const float CELL = 6.4;   // flake size, CSS px

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

// 1 inside a text box, easing to 0 over ~50px outside it.
float calmFor(vec4 box, vec2 at) {
  if (box.z <= 0.0) return 0.0;
  vec2 q = abs(at - (box.xy + box.zw * 0.5)) - box.zw * 0.5;
  float outside = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  return 1.0 - smoothstep(-10.0, 48.0, outside);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_size.y * u_dpr - gl_FragCoord.y) / u_dpr;

  // Which flake this pixel belongs to (Voronoi facets).
  vec2 g = floor(p / CELL);
  vec2 f = p / CELL - g;
  float d1 = 8.0, d2 = 8.0;
  vec2 id = g;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 c = o + 0.1 + 0.8 * hash2(g + o) - f;
      float d = dot(c, c);
      if (d < d1) { d2 = d1; d1 = d; id = g + o; }
      else if (d < d2) { d2 = d; }
    }
  }
  vec3 rnd = hash3(id);
  vec2 centre = (id + 0.1 + 0.8 * hash2(id)) * CELL;

  // The flake's resting tilt, plus a faint shimmer. Flakes are rigid, so
  // everything below is decided per flake, from its centre.
  float phase = rnd.x * 6.2832;
  vec2 tilt = (rnd.xy - 0.5) * 0.9
            + 0.035 * vec2(sin(u_time * (0.7 + rnd.z) + phase), cos(u_time * (0.9 + rnd.y) + phase));
  vec3 n = normalize(vec3(tilt, 1.0));

  // Light from the upper left, nudged by the pointer; viewer straight on.
  vec3 L = normalize(vec3(-0.45 + u_light.x * 0.35, -0.55 + u_light.y * 0.35, 1.0));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float ndh = max(dot(n, H), 0.0);
  float spec = pow(ndh, 260.0);         // a mirror flake: all or nothing
  float glow = pow(ndh, 24.0) * 0.14;   // its near misses, a soft glint

  // Behind text the glitter is quieter: fewer, dimmer flashes and a
  // flatter tone, easing out to full sparkle past the text.
  float calm = 0.0;
  for (int k = 0; k < ${MAX_CALM}; k++) calm = max(calm, calmFor(u_calm[k], centre));
  spec *= 1.0 - 0.85 * calm;
  glow *= 1.0 - 0.6 * calm;
  float diffuse = max(dot(n, L), 0.0);

  // Peach flakes centred on the header's --bg-outer (#fde3d5), so the
  // glitter reads as the same colour catching the light.
  vec3 dark  = vec3(0.902, 0.765, 0.694);
  vec3 mid   = vec3(0.992, 0.890, 0.835);
  vec3 light = vec3(1.0, 0.945, 0.918);
  vec3 base = rnd.z < 0.5 ? mix(dark, mid, rnd.z * 2.0) : mix(mid, light, rnd.z * 2.0 - 1.0);

  base = mix(base, mid, 0.45 * calm);
  vec3 col = base * (0.62 + 0.45 * diffuse)
           + vec3(1.0, 0.95, 0.92) * glow
           + vec3(1.0, 0.98, 0.96) * spec * 1.7;

  // Hairline seams between flakes.
  float seam = smoothstep(0.0, 0.06, sqrt(d2) - sqrt(d1));
  col *= mix(0.93, 1.0, seam);

  // Knock back toward the mid peach so it stays a background.
  col = mix(col, mid, 0.22);
  gl_FragColor = vec4(col, 1.0);
}
`

/** A full-window glitter surface that sits behind the page content. */
export function GlitterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    // Without WebGL the plain page background shows instead.
    if (!canvas || !gl) return

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('GlitterBackground shader:', gl.getShaderInfoLog(shader))
        return null
      }
      return shader
    }
    const vertex = compile(gl.VERTEX_SHADER, VERTEX)
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()!
    if (!vertex || !fragment) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // One triangle covering the viewport.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const u = {
      size: gl.getUniformLocation(program, 'u_size'),
      dpr: gl.getUniformLocation(program, 'u_dpr'),
      time: gl.getUniformLocation(program, 'u_time'),
      light: gl.getUniformLocation(program, 'u_light'),
      calm: gl.getUniformLocation(program, 'u_calm'),
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    const pointer = { x: 0, y: 0 }
    const light = { x: 0, y: 0 }
    const size = { w: 0, h: 0, dpr: 1 }
    const calm = new Float32Array(MAX_CALM * 4)
    let frame = 0

    const measureCalm = () => {
      calm.fill(0)
      document.querySelectorAll(`[${CALM_ATTR}]`).forEach((el, i) => {
        if (i >= MAX_CALM) return
        const r = el.getBoundingClientRect()
        calm.set([r.left, r.top, r.width, r.height], i * 4)
      })
    }

    const resize = () => {
      size.w = window.innerWidth
      size.h = window.innerHeight
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(size.w * size.dpr))
      canvas.height = Math.max(1, Math.round(size.h * size.dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      measureCalm()
    }

    const draw = (now: number) => {
      gl.uniform2f(u.size, size.w, size.h)
      gl.uniform1f(u.dpr, size.dpr)
      gl.uniform1f(u.time, reducedMotion ? 0 : (now - start) / 1000)
      gl.uniform2f(u.light, light.x, light.y)
      gl.uniform4fv(u.calm, calm)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (document.hidden) return
      light.x += (pointer.x - light.x) * LIGHT_EASE
      light.y += (pointer.y - light.y) * LIGHT_EASE
      draw(now)
    }

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = bounce(e.clientX / LIGHT_SPAN)
      pointer.y = bounce(e.clientY / LIGHT_SPAN)
      // Without the loop (reduced motion), the light snaps to the pointer.
      if (reducedMotion) {
        light.x = pointer.x
        light.y = pointer.y
        draw(performance.now())
      }
    }

    const onResize = () => {
      resize()
      draw(performance.now())
    }

    // Text boxes can change size without the window resizing (fonts loading,
    // nav wrapping), so watch them too.
    const resizeObserver = new ResizeObserver(() => {
      measureCalm()
      if (reducedMotion) draw(performance.now())
    })
    document.querySelectorAll(`[${CALM_ATTR}]`).forEach((el) => resizeObserver.observe(el))

    resize()
    draw(performance.now())
    if (!reducedMotion) frame = requestAnimationFrame(loop)
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      // No loseContext(): StrictMode remounts onto the same canvas, which
      // would hand back the lost context.
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={styles.canvas} />
}
