/**
 * Public runtime configuration, read from Vite environment variables
 * (see .env.example). Everything here ends up in the built JavaScript –
 * never add secrets.
 */
const env = import.meta.env

const clean = (value: string | undefined) => (value ?? '').trim()
const trimSlash = (value: string) => value.replace(/\/+$/, '')

/** The GA4 property used by the previous site, kept so reporting continues. */
const DEFAULT_GA_ID = 'G-62L4BW8BGX'

function resolveGaId(): string {
  const value = clean(env.VITE_GA_MEASUREMENT_ID)
  if (value.toLowerCase() === 'off') return ''
  if (value) return value
  // Unset: production builds keep analytics, local development does not.
  return env.PROD ? DEFAULT_GA_ID : ''
}

export const config = {
  /** Production origin without a trailing slash. */
  siteUrl: trimSlash(clean(env.VITE_SITE_URL) || 'https://hadesdesign.fi'),
  /** Vite base path – always starts and ends with "/". */
  basePath: env.BASE_URL || '/',
  /** Google Apps Script web app endpoint of the contact form. */
  appsScriptUrl: clean(env.VITE_APPS_SCRIPT_URL),
  /** reCAPTCHA v3 site key (public). */
  recaptchaSiteKey: clean(env.VITE_RECAPTCHA_SITE_KEY),
  /** Must match `recaptchaAction` in apps-script/Site.js. */
  recaptchaAction: 'contact',
  /** GA4 measurement ID, empty when analytics is disabled. */
  gaMeasurementId: resolveGaId(),
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
