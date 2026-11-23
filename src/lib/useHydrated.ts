import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * false while prerendering and during hydration, true afterwards (and on every
 * client-side mount). Pages are prerendered without a query string, so anything
 * that depends on location.search must wait for this to stay hydration-safe.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
