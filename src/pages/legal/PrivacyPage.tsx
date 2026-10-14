import { useT } from '../../i18n/locale'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'
import { LegalDocumentView } from './LegalDocumentView'
import { privacyPolicy } from './legalContent'

export default function PrivacyPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()
  return <LegalDocumentView id={id} doc={t(privacyPolicy)} />
}
