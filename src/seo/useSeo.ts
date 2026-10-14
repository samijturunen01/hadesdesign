import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router'
import { useLocale } from '../i18n/locale'
import { applySeo, buildSeo, type SeoData, type SeoInput } from './seo'

/** Provided only while prerendering: collects the page's SEO data for the <head>. */
export interface SeoCollector {
  collect(seo: SeoData): void
}
export const SeoContext = createContext<SeoCollector | null>(null)

/** Declare the page's title, description, social image and structured data. Call once per page. */
export function useSeo(input: SeoInput): void {
  const locale = useLocale()
  const { pathname } = useLocation()
  const collector = useContext(SeoContext)
  const seo = buildSeo(input, locale, pathname)

  // Prerender: hand the data to the static HTML writer.
  collector?.collect(seo)

  // Client: keep <head> in sync on navigation. The signature keeps the effect stable.
  const signature = JSON.stringify(seo)
  useEffect(() => {
    applySeo(JSON.parse(signature) as SeoData)
  }, [signature])
}
