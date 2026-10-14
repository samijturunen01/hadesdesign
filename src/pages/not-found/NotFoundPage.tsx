import { usePageSeo } from '../../seo/usePageSeo'

export default function NotFoundPage() {
  usePageSeo('notFound')
  return <h1>404</h1>
}
