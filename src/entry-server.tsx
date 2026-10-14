/**
 * Server entry, used only at build time by scripts/prerender.mjs to render
 * every route to static HTML. Never shipped to the browser.
 */
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Writable } from 'node:stream'
import App from './App'
import { config } from './config/site'
import { LOCALES, LOCALE_META } from './i18n/locale'
import { loadAllPages } from './pages/registry'
import { LEGACY_REDIRECTS, PAGE_IDS, PATHS, PRIORITY } from './routes'
import { renderHead, type SeoData } from './seo/seo'
import { SeoContext } from './seo/useSeo'
import './styles/index.css'

export interface RenderResult {
  html: string
  head: string
  lang: string
  locale: string
}

/** Render one route (path without the base path) to HTML plus its <head> tags. */
export async function render(path: string): Promise<RenderResult> {
  await loadAllPages()
  const base = import.meta.env.BASE_URL
  const location = `${base.replace(/\/$/, '')}${path}` || '/'
  const collected: { seo?: SeoData } = {}

  const html = await new Promise<string>((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <SeoContext.Provider value={{ collect: (seo) => (collected.seo = seo) }}>
          <StaticRouter location={location} basename={base}>
            <App />
          </StaticRouter>
        </SeoContext.Provider>
      </StrictMode>,
      {
        onAllReady() {
          const chunks: Buffer[] = []
          pipe(
            new Writable({
              write(chunk, _encoding, callback) {
                chunks.push(Buffer.from(chunk))
                callback()
              },
              final(callback) {
                resolve(Buffer.concat(chunks).toString('utf8'))
                callback()
              },
            }),
          )
        },
        onShellError: reject,
        onError: reject,
      },
    )
  })

  const seo = collected.seo
  if (!seo) throw new Error(`The page at ${path} did not call useSeo()`)
  return { html, head: renderHead(seo), lang: LOCALE_META[seo.locale].htmlLang, locale: seo.locale }
}

/** Everything the prerender script needs to know about the site's URLs. */
export function siteManifest() {
  return {
    siteUrl: config.siteUrl,
    noindex: config.noindex,
    pages: PAGE_IDS.flatMap((id) =>
      LOCALES.map((locale) => ({
        id,
        locale,
        path: PATHS[id][locale],
        priority: PRIORITY[id],
        alternates: LOCALES.map((l) => ({ hreflang: LOCALE_META[l].htmlLang, path: PATHS[id][l] })),
      })),
    ),
    legacy: LEGACY_REDIRECTS.flatMap((r) => r.from.map((from) => ({ from, fi: PATHS[r.to].fi, en: PATHS[r.to].en }))),
  }
}
