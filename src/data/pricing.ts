/**
 * Website packages Hermes, Apollo and Zeus, and the Zeus add-ons.
 *
 * The single source of truth for package prices: the pricing page and its Zeus
 * calculator, the home page, the websites service page, the contact form, page
 * meta and structured data all read from here. Prices set by the owner on
 * 2026-11-23. They are shown VAT excluded (+ ALV, owner's decision 2026-11-23)
 * – see src/data/packages.ts → vatNote/vatShort.
 *
 * Positioning (owner's brief, 2026-11-23): every package gets the same premium
 * design, Conversion First planning and craftsmanship. Hermes and Apollo differ
 * in two things only – one page vs. several pages, and a simple vs. a
 * business-specific contact form. Zeus is Apollo plus optional add-ons. Never
 * describe Hermes as basic or lower quality.
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
export const ADDON_KEYS: readonly AddonKey[] = [...ADDON_IDS, 'languages']

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

/** A headline fact on a package card. `shared` = the same in Hermes and Apollo. */
export interface TierSpec {
  key: 'form' | 'conversion' | 'design'
  label: Localized
  shared: boolean
}

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
  /** Headline facts under the price (Zeus shows its add-ons there instead). */
  specs: TierSpec[]
  /** Lead-in above the feature list. */
  includesLead: Localized
  features: Localized<string[]>
  recommended: boolean
}

const conversionSpec: TierSpec = {
  key: 'conversion',
  label: { fi: 'Conversion First -suunnittelu', en: 'Conversion First planning' },
  shared: true,
}
const designSpec: TierSpec = { key: 'design', label: { fi: 'Premium-ulkoasu', en: 'Premium design' }, shared: true }

export const tiers: Tier[] = [
  {
    id: 'hermes',
    name: 'Hermes',
    kind: { fi: 'Yksisivuinen verkkosivusto', en: 'One-page website' },
    myth: { fi: 'Jumalten sanansaattaja – selkeä viesti perille', en: 'Messenger of the gods – a clear message delivered' },
    description: {
      fi: 'Kaikki olennainen yhdellä sivulla. Näyttävä ja myyntiin suunniteltu verkkosivusto, joka tekee yritykseesi tutustumisesta ja yhteydenotosta helppoa.',
      en: 'Everything that matters on one page. A striking website designed to sell, making it easy to get to know your business and get in touch.',
    },
    idealFor: {
      fi: 'Kun palvelusi ja tarinasi mahtuvat selkeästi yhdelle sivulle – esimerkiksi uudelle yritykselle tai yhteen palveluun keskittyvälle toimijalle.',
      en: 'When your services and story fit clearly on one page – for a new business or one focused on a single service, for example.',
    },
    specs: [
      { key: 'form', label: { fi: 'Yksinkertainen yhteydenottolomake', en: 'Simple contact form' }, shared: false },
      conversionSpec,
      designSpec,
    ],
    includesLead: { fi: 'Kaikki olennainen yhdellä sivulla:', en: 'Everything that matters, on one page:' },
    features: {
      fi: [
        'Yksilöllinen ulkoasu yrityksesi brändin mukaan',
        'Asiakaspolku ja toimintakehotteet, jotka ohjaavat yhteydenottoon',
        'Yrityskohtaiset animaatiot, kun ne tukevat viestiä',
        'Responsiivinen: tietokone, tabletti ja puhelin',
        'Yritysesittely, palvelut tai tuotteet, kuvat ja referenssit',
        'Hakukoneoptimointi, nopeus ja saavutettavuus',
        'Yhteystiedot ja Google Maps -kartta, kun sinulla on asiakaspiste',
      ],
      en: [
        'A custom design built around your brand',
        'A customer journey and calls to action that lead to enquiries',
        'Custom animations where they support the message',
        'Responsive on desktop, tablet and phone',
        'Business introduction, services or products, photos and references',
        'Search engine optimisation, speed and accessibility',
        'Contact details and Google Maps when you have a customer location',
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
      fi: 'Kun yritykselläsi on enemmän kerrottavaa. Näyttävä monisivuinen verkkosivusto, jossa jokainen palvelu saa ansaitsemansa huomion ja asiakkaan on helppo ottaa yhteyttä.',
      en: 'For when your business has more to say. A striking multi-page website where every service gets the attention it deserves and customers find it easy to get in touch.',
    },
    idealFor: {
      fi: 'Useimmille yrityksille: kun palveluita on useampi tai haluat kertoa yrityksestäsi, töistäsi ja osaamisestasi laajemmin.',
      en: 'Most businesses: when you offer several services or want to say more about your company, work and expertise.',
    },
    specs: [
      { key: 'form', label: { fi: 'Monipuolinen yhteydenottolomake', en: 'Advanced contact form' }, shared: false },
      conversionSpec,
      designSpec,
    ],
    includesLead: { fi: 'Kaikki, mitä Hermes sisältää, ja lisäksi:', en: 'Everything in Hermes, plus:' },
    features: {
      fi: [
        'Omat sivut palveluille, yritykselle ja yhteydenotolle',
        'Yhteydenottolomake, joka kysyy juuri sinun palveluillesi oikeat asiat',
        'Laajempi sisältö ja kattavampi palveluiden esittely',
        'Referenssi- tai projektisivu tarpeen mukaan',
        'Asiakaspolku suunniteltuna koko sivuston läpi',
        'Sivukohtaiset hakusanat ja metatiedot',
      ],
      en: [
        'Dedicated pages for your services, company and contact',
        'A contact form that asks the right questions for your services',
        'More content and a fuller presentation of your services',
        'A references or projects page where relevant',
        'A customer journey planned across the whole site',
        'Page-specific keywords and metadata',
      ],
    },
    recommended: true,
  },
  {
    id: 'zeus',
    name: 'Zeus',
    kind: { fi: 'Apollo + valinnaiset lisäominaisuudet', en: 'Apollo + optional add-ons' },
    myth: { fi: 'Jumalten kuningas – voima ja hallinta', en: 'King of the gods – power and control' },
    description: {
      fi: 'Enemmän kuin verkkosivut. Laajenna Apolloa yrityksesi tarvitsemilla toiminnoilla, kuten ajanvarauksella, verkkomaksuilla, analytiikalla ja kieliversioilla.',
      en: 'More than a website. Extend Apollo with the features your business needs, such as online booking, payments, analytics and language versions.',
    },
    idealFor: {
      fi: 'Kun asiakkaidesi pitää voida varata aika, maksaa verkossa tai asioida useammalla kielellä.',
      en: 'When customers need to book, pay online or use your site in more than one language.',
    },
    specs: [],
    includesLead: { fi: 'Kaikki, mitä Apollo sisältää:', en: 'Everything in Apollo:' },
    features: {
      fi: [
        'Monisivuinen verkkosivusto',
        'Monipuolinen, yrityskohtainen yhteydenottolomake',
        'Conversion First -suunnittelu ja premium-ulkoasu',
        'Lisäominaisuudet osana sivuston ilmettä ja asiakaspolkua',
      ],
      en: [
        'A multi-page website',
        'An advanced contact form tailored to your business',
        'Conversion First planning and premium design',
        'Add-ons built into the look and customer journey of your site',
      ],
    },
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
  /** Short name for chips (contact form). */
  short: Localized
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
    short: { fi: 'Ajanvaraus', en: 'Online booking' },
    summary: {
      fi: 'Asiakkaat varaavat ajan verkossa, sinä hallitset varauksia yhdestä paikasta.',
      en: 'Customers book online; you manage bookings in one place.',
    },
    what: {
      fi: 'Asiakkaasi näkevät vapaat ajat ja varaavat ajan suoraan sivustoltasi – myös iltaisin ja viikonloppuisin. Hallintapaneelista hallitset vapaita aikoja, varauksia ja varausasetuksia. Ajanvaraus ja hallintapaneeli ovat yksi kokonaisuus.',
      en: 'Customers see available times and book straight from your website – evenings and weekends included. In the admin dashboard you manage availability, appointments and booking settings. The booking system and the dashboard come as one.',
    },
    when: {
      fi: 'Kun asiakkaasi varaavat aikoja – esimerkiksi hoito-, valmennus-, konsultointi- tai vuokrauspalveluissa.',
      en: 'When your customers book appointments – for treatments, coaching, consulting or rentals, for example.',
    },
    note: {
      fi: 'Ajanvaraus perustuu Hades Designin valmiiksi kehittämään varausjärjestelmään, joka sovitetaan yrityksesi tarpeisiin ja ilmeeseen. Laajat erikoistoiminnot ja integraatiot muihin järjestelmiin arvioidaan erikseen tarjouksessa.',
      en: 'The booking system is built on Hades Design’s own proven booking platform, adapted to your business and your look. Extensive special features and integrations with other systems are scoped separately in the quote.',
    },
  },
  {
    id: 'payments',
    price: PRICES.payments,
    name: { fi: 'Verkkomaksut', en: 'Online payments' },
    short: { fi: 'Verkkomaksut', en: 'Online payments' },
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
      fi: 'Maksupalveluntarjoaja perii omat transaktio- ja mahdolliset kuukausimaksunsa, eivätkä ne sisälly hintaan. Verkkomaksut on tarkoitettu palveluiden ja varausten maksamiseen – siihen ei kuulu tuotekatalogia tai ostoskoria.',
      en: 'The payment provider charges its own transaction and any monthly fees, which are not included. Online payments are for paying for services and bookings – they do not include a product catalogue or shopping cart.',
    },
  },
  {
    id: 'analytics',
    price: PRICES.analytics,
    name: { fi: 'Analytiikka', en: 'Analytics' },
    short: { fi: 'Analytiikka', en: 'Analytics' },
    summary: {
      fi: 'Näet, mistä kävijät tulevat ja mitä he sivustollasi tekevät.',
      en: 'See where visitors come from and what they do on your site.',
    },
    what: {
      fi: 'Sovittu analytiikka, esimerkiksi Google Analytics 4, näyttää kävijämäärät, liikenteen lähteet ja keskeiset toiminnot, kuten yhteydenotot.',
      en: 'An agreed analytics setup, such as Google Analytics 4, shows visitor numbers, traffic sources and key actions such as enquiries.',
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
    short: { fi: 'Lisäkielet', en: 'Extra languages' },
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

/**
 * true = included, false = not included, text = included in this form,
 * addon = optional for Zeus at this price (never part of the Apollo base).
 */
export type CompareCell = boolean | Localized | { addon: AddonKey }

export interface CompareRow {
  label: Localized
  note?: Localized
  /** A yes/no property of the package (one page, simple form …): read true/false as "Yes"/"No". */
  yesNo?: boolean
  cells: Record<TierId, CompareCell>
}

export interface CompareGroup {
  title: Localized
  /** One line under the group title. */
  lead?: Localized
  rows: CompareRow[]
}

/** The same output as formatEuro() in src/i18n/locale.ts, which this module cannot import. */
const NO_BREAK_SPACE = String.fromCharCode(0xa0)
const euro = (amount: number): Localized => ({
  fi: new Intl.NumberFormat('fi-FI').format(amount) + NO_BREAK_SPACE + '€',
  en: `€${new Intl.NumberFormat('en-GB').format(amount)}`,
})

const every: Record<TierId, CompareCell> = { hermes: true, apollo: true, zeus: true }
const asNeeded: Localized = { fi: 'Tarpeen mukaan', en: 'Where relevant' }
const everyAsNeeded: Record<TierId, CompareCell> = { hermes: asNeeded, apollo: asNeeded, zeus: asNeeded }
const hermesOnly: Record<TierId, CompareCell> = { hermes: true, apollo: false, zeus: false }
const apolloAndZeus: Record<TierId, CompareCell> = { hermes: false, apollo: true, zeus: true }

export const comparison: CompareGroup[] = [
  {
    title: { fi: 'Sama laatu kaikissa paketeissa', en: 'The same quality in every package' },
    lead: {
      fi: 'Hermes, Apollo ja Zeus suunnitellaan samalla huolellisuudella.',
      en: 'Hermes, Apollo and Zeus are designed with the same care.',
    },
    rows: [
      { label: { fi: 'Conversion First -suunnittelu', en: 'Conversion First planning' }, cells: every },
      { label: { fi: 'Yksilöllinen premium-ulkoasu', en: 'Custom premium design' }, cells: every },
      { label: { fi: 'Responsiivinen kaikilla laitteilla', en: 'Responsive on every device' }, cells: every },
      {
        label: { fi: 'Animaatiot', en: 'Animations' },
        note: { fi: 'Yrityskohtaiset animaatiot, kun ne tukevat viestiä.', en: 'Custom animations where they support the message.' },
        cells: everyAsNeeded,
      },
      {
        label: { fi: 'Hakukoneoptimointi', en: 'Search engine optimisation' },
        note: {
          fi: 'Monisivuisessa sivustossa jokaisella sivulla on omat hakusanat ja metatiedot.',
          en: 'On a multi-page site, every page gets its own keywords and metadata.',
        },
        cells: every,
      },
      { label: { fi: 'Nopeus ja saavutettavuus', en: 'Speed and accessibility' }, cells: every },
      {
        label: { fi: 'Google Maps -kartta', en: 'Google Maps' },
        note: { fi: 'Kun yritykselläsi on julkinen asiakaspiste.', en: 'When your business has a public customer location.' },
        cells: everyAsNeeded,
      },
    ],
  },
  {
    title: { fi: 'Rakenne ja yhteydenottolomake', en: 'Structure and contact form' },
    lead: {
      fi: 'Tässä Hermes ja Apollo eroavat toisistaan.',
      en: 'This is where Hermes and Apollo differ.',
    },
    rows: [
      { label: { fi: 'Yksisivuinen verkkosivusto', en: 'One-page website' }, yesNo: true, cells: hermesOnly },
      {
        label: { fi: 'Monisivuinen verkkosivusto', en: 'Multi-page website' },
        note: { fi: 'Omat sivut palveluille, yritykselle ja yhteydenotolle.', en: 'Dedicated pages for services, company and contact.' },
        yesNo: true,
        cells: apolloAndZeus,
      },
      {
        label: { fi: 'Yksinkertainen yhteydenottolomake', en: 'Simple contact form' },
        note: { fi: 'Nimi, sähköposti, puhelin (valinnainen) ja viesti.', en: 'Name, email, phone (optional) and message.' },
        yesNo: true,
        cells: hermesOnly,
      },
      {
        label: { fi: 'Monipuolinen, yrityskohtainen lomake', en: 'Advanced form tailored to your business' },
        note: {
          fi: 'Kentät palveluidesi mukaan – esimerkiksi palvelu, paikkakunta tai toivottu päivämäärä.',
          en: 'Fields shaped by your services – such as service, location or preferred date.',
        },
        yesNo: true,
        cells: apolloAndZeus,
      },
    ],
  },
  {
    title: { fi: 'Zeus-lisäominaisuudet', en: 'Zeus add-ons' },
    lead: {
      fi: `Valinnaisia – valitset vain tarvitsemasi, ja niiden hinta lisätään Apollon hintaan (${euro(PRICES.apollo).fi}).`,
      en: `Optional – choose only what you need; their price is added to Apollo’s (${euro(PRICES.apollo).en}).`,
    },
    rows: addons.map((addon) => ({
      label: addon.name,
      cells: { hermes: false, apollo: false, zeus: { addon: addon.id } },
    })),
  },
]
