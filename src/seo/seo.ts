/**
 * SEO data model shared by the prerenderer (server) and the client.
 * One renderer (renderHead) produces the managed <head> tags for both, so the
 * static HTML and client-side navigations always agree.
 */
import { absoluteUrl, config } from '../config/site'
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from '../i18n/locale'
import { matchPage, PATHS, type PageId } from '../routes'

export const SITE_NAME = 'Hades Design'

export interface SeoInput {
  /** Page title without the site name (the home page passes `fullTitle` instead). */
  title?: string
  /** Use this exact <title> (e.g. the home page). */
  fullTitle?: string
  description: string
  /** Path of a 1200×630 image in /public. Defaults to the locale's brand image. */
  image?: string
  imageAlt?: string
  noindex?: boolean
  /** JSON-LD objects (or @graph nodes) for this page. */
  jsonLd?: object[]
}

export interface SeoData {
  title: string
  description: string
  locale: Locale
  canonical: string | null
  alternates: Array<{ hreflang: string; href: string }>
  image: string
  imageAlt: string
  noindex: boolean
  jsonLd: object[]
}

const DEFAULT_IMAGE: Record<Locale, { path: string; alt: string }> = {
  fi: { path: 'og/hades-design-fi.png', alt: 'Hades Design – verkkosivut, verkkokaupat ja ylläpito' },
  en: { path: 'og/hades-design-en.png', alt: 'Hades Design – websites, online stores and maintenance' },
}

export function buildSeo(input: SeoInput, locale: Locale, pathname: string): SeoData {
  const page = matchPage(pathname)
  const noindex = Boolean(input.noindex || config.noindex || !page)
  const title = input.fullTitle ?? (input.title ? `${input.title} | ${SITE_NAME}` : SITE_NAME)
  const fallback = DEFAULT_IMAGE[locale]

  return {
    title,
    description: input.description,
    locale,
    canonical: page && !input.noindex ? absoluteUrl(PATHS[page.id][locale]) : null,
    alternates: page && !input.noindex ? alternatesFor(page.id) : [],
    image: absoluteUrl(input.image ?? fallback.path),
    imageAlt: input.imageAlt ?? fallback.alt,
    noindex,
    jsonLd: input.jsonLd ?? [],
  }
}

function alternatesFor(id: PageId) {
  return [
    ...LOCALES.map((l) => ({ hreflang: LOCALE_META[l].htmlLang, href: absoluteUrl(PATHS[id][l]) })),
    { hreflang: 'x-default', href: absoluteUrl(PATHS[id][DEFAULT_LOCALE]) },
  ]
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** JSON for a <script> element: "</script>" and friends can never break out. */
const safeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

/** The managed <head> tags. Every tag carries data-seo so the client can replace them. */
export function renderHead(seo: SeoData): string {
  const m = LOCALE_META[seo.locale]
  const tags: string[] = [
    `<title data-seo>${escapeAttr(seo.title)}</title>`,
    `<meta data-seo name="description" content="${escapeAttr(seo.description)}" />`,
  ]
  if (seo.noindex) tags.push('<meta data-seo name="robots" content="noindex, follow" />')
  if (seo.canonical) tags.push(`<link data-seo rel="canonical" href="${escapeAttr(seo.canonical)}" />`)
  for (const alt of seo.alternates) {
    tags.push(`<link data-seo rel="alternate" hreflang="${alt.hreflang}" href="${escapeAttr(alt.href)}" />`)
  }
  tags.push(
    '<meta data-seo property="og:type" content="website" />',
    `<meta data-seo property="og:site_name" content="${SITE_NAME}" />`,
    `<meta data-seo property="og:locale" content="${m.ogLocale}" />`,
    ...LOCALES.filter((l) => l !== seo.locale).map(
      (l) => `<meta data-seo property="og:locale:alternate" content="${LOCALE_META[l].ogLocale}" />`,
    ),
    `<meta data-seo property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta data-seo property="og:description" content="${escapeAttr(seo.description)}" />`,
  )
  if (seo.canonical) tags.push(`<meta data-seo property="og:url" content="${escapeAttr(seo.canonical)}" />`)
  tags.push(
    `<meta data-seo property="og:image" content="${escapeAttr(seo.image)}" />`,
    '<meta data-seo property="og:image:width" content="1200" />',
    '<meta data-seo property="og:image:height" content="630" />',
    `<meta data-seo property="og:image:alt" content="${escapeAttr(seo.imageAlt)}" />`,
    '<meta data-seo name="twitter:card" content="summary_large_image" />',
    `<meta data-seo name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta data-seo name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta data-seo name="twitter:image" content="${escapeAttr(seo.image)}" />`,
  )
  for (const data of seo.jsonLd) {
    tags.push(`<script data-seo type="application/ld+json">${safeJson(data)}</script>`)
  }
  return tags.join('\n    ')
}

/** Client side: swap the managed head tags for the current page. */
export function applySeo(seo: SeoData): void {
  const head = document.head
  head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  const template = document.createElement('template')
  template.innerHTML = renderHead(seo)
  // Insert right after <meta viewport> so ordering matches the static HTML.
  const anchor = head.querySelector('meta[name="viewport"]')
  head.insertBefore(template.content, anchor ? anchor.nextSibling : head.firstChild)
  document.documentElement.lang = LOCALE_META[seo.locale].htmlLang
}
