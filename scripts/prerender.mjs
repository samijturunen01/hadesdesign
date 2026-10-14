/**
 * Prerender every route to static HTML after `vite build` (run by `npm run build`).
 *
 * GitHub Pages has no rewrite rules, so every URL must exist as a real file:
 *   /palvelut   → dist/palvelut.html          (GitHub Pages serves extensionless URLs from .html)
 *   /palvelut/  → dist/palvelut/index.html    (trailing-slash variant)
 *   unknown URL → dist/404.html               (branded not-found page, served with HTTP 404)
 * Old URLs of the previous site get small redirect pages (meta refresh + canonical).
 * Also writes sitemap.xml (with hreflang alternates), robots.txt and .nojekyll.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const rawBase = process.env.BASE_PATH?.trim() || '/'
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/\/{2,}/g, '/')

const templatePath = path.join(dist, 'index.html')
if (!existsSync(templatePath)) fail('dist/index.html not found – run `vite build` first.')
const entryPath = path.join(ssrDir, 'entry-server.js')
if (!existsSync(entryPath)) fail('dist-ssr/entry-server.js not found – run the SSR build first.')

const template = readFileSync(templatePath, 'utf8')
for (const marker of ['<!-- seo:start -->', '<!-- seo:end -->', '<!--app-html-->', '<html lang="fi">', '<div id="root">']) {
  if (!template.includes(marker)) fail(`index.html is missing the marker ${marker}`)
}

const { render, siteManifest } = await import(pathToFileURL(entryPath).href)
const manifest = siteManifest()
const siteUrl = manifest.siteUrl.replace(/\/+$/, '')
const abs = (p) => `${siteUrl}/${p.replace(/^\/+/, '')}`

// Preload the Latin subsets of the brand fonts so headlines render without a swap.
const assetsDir = path.join(dist, 'assets')
const PRELOAD_FONTS = [/latin-wght-normal.*\.woff2$/]
const fontPreloads = existsSync(assetsDir)
  ? readdirSync(assetsDir)
      .filter((file) => PRELOAD_FONTS.some((re) => re.test(file)) && !/latin-ext/.test(file))
      .map((file) => `<link rel="preload" href="${base}assets/${file}" as="font" type="font/woff2" crossorigin />`)
  : []

function writePage(route, files, result) {
  let page = template
    .replace('<html lang="fi">', `<html lang="${result.lang}">`)
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, () => result.head)
    .replace('<div id="root">', `<div id="root" data-route="${route}" data-locale="${result.locale}">`)
    .replace('<!--app-html-->', () => result.html)
  if (fontPreloads.length) page = page.replace('</head>', `  ${fontPreloads.join('\n    ')}\n  </head>`)
  for (const file of files) {
    const out = path.join(dist, file)
    mkdirSync(path.dirname(out), { recursive: true })
    writeFileSync(out, page)
  }
}

/** "/" → index.html; "/palvelut" → palvelut.html + palvelut/index.html */
const filesFor = (p) => (p === '/' ? ['index.html'] : [`${p.slice(1)}.html`, `${p.slice(1)}/index.html`])

// 1. Every page in every language ------------------------------------------------
for (const page of manifest.pages) {
  const result = await render(page.path)
  writePage(page.path.toLowerCase(), filesFor(page.path), result)
  console.log(`prerendered ${page.path.padEnd(42)} ${page.locale}`)
}

// 2. Not-found page ----------------------------------------------------------------
writePage('/404', ['404.html'], await render('/404'))
console.log('prerendered 404.html')

// 3. Redirects from the previous site's URLs ---------------------------------------
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
for (const legacy of manifest.legacy) {
  const target = `${base}${legacy.fi.replace(/^\//, '')}`
  const targetEn = `${base}${legacy.en.replace(/^\//, '')}`
  const html = `<!doctype html>
<html lang="fi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sivu on siirtynyt – Hades Design</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${escapeHtml(abs(legacy.fi))}" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <script>location.replace(/[?&]lang=en(&|$)/.test(location.search) ? ${JSON.stringify(targetEn)} : ${JSON.stringify(target)})</script>
    <style>html{background:#09080d;color:#ece8f2;font:16px/1.5 system-ui,sans-serif}body{display:grid;place-items:center;min-height:100vh;margin:0}a{color:inherit}</style>
  </head>
  <body>
    <p>Sivu on siirtynyt osoitteeseen <a href="${escapeHtml(target)}">${escapeHtml(abs(legacy.fi))}</a>.</p>
  </body>
</html>
`
  for (const file of filesFor(legacy.from)) {
    const out = path.join(dist, file)
    mkdirSync(path.dirname(out), { recursive: true })
    writeFileSync(out, html)
  }
}
console.log(`wrote ${manifest.legacy.length} legacy redirects`)

// 4. sitemap.xml + robots.txt -------------------------------------------------------
const today = new Date().toISOString().slice(0, 10)
if (manifest.noindex) {
  writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
  console.log('noindex build: robots.txt disallows everything, no sitemap')
} else {
  const urls = manifest.pages
    .map((page) => {
      const links = [
        ...page.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${abs(a.path)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(page.alternates[0].path)}"/>`,
      ]
      return `  <url>\n    <loc>${abs(page.path)}</loc>\n${links.join('\n')}\n    <lastmod>${today}</lastmod>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`
    })
    .join('\n')
  writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  )
  writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
  console.log(`sitemap.xml: ${manifest.pages.length} URLs`)
}

// GitHub Pages: serve files and folders that start with "_" as-is.
writeFileSync(path.join(dist, '.nojekyll'), '')
rmSync(ssrDir, { recursive: true, force: true })
console.log('prerender done')

function fail(message) {
  console.error(`prerender: ${message}`)
  process.exit(1)
}
