# Project status – hadesdesign.fi redesign

Read this first when resuming work. Keep it short and current.

## Rules that never change

- Work happens on the `redesign` branch. **Never push to `main`, change DNS, or publish to hadesdesign.fi without the owner's explicit approval.** The old site stays online until then.
- Never invent facts (clients, projects, prices, numbers, testimonials). All facts live in `src/data/` and come from the previous site.
- Finnish is primary (`/`), English secondary (`/en`).

## Architecture

- React 19 + Vite 8 + TypeScript, React Router 8 (declarative). Every route is prerendered to static HTML (`scripts/prerender.mjs`) for GitHub Pages; `scripts/check-dist.mjs` validates the output.
- `src/routes.ts` – single source of truth for URLs (FI/EN), sitemap, legacy redirects.
- `src/data/` – verified content. `src/seo/` – meta, hreflang, JSON-LD. `src/features/` – contact form (Apps Script + reCAPTCHA v3). No analytics, no cookie banner (see below).
- `src/components/` – shared UI. `src/pages/` – one folder per page; the four service pages share `pages/service`.
- Page transitions: native View Transitions (`src/lib/useAppNavigate.ts`). Reveals: IntersectionObserver (`src/lib/useReveal.ts`). All motion respects `prefers-reduced-motion`.
- Hero: hand-written WebGL2 shader, lazy-loaded progressive enhancement over a CSS fallback. The LCP element is the prerendered headline.
- Images: `npm run assets` (`scripts/generate-assets.mjs`, sharp) turns `assets-src/` into responsive AVIF/WebP in `public/images/`, and draws favicons, brand mark and OG images from SVG.

## Design direction: "Obsidian & Ember"

Chosen 2026-10-14. (The multi-agent creative panel in the first session never returned a result; the direction was picked from its seed concepts, not re-explored.)

- Concept: Hades as the forge. Obsidian is natural volcanic glass → glassmorphism as **dark smoked glass**, lit by **molten ember light from below** and a **cool violet rim light from above**.
- Palette: obsidian `#09080d` background, text `#ece8f2`, ember `#ff7a3d` → `#ffb36b`, violet rim `#a58bff`. Glass = translucent near-black with a 1px light edge, never white frost.
- Type: Fraunces Variable (display, optical sizing; italic for ember accents) + Hanken Grotesk Variable (UI/body). Self-hosted via @fontsource-variable. Long Finnish compounds: fluid sizes + `hyphens: auto`.
- Logo: geometric SVG mark – a faceted obsidian shard (H-negative space) with an ember core.

## Done

- Infrastructure scaffold, data layer, SEO, prerender, legacy redirects (commit d3fe155).
- Apps Script backend + docs (`apps-script/`), deploy workflow, `docs/DEPLOYMENT.md` (GitHub Pages preview → Cloudflare DNS → cut-over, with rollback).
- `scripts/generate-assets.mjs`: responsive work images, favicons/icons/manifest, brand mark, OG images (headless Chrome).
- Design system (`src/styles/`), fonts, header (services menu, mobile sheet, FI/EN switch), footer.
- WebGL2 hero (`src/pages/home/emberField.ts`) with CSS fallback; reveals, cursor spotlight, tilt, magnetic buttons (`src/lib/interactions.ts`); view transitions.
- All pages: home, services, 4 service pages, work, pricing (packages, comparison, maintenance toggle, FAQ), about, contact (form → Apps Script), privacy, terms, 404.
- QA 2026-10-14: build + `npm run check` (48 pages, 0 errors), ESLint, typecheck clean; headless Chrome screenshots at 1440 / 390 / 360 px – no horizontal overflow, no console errors.
- `docs/CONTENT-SOURCES.md`.
- Content update 2026-10-14: hero stats → 790 € / 100 % asiakastyytyväisyys / 24/7; hero glass badge → "Nopeat ja hakukoneoptimoidut sivut" (bolt icon); every "60 days of included support" claim removed (post-launch support and maintenance are separately paid). The 100 % figure needs owner confirmation before production.
- Contact form live 2026-10-14: reCAPTCHA v3 key + Apps Script web app deployed (details and IDs in `apps-script/README.md` → *Deployment*); messages go to contact.hadesdesign@gmail.com. Public URL/site key are defaults in `src/config/site.ts` (env vars override), so no GitHub variables are needed. "Form not active" notice removed; success card scrolls into view. Tested: 8 backend error paths, real-Chrome E2E on FI (desktop) + EN (390 px) with real reCAPTCHA and delivery confirmed `{ok:true}`, mocked rate-limit/score/server/network errors.
- Portfolio update 2026-10-14: Shady replaced by Okkuva (okkuva.fi); new project Kuljetus Jumppanen (kuljetusjumppanen.fi). Desktop (1440×900 @2x) and mobile (390×844 @3x) screenshots captured from the live sites into `assets-src/work/`; Shady assets deleted. Testimonial quote unchanged, attribution → Okkuva (**needs owner confirmation before production**). Home work teasers: 3 columns ≥ 72rem, odd last card centred at 2 columns.

- Cookie banner and Google Analytics removed 2026-10-14 (GA4 needs prior consent under Finnish law, and the owner wants no banner). The site's own code sets no cookies and uses no localStorage/sessionStorage. Only third-party script: reCAPTCHA v3, lazy-loaded on first focus of the contact form (it then sets `_GRECAPTCHA` on www.google.com, 180 days, and `_grecaptcha` in our localStorage – verified in headless Chrome), treated as necessary for the requested service and disclosed in the privacy policy (FI/EN). Residual risk: some EU regulators consider reCAPTCHA consent-requiring because Google also uses the data for its own purposes – if the owner wants zero risk, replace it with a consent-free alternative (decision pending, nothing changed yet).

## Remaining

- [ ] Owner review of the design on a GitHub Pages preview (`docs/DEPLOYMENT.md` §3).
- [ ] Lighthouse run on the preview (mobile), fix anything below ~90.
- [ ] Owner actions: confirm the two 2026-10-14 `TEST`/`TESTIVIESTI` emails arrived at contact.hadesdesign@gmail.com (check spam); review privacy policy; confirm items in `docs/CONTENT-SOURCES.md`.
- [ ] Only after explicit approval: merge to `main`, DNS cut-over (`docs/DEPLOYMENT.md` §5–7).
- Optional ideas: preselect the package in the contact form from pricing CTAs.

## QA tooling notes

- `npm run build && npx vite preview --port 4373`, then screenshot with Chrome DevTools Protocol (device emulation – plain `--headless --window-size` cannot go below ~500 px wide). In Git Bash set `MSYS_NO_PATHCONV=1` when passing URL paths.
