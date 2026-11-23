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
    fi: 'Myyntiin suunnitellut verkkosivut yrityksille – Joensuusta, paikallisesti ja etänä.',
    en: 'Websites designed to sell, for businesses – from Joensuu, locally and remotely.',
  },
  footerServices: { fi: 'Palvelut', en: 'Services' },
  footerCompany: { fi: 'Yritys', en: 'Company' },
  footerContact: { fi: 'Yhteystiedot', en: 'Contact' },
  rights: { fi: 'Kaikki oikeudet pidätetään.', en: 'All rights reserved.' },
  ctaTitle: { fi: 'Aloitetaan yrityksesi uusista verkkosivuista.', en: 'Let’s start on your new website.' },
  ctaText: {
    fi: 'Kerro lyhyesti yrityksestäsi ja tavoitteistasi. Saat maksuttoman tarjouksen ja suosituksen sopivimmasta paketista – vastaamme yleensä 24 tunnin kuluessa arkipäivisin.',
    en: 'Tell us briefly about your business and goals. You’ll get a free quote and a recommendation for the package that fits – we usually reply within 24 hours on business days.',
  },
  perMonth: { fi: '/kk', en: '/month' },
  perYear: { fi: '/v', en: '/year' },
} satisfies Record<string, Localized>
