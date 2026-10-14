/**
 * Structured data (schema.org JSON-LD). Only verified facts are used: no
 * street address, opening hours, ratings or business ID, because the owner
 * has not published them.
 */
import { absoluteUrl } from '../config/site'
import { LOCALE_META, type Locale } from '../i18n/locale'
import { business } from '../data/business'
import { maintenancePlan, packages, type WebsitePackage } from '../data/packages'
import { getService } from '../data/services'
import { PATHS, type PageId, type ServicePageId } from '../routes'
import { SITE_NAME } from './seo'

const ORG_ID = absoluteUrl('/#organization')
const SITE_ID = absoluteUrl('/#website')

export function organizationNode(locale: Locale) {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    logo: absoluteUrl('brand/hades-design-mark.png'),
    image: absoluteUrl(`og/hades-design-${locale}.png`),
    email: business.email,
    telephone: business.phone.display.replace(/\s/g, ''),
    founder: { '@type': 'Person', name: business.founder.name, jobTitle: business.founder.role[locale] },
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.location.city,
      addressCountry: business.location.countryCode,
    },
    areaServed: { '@type': 'Country', name: business.location.country[locale] },
    priceRange: '790–1990 €',
  }
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: absoluteUrl('/'),
    name: SITE_NAME,
    publisher: { '@id': ORG_ID },
    inLanguage: ['fi', 'en'],
  }
}

export interface Crumb {
  name: string
  id: PageId
}

/** One @graph per page: organization, website, the page itself and optional extras. */
export function pageGraph(opts: {
  locale: Locale
  id: PageId
  name: string
  description: string
  crumbs?: Crumb[]
  extra?: object[]
}) {
  const url = absoluteUrl(PATHS[opts.id][opts.locale])
  const nodes: object[] = [
    organizationNode(opts.locale),
    websiteNode(),
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: opts.name,
      description: opts.description,
      inLanguage: LOCALE_META[opts.locale].htmlLang,
      isPartOf: { '@id': SITE_ID },
      about: { '@id': ORG_ID },
      ...(opts.crumbs?.length ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    },
  ]
  if (opts.crumbs?.length) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: opts.crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absoluteUrl(PATHS[c.id][opts.locale]),
      })),
    })
  }
  nodes.push(...(opts.extra ?? []))
  return [{ '@context': 'https://schema.org', '@graph': nodes }]
}

const euro = (price: number, vatIncluded: boolean | null, unit?: 'MON' | 'ANN') => ({
  '@type': 'UnitPriceSpecification',
  price,
  priceCurrency: 'EUR',
  ...(vatIncluded === null ? {} : { valueAddedTaxIncluded: vatIncluded }),
  ...(unit ? { unitCode: unit } : {}),
})

function packageOffer(p: WebsitePackage, locale: Locale) {
  return {
    '@type': 'Offer',
    name: p.name[locale],
    description: `${p.description[locale]} ${p.pages[locale]}.`,
    price: p.price,
    priceCurrency: 'EUR',
    priceSpecification: euro(p.price, true),
    seller: { '@id': ORG_ID },
    url: absoluteUrl(PATHS.pricing[locale]),
  }
}

function maintenanceOffer(locale: Locale) {
  return {
    '@type': 'Offer',
    name: maintenancePlan.name[locale],
    description: maintenancePlan.tagline[locale],
    price: maintenancePlan.monthly,
    priceCurrency: 'EUR',
    priceSpecification: [euro(maintenancePlan.monthly, null, 'MON'), euro(maintenancePlan.yearly, null, 'ANN')],
    seller: { '@id': ORG_ID },
    url: absoluteUrl(PATHS.maintenance[locale]),
  }
}

/** Offers for the website packages (VAT included) and the maintenance plan (VAT not stated). */
export function offerNodes(locale: Locale) {
  return [...packages.map((p) => packageOffer(p, locale)), maintenanceOffer(locale)]
}

const SERVICE_OFFERS: Record<ServicePageId, (locale: Locale) => object[]> = {
  websites: (l) => packages.filter((p) => p.id !== 'store').map((p) => packageOffer(p, l)),
  ecommerce: (l) => packages.filter((p) => p.id === 'store').map((p) => packageOffer(p, l)),
  redesign: () => [],
  maintenance: (l) => [maintenanceOffer(l)],
}

/** A Service node for a service detail page. */
export function serviceNode(id: ServicePageId, locale: Locale) {
  const service = getService(id)
  const url = absoluteUrl(PATHS[id][locale])
  const offers = SERVICE_OFFERS[id](locale)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title[locale],
    serviceType: service.title[locale],
    description: service.description[locale],
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: business.location.country[locale] },
    url,
    ...(offers.length ? { offers } : {}),
  }
}
