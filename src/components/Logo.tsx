import { useId } from 'react'

/**
 * The Hades Design mark: a faceted obsidian hexagon with an ember-lit H.
 * Keep the geometry in sync with scripts/generate-assets.mjs (favicons, OG images).
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}b`} x1="8" y1="2" x2="24" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2b2537" />
          <stop offset=".55" stopColor="#121018" />
          <stop offset="1" stopColor="#1c1214" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c7b6ff" />
          <stop offset=".5" stopColor="#5b4a86" />
          <stop offset="1" stopColor="#ff8a4c" />
        </linearGradient>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff6a2b" />
          <stop offset="1" stopColor="#ffc07a" />
        </linearGradient>
      </defs>
      <path d="M16 1.5 28.5 8.75v14.5L16 30.5 3.5 23.25V8.75Z" fill={`url(#${id}b)`} stroke={`url(#${id}r)`} strokeWidth="1" />
      <path d="M16 1.5 3.5 8.75 16 16Z" fill="#fff" fillOpacity=".07" />
      <path d="M16 16 28.5 23.25 16 30.5Z" fill="#ff7a3d" fillOpacity=".1" />
      <path d="M9.6 9.4 13 8.4v15.2l-3.4-1Z" fill="#ece8f2" />
      <path d="M22.4 9.4 19 8.4v15.2l3.4-1Z" fill="#ece8f2" />
      <rect x="13" y="14.3" width="6" height="3.4" fill={`url(#${id}e)`} />
    </svg>
  )
}
