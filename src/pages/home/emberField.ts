/**
 * The hero's living background: molten ember light moving beneath a sheet of
 * obsidian, with a cool violet rim light from above. Raw WebGL2, one
 * full-screen triangle, rendered at reduced resolution and paused whenever the
 * hero is off screen or the tab is hidden. Loaded lazily – the CSS gradient
 * underneath is the fallback and looks complete on its own.
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHeat;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;
  float t = uTime * 0.035;

  // Domain-warped noise: slow, viscous flow.
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.6 * r);

  // Heat rises from below and gathers around the cursor.
  float heat = smoothstep(0.78, -0.05, uv.y) * uHeat;
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(vec2(uv.x * aspect, uv.y), m);
  heat += 0.28 * exp(-d * d * 7.0);

  float lava = smoothstep(0.42, 1.0, f * heat * 1.5 + heat * 0.22);

  vec3 col = vec3(0.035, 0.031, 0.051);                         // obsidian
  col = mix(col, vec3(0.2, 0.045, 0.02), smoothstep(0.0, 0.4, lava));
  col = mix(col, vec3(0.95, 0.36, 0.13), smoothstep(0.32, 0.78, lava));
  col = mix(col, vec3(1.0, 0.74, 0.46), smoothstep(0.78, 1.0, lava));

  // Thin glowing veins, like light through cracks in volcanic glass.
  float vein = 1.0 - smoothstep(0.0, 0.03, abs(f - 0.52));
  col += vec3(1.0, 0.42, 0.18) * vein * heat * 0.3;

  // Cool rim light from above.
  col += vec3(0.36, 0.28, 0.72) * pow(uv.y, 2.5) * 0.16 * (0.6 + 0.4 * q.x);

  // Dither to avoid banding in the dark gradients.
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
  outColor = vec4(col, 1.0);
}`

export interface EmberFieldOptions {
  /** Render a single frame and stop (prefers-reduced-motion). */
  still?: boolean
  /** Fraction of device pixels to render (lower = faster). */
  scale?: number
  onReady?: () => void
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/** Start the effect on a canvas. Returns a cleanup function (also when WebGL2 is unavailable). */
export function startEmberField(canvas: HTMLCanvasElement, options: EmberFieldOptions = {}): () => void {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' })
  if (!gl) return () => {}

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return () => {}
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {}
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uRes = gl.getUniformLocation(program, 'uRes')
  const uTime = gl.getUniformLocation(program, 'uTime')
  const uMouse = gl.getUniformLocation(program, 'uMouse')
  const uHeat = gl.getUniformLocation(program, 'uHeat')

  const scale = options.scale ?? 0.5
  const mouse = { x: 0.72, y: 0.12, tx: 0.72, ty: 0.12 }
  let heat = options.still ? 1 : 0
  let frame = 0
  let visible = true
  let ready = false
  const start = performance.now() - 40_000 // start mid-flow, not from a uniform field

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2) * scale
    const w = Math.max(1, Math.round(canvas.clientWidth * ratio))
    const h = Math.max(1, Math.round(canvas.clientHeight * ratio))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
  }

  const draw = (now: number) => {
    frame = 0
    resize()
    mouse.x += (mouse.tx - mouse.x) * 0.04
    mouse.y += (mouse.ty - mouse.y) * 0.04
    heat += (1 - heat) * 0.02 // the forge warms up after load
    gl.uniform2f(uRes, canvas.width, canvas.height)
    gl.uniform1f(uTime, (now - start) / 1000)
    gl.uniform2f(uMouse, mouse.x, mouse.y)
    gl.uniform1f(uHeat, heat)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (!ready) {
      ready = true
      options.onReady?.()
    }
    if (!options.still && visible && !document.hidden) frame = requestAnimationFrame(draw)
  }

  const play = () => {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw)
  }

  const onPointer = (event: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    mouse.tx = (event.clientX - r.left) / r.width
    mouse.ty = 1 - (event.clientY - r.top) / r.height
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true
    if (visible && !options.still) play()
  })
  observer.observe(canvas)

  const onVisibility = () => (options.still ? undefined : play())
  const onResize = () => (options.still ? requestAnimationFrame(draw) : undefined)

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', onResize)
  if (!options.still) window.addEventListener('pointermove', onPointer, { passive: true })
  frame = requestAnimationFrame(draw)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointer)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
