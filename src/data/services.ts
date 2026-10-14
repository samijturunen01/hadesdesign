/** The four services (verified copy from the previous site, edited for clarity). */
import type { Localized } from '../i18n/locale'
import type { ServicePageId } from '../routes'

export interface Service {
  id: ServicePageId
  /** Short name for navigation, cards and breadcrumbs. */
  name: Localized
  /** Full service name (detail page heading, structured data). */
  title: Localized
  /** One sentence for cards. */
  summary: Localized
  /** The service description. */
  description: Localized
  /** What the service covers. */
  benefits: Localized<string[]>
  /** Verified price hint, or null when the price is quoted per project. */
  price: Localized | null
}

export const services: Service[] = [
  {
    id: 'websites',
    name: { fi: 'Verkkosivut', en: 'Websites' },
    title: { fi: 'Verkkosivujen suunnittelu ja kehitys', en: 'Website design and development' },
    summary: {
      fi: 'Yrityksesi näköiset verkkosivut, jotka suunnitellaan ja rakennetaan yksilöllisesti – ei valmiista massapohjista.',
      en: 'Websites designed and built individually for your business – never from mass-produced templates.',
    },
    description: {
      fi: 'Suunnittelemme verkkosivut yrityksesi tarpeiden ja brändin mukaan. Jokainen sivusto rakennetaan yksilöllisesti, ei valmiista massapohjista.',
      en: 'We design websites around your business needs and your brand. Every site is built individually, never from mass-produced templates.',
    },
    benefits: {
      fi: [
        'Responsiiviset – toimivat tietokoneella, tabletilla ja puhelimella',
        'Nopeat ja teknisesti toimivat',
        'Selkeät ja helppokäyttöiset',
        'Visuaalisesti modernit ja ammattimaiset',
      ],
      en: [
        'Responsive – they work on desktop, tablet and phone',
        'Fast and technically sound',
        'Clear and easy to use',
        'Visually modern and professional',
      ],
    },
    price: { fi: 'alk. 790 €', en: 'from €790' },
  },
  {
    id: 'ecommerce',
    name: { fi: 'Verkkokaupat', en: 'Online stores' },
    title: { fi: 'Verkkokaupat', en: 'Online stores' },
    summary: {
      fi: 'Turvalliset ja skaalautuvat verkkokaupat, joissa kassa toimii sujuvasti myös mobiilissa.',
      en: 'Secure, scalable online stores with a checkout that works smoothly on mobile too.',
    },
    description: {
      fi: 'Tehokkaat verkkokaupparatkaisut, jotka lisäävät myyntiä. Rakennamme turvallisia ja skaalautuvia verkkokauppoja, joissa on saumaton kassakokemus ja varastonhallinta.',
      en: 'Effective e-commerce solutions that drive sales. We build secure, scalable online stores with a seamless checkout and inventory management.',
    },
    benefits: {
      fi: [
        'Tuoteluettelon hallinta',
        'Turvallinen maksuintegraatio',
        'Ostoskoritoiminnallisuus',
        'Tilaustenhallintajärjestelmä',
        'Mobiilioptimoitu kassa',
      ],
      en: [
        'Product catalogue management',
        'Secure payment integration',
        'Shopping cart functionality',
        'Order management system',
        'Mobile-optimised checkout',
      ],
    },
    price: { fi: 'alk. 1 990 €', en: 'from €1,990' },
  },
  {
    id: 'redesign',
    name: { fi: 'Uudistus', en: 'Redesign' },
    title: { fi: 'Verkkosivujen uudistus', en: 'Website redesign' },
    summary: {
      fi: 'Uutta elämää nykyiselle sivustolle – menettämättä jo saavutettua hakukonenäkyvyyttä.',
      en: 'New life for your current website – without losing the search visibility you have earned.',
    },
    description: {
      fi: 'Puhalla uutta elämää olemassa olevaan sivustoosi. Modernisoimme vanhentuneen ulkoasun, parannamme käyttökokemusta ja tehostamme suorituskykyä menettämättä saavutettua hakukonenäkyvyyttä.',
      en: 'Breathe new life into your existing website. We modernise an outdated design, improve the user experience and boost performance without losing the search visibility you have already earned.',
    },
    benefits: {
      fi: [
        'Moderni käyttöliittymä ja käyttökokemus (UI/UX)',
        'Suorituskyvyn optimointi',
        'Hakukonenäkyvyyden säilyttäminen',
        'Sisällön siirto',
        'Paremmat konversiot',
      ],
      en: ['Modern UI/UX design', 'Performance optimisation', 'SEO preservation', 'Content migration', 'Improved conversions'],
    },
    price: null,
  },
  {
    id: 'maintenance',
    name: { fi: 'Ylläpito ja hosting', en: 'Maintenance & hosting' },
    title: { fi: 'Jatkuva ylläpito, tuki ja hosting', en: 'Ongoing maintenance, support and hosting' },
    summary: {
      fi: 'Päivitykset, tietoturva, varmuuskopiot ja hosting – me hoidamme tekniikan, sinä keskityt liiketoimintaan.',
      en: 'Updates, security, backups and hosting – we handle the technology, you focus on your business.',
    },
    description: {
      fi: 'Kaikki verkkosivupaketit sisältävät 60 päivän tuen julkaisun jälkeen bugikorjauksiin ja teknisiin ongelmiin. Jatkuva ylläpito ja hosting ovat saatavilla kuukausi- tai vuosisopimuksella.',
      en: 'Every website package includes 60 days of post-launch support for bug fixes and technical issues. Ongoing maintenance and hosting are available on a monthly or yearly plan.',
    },
    benefits: {
      fi: [
        'Säännölliset ohjelmistopäivitykset',
        'Tietoturvavalvonta',
        'Sisältöpäivitykset',
        'Suorituskyvyn optimointi',
        'Neuvontaa ja apua sivuston käyttöön',
        'Hosting sisältyy',
      ],
      en: [
        'Regular software updates',
        'Security monitoring',
        'Content updates',
        'Performance optimisation',
        'Advice and help with using your site',
        'Hosting included',
      ],
    },
    price: { fi: '40 €/kk', en: '€40/month' },
  },
]

export function getService(id: ServicePageId): Service {
  const service = services.find((s) => s.id === id)
  if (!service) throw new Error(`Unknown service: ${id}`)
  return service
}
