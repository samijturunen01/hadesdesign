/**
 * Website packages Hermes, Apollo and Zeus, and the Zeus add-ons.
 *
 * The single source of truth for package prices: the pricing page and its Zeus
 * calculator, the home page, the websites service page, the contact form, page
 * meta and structured data all read from here. Prices set by the owner on
 * 2026-11-23. Like the packages before them they are shown VAT included (the
 * site's existing pricing policy) – see docs/CONTENT-SOURCES.md.
 *
 * Keep this module free of runtime imports (type imports only):
 * scripts/pricing.test.mjs imports it directly with Node's type stripping.
 */
import type { Localized } from '../i18n/locale'

/** One-time prices in euros. */
export const PRICES = {
  hermes: 800,
  apollo: 1000,
  booking: 400,
  payments: 300,
  analytics: 100,
  /** Per additional language. Finnish is the standard language. */
  language: 100,
} as const

/** Upper limit of the calculator's language stepper (more can be asked for in the quote request). */
export const MAX_EXTRA_LANGUAGES = 5

export type TierId = 'hermes' | 'apollo' | 'zeus'
export const TIER_IDS: readonly TierId[] = ['hermes', 'apollo', 'zeus']

/** Add-ons that are either on or off. Additional languages are counted separately. */
export const ADDON_IDS = ['booking', 'payments', 'analytics'] as const
export type AddonId = (typeof ADDON_IDS)[number]
export type AddonKey = AddonId | 'languages'

/** What is chosen in the Zeus calculator on top of the Apollo website. */
export type ZeusSelection = Record<AddonId, boolean> & { languages: number }

export const NO_ADDONS: ZeusSelection = { booking: false, payments: false, analytics: false, languages: 0 }

/** Every listed add-on with one additional language – the Zeus headline price. */
export const ALL_ADDONS: ZeusSelection = { booking: true, payments: true, analytics: true, languages: 1 }

export function clampLanguages(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(MAX_EXTRA_LANGUAGES, Math.max(0, Math.trunc(value)))
}

export function normalizeSelection(selection: ZeusSelection): ZeusSelection {
  return {
    booking: selection.booking === true,
    payments: selection.payments === true,
    analytics: selection.analytics === true,
    languages: clampLanguages(selection.languages),
  }
}

export function hasAddons(selection: ZeusSelection): boolean {
  return ADDON_IDS.some((id) => selection[id]) || clampLanguages(selection.languages) > 0
}

/** Number of add-on types chosen (additional languages count as one, however many). */
export function addonCount(selection: ZeusSelection): number {
  return ADDON_IDS.filter((id) => selection[id]).length + (clampLanguages(selection.languages) > 0 ? 1 : 0)
}

export interface LineItem {
  id: 'apollo' | AddonKey
  /** Euros for this line. */
  amount: number
  /** Number of languages for the 'languages' line, otherwise 1. */
  quantity: number
}

/** The Apollo base followed by every chosen add-on, in display order. */
export function lineItems(selection: ZeusSelection): LineItem[] {
  const items: LineItem[] = [{ id: 'apollo', amount: PRICES.apollo, quantity: 1 }]
  for (const id of ADDON_IDS) if (selection[id]) items.push({ id, amount: PRICES[id], quantity: 1 })
  const languages = clampLanguages(selection.languages)
  if (languages > 0) items.push({ id: 'languages', amount: languages * PRICES.language, quantity: languages })
  return items
}

/** Apollo plus the chosen add-ons. No add-ons = the Apollo price. */
export function zeusTotal(selection: ZeusSelection): number {
  return lineItems(selection).reduce((sum, item) => sum + item.amount, 0)
}

/** Apollo with no add-ons is simply Apollo – never labelled as a Zeus upgrade. */
export function tierForSelection(selection: ZeusSelection): 'apollo' | 'zeus' {
  return hasAddons(selection) ? 'zeus' : 'apollo'
}

/** Zeus with every listed add-on and one additional language (1 900 €). */
export const ZEUS_FULL_PRICE = zeusTotal(ALL_ADDONS)

/** The cheapest Zeus: Apollo with the least expensive single add-on (1 100 €). */
export const ZEUS_FROM_PRICE =
  PRICES.apollo + Math.min(PRICES.booking, PRICES.payments, PRICES.analytics, PRICES.language)

/** The lowest website package price (Hermes). */
export const STARTING_PRICE = Math.min(PRICES.hermes, PRICES.apollo)

/** The price shown on a package card. */
export function headlinePrice(tier: TierId): number {
  if (tier === 'hermes') return PRICES.hermes
  if (tier === 'apollo') return PRICES.apollo
  return ZEUS_FULL_PRICE
}

/* ------------------------------------------------------------------ */
/* Quote: a package choice handed from the pricing page to the contact */
/* form through the URL, e.g. ?package=zeus&addons=booking,payments&languages=1 */
/* ------------------------------------------------------------------ */

export interface Quote {
  tier: TierId
  /** Zeus add-ons; always NO_ADDONS for Hermes and Apollo. */
  selection: ZeusSelection
}

/** Apollo/Zeus from a calculator selection (no add-ons → Apollo). */
export function quoteFromSelection(selection: ZeusSelection): Quote {
  const normalized = normalizeSelection(selection)
  return { tier: tierForSelection(normalized), selection: normalized }
}

export function quoteForTier(tier: 'hermes' | 'apollo'): Quote {
  return { tier, selection: NO_ADDONS }
}

export function quoteTotal(quote: Quote): number {
  return quote.tier === 'hermes' ? PRICES.hermes : zeusTotal(quote.selection)
}

/** "?package=…" for a quote – parameter names are language neutral, so FI and EN share them. */
export function quoteToSearch(quote: Quote): string {
  if (quote.tier !== 'zeus') return `?package=${quote.tier}`
  const addons = ADDON_IDS.filter((id) => quote.selection[id])
  const languages = clampLanguages(quote.selection.languages)
  let search = '?package=zeus'
  if (addons.length) search += `&addons=${addons.join(',')}`
  if (languages > 0) search += `&languages=${languages}`
  return search
}

/** Reads a quote from a URL query string. Unknown or malformed values are ignored. */
export function quoteFromSearch(search: string): Quote | null {
  const params = new URLSearchParams(search)
  const tier = params.get('package')
  if (tier === 'hermes') return quoteForTier('hermes')
  if (tier !== 'apollo' && tier !== 'zeus') return null
  const chosen = new Set((params.get('addons') ?? '').split(',').map((s) => s.trim()))
  const languages = Number.parseInt(params.get('languages') ?? '0', 10)
  return quoteFromSelection({
    booking: chosen.has('booking'),
    payments: chosen.has('payments'),
    analytics: chosen.has('analytics'),
    languages: Number.isNaN(languages) ? 0 : languages,
  })
}

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

export interface Tier {
  id: TierId
  name: string
  /** What the package is, in a few words. */
  kind: Localized
  /** The idea behind the name. */
  myth: Localized
  description: Localized
  /** Who the package suits. */
  idealFor: Localized
  /** Lead-in above the feature list. */
  includesLead?: Localized
  features: Localized<string[]>
  recommended: boolean
}

export const tiers: Tier[] = [
  {
    id: 'hermes',
    name: 'Hermes',
    kind: { fi: 'Yhden sivun verkkosivusto', en: 'One-page website' },
    myth: { fi: 'Jumalten sanansaattaja – nopeus ja selkeä viesti', en: 'Messenger of the gods – speed and a clear message' },
    description: {
      fi: 'Nopea, selkeä ja ammattimainen verkkosivusto, joka esittelee yrityksesi tärkeimmät palvelut ja tekee yhteydenotosta helppoa.',
      en: 'A fast, clear and professional website that presents your key services and makes it easy to get in touch.',
    },
    idealFor: {
      fi: 'Kun yksi huolella suunniteltu sivu riittää kertomaan, mitä teet – esimerkiksi uudelle yritykselle tai selkeälle palvelulle.',
      en: 'When one carefully designed page says everything you need – for a new business or a focused service, for example.',
    },
    features: {
      fi: [
        'Yksi tiivis ja selkeä sivu',
        'Yksilöllinen, ammattimainen ulkoasu',
        'Conversion First -suunnittelu',
        'Responsiivinen: tietokone, tabletti ja puhelin',
        'Yritysesittely, pääpalvelut tai -tuotteet ja olennaiset tiedot',
        'Yhteystiedot ja selkeä yhteydenottolomake',
        'Hakukoneoptimoinnin perusteet',
        'Nopeuden ja saavutettavuuden perusteet',
      ],
      en: [
        'One focused, clear page',
        'Custom, professional design',
        'Conversion First planning',
        'Responsive on desktop, tablet and phone',
        'Business introduction, main services or products and key information',
        'Contact details and a simple contact form',
        'Search engine optimisation fundamentals',
        'Performance and accessibility fundamentals',
      ],
    },
    recommended: false,
  },
  {
    id: 'apollo',
    name: 'Apollo',
    kind: { fi: 'Monisivuinen verkkosivusto', en: 'Multi-page website' },
    myth: { fi: 'Valon ja taiteiden jumala – kauneus ja harmonia', en: 'God of light and the arts – beauty and harmony' },
    description: {
      fi: 'Näyttävä ja myyntiin suunniteltu verkkosivusto, joka esittelee yrityksesi palvelut kattavasti ja ohjaa kävijät kohti yhteydenottoa.',
      en: 'A striking website designed to sell, presenting your services in full and guiding visitors towards getting in touch.',
    },
    idealFor: {
      fi: 'Useimmille yrityksille: kun palveluita on useampi ja haluat jokaisen niistä tuovan yhteydenottoja.',
      en: 'Most businesses: when you offer several services and want each of them to bring in enquiries.',
    },
    includesLead: { fi: 'Kaikki Hermeksen olennainen, ja lisäksi:', en: 'Everything relevant from Hermes, plus:' },
    features: {
      fi: [
        'Monisivuinen sivusto, jossa omat sivut palveluille',
        'Ainutlaatuinen ulkoasu ja yrityskohtainen luova konsepti',
        'Kattava Conversion First -strategia ja selkeä asiakaspolku',
        'Yrityksellesi räätälöity yhteydenottolomake',
        'Referenssi- tai kuvagalleria tarpeen mukaan',
        'Logo- ja vuorovaikutusanimaatiot, kun ne tukevat kokonaisuutta',
        'Hakukoneoptimointi ja suorituskyvyn optimointi',
        'Google Maps -kartta, kun sinulla on julkinen asiakaspiste',
      ],
      en: [
        'Multiple pages, with dedicated pages for your services',
        'Unique design and a creative direction made for your business',
        'A complete Conversion First strategy and a clear customer journey',
        'A contact form tailored to your business',
        'A portfolio or reference gallery where relevant',
        'Custom logo and interaction animations where they add value',
        'Search engine optimisation and performance optimisation',
        'Google Maps when you have a public customer location',
      ],
    },
    recommended: true,
  },
  {
    id: 'zeus',
    name: 'Zeus',
    kind: { fi: 'Apollo + valitsemasi lisäosat', en: 'Apollo + the add-ons you choose' },
    myth: { fi: 'Jumalten kuningas – voima ja hallinta', en: 'King of the gods – power and control' },
    description: {
      fi: 'Kun verkkosivuilta tarvitaan enemmän. Laajenna Apollo-verkkosivustoa ajanvarauksella, verkkomaksamisella, analytiikalla ja kieliversioilla.',
      en: 'For when your website needs to do more. Extend Apollo with online booking, online payments, analytics and language versions.',
    },
    idealFor: {
      fi: 'Kun asiakkaiden pitää voida varata, maksaa tai asioida sivustollasi useammalla kielellä.',
      en: 'When customers need to book, pay or use your site in more than one language.',
    },
    includesLead: { fi: 'Koko Apollo-verkkosivusto, ja valintasi mukaan:', en: 'The complete Apollo website, plus your choice of:' },
    features: { fi: [], en: [] },
    recommended: false,
  },
]

export function getTier(id: TierId): Tier {
  const tier = tiers.find((t) => t.id === id)
  if (!tier) throw new Error(`Unknown tier: ${id}`)
  return tier
}

export interface Addon {
  id: AddonKey
  price: number
  /** Unit after the price, for per-language pricing. */
  unit?: Localized
  name: Localized
  /** One line for the calculator. */
  summary: Localized
  what: Localized
  when: Localized
  /** Limits and costs that are not included. */
  note: Localized
}

export const addons: Addon[] = [
  {
    id: 'booking',
    price: PRICES.booking,
    name: { fi: 'Ajanvaraus ja hallintapaneeli', en: 'Booking system and admin dashboard' },
    summary: {
      fi: 'Asiakkaat varaavat ajan verkossa, sinä hallitset varauksia yhdestä paikasta.',
      en: 'Customers book online; you manage bookings in one place.',
    },
    what: {
      fi: 'Asiakkaasi näkevät vapaat ajat ja varaavat ajan suoraan sivustoltasi – myös iltaisin ja viikonloppuisin. Hallintapaneelista hallitset vapaita aikoja, varauksia ja varausasetuksia.',
      en: 'Customers see available times and book straight from your website – evenings and weekends included. In the admin dashboard you manage availability, appointments and booking settings.',
    },
    when: {
      fi: 'Kun asiakkaasi varaavat aikoja – esimerkiksi hoito-, valmennus-, konsultointi- tai vuokrauspalveluissa.',
      en: 'When your customers book appointments – for treatments, coaching, consulting or rentals, for example.',
    },
    note: {
      fi: 'Ajanvaraus toteutetaan yrityksesi tarpeisiin sopivaksi. Laajat erikoistoiminnot ja integraatiot muihin järjestelmiin arvioidaan erikseen tarjouksessa.',
      en: 'The booking system is set up to suit your business. Extensive special features and integrations with other systems are scoped separately in the quote.',
    },
  },
  {
    id: 'payments',
    price: PRICES.payments,
    name: { fi: 'Verkkomaksut', en: 'Online payments' },
    summary: {
      fi: 'Asiakkaat maksavat palvelun tai varauksen turvallisesti verkossa.',
      en: 'Customers pay for services or bookings securely online.',
    },
    what: {
      fi: 'Asiakkaat voivat maksaa soveltuvat palvelut tai varaukset verkossa. Maksut kulkevat luotettavan maksupalveluntarjoajan kautta.',
      en: 'Customers can pay for eligible services or bookings online. Payments go through a trusted payment provider.',
    },
    when: {
      fi: 'Kun haluat varmistaa varaukset ennakkomaksulla tai ottaa maksun palvelusta jo tilausvaiheessa.',
      en: 'When you want to secure bookings with a prepayment or take payment when a service is ordered.',
    },
    note: {
      fi: 'Maksupalveluntarjoaja perii omat transaktio- ja mahdolliset kuukausimaksunsa, eivätkä ne sisälly hintaan. Verkkomaksut eivät ole verkkokauppa.',
      en: 'The payment provider charges its own transaction and any monthly fees, which are not included. Online payments are not an online store.',
    },
  },
  {
    id: 'analytics',
    price: PRICES.analytics,
    name: { fi: 'Analytiikka', en: 'Analytics' },
    summary: {
      fi: 'Näet, mistä kävijät tulevat ja mitä he sivustollasi tekevät.',
      en: 'See where visitors come from and what they do on your site.',
    },
    what: {
      fi: 'Analytiikkaintegraatio, esimerkiksi Google Analytics, näyttää kävijämäärät, liikenteen lähteet ja keskeiset toiminnot, kuten yhteydenotot.',
      en: 'An analytics integration, such as Google Analytics, shows visitor numbers, traffic sources and key actions such as enquiries.',
    },
    when: {
      fi: 'Kun haluat tietää, mikä markkinointi toimii, ja tehdä päätöksiä tiedon pohjalta.',
      en: 'When you want to know which marketing works and make decisions based on data.',
    },
    note: {
      fi: 'Hinta kattaa analytiikan käyttöönoton. Seuranta määritetään tietosuoja- ja suostumusvaatimusten mukaisesti. Jatkuva analysointi ja raportointi eivät sisälly hintaan.',
      en: 'The price covers setting up analytics. Tracking is configured to meet privacy and consent requirements. Ongoing analysis and reporting are not included.',
    },
  },
  {
    id: 'languages',
    price: PRICES.language,
    unit: { fi: '/ kieli', en: '/ language' },
    name: { fi: 'Lisäkieli', en: 'Additional language' },
    summary: {
      fi: 'Palvele asiakkaita suomen lisäksi esimerkiksi englanniksi tai ruotsiksi.',
      en: 'Serve customers in, for example, English or Swedish as well as Finnish.',
    },
    what: {
      fi: 'Sivustosi toimii suomen lisäksi valitsemillasi kielillä, ja kävijä vaihtaa kieltä yhdellä napautuksella. Yksi lisäkieli tarkoittaa kahta kieltä yhteensä.',
      en: 'Your site works in the languages you choose as well as Finnish, and visitors switch language with a single tap. One additional language means two languages in total.',
    },
    when: {
      fi: 'Kun asiakkaisiisi kuuluu myös matkailijoita, kansainvälisiä yrityksiä tai ruotsinkielisiä.',
      en: 'When your customers include tourists, international companies or Swedish speakers.',
    },
    note: {
      fi: 'Hinta on kielikohtainen ja kattaa kieliversion toteutuksen sivustolle. Käännösten laajuus sovitaan tarjouksessa; ulkopuolinen käännöstarkastus ja myöhemmin lisättävän sisällön kääntäminen eivät sisälly hintaan.',
      en: 'The price is per language and covers building the language version. The scope of translation is agreed in the quote; external translation review and translating content added later are not included.',
    },
  },
]

export function getAddon(id: AddonKey): Addon {
  const addon = addons.find((a) => a.id === id)
  if (!addon) throw new Error(`Unknown add-on: ${id}`)
  return addon
}

/* ------------------------------------------------------------------ */
/* Comparison                                                          */
/* ------------------------------------------------------------------ */

/** true = included, false = not included, text = included in this form, addon = optional at this price. */
export type CompareCell = boolean | Localized | { addon: AddonKey }

export interface CompareRow {
  label: Localized
  note?: Localized
  cells: Record<TierId, CompareCell>
}

export interface CompareGroup {
  title: Localized
  rows: CompareRow[]
}

const every: Record<TierId, CompareCell> = { hermes: true, apollo: true, zeus: true }
const apolloUp = (cell: CompareCell, hermes: CompareCell = false): Record<TierId, CompareCell> => ({
  hermes,
  apollo: cell,
  zeus: cell,
})

const asNeeded: Localized = { fi: 'Tarpeen mukaan', en: 'Where relevant' }

export const comparison: CompareGroup[] = [
  {
    title: { fi: 'Rakenne ja sisältö', en: 'Structure and content' },
    rows: [
      {
        label: { fi: 'Sivusto', en: 'Website' },
        cells: apolloUp({ fi: 'Monisivuinen', en: 'Multi-page' }, { fi: 'Yksi sivu', en: 'One page' }),
      },
      { label: { fi: 'Yritysesittely ja yhteystiedot', en: 'Business introduction and contact details' }, cells: every },
      {
        label: { fi: 'Palvelut tai tuotteet', en: 'Services or products' },
        cells: apolloUp({ fi: 'Omat palvelusivut', en: 'Dedicated pages' }, { fi: 'Pääpalvelut', en: 'Main services' }),
      },
      { label: { fi: 'Referenssi- tai kuvagalleria', en: 'Portfolio or reference gallery' }, cells: apolloUp(asNeeded) },
      {
        label: { fi: 'Google Maps -kartta', en: 'Google Maps' },
        note: { fi: 'Kun yritykselläsi on julkinen asiakaspiste.', en: 'When your business has a public customer location.' },
        cells: apolloUp(true),
      },
    ],
  },
  {
    title: { fi: 'Suunnittelu', en: 'Design' },
    rows: [
      { label: { fi: 'Yksilöllinen, ammattimainen ulkoasu', en: 'Custom, professional design' }, cells: every },
      { label: { fi: 'Responsiivinen kaikilla laitteilla', en: 'Responsive on every device' }, cells: every },
      { label: { fi: 'Yrityskohtainen luova konsepti', en: 'Creative direction for your business' }, cells: apolloUp(true) },
      { label: { fi: 'Logo- ja vuorovaikutusanimaatiot', en: 'Logo and interaction animations' }, cells: apolloUp(asNeeded) },
    ],
  },
  {
    title: { fi: 'Conversion First ja yhteydenotot', en: 'Conversion First and enquiries' },
    rows: [
      { label: { fi: 'Conversion First -suunnittelu', en: 'Conversion First planning' }, cells: every },
      {
        label: { fi: 'Strategia ja asiakaspolku', en: 'Strategy and customer journey' },
        cells: apolloUp({ fi: 'Koko sivustolle', en: 'Across the site' }, { fi: 'Yhdellä sivulla', en: 'On one page' }),
      },
      {
        label: { fi: 'Yhteydenottolomake', en: 'Contact form' },
        note: {
          fi: 'Hermes: nimi, sähköposti, puhelin (valinnainen) ja viesti. Apollo: kentät yrityksesi palveluiden mukaan.',
          en: 'Hermes: name, email, phone (optional) and message. Apollo: fields shaped around your services.',
        },
        cells: apolloUp({ fi: 'Räätälöity yrityksellesi', en: 'Tailored to your business' }, { fi: 'Selkeä peruslomake', en: 'Simple standard form' }),
      },
    ],
  },
  {
    title: { fi: 'Löydettävyys ja tekniikka', en: 'Visibility and performance' },
    rows: [
      {
        label: { fi: 'Hakukoneoptimointi', en: 'Search engine optimisation' },
        cells: apolloUp({ fi: 'Koko sivustolle', en: 'Across the site' }, { fi: 'Perusteet kunnossa', en: 'Fundamentals' }),
      },
      {
        label: { fi: 'Nopeus ja suorituskyky', en: 'Speed and performance' },
        cells: apolloUp({ fi: 'Optimoitu koko sivustolle', en: 'Optimised across the site' }, { fi: 'Perusteet kunnossa', en: 'Fundamentals' }),
      },
      { label: { fi: 'Saavutettavuuden perusteet', en: 'Accessibility fundamentals' }, cells: every },
    ],
  },
  {
    title: { fi: 'Zeus-lisäosat – valitse tarvitsemasi', en: 'Zeus add-ons – pick what you need' },
    rows: addons.map((addon) => ({
      label: addon.name,
      cells: { hermes: false, apollo: false, zeus: { addon: addon.id } },
    })),
  },
]
