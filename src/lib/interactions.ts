/**
 * Site-wide interaction layer, mounted once in the layout:
 *  - scroll reveals for [data-reveal] (stagger with style="--i: n")
 *  - cursor spotlight for [data-spotlight] (sets --mx/--my)
 *  - 3D tilt for [data-tilt] (sets --rx/--ry, −1…1)
 *  - magnetic pull for [data-magnetic] (sets --tx/--ty)
 * Everything is enhancement: without JS or with reduced motion the content is simply visible.
 */
import { useEffect, useLayoutEffect } from 'react'
import { hasFinePointer, prefersReducedMotion } from './motion'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useSiteInteractions(pathname: string): void {
  // Reveals – re-scanned on every route change.
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-ready')
      return
    }
    const pending = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')]
    const fold = window.innerHeight * 0.95
    // Anything already on screen is shown immediately, so nothing visible ever blinks out.
    for (const el of pending) if (el.getBoundingClientRect().top < fold) el.classList.add('is-in')
    root.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    )
    for (const el of pending) if (!el.classList.contains('is-in')) observer.observe(el)
    return () => observer.disconnect()
  }, [pathname])

  // Pointer effects – one delegated, rAF-throttled listener.
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    let frame = 0
    let last: PointerEvent | null = null
    let tilted: HTMLElement | null = null
    let magnet: HTMLElement | null = null

    const reset = (el: HTMLElement | null, a: string, b: string) => {
      el?.style.setProperty(a, '0')
      el?.style.setProperty(b, '0')
    }

    const update = () => {
      frame = 0
      const event = last
      if (!event) return
      const target = event.target instanceof Element ? event.target : null

      const spot = target?.closest<HTMLElement>('[data-spotlight]')
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--mx', `${event.clientX - r.left}px`)
        spot.style.setProperty('--my', `${event.clientY - r.top}px`)
      }

      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null
      if (tilt !== tilted) reset(tilted, '--rx', '--ry')
      tilted = tilt
      if (tilt) {
        const r = tilt.getBoundingClientRect()
        tilt.style.setProperty('--rx', (((event.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
        tilt.style.setProperty('--ry', (((event.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
      }

      const pull = target?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (pull !== magnet) {
        magnet?.style.setProperty('--tx', '0px')
        magnet?.style.setProperty('--ty', '0px')
      }
      magnet = pull
      if (pull) {
        const r = pull.getBoundingClientRect()
        pull.style.setProperty('--tx', `${((event.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px`)
        pull.style.setProperty('--ty', `${((event.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px`)
      }
    }

    const onMove = (event: PointerEvent) => {
      last = event
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onLeave = () => {
      reset(tilted, '--rx', '--ry')
      magnet?.style.setProperty('--tx', '0px')
      magnet?.style.setProperty('--ty', '0px')
      tilted = magnet = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}
