/**
 * Website packages and the maintenance & hosting plan (verified prices).
 * Website package prices include VAT, as stated on the previous site. The VAT
 * status of the maintenance prices was never stated – do not add one.
 */
import type { Localized } from '../i18n/locale'

export type FeatureId =
  | 'design'
  | 'development'
  | 'mobile'
  | 'support'
  | 'seo'
  | 'ssl'
  | 'speed'
  | 'contactForm'
  | 'extraPages'
  | 'storeDesign'
  | 'orderTracking'
  | 'payments'
  | 'catalog'

export const FEATURES: Record<FeatureId, Localized> = {
  design: { fi: 'Web-suunnittelu', en: 'Web design' },
  development: { fi: 'Web-kehitys', en: 'Web development' },
  mobile: { fi: 'Mobiilioptimointi', en: 'Mobile optimisation' },
  support: { fi: 'Ylläpito ja tuki 60 päivää julkaisun jälkeen', en: 'Maintenance & support for 60 days after launch' },
  seo: { fi: 'Hakukoneoptimointi (SEO)', en: 'Search engine optimisation (SEO)' },
  ssl: { fi: 'SSL-suojaus', en: 'SSL security' },
  speed: { fi: 'Nopea latausaika', en: 'Fast loading times' },
  contactForm: { fi: 'Yhteydenottolomake', en: 'Contact form' },
  extraPages: { fi: 'Lisäsivut 100 € / sivu', en: 'Additional pages €100 / page' },
  storeDesign: { fi: 'Verkkokaupan suunnittelu', en: 'Online store design' },
  orderTracking: { fi: 'Tilausten seuranta', en: 'Order tracking' },
  payments: { fi: 'Maksujen käsittely', en: 'Payment processing' },
  catalog: { fi: 'Tuotekuvasto', en: 'Product catalogue' },
}

/** Display order of the comparison rows. */
export const FEATURE_ORDER: FeatureId[] = [
  'design',
  'development',
  'mobile',
  'support',
  'seo',
  'ssl',
  'speed',
  'contactForm',
  'extraPages',
  'storeDesign',
  'orderTracking',
  'payments',
  'catalog',
]

export type PackageId = 'light' | 'website' | 'store'

export interface WebsitePackage {
  id: PackageId
  name: Localized
  /** Price in euros, VAT included. */
  price: number
  pages: Localized
  description: Localized
  /** Typical delivery time (from the pricing FAQ). */
  timeline: Localized
  included: FeatureId[]
  /** Marked "Suosituin" on the previous site. */
  popular: boolean
}

export const packages: WebsitePackage[] = [
  {
    id: 'light',
    name: { fi: 'Kevyt verkkosivupaketti', en: 'Light website package' },
    price: 790,
    pages: { fi: '1–2 sivua', en: '1–2 pages' },
    description: {
      fi: 'Helppo ja kustannustehokas ratkaisu pienille sivustoille.',
      en: 'An easy, cost-effective solution for small websites.',
    },
    timeline: { fi: '1–2 viikkoa', en: '1–2 weeks' },
    included: ['design', 'development', 'mobile', 'support', 'seo', 'ssl', 'speed', 'contactForm'],
    popular: false,
  },
  {
    id: 'website',
    name: { fi: 'Verkkosivupaketti', en: 'Website package' },
    price: 990,
    pages: { fi: 'Jopa 6 sivua', en: 'Up to 6 pages' },
    description: {
      fi: 'Kaikki, mitä tarvitset menestyvään verkkosivustoon.',
      en: 'Everything you need for a successful website.',
    },
    timeline: { fi: '2–3 viikkoa', en: '2–3 weeks' },
    included: ['design', 'development', 'mobile', 'support', 'seo', 'ssl', 'speed', 'contactForm', 'extraPages'],
    popular: true,
  },
  {
    id: 'store',
    name: { fi: 'Verkkokauppapaketti', en: 'Online store package' },
    price: 1990,
    pages: { fi: 'Jopa 10 sivua', en: 'Up to 10 pages' },
    description: {
      fi: 'Täydellinen ratkaisu verkkomyyntiin.',
      en: 'A complete solution for selling online.',
    },
    timeline: { fi: '3–4 viikkoa', en: '3–4 weeks' },
    included: [
      'development',
      'mobile',
      'support',
      'seo',
      'ssl',
      'speed',
      'contactForm',
      'extraPages',
      'storeDesign',
      'orderTracking',
      'payments',
      'catalog',
    ],
    popular: false,
  },
]

export const vatNote: Localized = {
  fi: 'Hinnat sisältävät ALV:n.',
  en: 'Prices include VAT.',
}

export const popularLabel: Localized = { fi: 'Suosituin', en: 'Most popular' }

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
