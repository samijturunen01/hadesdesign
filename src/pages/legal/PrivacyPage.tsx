import type { PageProps } from '../registry'
import { usePageSeo } from '../../seo/usePageSeo'

export default function PrivacyPage({ id }: PageProps) {
  usePageSeo(id)
  return <h1>{id}</h1>
}
