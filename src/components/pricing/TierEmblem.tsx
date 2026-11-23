import { useId } from 'react'
import type { TierId } from '../../data/pricing'

/**
 * Package emblems drawn in the site's line style:
 * Hermes – a wing (speed, the messenger), Apollo – the sun (light, harmony),
 * Zeus – a thunderbolt (power). Colour comes from the surrounding --tier token.
 */
export function TierEmblem({ tier, className }: { tier: TierId; className?: string }) {
  const id = useId().replace(/:/g, '')
  const glow = `${id}g`
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={glow} cx="50%" cy="60%" r="55%">
          <stop offset="0" stopColor="currentColor" stopOpacity=".45" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {tier === 'hermes' && (
        <>
          <path d="M5.5 24.5C10 17 17.5 10.5 27.5 6.5 25 12 20.5 16.6 14.5 19.8" fill={`url(#${glow})`} />
          <path d="M8 26c5-1.6 10-4.6 14.5-9.2" />
          <path d="M11 27.4c3.6-.4 7-1.8 10-4.2" />
          <path d="M5.5 24.5 3 27" />
        </>
      )}
      {tier === 'apollo' && (
        <>
          <circle cx="16" cy="16" r="5.5" fill={`url(#${glow})`} />
          <path d="M24.5 16h4M22 22l2.8 2.8M16 24.5v4M10 22l-2.8 2.8M7.5 16h-4M10 10 7.2 7.2M16 7.5v-4M22 10l2.8-2.8" />
          <path
            d="M24.3 19.4l1.7.7M19.4 24.3l.7 1.7M12.6 24.3l-.7 1.7M7.7 19.4l-1.7.7M7.7 12.6 6 11.9M12.6 7.7 11.9 6M19.4 7.7l.7-1.7M24.3 12.6l1.7-.7"
            strokeWidth={1.1}
          />
        </>
      )}
      {tier === 'zeus' && <path d="M18.6 3 8 18h7.2l-2.8 11L24 13h-7.2l1.8-10Z" fill={`url(#${glow})`} />}
    </svg>
  )
}
