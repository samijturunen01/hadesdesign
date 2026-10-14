import { useT } from '../../i18n/locale'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'
import { LegalDocumentView } from './LegalDocumentView'
import { termsOfService } from './legalContent'

export default function TermsPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()
  return <LegalDocumentView id={id} doc={t(termsOfService)} />
}
