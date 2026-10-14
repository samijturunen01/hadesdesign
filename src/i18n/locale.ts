import { useLocation } from 'react-router'

export const LOCALES = ['fi', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'fi'

/** A value that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>

export const LOCALE_META: Record<Locale, { htmlLang: string; ogLocale: string; label: string; short: string }> = {
  fi: { htmlLang: 'fi', ogLocale: 'fi_FI', label: 'Suomi', short: 'FI' },
  en: { htmlLang: 'en', ogLocale: 'en_GB', label: 'English', short: 'EN' },
}

/** English lives under /en, everything else is Finnish. */
export function localeFromPath(pathname: string): Locale {
  return /^\/en(?:\/|$)/i.test(pathname) ? 'en' : 'fi'
}

/** The active locale, derived from the current URL. */
export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname)
}

/** Pick the active-language value from a Localized object. */
export function useT() {
  const locale = useLocale()
  return <T,>(value: Localized<T>): T => value[locale]
}

const NBSP = ' '

const numberFormat: Localized<Intl.NumberFormat> = {
  fi: new Intl.NumberFormat('fi-FI'),
  en: new Intl.NumberFormat('en-GB'),
}

/** Finnish "1 990 €" (non-breaking spaces), English "€1,990". */
export function formatEuro(amount: number, locale: Locale): string {
  const n = numberFormat[locale].format(amount)
  return locale === 'fi' ? `${n}${NBSP}€` : `€${n}`
}
