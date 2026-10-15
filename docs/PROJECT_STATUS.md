# Project status – hadesdesign.fi redesign

Read this first when resuming work. Keep it short and current.

## Rules that never change

- Work happens on the `redesign` branch; pushing to `main` deploys to production. **Never push to `main`, change DNS or name servers without the owner's explicit approval.** DNS lives in Cloudflare (dashboard only, owner makes the changes); the registrar is Domainhotelli, never Zoner.
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
- Apps Script backend + docs (`apps-script/`), deploy workflow, `docs/DEPLOYMENT.md` (Domainhotelli → Cloudflare DNS → GitHub Pages, with rollback).
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

- Launch prep 2026-10-14 (owner authorised the production migration): pre-flight QA green (lint, typecheck, build, `npm run check` 48 pages/0 errors; headless Chrome on all 24 routes + legacy redirect + 404 at 1440/390 px – no console errors, failed requests, overflow or broken images; fonts load; mobile menu works). Backend health `{ok:true}`, fake token rejected. Repo `samijturunen01/hadesdesign` created (public), Pages = GitHub Actions, `redesign` fast-forwarded into `main` (796ac2c), preview deployed and re-checked at https://samijturunen01.github.io/hadesdesign/.

- Production migration 2026-10-14 (owner-authorised). Corrected infrastructure: **Domainhotelli (registrar) → Cloudflare Free (DNS only, managed by hand in the dashboard, no API token) → GitHub Pages**. Zoner is neither registrar nor DNS; no email hosting on the domain (no MX, no Email Routing). Pre-cut-over lookups (18:40 UTC): `.fi` registry still delegates to `ns1–3.zoner.fi`, old site `5.44.245.60`, DNSSEC off (no DS) – full snapshot in `docs/DEPLOYMENT.md`. Owner built the Cloudflare zone (GitHub A/AAAA, `www` CNAME, Google verification TXT, all DNS only). Done here: `CUSTOM_DOMAIN=hadesdesign.fi`, production deploy, Pages custom domain `hadesdesign.fi`; local production build `npm run check` 48 pages/0 errors, canonicals/sitemap/robots on `https://hadesdesign.fi`; backend health `{ok:true}`, fake token → `{ok:false,error:"recaptcha"}`. `docs/DEPLOYMENT.md` rewritten for this setup.

- Cut-over started 2026-10-14 (paused by the owner at 19:05 UTC):
  - Cloudflare zone checked from the owner's screenshot – exactly 10 records: 4× A, 4× AAAA (GitHub), CNAME `www` → `samijturunen01.github.io`, TXT google-site-verification; all DNS only, no MX/mail/old `5.44.245.60` records.
  - Assigned Cloudflare name servers: **`carter.ns.cloudflare.com`, `nelci.ns.cloudflare.com`** – queried directly, both already answer with the correct records.
  - Owner gave final approval and confirmed the 100 % satisfaction figure and the Okkuva testimonial attribution as they are.
  - Owner **saved the name-server change at Domainhotelli** (~18:55 UTC). At 19:05 UTC the `.fi` registry (`nslookup -type=NS hadesdesign.fi a.fi`) still listed `ns1–3.zoner.fi` – propagation from Domainhotelli to Traficom pending. Public DNS still served the old site.
  - Pages API state: `cname: hadesdesign.fi`, `https_enforced: false` (re-enabled after the certificate), `protected_domain_state: null` (account domain not verified yet).
  - No background monitoring is running.

- Cut-over resumed 2026-10-14 ~21:20 UTC:
  - **Delegation done:** `.fi` registry (`a.fi`), 1.1.1.1 and 8.8.8.8 all return `carter`/`nelci.ns.cloudflare.com`. Cloudflare answers 4× A, 4× AAAA (GitHub), `www` CNAME → `samijturunen01.github.io`, Google TXT; no MX.
  - **New site live over HTTP:** `http://hadesdesign.fi/` → 200 from GitHub.com, correct title; `http://www.` → 301 to apex. All 24 sitemap URLs 200 with correct canonical and no `noindex`; robots.txt `Allow: /` + sitemap; 404 works; legacy `/services` → `/palvelut`.
  - HTTPS **not yet**: GitHub still presents `*.github.io` (`https_certificate: null`). Pages health: DNS points to Pages IPs, `is_https_eligible: true`, but `is_served_by_pages: false` (stale check). Custom domain re-saved via API (`PUT pages cname=hadesdesign.fi`, no removal) to trigger provisioning.
  - Account domain verification still pending (`protected_domain_state: null`).

- HTTPS live 2026-10-15 (owner turned on Enforce HTTPS in the GitHub dashboard):
  - Pages API: `https_enforced: true`, certificate `approved` (Let's Encrypt, `hadesdesign.fi` + `www.hadesdesign.fi`, expires 2027-01-12, GitHub renews it automatically), `protected_domain_state: verified`.
  - `http://` apex and `http://`/`https://www.` → 301 → `https://hadesdesign.fi/`; certificate verifies.
  - All 24 sitemap URLs over HTTPS: 200, canonical = own URL, no `http://` src/href. Legacy `/services` → `/palvelut`; 404 returns 404; robots.txt correct.

- **Production launch completed 2026-10-15.** Owner reviewed the live site (FI/EN, desktop/mobile) and approved it, and confirmed that a real contact-form message arrived at contact.hadesdesign@gmail.com.

## Remaining

Resume here – one step at a time, owner performs every dashboard action:

- [x] **1. Check delegation** – done 2026-10-14 (see above).
- [x] **2. Resolution** – done 2026-10-14 (see above).
- [x] **3. GitHub domain verification** – done (`protected_domain_state: verified`, checked 2026-10-15).
- [x] **4. HTTPS** – done 2026-10-15 (see above).
- [x] **5. Launch verification** – done 2026-10-15: automated checks (status codes, redirects, certificate, canonicals, sitemap, robots, 404) + owner's review of the pages and a delivered contact-form message.
- [ ] **6.** Search Console (owner, no access from here): submit `https://hadesdesign.fi/sitemap.xml` (`docs/DEPLOYMENT.md` §10).
- [ ] Lighthouse run on production (mobile), fix anything below ~90.
- [ ] Owner actions: review privacy policy; confirm remaining items in `docs/CONTENT-SOURCES.md`.
- [ ] Later: keep the Zoner hosting until the new site has run cleanly for a while (rollback, §Rollback); optional DNSSEC and `v=spf1 -all` / DMARC `p=reject` (§11).
- Optional ideas: preselect the package in the contact form from pricing CTAs.

## QA tooling notes

- `npm run build && npx vite preview --port 4373`, then screenshot with Chrome DevTools Protocol (device emulation – plain `--headless --window-size` cannot go below ~500 px wide). In Git Bash set `MSYS_NO_PATHCONV=1` when passing URL paths.
