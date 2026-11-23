/**
 * The maintenance & hosting plan (verified prices) and shared price wording.
 * The website packages Hermes, Apollo and Zeus live in ./pricing.ts.
 * Package prices include VAT, as stated on the previous site. The VAT status of
 * the maintenance prices was never stated – do not add one.
 */
import type { Localized } from '../i18n/locale'

/** VAT wording for every package price on the site – the one place to change if the policy changes. */
export const vatNote: Localized = {
  fi: 'Hinnat sisältävät ALV:n.',
  en: 'Prices include VAT.',
}

/** Short form next to a price. */
export const vatShort: Localized = { fi: 'sis. ALV', en: 'VAT incl.' }

/** Apollo's badge (owner's choice, 2026-11-23). */
export const recommendedLabel: Localized = { fi: 'Suosituin', en: 'Most popular' }

/** Maintenance & hosting plan. */
export const maintenancePlan = {
  name: { fi: 'Ylläpito & hosting -paketti', en: 'Maintenance & hosting plan' } satisfies Localized,
  tagline: {
    fi: 'Kaikki, mitä tarvitset verkkosivujesi sujuvaan toimintaan.',
    en: 'Everything you need to keep your website running smoothly.',
  } satisfies Localized,
  monthly: 40,
  yearly: 360,
  /** 360 € / 12 */
  yearlyPerMonth: 30,
  /** 12 × 40 € − 360 € */
  yearlySaving: 120,
  yearlySavingPercent: 25,
  features: [
    {
      title: { fi: 'Hallittu ylläpito', en: 'Managed maintenance' },
      description: {
        fi: 'Säännölliset päivitykset, optimoinnit ja tekniset parannukset hoidetaan puolestasi.',
        en: 'Regular updates, optimisations and technical improvements, handled for you.',
      },
    },
    {
      title: { fi: 'Turvallinen hosting', en: 'Secure hosting' },
      description: {
        fi: 'Nopea ja luotettava hosting sisäänrakennetulla suojauksella.',
        en: 'Fast, reliable hosting with built-in protection.',
      },
    },
    {
      title: { fi: 'Tietoturva ja seuranta', en: 'Security & uptime monitoring' },
      description: {
        fi: 'Ympärivuorokautinen valvonta torjuu uhkia ja varmistaa, että sivusto pysyy toiminnassa.',
        en: 'Round-the-clock monitoring guards against threats and keeps your site online.',
      },
    },
    {
      title: { fi: 'Sisältöpäivitykset', en: 'Content updates' },
      description: {
        fi: 'Pienet teksti- ja sisältömuutokset sisältyvät tarvittaessa.',
        en: 'Small text and content changes are included when needed.',
      },
    },
    {
      title: { fi: 'Automaattiset varmuuskopiot', en: 'Automatic backups' },
      description: {
        fi: 'Päivittäiset varmuuskopiot pitävät tietosi turvassa ja palautettavissa.',
        en: 'Daily backups keep your data safe and recoverable.',
      },
    },
    {
      title: { fi: 'Prioriteettituki', en: 'Priority support' },
      description: {
        fi: 'Suora yhteys meihin kaikissa kysymyksissä ja kiireellisissä ongelmissa.',
        en: 'A direct line to us for questions and urgent issues.',
      },
    },
  ] satisfies Array<{ title: Localized; description: Localized }>,
} as const
