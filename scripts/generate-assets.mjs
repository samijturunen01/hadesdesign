/**
 * Generate the site's static images (run with `npm run assets`, commit the output).
 *
 *  1. Portfolio screenshots: assets-src/work/<name>.webp → public/images/work/<name>-<width>.{avif,webp}
 *     plus src/generated/images.json (intrinsic sizes and widths for <ResponsiveImage>).
 *  2. Brand: public/favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png,
 *     brand/hades-design-mark.png and site.webmanifest – all drawn from the SVG mark below.
 *  3. Social images: public/og/hades-design-{fi,en}.png (1200×630), rendered with headless
 *     Chrome so they use the real brand fonts. Skipped with a warning when Chrome is missing
 *     (set CHROME_PATH to point at it).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const root = process.cwd()
const pub = path.join(root, 'public')
const out = (...p) => path.join(pub, ...p)
const ensure = (dir) => mkdirSync(dir, { recursive: true })

// ---------------------------------------------------------------------------
// 1. Portfolio screenshots
// ---------------------------------------------------------------------------
const WIDTHS = { desktop: [640, 960, 1440, 1920], mobile: [390, 780] }
const workSrc = path.join(root, 'assets-src', 'work')
const workOut = out('images', 'work')
rmSync(workOut, { recursive: true, force: true })
ensure(workOut)

const manifest = {}
for (const file of readdirSync(workSrc).filter((f) => f.endsWith('.webp')).sort()) {
  const name = file.replace(/\.webp$/, '')
  const input = path.join(workSrc, file)
  const { width, height } = await sharp(input).metadata()
  const kind = name.endsWith('-mobile') ? 'mobile' : 'desktop'
  const widths = [...new Set(WIDTHS[kind].map((w) => Math.min(w, width)))]
  for (const w of widths) {
    const resized = sharp(input).resize({ width: w, withoutEnlargement: true })
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(workOut, `${name}-${w}.avif`))
    await resized.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(workOut, `${name}-${w}.webp`))
  }
  manifest[name] = { width, height, widths }
  console.log(`work  ${name.padEnd(24)} ${widths.join(', ')}`)
}
ensure(path.join(root, 'src', 'generated'))
writeFileSync(path.join(root, 'src', 'generated', 'images.json'), `${JSON.stringify(manifest, null, 2)}\n`)

// ---------------------------------------------------------------------------
// 2. Brand mark – keep in sync with src/components/Logo.tsx
// ---------------------------------------------------------------------------
const MARK_DEFS = `
  <linearGradient id="g-body" x1="8" y1="2" x2="24" y2="30" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#2b2537"/><stop offset=".55" stop-color="#121018"/><stop offset="1" stop-color="#1c1214"/>
  </linearGradient>
  <linearGradient id="g-rim" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#c7b6ff"/><stop offset=".5" stop-color="#5b4a86"/><stop offset="1" stop-color="#ff8a4c"/>
  </linearGradient>
  <linearGradient id="g-ember" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ff6a2b"/><stop offset="1" stop-color="#ffc07a"/>
  </linearGradient>`
const MARK_BODY = `
  <path d="M16 1.5 28.5 8.75v14.5L16 30.5 3.5 23.25V8.75Z" fill="url(#g-body)" stroke="url(#g-rim)" stroke-width="1"/>
  <path d="M16 1.5 3.5 8.75 16 16Z" fill="#fff" fill-opacity=".07"/>
  <path d="M16 16 28.5 23.25 16 30.5Z" fill="#ff7a3d" fill-opacity=".1"/>
  <path d="M9.6 9.4 13 8.4v15.2l-3.4-1Z" fill="#ece8f2"/>
  <path d="M22.4 9.4 19 8.4v15.2l3.4-1Z" fill="#ece8f2"/>
  <rect x="13" y="14.3" width="6" height="3.4" fill="url(#g-ember)"/>`
const markSvg = (size, background = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><defs>${MARK_DEFS}</defs>${background}${MARK_BODY}</svg>`

ensure(out('brand'))
writeFileSync(out('favicon.svg'), markSvg(32))
const png = (svg, file) => sharp(Buffer.from(svg), { density: 384 }).png({ compressionLevel: 9 }).toFile(file)
await png(markSvg(32), out('favicon-32.png'))
await png(markSvg(512), out('brand', 'hades-design-mark.png'))
// Opaque icons for home screens: the mark on obsidian with breathing room.
const padded = (size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-6 -6 44 44"><defs>${MARK_DEFS}</defs><rect x="-6" y="-6" width="44" height="44" fill="#09080d"/>${MARK_BODY}</svg>`
await png(padded(180), out('apple-touch-icon.png'))
await png(padded(192), out('icon-192.png'))
await png(padded(512), out('icon-512.png'))
writeFileSync(
  out('site.webmanifest'),
  `${JSON.stringify(
    {
      name: 'Hades Design',
      short_name: 'Hades Design',
      start_url: '/',
      display: 'browser',
      background_color: '#09080d',
      theme_color: '#09080d',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    null,
    2,
  )}\n`,
)
console.log('brand favicon.svg, favicon-32, apple-touch-icon, icon-192/512, brand mark, manifest')

// ---------------------------------------------------------------------------
// 3. Open Graph images (headless Chrome)
// ---------------------------------------------------------------------------
const OG = {
  fi: { kicker: 'Verkkosivut · Verkkokaupat · Ylläpito', title: 'Verkkosivut, jotka', accent: 'tekevät vaikutuksen.' },
  en: { kicker: 'Websites · Online stores · Maintenance', title: 'Websites that', accent: 'leave a mark.' },
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ]
  return candidates.find((c) => c && existsSync(c))
}

const fontUrl = (pkg, file) => pathToFileURL(path.join(root, 'node_modules', '@fontsource-variable', pkg, 'files', file)).href

function ogHtml({ kicker, title, accent }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;font-weight:100 900;src:url(${fontUrl('fraunces', 'fraunces-latin-opsz-normal.woff2')})}
@font-face{font-family:Fraunces;font-style:italic;font-weight:100 900;src:url(${fontUrl('fraunces', 'fraunces-latin-wght-italic.woff2')})}
@font-face{font-family:Hanken;font-weight:100 900;src:url(${fontUrl('hanken-grotesk', 'hanken-grotesk-latin-wght-normal.woff2')})}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#09080d;color:#ece8f2}
body{position:relative;font-family:Hanken,sans-serif}
.bg{position:absolute;inset:0;background:
 radial-gradient(70% 60% at 78% 112%,rgba(255,106,43,.55),transparent 70%),
 radial-gradient(40% 35% at 82% 100%,rgba(255,192,122,.35),transparent 70%),
 radial-gradient(60% 55% at 10% -10%,rgba(165,139,255,.28),transparent 70%)}
.glass{position:absolute;right:70px;top:120px;width:360px;height:390px;border-radius:28px;transform:rotate(-8deg);
 background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.14);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 40px 80px rgba(0,0,0,.5)}
.glass.b{right:190px;top:190px;width:260px;height:300px;transform:rotate(9deg);background:linear-gradient(200deg,rgba(255,138,76,.16),rgba(255,255,255,.02))}
.wrap{position:absolute;left:80px;top:70px;bottom:70px;width:700px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font:600 30px/1 Hanken;letter-spacing:.01em}
.brand svg{width:56px;height:56px}
.kicker{margin-top:auto;font:600 22px/1 Hanken;letter-spacing:.14em;text-transform:uppercase;color:#ffb36b}
h1{margin:22px 0 0;font:500 84px/1.02 Fraunces;letter-spacing:-.02em}
em{display:block;font-style:italic;font-weight:400;background:linear-gradient(90deg,#ff7a3d,#ffc07a);-webkit-background-clip:text;color:transparent}
.url{margin-top:34px;font:500 24px/1 Hanken;color:#b9b2c6}
</style></head><body><div class="bg"></div><div class="glass"></div><div class="glass b"></div>
<div class="wrap"><div class="brand">${markSvg(56)}Hades Design</div>
<div class="kicker">${kicker}</div><h1>${title}<em>${accent}</em></h1><div class="url">hadesdesign.fi</div></div></body></html>`
}

const chrome = findChrome()
if (!chrome) {
  console.warn('og    skipped – Chrome not found (set CHROME_PATH)')
} else {
  ensure(out('og'))
  const tmp = mkdtempSync(path.join(tmpdir(), 'hades-og-'))
  try {
    for (const [locale, copy] of Object.entries(OG)) {
      const html = path.join(tmp, `og-${locale}.html`)
      const shot = path.join(tmp, `og-${locale}.png`)
      writeFileSync(html, ogHtml(copy))
      execFileSync(
        chrome,
        [
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          '--force-device-scale-factor=1',
          '--allow-file-access-from-files',
          '--virtual-time-budget=3000',
          `--user-data-dir=${path.join(tmp, 'profile')}`,
          '--window-size=1200,630',
          `--screenshot=${shot}`,
          pathToFileURL(html).href,
        ],
        { stdio: 'ignore' },
      )
      await sharp(shot).resize(1200, 630).png({ compressionLevel: 9, palette: false }).toFile(out('og', `hades-design-${locale}.png`))
      console.log(`og    hades-design-${locale}.png`)
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}
