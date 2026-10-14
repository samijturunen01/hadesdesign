/**
 * Route registry – the single source of truth for every URL on the site.
 * Used by the client router, the prerender script (static HTML per route),
 * sitemap.xml, hreflang alternates, navigation and the language switcher.
 */
import { LOCALES, type Locale, type Localized } from './i18n/locale'

export const PAGE_IDS = [
  'home',
  'services',
  'websites',
  'ecommerce',
  'redesign',
  'maintenance',
  'work',
  'pricing',
  'about',
  'contact',
  'privacy',
  'terms',
] as const

export type PageId = (typeof PAGE_IDS)[number]

/** Service detail pages share one template (src/pages/service). */
export const SERVICE_PAGE_IDS = ['websites', 'ecommerce', 'redesign', 'maintenance'] as const
export type ServicePageId = (typeof SERVICE_PAGE_IDS)[number]

export const PATHS: Record<PageId, Localized> = {
  home: { fi: '/', en: '/en' },
  services: { fi: '/palvelut', en: '/en/services' },
  websites: { fi: '/palvelut/verkkosivut', en: '/en/services/websites' },
  ecommerce: { fi: '/palvelut/verkkokaupat', en: '/en/services/online-stores' },
  redesign: { fi: '/palvelut/verkkosivujen-uudistus', en: '/en/services/website-redesign' },
  maintenance: { fi: '/palvelut/yllapito-ja-hosting', en: '/en/services/maintenance-and-hosting' },
  work: { fi: '/referenssit', en: '/en/work' },
  pricing: { fi: '/hinnasto', en: '/en/pricing' },
  about: { fi: '/meista', en: '/en/about' },
  contact: { fi: '/ota-yhteytta', en: '/en/contact' },
  privacy: { fi: '/tietosuojaseloste', en: '/en/privacy-policy' },
  terms: { fi: '/kayttoehdot', en: '/en/terms' },
}

/** Sitemap priority hints (0.0–1.0). */
export const PRIORITY: Record<PageId, number> = {
  home: 1,
  services: 0.9,
  websites: 0.9,
  ecommerce: 0.8,
  redesign: 0.8,
  maintenance: 0.8,
  work: 0.8,
  pricing: 0.9,
  about: 0.7,
  contact: 0.8,
  privacy: 0.3,
  terms: 0.3,
}

/** "/palvelut/" → "/palvelut", "" → "/" (query and hash removed). */
export function normalizePath(pathname: string): string {
  const path = (pathname.split(/[?#]/)[0] ?? '').replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return path || '/'
}

const byPath = new Map<string, { id: PageId; locale: Locale }>()
for (const id of PAGE_IDS) {
  for (const locale of LOCALES) byPath.set(PATHS[id][locale].toLowerCase(), { id, locale })
}

/** Which page (and language) a pathname belongs to, or null for unknown URLs. */
export function matchPage(pathname: string): { id: PageId; locale: Locale } | null {
  return byPath.get(normalizePath(pathname).toLowerCase()) ?? null
}

export function pathFor(id: PageId, locale: Locale): string {
  return PATHS[id][locale]
}

/** The same page in another language (falls back to that language's home page). */
export function translatePath(pathname: string, target: Locale): string {
  const match = matchPage(pathname)
  return match ? PATHS[match.id][target] : PATHS.home[target]
}

/**
 * URLs of the previous site (a client-side app whose routes were matched
 * case-insensitively; links used lowercase, route definitions PascalCase).
 * The prerender script writes a static redirect page for every variant, and
 * the not-found page redirects any other casing on the client.
 */
export const LEGACY_REDIRECTS: Array<{ from: string[]; to: PageId }> = [
  { from: ['/home', '/Home'], to: 'home' },
  { from: ['/services', '/Services'], to: 'services' },
  { from: ['/portfolio', '/Portfolio'], to: 'work' },
  { from: ['/pricing', '/Pricing'], to: 'pricing' },
  { from: ['/hosting', '/Hosting'], to: 'maintenance' },
  { from: ['/about', '/About'], to: 'about' },
  { from: ['/contact', '/Contact'], to: 'contact' },
  { from: ['/privacypolicy', '/PrivacyPolicy'], to: 'privacy' },
  { from: ['/terms', '/Terms'], to: 'terms' },
]

/** Resolve an old-site URL (any casing) to its new page, or null. */
export function matchLegacy(pathname: string): PageId | null {
  const path = normalizePath(pathname).toLowerCase()
  return LEGACY_REDIRECTS.find((r) => r.from.some((f) => f.toLowerCase() === path))?.to ?? null
}
