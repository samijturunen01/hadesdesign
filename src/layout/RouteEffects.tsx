/**
 * Side effects of navigation: scroll position, focus, screen-reader
 * announcement and the old site's ?lang=en links.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import { useLocale } from '../i18n/locale'
import { translatePath } from '../routes'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function RouteEffects() {
  const { pathname, hash, search } = useLocation()
  const navigationType = useNavigationType()
  const navigate = useNavigate()
  const locale = useLocale()
  const lastScrolled = useRef(pathname + hash)
  const lastAnnounced = useRef(pathname)
  const [announcement, setAnnouncement] = useState('')

  // Scroll to the top (or to #hash) on PUSH/REPLACE; the browser restores POP.
  // A layout effect, so a view transition snapshots the new page at the top.
  useIsomorphicLayoutEffect(() => {
    const key = pathname + hash
    if (lastScrolled.current === key) return
    lastScrolled.current = key
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' })
    } else if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash, navigationType])

  // Move focus to the new page and announce its heading to screen readers.
  useEffect(() => {
    if (lastAnnounced.current === pathname) return
    lastAnnounced.current = pathname
    document.getElementById('main')?.focus({ preventScroll: true })
    const id = window.setTimeout(() => {
      const heading = document.querySelector('main h1')?.textContent?.trim()
      setAnnouncement(heading || document.title)
    }, 80)
    return () => window.clearTimeout(id)
  }, [pathname])

  // The previous site used ?lang=en – send those visitors to the English page.
  useEffect(() => {
    if (locale === 'fi' && new URLSearchParams(search).get('lang') === 'en') {
      void navigate(translatePath(pathname, 'en'), { replace: true })
    }
  }, [locale, pathname, search, navigate])

  return (
    <p className="visually-hidden" aria-live="polite" aria-atomic="true">
      {announcement}
    </p>
  )
}
