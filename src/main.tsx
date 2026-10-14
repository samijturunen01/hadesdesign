import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { localeFromPath } from './i18n/locale'
import { loadPage, pageKeyForPath } from './pages/registry'
import { matchPage, normalizePath } from './routes'
import './styles/index.css'

const base = import.meta.env.BASE_URL
const container = document.getElementById('root')
if (!container) throw new Error('#root is missing from index.html')

/** The current path without the base path (for preview builds under a sub-folder). */
function currentPath(): string {
  const { pathname } = window.location
  const prefix = base.replace(/\/$/, '')
  if (prefix && pathname.toLowerCase().startsWith(prefix.toLowerCase())) return pathname.slice(prefix.length) || '/'
  return pathname
}

const path = currentPath()

// Load this page's chunk first: the lazy page then renders synchronously, so
// hydration matches the prerendered HTML without a loading state.
await loadPage(pageKeyForPath(path)).catch(() => undefined)

const app = (
  <StrictMode>
    <BrowserRouter basename={base} useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Hydrate only when the static HTML was rendered for this URL. GitHub Pages
// serves 404.html (Finnish) for unknown URLs – an English unknown URL, for
// example, is rendered fresh instead.
const prerendered = container.dataset.route
const matchesRoute =
  prerendered === normalizePath(path).toLowerCase() ||
  (prerendered === '/404' && !matchPage(path) && container.dataset.locale === localeFromPath(path))

if (container.firstElementChild && matchesRoute) {
  hydrateRoot(container, app)
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
