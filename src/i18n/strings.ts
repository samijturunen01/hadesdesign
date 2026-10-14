/** Short interface strings shared by several components. */
import type { Localized } from './locale'

export const ui = {
  skip: { fi: 'Siirry sisältöön', en: 'Skip to content' },
  menu: { fi: 'Valikko', en: 'Menu' },
  openMenu: { fi: 'Avaa valikko', en: 'Open menu' },
  closeMenu: { fi: 'Sulje valikko', en: 'Close menu' },
  mainNav: { fi: 'Päävalikko', en: 'Main navigation' },
  breadcrumbs: { fi: 'Murupolku', en: 'Breadcrumbs' },
  allServices: { fi: 'Kaikki palvelut', en: 'All services' },
  switchLanguage: { fi: 'In English', en: 'Suomeksi' },
  homeLink: { fi: 'Hades Design – etusivulle', en: 'Hades Design – home' },
  readMore: { fi: 'Lue lisää', en: 'Read more' },
  seePricing: { fi: 'Katso hinnasto', en: 'See pricing' },
  seeWork: { fi: 'Katso referenssit', en: 'See our work' },
  contactUs: { fi: 'Ota yhteyttä', en: 'Contact us' },
  quotePrompt: { fi: 'Pyydä maksuton tarjous', en: 'Request a free quote' },
  priceOnRequest: { fi: 'Hinta tarjouksen mukaan', en: 'Priced per project' },
  visitSite: { fi: 'Avaa sivusto', en: 'Visit the site' },
  opensInNewTab: { fi: '(avautuu uuteen välilehteen)', en: '(opens in a new tab)' },
  footerTagline: {
    fi: 'Verkkosivut, verkkokaupat ja ylläpito yrityksille – Joensuusta, paikallisesti ja etänä.',
    en: 'Websites, online stores and maintenance for businesses – from Joensuu, locally and remotely.',
  },
  footerServices: { fi: 'Palvelut', en: 'Services' },
  footerCompany: { fi: 'Yritys', en: 'Company' },
  footerContact: { fi: 'Yhteystiedot', en: 'Contact' },
  rights: { fi: 'Kaikki oikeudet pidätetään.', en: 'All rights reserved.' },
  ctaTitle: { fi: 'Rakennetaan jotain, joka jää mieleen.', en: 'Let’s build something people remember.' },
  ctaText: {
    fi: 'Kerro lyhyesti yrityksestäsi ja tarpeistasi – saat maksuttoman tarjouksen ja selkeän suunnitelman.',
    en: 'Tell us briefly about your business and what you need – you will get a free quote and a clear plan.',
  },
  perMonth: { fi: '/kk', en: '/month' },
  perYear: { fi: '/v', en: '/year' },
} satisfies Record<string, Localized>
