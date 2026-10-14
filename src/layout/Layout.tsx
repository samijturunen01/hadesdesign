import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { useT } from '../i18n/locale'
import { ui } from '../i18n/strings'
import { useSiteInteractions } from '../lib/interactions'
import { RouteEffects } from './RouteEffects'

export function Layout({ children }: { children: ReactNode }) {
  const t = useT()
  const { pathname } = useLocation()
  useSiteInteractions(pathname)

  return (
    <>
      <a className="skip-link" href="#main">
        {t(ui.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <RouteEffects />
    </>
  )
}
