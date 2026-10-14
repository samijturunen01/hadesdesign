import type { Localized } from '../i18n/locale'
import type { PageId, ServicePageId } from '../routes'

/** Short page names – navigation, breadcrumbs and link labels. */
export const pageNames: Record<PageId, Localized> = {
  home: { fi: 'Etusivu', en: 'Home' },
  services: { fi: 'Palvelut', en: 'Services' },
  websites: { fi: 'Verkkosivut', en: 'Websites' },
  ecommerce: { fi: 'Verkkokaupat', en: 'Online stores' },
  redesign: { fi: 'Verkkosivujen uudistus', en: 'Website redesign' },
  maintenance: { fi: 'Ylläpito ja hosting', en: 'Maintenance & hosting' },
  work: { fi: 'Referenssit', en: 'Work' },
  pricing: { fi: 'Hinnasto', en: 'Pricing' },
  about: { fi: 'Meistä', en: 'About' },
  contact: { fi: 'Ota yhteyttä', en: 'Contact' },
  privacy: { fi: 'Tietosuojaseloste', en: 'Privacy policy' },
  terms: { fi: 'Käyttöehdot', en: 'Terms of service' },
}

export interface NavItem {
  id: PageId
  children?: ServicePageId[]
}

/** Primary navigation (the contact page is the separate call to action). */
export const primaryNav: NavItem[] = [
  { id: 'services', children: ['websites', 'ecommerce', 'redesign', 'maintenance'] },
  { id: 'work' },
  { id: 'pricing' },
  { id: 'about' },
]

export const ctaLabel: Localized = { fi: 'Pyydä tarjous', en: 'Request a quote' }

/** Parent page for breadcrumbs. */
export const parentOf: Partial<Record<PageId, PageId>> = {
  websites: 'services',
  ecommerce: 'services',
  redesign: 'services',
  maintenance: 'services',
}

/** Breadcrumb trail from the home page to `id` (empty for the home page). */
export function trailTo(id: PageId): PageId[] {
  if (id === 'home') return []
  const parent = parentOf[id]
  return parent ? ['home', parent, id] : ['home', id]
}
