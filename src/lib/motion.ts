/** Motion helpers shared by components. All motion is optional enhancement. */

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Fine pointer + hover capable (mouse/trackpad) – gates cursor-driven effects. */
export function hasFinePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/** Run a callback when the browser is idle (falls back to a timeout). */
export function onIdle(callback: () => void, timeout = 1500): () => void {
  if (typeof window === 'undefined') return () => {}
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = setTimeout(callback, 600)
  return () => clearTimeout(handle)
}
