import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './motion'

/**
 * Counts smoothly from the previous value to `target` (ease-out). With reduced
 * motion the new value is shown on the next frame. Purely visual – keep the
 * real value in an accessible live region next to it.
 */
export function useTweenedNumber(target: number, duration = 480): number {
  const [value, setValue] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const from = current.current
    if (from === target) return
    const length = prefersReducedMotion() ? 0 : duration
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const progress = length ? Math.min(1, (now - start) / length) : 1
      const eased = 1 - (1 - progress) ** 3
      const next = progress === 1 ? target : Math.round(from + (target - from) * eased)
      current.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
