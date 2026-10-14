/**
 * Static checks of the built site (run after `npm run build`; also in CI).
 * Fails on: broken internal links/assets, missing or duplicate titles and
 * descriptions, missing canonical/hreflang, more or fewer than one <h1>,
 * images without alt text, invalid JSON-LD and sitemap URLs without a file.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const rawBase = process.env.BASE_PATH?.trim() || '/'
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/\/{2,}/g, '/')
const errors = []
const warnings = []

if (!existsSync(dist)) {
  console.error('dist/ not found – run `npm run build` first.')
  process.exit(1)
}

/** All .html files under dist (relative, forward slashes). */
function htmlFiles(dir = dist, prefix = '') {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    const rel = prefix ? `${prefix}/${name}` : name
    if (statSync(full).isDirectory()) return name === 'assets' ? [] : htmlFiles(full, rel)
    return name.endsWith('.html') ? [rel] : []
  })
}

/** Does a site path (without base) resolve to a file the way GitHub Pages serves it? */
function resolves(sitePath) {
  const clean = decodeURIComponent(sitePath.split(/[?#]/)[0]).replace(/^\/+/, '')
  if (clean === '') return existsSync(path.join(dist, 'index.html'))
  const candidates = [clean, `${clean.replace(/\/$/, '')}.html`, `${clean.replace(/\/$/, '')}/index.html`]
  return candidates.some((c) => existsSync(path.join(dist, c)) && statSync(path.join(dist, c)).isFile())
}

const stripBase = (href) => (base !== '/' && href.startsWith(base) ? `/${href.slice(base.length)}` : href)
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
const all = (html, re) => [...html.matchAll(re)].map((m) => m[0])

const files = htmlFiles()
const isRedirect = (html) => /http-equiv="refresh"/.test(html)
const pages = files.filter((f) => !isRedirect(readFileSync(path.join(dist, f), 'utf8')))
const titles = new Map()
const descriptions = new Map()
const robots = existsSync(path.join(dist, 'robots.txt')) ? readFileSync(path.join(dist, 'robots.txt'), 'utf8') : ''
const noindexBuild = /Disallow:\s*\/\s*$/m.test(robots)

for (const file of pages) {
  const html = readFileSync(path.join(dist, file), 'utf8')
  const where = `dist/${file}`
  const isNotFound = file === '404.html'
  const isIndexHtml = file.endsWith('/index.html')

  if (html.includes('<!--app-html-->')) errors.push(`${where}: app HTML was not injected`)
  if (/>\s*(undefined|null|\[object Object\])\s*</.test(html)) errors.push(`${where}: renders "undefined/null/[object Object]"`)

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1]?.trim()
  if (!title) errors.push(`${where}: missing <title>`)
  const description = attr(html.match(/<meta[^>]*name="description"[^>]*>/)?.[0] ?? '', 'content')
  if (!description) errors.push(`${where}: missing meta description`)
  else if (description.length < 50 || description.length > 170) {
    warnings.push(`${where}: description is ${description.length} characters`)
  }

  const lang = html.match(/<html lang="([^"]+)"/)?.[1]
  if (!lang) errors.push(`${where}: missing <html lang>`)

  const h1s = all(html, /<h1[\s>]/g).length
  if (h1s !== 1) errors.push(`${where}: has ${h1s} <h1> elements (expected 1)`)

  const noindex = /<meta[^>]*name="robots"[^>]*content="noindex/.test(html)
  if (!noindex && !isNotFound) {
    if (!/<link[^>]*rel="canonical"/.test(html)) errors.push(`${where}: missing canonical`)
    const alternates = all(html, /<link[^>]*rel="alternate"[^>]*hreflang="[^"]*"[^>]*>/g)
    if (alternates.length < 3) errors.push(`${where}: expected fi, en and x-default hreflang links`)
    for (const tag of alternates) {
      const href = attr(tag, 'href') ?? ''
      const sitePath = href.replace(/^https?:\/\/[^/]+/, '')
      if (!resolves(sitePath)) errors.push(`${where}: hreflang target ${href} has no file`)
    }
    // Duplicates are only meaningful once per URL (x.html and x/index.html are the same page).
    if (!isIndexHtml) {
      if (title) titles.set(title, [...(titles.get(title) ?? []), file])
      if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), file])
    }
  }

  for (const tag of all(html, /<meta[^>]*property="og:image"[^>]*>/g)) {
    const url = attr(tag, 'content') ?? ''
    const sitePath = url.replace(/^https?:\/\/[^/]+/, '')
    if (!resolves(sitePath)) errors.push(`${where}: og:image ${url} not found in dist`)
  }

  for (const json of [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])) {
    try {
      JSON.parse(json)
    } catch {
      errors.push(`${where}: invalid JSON-LD`)
    }
  }

  for (const tag of all(html, /<a\s[^>]*href="[^"]*"[^>]*>/g)) {
    const href = attr(tag, 'href') ?? ''
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const sitePath = stripBase(href)
    if (!resolves(sitePath)) errors.push(`${where}: broken link ${href}`)
  }

  for (const tag of all(html, /<img\s[^>]*>/g)) {
    if (!/\salt="/.test(tag)) errors.push(`${where}: <img> without alt: ${tag.slice(0, 80)}…`)
    const src = attr(tag, 'src') ?? ''
    if (src.startsWith('/') && !resolves(stripBase(src))) errors.push(`${where}: missing image ${src}`)
  }

  for (const tag of [...all(html, /<link\s[^>]*>/g), ...all(html, /<script\s[^>]*src="[^"]*"[^>]*>/g)]) {
    const href = attr(tag, 'href') ?? attr(tag, 'src') ?? ''
    if (/rel="(canonical|alternate)"/.test(tag) || !href.startsWith('/') || href.startsWith('//')) continue
    if (!resolves(stripBase(href))) errors.push(`${where}: missing asset ${href}`)
  }
}

for (const [title, where] of titles) if (where.length > 1) errors.push(`duplicate <title> "${title}": ${where.join(', ')}`)
for (const [desc, where] of descriptions) if (where.length > 1) errors.push(`duplicate description "${desc.slice(0, 50)}…": ${where.join(', ')}`)

for (const required of ['index.html', '404.html', 'robots.txt', '.nojekyll', 'CNAME', 'favicon.svg', 'site.webmanifest']) {
  if (!existsSync(path.join(dist, required))) errors.push(`missing dist/${required}`)
}

if (!noindexBuild) {
  const sitemapPath = path.join(dist, 'sitemap.xml')
  if (!existsSync(sitemapPath)) errors.push('missing dist/sitemap.xml')
  else {
    const locs = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    for (const loc of locs) {
      if (!resolves(loc.replace(/^https?:\/\/[^/]+/, ''))) errors.push(`sitemap URL without a page: ${loc}`)
    }
    if (!robots.includes('Sitemap:')) errors.push('robots.txt does not reference the sitemap')
  }
}

for (const w of warnings) console.warn(`warn  ${w}`)
for (const e of errors) console.error(`error ${e}`)
console.log(`\nchecked ${pages.length} pages, ${files.length - pages.length} redirects: ${errors.length} errors, ${warnings.length} warnings`)
process.exit(errors.length ? 1 : 0)
