# Deployment guide – hadesdesign.fi

This guide takes the new site from your computer to **https://hadesdesign.fi** with
**GitHub Pages** as the host and **Cloudflare** as the DNS provider. Nothing here has
been done for you: no repository was created, no DNS record was changed and the
current site keeps running until you perform the cut-over in step 5.

> **Current situation (checked 14 Oct 2026, read-only lookups)**
>
> | | Today |
> |---|---|
> | Website | Hosted at **Zoner** (`5.44.245.60`, nginx) |
> | DNS | **Zoner** name servers `ns1/ns2/ns3.zoner.fi` – *not Cloudflare yet* |
> | Email | **Zoner** – MX `mailscanner01.zoner.fi` and `mailscanner02.zoner.fi` (priority 10), SPF `v=spf1 include:spf.zoner.fi -all` |
> | Other records | `google-site-verification=VcPJQWUweCzJEOCCW2rE_agpN-kjvOPlntZVUxSvijc` (TXT), `www`, `mail`, `smtp`, `pop`, `ftp` → `5.44.245.60` |
> | DNSSEC / CAA | none |
>
> The domain stays registered at Zoner. Only the **name servers** move to Cloudflare,
> and email stays at Zoner (its MX/SPF records are copied as they are).
>
> **Rollback snapshot (14 Oct 2026, 17:15 UTC):** SOA `ns1.zoner.fi hostmaster.hadesdesign.fi`
> serial `2025111500`, every record TTL 3600. No AAAA, `_dmarc`, `imap`, `webmail`,
> `autodiscover`/`autoconfig` or common DKIM selectors (`default`, `google`, `zoner`, `selector1`)
> exist publicly. Zoner refuses zone transfers, so this list is **not** proof of completeness –
> the Zoner control panel export is the authoritative copy.
>
> **Progress (14 Oct 2026):** repository [`samijturunen01/hadesdesign`](https://github.com/samijturunen01/hadesdesign)
> created (public), Pages source = GitHub Actions, `redesign` merged into `main` and the noindex
> preview deployed to https://samijturunen01.github.io/hadesdesign/. Steps 2–3 below are done;
> DNS (steps 5–7) is untouched.

---

## 1. Run the site locally

Requirements: Node.js **22.22 or newer** (24 recommended) and npm.

```bash
npm ci              # install exact dependency versions
npm run dev         # development server → http://localhost:5373
npm run build       # typecheck + production build + prerender every page into dist/
npm run preview     # serve dist/ → http://localhost:4373
npm run check       # verify dist/: links, metadata, hreflang, sitemap, images
npm run lint        # ESLint (incl. accessibility rules)
```

Copy `.env.example` to `.env` to try the contact form locally (see section 4).

## 2. Create the GitHub repository

1. On GitHub, create a new repository, e.g. **`samijturunen01/hadesdesign`**.
   GitHub Pages on a free account requires a **public** repository (private repositories need GitHub Pro).
   Do not add a README or licence – the project already has them.
2. Push both branches:
   ```bash
   git remote add origin https://github.com/samijturunen01/hadesdesign.git
   git push -u origin main        # production branch (only an initial commit until you merge)
   git push -u origin redesign    # the new website
   ```
3. **Settings → Pages → Build and deployment → Source: “GitHub Actions”.**
4. **Settings → Secrets and variables → Actions → Variables** – add when ready:

   | Variable | Value | When |
   |---|---|---|
   | `VITE_APPS_SCRIPT_URL` | optional – defaults to the deployed web app (`apps-script/site.json` → `webAppUrl`) | only to override |
   | `VITE_RECAPTCHA_SITE_KEY` | optional – defaults to the site key in `apps-script/site.json` | only to override |
   | `CUSTOM_DOMAIN` | `hadesdesign.fi` | **only at cut-over (step 5)** |

   These are public values (they end up in the browser), so *variables* – not secrets – are correct.
   The reCAPTCHA **secret** and the receiving email address never go to GitHub.

### Workflows

- **CI** (`.github/workflows/ci.yml`) – every push to a non-`main` branch and every pull
  request: lint, typecheck, build, prerender, `npm run check`. Never deploys.
- **Deploy** (`.github/workflows/deploy.yml`) – every push to **`main`** and manual runs
  (Actions → *Deploy to GitHub Pages* → *Run workflow*). Merging into `main` = deploying.

## 3. Preview on GitHub Pages (before touching DNS)

While the `CUSTOM_DOMAIN` variable is **unset**, the deploy workflow builds a
**preview**: served from `https://samijturunen01.github.io/hadesdesign/`, with
`noindex` on every page and a `Disallow: /` robots.txt so search engines ignore it.

To publish a preview:
1. Merge `redesign` into `main` (pull request on GitHub, or locally `git checkout main && git merge redesign && git push`).
   *This is the step that publishes – only do it when you want the preview online.*
2. Watch **Actions → Deploy to GitHub Pages**. The deploy job prints the preview URL.

Leave **Settings → Pages → Custom domain empty** during the preview – once a custom domain
is set, GitHub redirects the `github.io` address to it (which would still be the old site).

> The contact form works on the preview: `samijturunen01.github.io` is an allowed domain of the
> reCAPTCHA key **and** in `allowedHostnames` in `apps-script/Site.js` (section 4).

## 4. Contact form backend (Google Apps Script)

**Done 2026-10-14** – the backend is deployed and tested; IDs and maintenance steps are in
**[apps-script/README.md](../apps-script/README.md)**. The website reads the public web app URL and
site key from `src/config/site.ts` (defaults) or `VITE_APPS_SCRIPT_URL` / `VITE_RECAPTCHA_SITE_KEY`,
so no repository variables are required. If the URL or key were ever missing, the form shows a
“form not active – email or call us” error on submit and never pretends to send.

## 5. Move DNS to Cloudflare (website and email keep working)

Do this whenever convenient – it changes nothing for visitors as long as the records are copied exactly.

1. **Export the current zone from Zoner first** (Zoner control panel → the domain's DNS settings).
   Save a copy or screenshots of every record. Lookups found the records listed at the top, but
   some records (for example DKIM keys) cannot be discovered from outside.
2. In Cloudflare: **Add a domain → `hadesdesign.fi` → Free plan.** Cloudflare scans and imports records.
3. **Compare the imported records with the Zoner export** and fix any differences:

   | Type | Name | Content | Proxy status |
   |---|---|---|---|
   | A | `@` | `5.44.245.60` | **DNS only** (grey cloud) |
   | A | `www` | `5.44.245.60` | **DNS only** |
   | A | `mail` | `5.44.245.60` | **DNS only** – mail must never be proxied |
   | A | `smtp` | `5.44.245.60` | **DNS only** |
   | A | `pop` | `5.44.245.60` | **DNS only** |
   | A | `ftp` | `5.44.245.60` | **DNS only** |
   | MX | `@` | `mailscanner01.zoner.fi` (priority 10) | – |
   | MX | `@` | `mailscanner02.zoner.fi` (priority 10) | – |
   | TXT | `@` | `v=spf1 include:spf.zoner.fi -all` | – |
   | TXT | `@` | `google-site-verification=VcPJQWUweCzJEOCCW2rE_agpN-kjvOPlntZVUxSvijc` | – |
   | … | | anything else from the Zoner export | DNS only |

   Keep everything **DNS only** for now so behaviour is identical to today.
4. **Do not enable Cloudflare Email Routing.** It replaces the MX records and would take mail
   away from Zoner.
5. In Zoner's control panel, replace the name servers `ns1/ns2/ns3.zoner.fi` with the **two
   Cloudflare name servers** shown in your Cloudflare dashboard. This only changes the name
   servers – the domain stays registered at Zoner. `.fi` changes usually take effect within a
   few hours (allow up to 48 h).
6. When Cloudflare shows the domain as **Active**, check that https://hadesdesign.fi (still the
   old site) and email (send and receive a test message) both work.

> Keep the Zoner hosting/email plan active – email is hosted there, and the old website stays
> your rollback until the new one is confirmed.

## 6. Verify the domain on GitHub (recommended, prevents domain takeover)

1. GitHub → your **profile Settings → Pages → Add a domain** → `hadesdesign.fi`.
2. GitHub shows a TXT record, e.g. name `_github-pages-challenge-samijturunen01`, value a random code.
3. Add it in Cloudflare (TXT, name `_github-pages-challenge-samijturunen01`, DNS only) and click **Verify** on GitHub.

## 7. Cut-over: point hadesdesign.fi to GitHub Pages

Only after you have approved the preview.

1. Repository **Settings → Secrets and variables → Actions → Variables**: add `CUSTOM_DOMAIN` = `hadesdesign.fi`.
2. **Actions → Deploy to GitHub Pages → Run workflow** (branch `main`). This production build is
   served from `/`, indexable, with `sitemap.xml` and canonical URLs on `https://hadesdesign.fi`.
3. Repository **Settings → Pages → Custom domain**: `hadesdesign.fi` → **Save**.
   (The `public/CNAME` file contains the same domain; with Actions-based publishing GitHub uses
   this setting, so the setting is what counts.)
4. In **Cloudflare → DNS**, change only the website records (leave mail records untouched):

   | Type | Name | Content | Proxy status |
   |---|---|---|---|
   | A | `@` | `185.199.108.153` | DNS only |
   | A | `@` | `185.199.109.153` | DNS only |
   | A | `@` | `185.199.110.153` | DNS only |
   | A | `@` | `185.199.111.153` | DNS only |
   | AAAA | `@` | `2606:50c0:8000::153` | DNS only |
   | AAAA | `@` | `2606:50c0:8001::153` | DNS only |
   | AAAA | `@` | `2606:50c0:8002::153` | DNS only |
   | AAAA | `@` | `2606:50c0:8003::153` | DNS only |
   | CNAME | `www` | `samijturunen01.github.io` | DNS only |

   Delete the old `A @ 5.44.245.60` and `A www 5.44.245.60` records (a name cannot have both a
   CNAME and an A record). `mail`, `smtp`, `pop`, `ftp`, MX and TXT records stay exactly as they are.
5. Wait until **Settings → Pages** shows the DNS check as successful and the certificate is issued
   (usually minutes, sometimes a few hours), then tick **Enforce HTTPS**.
6. Verify:
   - https://hadesdesign.fi and https://www.hadesdesign.fi (redirects to the apex)
   - an old address such as https://hadesdesign.fi/services → redirects to `/palvelut`
   - https://hadesdesign.fi/sitemap.xml and /robots.txt
   - send one real message through the contact form
7. Google Search Console (already verified via the TXT record): submit `https://hadesdesign.fi/sitemap.xml`.

### Why “DNS only” (grey cloud)?

GitHub Pages issues and renews its own Let's Encrypt certificate and must see its own IP
addresses when it checks the domain. Proxied (orange-cloud) records hide those addresses, which
can block certificate issuance and renewal. GitHub Pages already serves the site through a CDN
over HTTPS, so the proxy adds little. If you ever proxy the website records, set Cloudflare
**SSL/TLS mode to “Full (strict)”** – never “Flexible”, which causes redirect loops with
*Enforce HTTPS*. Mail records can never be proxied.

### Rollback

Put back `A @ 5.44.245.60` and `A www 5.44.245.60` (removing the GitHub records and the `www`
CNAME). The old site on Zoner answers again as soon as DNS caches expire. This works only
while the Zoner hosting plan is active.

## 8. After launch

- The previous site's contact-form script (an older Apps Script deployment) can be archived
  once the new form has delivered a real message.
- Update `Viimeksi päivitetty` in the privacy policy if you launch in a later month.
- Optional: enable DNSSEC in Cloudflare (then add the DS record at Zoner).
