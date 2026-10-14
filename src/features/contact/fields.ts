/**
 * Contact form fields and validation. The limits mirror apps-script/Site.js –
 * the backend validates again, so keep both in sync.
 */
import type { Locale, Localized } from '../../i18n/locale'

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  phone: { max: 30 },
  company: { max: 100 },
  message: { min: 10, max: 2000 },
} as const

/** Same values as the `service` options in apps-script/Site.js. */
export const SERVICE_OPTIONS = ['light', 'website', 'store', 'redesign', 'maintenance', 'other'] as const
export type ServiceOption = (typeof SERVICE_OPTIONS)[number]

export const serviceLabels: Record<ServiceOption, Localized> = {
  light: { fi: 'Kevyt verkkosivupaketti (790 €)', en: 'Light website package (€790)' },
  website: { fi: 'Verkkosivupaketti (990 €)', en: 'Website package (€990)' },
  store: { fi: 'Verkkokauppapaketti (1 990 €)', en: 'Online store package (€1,990)' },
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
  messageLong: {
    fi: `Viesti voi olla enintään ${LIMITS.message.max} merkkiä.`,
    en: `The message can be at most ${LIMITS.message.max} characters.`,
  },
} satisfies Record<string, Localized>

/** Validate the form. An empty object means it is valid. */
export function validateContact(values: ContactValues, locale: Locale): FieldErrors {
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
  else if (message.length > LIMITS.message.max) errors.message = messages.messageLong[locale]

  return errors
}
