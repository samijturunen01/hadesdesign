/**
 * Page modules are code-split. Each page is preloaded before navigation (and
 * before hydration), and the lazy wrapper then renders it synchronously, so a
 * view transition never captures a loading state.
 */
import { lazy, type ComponentType } from 'react'
import { matchPage, PAGE_IDS, type PageId } from '../routes'

export interface PageProps {
  id: PageId
}

type PageModule = { default: ComponentType<PageProps> }
export type PageKey = PageId | 'notFound'

const loaders: Record<PageKey, () => Promise<PageModule>> = {
  home: () => import('./home/HomePage'),
  services: () => import('./services/ServicesPage'),
  websites: () => import('./service/ServicePage'),
  ecommerce: () => import('./service/ServicePage'),
  redesign: () => import('./service/ServicePage'),
  maintenance: () => import('./service/ServicePage'),
  work: () => import('./work/WorkPage'),
  pricing: () => import('./pricing/PricingPage'),
  about: () => import('./about/AboutPage'),
  contact: () => import('./contact/ContactPage'),
  privacy: () => import('./legal/PrivacyPage'),
  terms: () => import('./legal/TermsPage'),
  notFound: () => import('./not-found/NotFoundPage'),
}

const loaded = new Map<PageKey, PageModule>()
const pending = new Map<PageKey, Promise<PageModule>>()

export function loadPage(key: PageKey): Promise<PageModule> {
  const done = loaded.get(key)
  if (done) return Promise.resolve(done)
  let promise = pending.get(key)
  if (!promise) {
    promise = loaders[key]().then((mod) => {
      loaded.set(key, mod)
      return mod
    })
    promise.catch(() => pending.delete(key))
    pending.set(key, promise)
  }
  return promise
}

export function pageKeyForPath(pathname: string): PageKey {
  return matchPage(pathname)?.id ?? 'notFound'
}

/** Warm the chunk for a URL (hover, focus, idle time). Errors are ignored here. */
export function preloadPath(pathname: string): Promise<unknown> {
  return loadPage(pageKeyForPath(pathname)).catch(() => undefined)
}

export function loadAllPages(): Promise<unknown> {
  return Promise.all([...PAGE_IDS, 'notFound' as const].map((key) => loadPage(key)))
}

/**
 * React.lazy whose factory returns a synchronous thenable once the module is
 * cached – React then resolves it during the same render instead of suspending.
 */
function lazyPage<P extends object>(key: PageKey) {
  type Module = { default: ComponentType<P> }
  return lazy<ComponentType<P>>(() => {
    const cached = loaded.get(key) as Module | undefined
    if (cached) return { then: (resolve: (mod: Module) => void) => resolve(cached) } as unknown as Promise<Module>
    return loadPage(key) as unknown as Promise<Module>
  })
}

export const PAGES = {} as Record<PageId, ComponentType<PageProps>>
for (const id of PAGE_IDS) PAGES[id] = lazyPage<PageProps>(id)

export const NotFoundPage = lazyPage<object>('notFound')
