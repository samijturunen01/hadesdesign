import type { PageProps } from '../registry'
import { usePageSeo } from '../../seo/usePageSeo'

export default function AboutPage({ id }: PageProps) {
  usePageSeo(id)
  return <h1>{id}</h1>
}
