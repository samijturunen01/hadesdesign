/**
 * In-app navigation with native View Transitions.
 *
 * Preloads the target page, then performs the route change inside
 * document.startViewTransition() with flushSync, so the browser animates
 * between two fully rendered pages. Browsers without the API (or users who
 * prefer reduced motion) navigate instantly – nothing depends on the animation.
 */
import { useCallback } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { preloadPath } from '../pages/registry'
import { normalizePath } from '../routes'
import { prefersReducedMotion } from './motion'

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> }
}

export function useAppNavigate() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    async (to: string, options: { replace?: boolean } = {}) => {
      const [targetPath = '/', hash] = to.split('#')
      if (normalizePath(targetPath) === normalizePath(pathname) && !hash) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
        return
      }
      await preloadPath(targetPath)
      const go = () => {
        void navigate(to, options)
      }
      const doc = document as ViewTransitionDocument
      if (!doc.startViewTransition || prefersReducedMotion()) {
        go()
        return
      }
      document.documentElement.dataset.navigating = ''
      const transition = doc.startViewTransition(() => flushSync(go))
      void transition.finished.finally(() => delete document.documentElement.dataset.navigating)
    },
    [navigate, pathname],
  )
}
