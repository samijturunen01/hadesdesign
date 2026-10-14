/**
 * reCAPTCHA v3, loaded on demand (only when someone starts filling in the
 * contact form). Only the PUBLIC site key is used here; the token is verified
 * with the secret key inside Google Apps Script.
 */
import { config } from '../../config/site'
import type { Locale } from '../../i18n/locale'

interface Grecaptcha {
  ready(callback: () => void): void
  execute(siteKey: string, options: { action: string }): Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

let loading: Promise<Grecaptcha> | null = null

export function loadRecaptcha(locale: Locale): Promise<Grecaptcha> {
  if (!config.recaptchaSiteKey) return Promise.reject(new Error('missing-site-key'))
  if (loading) return loading
  loading = new Promise<Grecaptcha>((resolve, reject) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => resolve(window.grecaptcha as Grecaptcha))
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(config.recaptchaSiteKey)}&hl=${locale}`
    script.async = true
    script.onload = () => {
      const g = window.grecaptcha
      if (g) g.ready(() => resolve(g))
      else reject(new Error('recaptcha-missing'))
    }
    script.onerror = () => reject(new Error('recaptcha-blocked'))
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    loading = null
    throw error
  })
  return loading
}

/** A fresh token (tokens expire after two minutes, so get one right before sending). */
export async function getRecaptchaToken(locale: Locale): Promise<string> {
  const grecaptcha = await loadRecaptcha(locale)
  return grecaptcha.execute(config.recaptchaSiteKey, { action: config.recaptchaAction })
}
