import { useLocale } from '../i18n/locale'
import { pageNames, trailTo } from '../data/navigation'
import type { PageId } from '../routes'
import { pageMeta } from './pageMeta'
import { pageGraph } from './schema'
import { useSeo } from './useSeo'

interface Options {
  /** Extra JSON-LD nodes for this page (Service, OfferCatalog, …). */
  extra?: object[]
  /** 1200×630 social image in /public (defaults to the brand image). */
  image?: string
  imageAlt?: string
}

/** Standard SEO for a page: meta from pageMeta, breadcrumbs and a JSON-LD @graph. */
export function usePageSeo(id: PageId | 'notFound', options: Options = {}): void {
  const locale = useLocale()
  const meta = pageMeta[id][locale]

  const jsonLd =
    id === 'notFound'
      ? []
      : pageGraph({
          locale,
          id,
          name: meta.fullTitle ?? meta.title ?? pageNames[id][locale],
          description: meta.description,
          crumbs: trailTo(id).map((crumb) => ({ id: crumb, name: pageNames[crumb][locale] })),
          extra: options.extra,
        })

  useSeo({
    title: meta.title,
    fullTitle: meta.fullTitle,
    description: meta.description,
    image: options.image,
    imageAlt: options.imageAlt,
    noindex: id === 'notFound',
    jsonLd,
  })
}
