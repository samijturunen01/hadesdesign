# Deployment guide – hadesdesign.fi

The new site runs on **GitHub Pages**. DNS is managed in **Cloudflare (Free, DNS only)** and the
domain is registered at **Domainhotelli**:

```
Domainhotelli (registrar: name servers) → Cloudflare (DNS zone) → GitHub Pages (website)
```

> **Status: live since 15 Oct 2026.** https://hadesdesign.fi is served by GitHub Pages through
> Cloudflare DNS (name servers `carter`/`nelci.ns.cloudflare.com`). The domain is verified on GitHub,
> the Let's Encrypt certificate covers `hadesdesign.fi` and `www.hadesdesign.fi` (GitHub renews it),
> and Enforce HTTPS is on. Steps 7–10 below are done and kept for reference.

Zoner is no longer the registrar and is **not** used for DNS. No email is hosted on the domain
(the contact form sends via Google Apps Script to a Gmail address), so the zone has no mail records
and **Cloudflare Email Routing stays off**. Cloudflare is managed by hand in its dashboard – no API token.

> **Situation before the cut-over (checked 14 Oct 2026, 18:40 UTC, public lookups)**
>
> | | |
> |---|---|
> | Registrar | **Domainhotelli** (transfer completed 13 Oct 2026; `.fi` registry "last changed" 2026-10-13) |
> | Authoritative name servers | still **`ns1.zoner.fi`, `ns2.zoner.fi`, `ns3.zoner.fi`** at the `.fi` registry – the transfer did not change them |
> | Website | old site on Zoner hosting, `5.44.245.60` (nginx, no HSTS) |
> | Records Zoner still serves | `A @` and `A www` → `5.44.245.60`; `mail`, `smtp`, `pop`, `ftp` → `5.44.245.60`; MX `mailscanner01/02.zoner.fi` (10); TXT `v=spf1 include:spf.zoner.fi -all`; TXT `google-site-verification=VcPJQWUweCzJEOCCW2rE_agpN-kjvOPlntZVUxSvijc` |
> | SOA | `ns1.zoner.fi hostmaster.hadesdesign.fi`, serial `2025111500`, record TTL 3600 |
> | DNSSEC | **off** – no DS record at the `.fi` registry, no DNSKEY in the zone |
> | CAA | none |
>
> Because the domain has left Zoner, Zoner may stop serving the zone at any time. Until the name
> servers point to Cloudflare, the website depends on that.

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
In Git Bash, set `MSYS_NO_PATHCONV=1` before passing `BASE_PATH=/` – otherwise Bash rewrites it
to `C:/Program Files/Git/` and `npm run check` reports hundreds of false broken links.

## 2. GitHub repository

Repository [`samijturunen01/hadesdesign`](https://github.com/samijturunen01/hadesdesign) (public –
GitHub Pages on a free account requires it). Production branch: **`main`**; work happens on `redesign`.

- **Settings → Pages → Build and deployment → Source: “GitHub Actions”.**
- **Settings → Secrets and variables → Actions → Variables:**

  | Variable | Value | Status |
  |---|---|---|
  | `CUSTOM_DOMAIN` | `hadesdesign.fi` | **set 14 Oct 2026** – production build |
  | `VITE_APPS_SCRIPT_URL` | optional – defaults to the deployed web app (`apps-script/site.json` → `webAppUrl`) | unset (only to override) |
  | `VITE_RECAPTCHA_SITE_KEY` | optional – defaults to the site key in `apps-script/site.json` | unset (only to override) |

  These are public values (they end up in the browser), so *variables* – not secrets – are correct.
  The reCAPTCHA **secret** and the receiving email address never go to GitHub.

### Workflows

- **CI** (`.github/workflows/ci.yml`) – every push to a non-`main` branch and every pull
  request: lint, typecheck, build, prerender, `npm run check`. Never deploys.
- **Deploy** (`.github/workflows/deploy.yml`) – every push to **`main`** and manual runs
  (Actions → *Deploy to GitHub Pages* → *Run workflow*). Merging into `main` = deploying.

## 3. Preview builds

While `CUSTOM_DOMAIN` is **unset**, the deploy workflow builds a **preview** served from
`https://samijturunen01.github.io/hadesdesign/` (base path `/hadesdesign/`, `noindex` on every page,
`Disallow: /` in robots.txt, no CNAME file). That is how the site was reviewed before launch.
To get a preview again you would have to unset the variable **and** remove the custom domain in
Settings → Pages, which takes the production site down – so for later changes, review locally
(`npm run build && npm run preview`) instead.

> `samijturunen01.github.io` stays an allowed domain of the reCAPTCHA key and in
> `allowedHostnames` in `apps-script/Site.js` (section 4).

## 4. Contact form backend (Google Apps Script)

**Done 2026-10-14** – the backend is deployed and tested; IDs and maintenance steps are in
**[apps-script/README.md](../apps-script/README.md)**. The website reads the public web app URL and
site key from `src/config/site.ts` (defaults) or `VITE_APPS_SCRIPT_URL` / `VITE_RECAPTCHA_SITE_KEY`,
so no repository variables are required. If the URL or key were ever missing, the form shows a
“form not active – email or call us” error on submit and never pretends to send.
Allowed domains: `hadesdesign.fi` (covers `www.`), `samijturunen01.github.io`, `localhost`.

## 5. Cloudflare DNS zone (dashboard, done by the owner)

Cloudflare → **Add a domain → `hadesdesign.fi` → Free plan**. The zone must contain exactly:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| A | `@` | `185.199.108.153` | **DNS only** (grey cloud) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| AAAA | `@` | `2606:50c0:8000::153` | DNS only |
| AAAA | `@` | `2606:50c0:8001::153` | DNS only |
| AAAA | `@` | `2606:50c0:8002::153` | DNS only |
| AAAA | `@` | `2606:50c0:8003::153` | DNS only |
| CNAME | `www` | `samijturunen01.github.io` | DNS only |
| TXT | `@` | `google-site-verification=VcPJQWUweCzJEOCCW2rE_agpN-kjvOPlntZVUxSvijc` | – |
| TXT | `_github-pages-challenge-samijturunen01` | code from GitHub (step 8) | – |

Nothing else: no `A @`/`A www` → `5.44.245.60`, no `mail`/`smtp`/`pop`/`ftp`, no MX, no Zoner SPF.
The Cloudflare records only go public once the name servers point to Cloudflare (step 7).

## 6. GitHub Pages production configuration

**Done 14 Oct 2026.**

1. Repository **Settings → Secrets and variables → Actions → Variables**: `CUSTOM_DOMAIN` = `hadesdesign.fi`.
   With it the deploy workflow builds for `/` (Vite base path), indexable, with canonical URLs,
   hreflang and `sitemap.xml` on `https://hadesdesign.fi`.
2. **Actions → Deploy to GitHub Pages → Run workflow** (branch `main`) – or any push to `main`.
3. Repository **Settings → Pages → Custom domain**: `hadesdesign.fi`. (`public/CNAME` holds the same
   domain; with Actions-based publishing the setting is what counts.)

From now on `https://samijturunen01.github.io/hadesdesign/` **redirects to `https://hadesdesign.fi/`**.
That is expected – until the name servers change, that address still shows the old site. GitHub's DNS
check and certificate stay pending until step 7.

## 7. Change the name servers at Domainhotelli

*Done 14 Oct 2026 – name servers `carter.ns.cloudflare.com`, `nelci.ns.cloudflare.com`; delegation visible ~21:20 UTC.*

Before: the Cloudflare zone matches step 5, the production deploy succeeded, and DNSSEC is off (it
is – if a DS record ever existed it would have to be removed at the registrar first, or validating
resolvers would reject Cloudflare's answers and the domain would stop resolving).

1. Cloudflare → `hadesdesign.fi` → **Overview / Continue to activation**: copy the **two name servers
   assigned to this zone** (`<name>.ns.cloudflare.com`).
2. Domainhotelli → sign in → **Domains → hadesdesign.fi → Name servers** (Nimipalvelimet).
3. Replace `ns1.zoner.fi`, `ns2.zoner.fi`, `ns3.zoner.fi` with the two Cloudflare name servers;
   leave no Zoner name server and no empty field behind. Save.
4. Cloudflare → **Check nameservers**. `.fi` changes usually take effect within an hour or a few
   (allow up to 24–48 h). Check with `nslookup -type=NS hadesdesign.fi 8.8.8.8` or
   `https://dns.google/resolve?name=hadesdesign.fi&type=NS`. Cloudflare emails when the zone is **Active**.

## 8. Verify the domain on GitHub (prevents domain takeover)

*Done – `protected_domain_state: verified` (checked 15 Oct 2026).*

GitHub checks public DNS, so this works only once Cloudflare is authoritative.

1. GitHub → **profile Settings → Pages → Add a domain** → `hadesdesign.fi`.
2. GitHub shows a TXT record: name `_github-pages-challenge-samijturunen01`, value a random code.
3. Cloudflare → **DNS → Records → Add record**: Type TXT, Name `_github-pages-challenge-samijturunen01`,
   Content = the code → Save. Back on GitHub click **Verify** (retry after a few minutes if needed).
   Keep the record – GitHub re-checks it.

## 9. HTTPS

*Done 15 Oct 2026 – certificate approved (expires 12 Jan 2027, renewed automatically), Enforce HTTPS on.*

Wait until repository **Settings → Pages** shows *DNS check successful* and the certificate is issued
(usually minutes, sometimes an hour or more), then tick **Enforce HTTPS**. If the certificate stays
pending for hours, remove the custom domain, save, and add it again to restart provisioning.

## 10. Verify the launch

*Done 15 Oct 2026 – automated checks passed and the owner approved the live site and confirmed
contact-form delivery. Search Console sitemap submission is done by the owner.*

- https://hadesdesign.fi (new site, valid certificate), http:// → https://
- https://www.hadesdesign.fi and http://www.hadesdesign.fi → `https://hadesdesign.fi/`
- an old address such as https://hadesdesign.fi/services → `/palvelut`
- `/en`, every service, work, pricing, contact, privacy and terms page; direct loads and refreshes
- https://hadesdesign.fi/sitemap.xml and /robots.txt (no `Disallow: /`, no `noindex`)
- one real message through the contact form (arrives at contact.hadesdesign@gmail.com)
- Google Search Console (verified by the TXT record): submit `https://hadesdesign.fi/sitemap.xml`

### Why “DNS only” (grey cloud)?

GitHub Pages issues and renews its own Let's Encrypt certificate and must see its own IP
addresses when it checks the domain. Proxied (orange-cloud) records hide those addresses, which
can block certificate issuance and renewal. GitHub Pages already serves the site through a CDN
over HTTPS, so the proxy adds little. If you ever proxy the website records, set Cloudflare
**SSL/TLS mode to “Full (strict)”** – never “Flexible”, which causes redirect loops with
*Enforce HTTPS*.

### Rollback

Pick the smallest step that fixes the problem:

1. **A bad release** – revert the commit on `main` (or run *Deploy to GitHub Pages* from an older
   commit). DNS stays as it is.
2. **GitHub Pages itself fails** – in Cloudflare change the website records back to the old host
   (`A @` and `A www` → `5.44.245.60`, DNS only; delete the GitHub A/AAAA records and the `www` CNAME).
   Works only while the Zoner hosting plan still serves the old site.
3. **Cloudflare fails** – at Domainhotelli set the name servers back to `ns1.zoner.fi`,
   `ns2.zoner.fi`, `ns3.zoner.fi`. Works only while Zoner still serves the zone (snapshot at the top),
   which is not guaranteed now that the domain has left Zoner.

Check `curl -sI http://5.44.245.60 -H "Host: hadesdesign.fi"` before relying on 2 or 3. Do not
cancel the Zoner plan until the new site has run without problems for a while.

## 11. After launch

- The previous site's contact-form script (an older Apps Script deployment) can be archived
  once the new form has delivered a real message.
- Update `Viimeksi päivitetty` in the privacy policy if you launch in a later month.
- Optional: enable DNSSEC in Cloudflare (**DNS → Settings → DNSSEC**) and add the DS record it
  shows at Domainhotelli.
- Optional anti-spoofing, since the domain sends no email: TXT `@` `v=spf1 -all` and TXT `_dmarc`
  `v=DMARC1; p=reject;`. (The contact form sends from Gmail, not from this domain, so it is unaffected.)
