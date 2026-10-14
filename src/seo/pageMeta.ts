/** Page titles and meta descriptions (≈ 50–160 characters, verified facts only). */
import type { Localized } from '../i18n/locale'
import type { PageId } from '../routes'

export interface PageMeta {
  /** Title without the site name; the home page uses fullTitle. */
  title?: string
  fullTitle?: string
  description: string
}

export const pageMeta: Record<PageId | 'notFound', Localized<PageMeta>> = {
  home: {
    fi: {
      fullTitle: 'Hades Design – Verkkosivut ja verkkokaupat yrityksille',
      description:
        'Modernit, nopeat ja hakukoneoptimoidut verkkosivut yrityksille alk. 790 €. Verkkosivut, verkkokaupat ja ylläpito Joensuusta – paikallisesti ja etänä.',
    },
    en: {
      fullTitle: 'Hades Design – Websites and online stores for businesses',
      description:
        'Modern, fast, search-optimised websites for businesses from €790. Websites, online stores and maintenance from Joensuu, Finland – locally and remotely.',
    },
  },
  services: {
    fi: {
      title: 'Palvelut – verkkosivut, verkkokaupat, uudistus ja ylläpito',
      description:
        'Suunnittelemme ja rakennamme yrityksille verkkosivut ja verkkokaupat, uudistamme vanhat sivustot sekä hoidamme ylläpidon ja hostingin.',
    },
    en: {
      title: 'Services – websites, online stores, redesigns and maintenance',
      description:
        'We design and build websites and online stores for businesses, redesign outdated sites and take care of maintenance and hosting.',
    },
  },
  websites: {
    fi: {
      title: 'Verkkosivut yritykselle – suunnittelu ja kehitys',
      description:
        'Yksilöllisesti suunnitellut, responsiiviset ja nopeat verkkosivut yrityksellesi – ei valmiista massapohjista. Verkkosivupaketit alk. 790 € (sis. ALV).',
    },
    en: {
      title: 'Business websites – design and development',
      description:
        'Individually designed, responsive and fast websites for your business – never from mass-produced templates. Website packages from €790 (VAT incl.).',
    },
  },
  ecommerce: {
    fi: {
      title: 'Verkkokauppa yritykselle',
      description:
        'Turvallinen ja skaalautuva verkkokauppa: tuotekuvasto, maksujen käsittely, tilausten seuranta ja mobiilioptimoitu kassa. Verkkokauppapaketti 1 990 € (sis. ALV).',
    },
    en: {
      title: 'Online stores for businesses',
      description:
        'A secure, scalable online store with a product catalogue, payment processing, order tracking and a mobile-optimised checkout. Package €1,990 (VAT incl.).',
    },
  },
  redesign: {
    fi: {
      title: 'Verkkosivujen uudistus',
      description:
        'Uudistamme vanhentuneen sivuston moderniksi, nopeaksi ja helppokäyttöiseksi – menettämättä jo saavutettua hakukonenäkyvyyttä. Pyydä tarjous.',
    },
    en: {
      title: 'Website redesign',
      description:
        'We turn an outdated website into a modern, fast and easy-to-use one – without losing the search visibility you have earned. Ask for a quote.',
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
      title: 'Referenssit',
      description:
        'Hades Designin toteuttamia verkkosivustoja: Pielisen Lumon matkailu- ja kulttuurisivusto, lyhytvideopalvelu Okkuva ja joensuulainen Kuljetus Jumppanen Oy.',
    },
    en: {
      title: 'Our work',
      description:
        'Websites built by Hades Design: Pielisen Lumo (tourism & culture), Okkuva (short-form video) and Kuljetus Jumppanen Oy (freight transport, Joensuu).',
    },
  },
  pricing: {
    fi: {
      title: 'Hinnasto – verkkosivut alk. 790 €',
      description:
        'Selkeät hinnat: Kevyt verkkosivupaketti 790 €, Verkkosivupaketti 990 € ja Verkkokauppapaketti 1 990 € (sis. ALV). Ylläpito & hosting 40 €/kk.',
    },
    en: {
      title: 'Pricing – websites from €790',
      description:
        'Clear prices: Light website package €790, Website package €990 and Online store package €1,990 (VAT incl.). Maintenance & hosting €40/month.',
    },
  },
  about: {
    fi: {
      title: 'Meistä',
      description:
        'Hades Design on joensuulainen verkkosivujen suunnittelija ja rakentaja. Teemme selkeitä, nopeita ja liiketoimintaa tukevia verkkosivuja.',
    },
    en: {
      title: 'About us',
      description:
        'Hades Design is a web design studio from Joensuu, Finland. We build clear, fast websites that support your business.',
    },
  },
  contact: {
    fi: {
      title: 'Ota yhteyttä – pyydä tarjous',
      description:
        'Kerro projektistasi ja pyydä ilmainen konsultointi ja tarjous. Vastaamme yleensä 24 tunnin kuluessa arkipäivisin. Puh. +358 45 108 8807.',
    },
    en: {
      title: 'Contact – request a quote',
      description:
        'Tell us about your project and request a free consultation and quote. We usually reply within 24 hours on business days. Tel. +358 45 108 8807.',
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
    fi: { title: 'Sivua ei löytynyt', description: 'Etsimääsi sivua ei löytynyt. Palaa etusivulle tai tutustu palveluihimme.' },
    en: { title: 'Page not found', description: 'The page you were looking for could not be found. Return to the home page or explore our services.' },
  },
}
