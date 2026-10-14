/**
 * Sends the contact form to the Google Apps Script web app.
 *
 * The request is a CORS "simple request" (POST with Content-Type text/plain):
 * Apps Script cannot answer a CORS preflight, but it does return a readable
 * JSON response to simple requests. We never use mode: 'no-cors' – the reply
 * must be read, and only { ok: true } counts as delivered.
 */
import { config } from '../../config/site'
import type { Locale, Localized } from '../../i18n/locale'
import type { ContactValues } from './fields'

export type ContactErrorCode =
  | 'not-configured'
  | 'recaptcha-unavailable'
  | 'recaptcha'
  | 'recaptcha-score'
  | 'validation'
  | 'rate-limit'
  | 'server'
  | 'bad-request'
  | 'timeout'
  | 'network'
  | 'http'

export class ContactError extends Error {
  readonly code: ContactErrorCode

  constructor(code: ContactErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

const errorMessages: Record<'spam' | 'validation' | 'rate' | 'timeout' | 'config' | 'captcha' | 'generic', Localized> = {
  spam: {
    fi: 'Roskapostisuodatin esti viestin. Yritä uudelleen tai lähetä meille sähköpostia.',
    en: 'Our spam filter blocked the message. Please try again or send us an email.',
  },
  validation: {
    fi: 'Tarkista lomakkeen tiedot ja yritä uudelleen.',
    en: 'Please check the form and try again.',
  },
  rate: {
    fi: 'Liian monta viestiä lyhyessä ajassa. Yritä hetken kuluttua uudelleen.',
    en: 'Too many messages in a short time. Please try again in a moment.',
  },
  timeout: {
    fi: 'Yhteys aikakatkaistiin. Tarkista verkkoyhteys ja yritä uudelleen.',
    en: 'The connection timed out. Please check your connection and try again.',
  },
  config: {
    fi: 'Lomake ei ole vielä käytössä. Lähetä viesti sähköpostilla tai soita – vastaamme mielellämme.',
    en: 'The form is not active yet. Please email or call us – we are happy to help.',
  },
  captcha: {
    fi: 'Roskapostisuojaus ei latautunut (esimerkiksi selaimen estolaajennuksen vuoksi). Yritä uudelleen tai lähetä viesti sähköpostilla.',
    en: 'The spam protection could not load (for example because of a content blocker). Please try again or send us an email.',
  },
  generic: {
    fi: 'Viestin lähetys ei onnistunut. Yritä hetken kuluttua uudelleen tai lähetä viesti sähköpostilla.',
    en: 'The message could not be sent. Please try again in a moment or send us an email.',
  },
}

export function contactErrorMessage(code: ContactErrorCode, locale: Locale): string {
  switch (code) {
    case 'recaptcha':
    case 'recaptcha-score':
      return errorMessages.spam[locale]
    case 'validation':
      return errorMessages.validation[locale]
    case 'rate-limit':
      return errorMessages.rate[locale]
    case 'timeout':
      return errorMessages.timeout[locale]
    case 'not-configured':
      return errorMessages.config[locale]
    case 'recaptcha-unavailable':
      return errorMessages.captcha[locale]
    default:
      return errorMessages.generic[locale]
  }
}

export interface ContactPayload extends ContactValues {
  /** reCAPTCHA v3 token for the action in config.recaptchaAction. */
  token: string
  /** Milliseconds since the form was shown (bots fill forms instantly). */
  elapsed: number
  /** The page the form was sent from. */
  page: string
}

const KNOWN_CODES = new Set<ContactErrorCode>(['recaptcha', 'recaptcha-score', 'validation', 'rate-limit', 'server', 'bad-request'])

/** Resolves only when the backend confirmed delivery with { ok: true }. */
export async function submitContact(payload: ContactPayload, locale: Locale, timeoutMs = 20000): Promise<void> {
  if (!config.appsScriptUrl) throw new ContactError('not-configured', contactErrorMessage('not-configured', locale))

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(config.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    })
    const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (response.ok && data?.ok === true) return
    const code: ContactErrorCode =
      data?.error && KNOWN_CODES.has(data.error as ContactErrorCode) ? (data.error as ContactErrorCode) : 'http'
    throw new ContactError(code, contactErrorMessage(code, locale))
  } catch (error) {
    if (error instanceof ContactError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ContactError('timeout', contactErrorMessage('timeout', locale))
    }
    throw new ContactError('network', contactErrorMessage('network', locale))
  } finally {
    window.clearTimeout(timer)
  }
}
