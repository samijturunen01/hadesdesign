# Contact form backend – Google Apps Script

The contact form (`/ota-yhteytta`, `/en/contact`) posts to a Google Apps Script web app.
The script validates the message, verifies a reCAPTCHA v3 token with Google, applies
spam limits and emails the message to your inbox (reply goes straight to the sender).

| File | Purpose |
|---|---|
| `Code.js` | Shared backend from your `contact-form` template – identical for every site |
| `Site.js` | Hades Design settings: fields, allowed hostnames, reCAPTCHA action |
| `appsscript.json` | Manifest: *Execute as: Me*, *Anyone* may call it, minimal OAuth scopes |
| `.claspignore` | Only the script files and manifest are pushed |

**No secrets are stored in this repository or in the website.** The reCAPTCHA *secret key*
and the *receiving email address* live only in the Apps Script project's **Script properties**
(`RECAPTCHA_SECRET`, `TO_EMAIL`).

## Deployment (live since 14 Oct 2026)

| | |
|---|---|
| Apps Script project | *Hades Design – yhteydenottolomake*, script ID `1cy2nsmMkVx8acfjWXIJiYBarrKe1msEBU2vuXBMhaLOMX0ttgfLaTbJA` (owned by your Google account) |
| Web app URL | `site.json` → `webAppUrl` (deployment `AKfycbymDvm…`, *Execute as: Me*, *Anyone*) |
| reCAPTCHA v3 key | site key `6LeDOe8tAAAAALxEemkEodBWofp8-vQ0o4oyPTgY`, Cloud project `verkkosivut-recaptcha` |
| Allowed domains | `hadesdesign.fi` (covers `www.`), `samijturunen01.github.io`, `localhost` – same list in `Site.js` |
| Recipient | `contact.hadesdesign@gmail.com` (Script property `TO_EMAIL`); mail is sent from the owner account |

`site.json` and `.clasp.json` hold only public IDs. The website uses the URL and site key as
defaults in `src/config/site.ts`; `VITE_APPS_SCRIPT_URL` / `VITE_RECAPTCHA_SITE_KEY` override them.

**After editing `Code.js` or `Site.js`:** `node $lomake deploy --dir $dir` – same URL, new version,
followed by an automatic smoke test. `node $lomake test --dir $dir` reruns only the smoke test.
**Changing the recipient or rotating the secret:** see *Other changes* in the `contact-form` skill
(rerun `create` with `--key` and `--script-id`, run `setup` in the editor, then `deploy`).

## Option A – with your contact-form automation (how it was set up)

Uses `C:\Users\kakka\.claude\skills\contact-form\scripts\lomake.mjs` (clasp and gcloud are
already signed in on your PC). `create` keeps this folder's `Code.js` and `Site.js`.

```powershell
$lomake = "C:\Users\kakka\.claude\skills\contact-form\scripts\lomake.mjs"
$dir = "E:\Hades Design nettisivut\apps-script"

# 1. reCAPTCHA key + Apps Script project + temporary Setup.js holding the secret
node $lomake create --dir $dir --name "Hades Design" `
  --domains "hadesdesign.fi,samijturunen01.github.io,localhost" `
  --to "contact.hadesdesign@gmail.com" --fields name,email,phone,company,message
```

2. Open the editor link it prints, choose **`setup`** in the function menu, click **Run** and
   **Allow** the permissions. A `[TESTI]` email arrives in your inbox.
3. Deploy (removes `Setup.js`, publishes a version, runs a smoke test):
   ```powershell
   node $lomake deploy --dir $dir
   ```
   Both checks must say **PASS**: the health check (GET) and the rejection of a fake reCAPTCHA token (POST).
4. Put `webAppUrl` and `siteKey` from the generated `site.json` into the defaults in
   `src/config/site.ts` (or `VITE_APPS_SCRIPT_URL` / `VITE_RECAPTCHA_SITE_KEY`).
5. Rebuild the site and send one real message from the form – a genuine reCAPTCHA token
   requires a real browser.

**Adding a host** (e.g. a new preview domain): add it both to the key
(`gcloud recaptcha keys update … --web '--domains=…'` – replaces the whole list) and to
`allowedHostnames` in `Site.js`, then run `deploy` again.

## Option B – by hand

1. **reCAPTCHA key:** <https://www.google.com/recaptcha/admin/create> → type **Score based (v3)**,
   domain `hadesdesign.fi` (plus preview/local domains if needed). Note the *site key* and *secret key*.
2. **Apps Script:** <https://script.google.com> → *New project*. Create files `Code.gs` and
   `Site.gs` with the contents of `Code.js` and `Site.js`. Enable *Project Settings → Show
   "appsscript.json"* and replace it with this folder's `appsscript.json`.
3. **Script properties** (*Project Settings → Script properties*): `RECAPTCHA_SECRET` = the secret
   key, `TO_EMAIL` = `<RECEIVING_EMAIL>`. Optional: `SHEET_ID` (log to a Google Sheet – also add the
   `https://www.googleapis.com/auth/spreadsheets` scope) and `MIN_SCORE` (default 0.5).
4. **Deploy → New deployment → Web app**: *Execute as:* **Me**, *Who has access:* **Anyone**.
   Authorise the permissions, then copy the web app URL.
5. Open the URL in a browser: it must answer `{"ok":true,"service":"Hades Design – contact form"}`.
6. Configure the website as in step 4 of option A.

After any code change, deploy a **new version** of the same deployment (Deploy → Manage
deployments → Edit → New version) so the URL stays the same.

## Permissions the script asks for

- **Send email as you** (`script.send_mail`) – delivers the messages. Mail is sent from the
  Google account that deploys the script, with *Reply-To* set to the visitor.
- **Connect to an external service** (`script.external_request`) – calls Google's reCAPTCHA
  verification endpoint.

## How the website talks to it (verified)

The site sends `POST` with `Content-Type: text/plain;charset=utf-8` and a JSON body – a CORS
“simple request”, so the browser sends no preflight (which Apps Script cannot answer). Apps
Script replies through a redirect to `script.googleusercontent.com` that allows cross-origin
reads. This was verified on 14 Oct 2026 in Chrome from an `http://localhost` origin against an
existing deployment of the same backend: the response was readable (`type: "cors"`) and
contained the JSON body.

Apps Script always answers **HTTP 200**, so the JSON decides the outcome: the form shows success
**only** for `{ "ok": true }`. Every other reply (`validation`, `recaptcha`, `recaptcha-score`,
`rate-limit`, `server`, `bad-request`), a network error or a timeout shows a Finnish/English
error message with the email address and phone number as alternatives. `mode: "no-cors"` is never used.

## Spam protection

- reCAPTCHA v3 (score ≥ 0.5, action `contact`, hostname must match `allowedHostnames`)
- hidden honeypot field (`website`) – bots that fill it get a silent fake success
- minimum fill-in time 2.5 s
- one message per email address per 60 s, at most 40 messages per hour in total
- length/format validation of every field (the website applies the same limits)
- HTML-escaped email body

## Quotas

A consumer Gmail account can send about 100 emails per day from Apps Script; reCAPTCHA
allows 10 000 free verifications per month across all your sites.
