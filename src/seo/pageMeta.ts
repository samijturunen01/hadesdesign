/** Page titles and meta descriptions (≈ 50–160 characters, verified facts only). */
import { PRICES, STARTING_PRICE, ZEUS_FULL_PRICE } from '../data/pricing'
import { formatEuro, type Localized } from '../i18n/locale'
import type { PageId } from '../routes'

const eur = (amount: number) => ({ fi: formatEuro(amount, 'fi'), en: formatEuro(amount, 'en') })
const from = eur(STARTING_PRICE)
const hermes = eur(PRICES.hermes)
const apollo = eur(PRICES.apollo)
const zeus = eur(ZEUS_FULL_PRICE)

export interface PageMeta {
  /** Title without the site name; the home page uses fullTitle. */
  title?: string
  fullTitle?: string
  description: string
}

export const pageMeta: Record<PageId | 'notFound', Localized<PageMeta>> = {
  home: {
    fi: {
      fullTitle: 'Verkkosivut yritykselle – Hades Design, Joensuu',
      description:
        `Näyttävät ja myyntiin suunnitellut verkkosivut yrityksille alk. ${from.fi}. Yksilöllinen suunnittelu Conversion First -periaatteella – Joensuusta, paikallisesti ja etänä.`,
    },
    en: {
      fullTitle: 'Websites for businesses – Hades Design, Joensuu',
      description:
        `Striking websites for businesses, designed to sell, from ${from.en}. Individual design on the Conversion First principle – from Joensuu, Finland, locally and remotely.`,
    },
  },
  services: {
    fi: {
      title: 'Palvelut – verkkosivut ja ylläpito yrityksille',
      description:
        'Suunnittelemme ja toteutamme yrityksille myyntiin keskittyviä verkkosivuja ja huolehdimme halutessasi niiden ylläpidosta ja hostingista.',
    },
    en: {
      title: 'Services – websites and maintenance for businesses',
      description:
        'We design and build websites for businesses that are focused on winning customers, and take care of maintenance and hosting if you wish.',
    },
  },
  websites: {
    fi: {
      title: 'Verkkosivujen suunnittelu yritykselle',
      description:
        `Yksilöllisesti suunnitellut, nopeat ja myyntiin keskittyvät kotisivut yrityksellesi. Hermes ${hermes.fi}, Apollo ${apollo.fi} ja Zeus lisäominaisuuksilla (sis. ALV).`,
    },
    en: {
      title: 'Website design for businesses',
      description:
        `Individually designed, fast websites for your business, focused on winning customers. Hermes ${hermes.en}, Apollo ${apollo.en} and Zeus with add-ons (VAT incl.).`,
    },
  },
  maintenance: {
    fi: {
      title: 'Verkkosivujen ylläpito ja hosting',
      description:
        'Ylläpito & hosting 40 €/kk tai 360 €/vuosi: päivitykset, tietoturvavalvonta, päivittäiset varmuuskopiot, sisältöpäivitykset ja prioriteettituki.',
    },
    en: {
      title: 'Website maintenance and hosting',
      description:
        'Maintenance & hosting for €40/month or €360/year: updates, security monitoring, daily backups, content updates and priority support.',
    },
  },
  work: {
    fi: {
      title: 'Referenssit – toteutetut verkkosivut',
      description:
        'Hades Designin toteuttamia verkkosivustoja: Pielisen Lumon matkailu- ja kulttuurisivusto, lyhytvideopalvelu Okkuva ja joensuulainen Kuljetus Jumppanen Oy.',
    },
    en: {
      title: 'Our work – websites we have built',
      description:
        'Websites built by Hades Design: Pielisen Lumo (tourism & culture), Okkuva (short-form video) and Kuljetus Jumppanen Oy (freight transport, Joensuu).',
    },
  },
  pricing: {
    fi: {
      title: `Hinnasto – verkkosivut yritykselle alk. ${from.fi}`,
      description:
        `Hermes ${hermes.fi} (yksisivuinen), Apollo ${apollo.fi} (monisivuinen) ja Zeus ${zeus.fi} kaikilla lisäominaisuuksilla. Vertaa paketteja ja laske hinta. Hinnat sis. ALV.`,
    },
    en: {
      title: `Pricing – business websites from ${from.en}`,
      description:
        `Hermes ${hermes.en} (one page), Apollo ${apollo.en} (multi-page) and Zeus ${zeus.en} with every add-on. Compare the packages and work out your price. VAT incl.`,
    },
  },
  about: {
    fi: {
      title: 'Meistä',
      description:
        'Hades Design on joensuulainen verkkosivujen suunnittelija ja toteuttaja. Teemme näyttäviä, nopeita ja asiakashankintaa tukevia verkkosivuja yrityksille.',
    },
    en: {
      title: 'About us',
      description:
        'Hades Design is a web design studio from Joensuu, Finland. We build striking, fast websites that help businesses win customers.',
    },
  },
  contact: {
    fi: {
      title: 'Ota yhteyttä – pyydä tarjous verkkosivuista',
      description:
        'Kerro projektistasi ja pyydä maksuton tarjous. Vastaamme yleensä 24 tunnin kuluessa arkipäivisin. Puh. +358 45 108 8807.',
    },
    en: {
      title: 'Contact – request a quote for your website',
      description:
        'Tell us about your project and request a free quote. We usually reply within 24 hours on business days. Tel. +358 45 108 8807.',
    },
  },
  privacy: {
    fi: {
      title: 'Tietosuojaseloste',
      description:
        'Miten Hades Design kerää, käyttää ja suojaa henkilötietojasi, kun käytät verkkosivustoamme, yhteydenottolomaketta tai palveluitamme.',
    },
    en: {
      title: 'Privacy policy',
      description:
        'How Hades Design collects, uses and protects your personal data when you use our website, contact form or services.',
    },
  },
  terms: {
    fi: {
      title: 'Käyttöehdot',
      description:
        'Hades Designin palveluiden ehdot: palvelut, asiakkaan vastuut, maksuehdot, immateriaalioikeudet, aikataulut, tuki ja vastuunrajoitus.',
    },
    en: {
      title: 'Terms of service',
      description:
        'The terms for Hades Design services: services, client responsibilities, payment, intellectual property, timelines, support and liability.',
    },
  },
  notFound: {
    fi: { title: 'Sivua ei löytynyt', description: 'Etsimääsi sivua ei löytynyt. Palaa etusivulle tai tutustu verkkosivupaketteihimme.' },
    en: { title: 'Page not found', description: 'The page you were looking for could not be found. Return to the home page or explore our website packages.' },
  },
}
