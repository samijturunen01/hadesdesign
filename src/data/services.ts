/**
 * The services Hades Design markets: conversion-focused websites (sold as the
 * Hermes / Apollo / Zeus packages in ./pricing.ts) and maintenance & hosting.
 *
 * Online stores and website redesign stopped being separately marketed services
 * on 2026-11-23 (owner's decision). Their old URLs redirect to the website
 * service (src/routes.ts → LEGACY_REDIRECTS). A business with an old website
 * still gets a new one through the packages – do not phrase anything as if
 * replacing an existing site were not possible.
 */
import { formatEuro, type Localized } from '../i18n/locale'
import { STARTING_PRICE } from './pricing'
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
  /** What the customer gets – benefits first. */
  benefits: Localized<string[]>
  /** Verified price hint, or null when the price is quoted per project. */
  price: Localized | null
}

export const services: Service[] = [
  {
    id: 'websites',
    name: { fi: 'Verkkosivut', en: 'Websites' },
    title: { fi: 'Verkkosivujen suunnittelu ja toteutus', en: 'Website design and development' },
    summary: {
      fi: 'Yksilölliset, nopeat ja myyntiin suunnitellut verkkosivut yrityksellesi – Hermes, Apollo tai Zeus.',
      en: 'Distinctive, fast websites designed to sell – Hermes, Apollo or Zeus.',
    },
    description: {
      fi: 'Suunnittelemme ja toteutamme yrityksellesi verkkosivut, jotka näyttävät hyvältä ja on rakennettu tukemaan asiakashankintaa. Jokainen sivusto tehdään yksilöllisesti Conversion First -periaatteella – asiakkaasi näkökulmasta, ei valmiista massapohjista.',
      en: 'We design and build websites that look good and are built to support how you win customers. Every site is made individually on the Conversion First principle – from your customer’s point of view, never from mass-produced templates.',
    },
    benefits: {
      fi: [
        'Yksilöllinen ulkoasu, joka herättää luottamuksen ensisilmäyksellä',
        'Selkeä viesti: asiakas ymmärtää nopeasti, mitä tarjoat ja miksi valita sinut',
        'Toimintakehotteet ja lomake, jotka tekevät yhteydenotosta vaivatonta',
        'Nopeasti latautuvat sivut tietokoneella, tabletilla ja puhelimella',
        'Hakukoneoptimointi, joka auttaa uusia asiakkaita löytämään sinut',
        'Valmis sivusto on sinun, kun maksu on suoritettu',
      ],
      en: [
        'A distinctive design that earns trust at first glance',
        'A clear message: customers quickly understand what you offer and why to choose you',
        'Calls to action and a form that make getting in touch effortless',
        'Fast-loading pages on desktop, tablet and phone',
        'Search engine optimisation that helps new customers find you',
        'The finished site is yours once payment has been made',
      ],
    },
    price: { fi: `alk. ${formatEuro(STARTING_PRICE, 'fi')}`, en: `from ${formatEuro(STARTING_PRICE, 'en')}` },
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
      fi: 'Julkaisun jälkeinen tekninen tuki ja ylläpito ovat saatavilla erillisinä maksullisina palveluina. Jatkuva ylläpito ja hosting hoituvat kuukausi- tai vuosisopimuksella, joten sivustosi pysyy turvallisena, ajan tasalla ja asiakkaidesi saatavilla.',
      en: 'Post-launch technical support and maintenance are available as separately paid services, with ongoing maintenance and hosting on a monthly or yearly plan – so your site stays secure, up to date and available to your customers.',
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
