import type { ReactNode } from 'react'
import { RouteEffects } from './RouteEffects'

/** TEMPORARY shell – replaced by the designed header/footer. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Siirry sisältöön</a>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <RouteEffects />
    </>
  )
}
