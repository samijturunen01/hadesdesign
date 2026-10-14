/**
 * Public runtime configuration, read from Vite environment variables
 * (see .env.example). Everything here ends up in the built JavaScript –
 * never add secrets.
 */
const env = import.meta.env

const clean = (value: string | undefined) => (value ?? '').trim()
const trimSlash = (value: string) => value.replace(/\/+$/, '')

/**
 * Contact form backend (apps-script/site.json). Both values are public – they
 * end up in the built JavaScript anyway; the reCAPTCHA secret lives only in
 * the Apps Script project's Script properties. Env variables override them.
 */
const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbymDvm-kHB0jJZu6flHpQkQHyA7TYyDaLa4_4F6rzCO4n8sS1JJwWW_YNxqRZ0ZYglbGg/exec'
const DEFAULT_RECAPTCHA_SITE_KEY = '6LeDOe8tAAAAALxEemkEodBWofp8-vQ0o4oyPTgY'

export const config = {
  /** Production origin without a trailing slash. */
  siteUrl: trimSlash(clean(env.VITE_SITE_URL) || 'https://hadesdesign.fi'),
  /** Vite base path – always starts and ends with "/". */
  basePath: env.BASE_URL || '/',
  /** Google Apps Script web app endpoint of the contact form. */
  appsScriptUrl: clean(env.VITE_APPS_SCRIPT_URL) || DEFAULT_APPS_SCRIPT_URL,
  /** reCAPTCHA v3 site key (public). */
  recaptchaSiteKey: clean(env.VITE_RECAPTCHA_SITE_KEY) || DEFAULT_RECAPTCHA_SITE_KEY,
  /** Must match `recaptchaAction` in apps-script/Site.js. */
  recaptchaAction: 'contact',
  /** Preview/staging builds must never be indexed. */
  noindex: clean(env.VITE_NOINDEX) === 'true',
} as const

/** True when the contact form has everything it needs to deliver messages. */
export const isContactFormConfigured = Boolean(config.appsScriptUrl && config.recaptchaSiteKey)

/** Resolve a file in /public against the base path (works under a sub-folder too). */
export function publicUrl(path: string): string {
  return config.basePath + path.replace(/^\/+/, '')
}

/**
 * Absolute production URL for a route path or public file. Canonical URLs
 * always point at production, never at a preview sub-folder.
 *   absoluteUrl('/')         → https://hadesdesign.fi/
 *   absoluteUrl('/palvelut') → https://hadesdesign.fi/palvelut
 */
export function absoluteUrl(path = '/'): string {
  return `${config.siteUrl}/${path.replace(/^\/+/, '')}`
}
