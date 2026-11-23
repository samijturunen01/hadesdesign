/**
 * Contact form fields and validation. The limits mirror apps-script/Site.js –
 * the backend validates again, so keep both in sync.
 */
import { PRICES, ZEUS_FROM_PRICE, type TierId } from '../../data/pricing'
import { formatEuro, type Locale, type Localized } from '../../i18n/locale'

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  phone: { max: 30 },
  company: { max: 100 },
  message: { min: 10, max: 2000 },
} as const

/** What the visitor can choose in the form. */
export const SERVICE_OPTIONS = ['hermes', 'apollo', 'zeus', 'store', 'redesign', 'maintenance', 'other'] as const
export type ServiceOption = (typeof SERVICE_OPTIONS)[number]

/** The `service` values the backend accepts (apps-script/Site.js → fields → service → options). */
export type BackendService = 'light' | 'website' | 'store' | 'redesign' | 'maintenance' | 'other'

/**
 * The deployed backend predates Hermes, Apollo and Zeus and validates `service`
 * against its original keys, so the new packages are sent under those keys
 * (Hermes = the one-page tier, Apollo and Zeus = the multi-page tier). The
 * exact package and add-ons travel in the message (see quoteSummary), so an
 * old backend still delivers every request correctly.
 */
export const BACKEND_SERVICE: Record<ServiceOption, BackendService> = {
  hermes: 'light',
  apollo: 'website',
  zeus: 'website',
  store: 'store',
  redesign: 'redesign',
  maintenance: 'maintenance',
  other: 'other',
}

/** The packages Hermes, Apollo and Zeus. */
export const TIER_OPTIONS = ['hermes', 'apollo', 'zeus'] as const satisfies readonly ServiceOption[]
export const isTierOption = (value: ServiceOption | ''): value is TierId =>
  (TIER_OPTIONS as readonly string[]).includes(value)

const eur = (amount: number) => ({ fi: formatEuro(amount, 'fi'), en: formatEuro(amount, 'en') })

export const serviceLabels: Record<ServiceOption, Localized> = {
  hermes: {
    fi: `Hermes – yhden sivun verkkosivusto (${eur(PRICES.hermes).fi})`,
    en: `Hermes – one-page website (${eur(PRICES.hermes).en})`,
  },
  apollo: {
    fi: `Apollo – monisivuinen verkkosivusto (${eur(PRICES.apollo).fi})`,
    en: `Apollo – multi-page website (${eur(PRICES.apollo).en})`,
  },
  zeus: {
    fi: `Zeus – Apollo + lisäosat (alk. ${eur(ZEUS_FROM_PRICE).fi})`,
    en: `Zeus – Apollo + add-ons (from ${eur(ZEUS_FROM_PRICE).en})`,
  },
  store: { fi: 'Verkkokauppa', en: 'Online store' },
  redesign: { fi: 'Verkkosivujen uudistus', en: 'Website redesign' },
  maintenance: { fi: 'Ylläpito & hosting', en: 'Maintenance & hosting' },
  other: { fi: 'Muu / en ole vielä varma', en: 'Something else / not sure yet' },
}

export interface ContactValues {
  name: string
  email: string
  phone: string
  company: string
  service: ServiceOption | ''
  message: string
  /** Honeypot – hidden from people, must stay empty. */
  website: string
}

export type FieldName = Exclude<keyof ContactValues, 'website'>
export type FieldErrors = Partial<Record<FieldName, string>>

export const emptyContact: ContactValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
  website: '',
}

/** Same patterns as the backend (Code.js). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+\d][\d\s()-]{5,}$/

const messages = {
  nameShort: { fi: 'Kerro vielä nimesi.', en: 'Please tell us your name.' },
  nameLong: { fi: `Nimi voi olla enintään ${LIMITS.name.max} merkkiä.`, en: `The name can be at most ${LIMITS.name.max} characters.` },
  emailMissing: { fi: 'Sähköposti tarvitaan, jotta voimme vastata.', en: 'We need your email address to reply.' },
  emailInvalid: { fi: 'Tarkista sähköpostiosoitteen muoto.', en: 'Please check the email address.' },
  phoneInvalid: { fi: 'Tarkista puhelinnumeron muoto.', en: 'Please check the phone number.' },
  companyLong: {
    fi: `Yrityksen nimi voi olla enintään ${LIMITS.company.max} merkkiä.`,
    en: `The company name can be at most ${LIMITS.company.max} characters.`,
  },
  serviceInvalid: { fi: 'Valitse vaihtoehto listasta.', en: 'Please choose an option from the list.' },
  messageShort: {
    fi: `Kerro muutamalla sanalla, mistä on kyse (vähintään ${LIMITS.message.min} merkkiä).`,
    en: `Tell us in a few words what it is about (at least ${LIMITS.message.min} characters).`,
  },
} satisfies Record<string, Localized>

const messageLong = (max: number): Localized => ({
  fi: `Viesti voi olla enintään ${max} merkkiä.`,
  en: `The message can be at most ${max} characters.`,
})

/**
 * Validate the form. An empty object means it is valid. `messageMax` is lower
 * than the backend limit when a package summary is sent along with the message.
 */
export function validateContact(values: ContactValues, locale: Locale, messageMax: number = LIMITS.message.max): FieldErrors {
  const errors: FieldErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()
  const message = values.message.trim()

  if (name.length < LIMITS.name.min) errors.name = messages.nameShort[locale]
  else if (name.length > LIMITS.name.max) errors.name = messages.nameLong[locale]

  if (!email) errors.email = messages.emailMissing[locale]
  else if (!EMAIL_RE.test(email) || email.length > LIMITS.email.max) errors.email = messages.emailInvalid[locale]

  if (phone && (!PHONE_RE.test(phone) || phone.length > LIMITS.phone.max)) errors.phone = messages.phoneInvalid[locale]

  if (values.company.trim().length > LIMITS.company.max) errors.company = messages.companyLong[locale]

  if (values.service && !SERVICE_OPTIONS.includes(values.service)) errors.service = messages.serviceInvalid[locale]

  if (message.length < LIMITS.message.min) errors.message = messages.messageShort[locale]
  else if (message.length > messageMax) errors.message = messageLong(messageMax)[locale]

  return errors
}
