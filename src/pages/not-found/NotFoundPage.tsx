import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ButtonLink, PageLink } from '../../components/ui'
import { useLocale, useT } from '../../i18n/locale'
import { matchLegacy, pathFor, type PageId } from '../../routes'
import { usePageSeo } from '../../seo/usePageSeo'

const copy = {
  title: { fi: 'Tämä polku vei', en: 'This path led' },
  accent: { fi: 'manalaan.', en: 'to the underworld.' },
  lead: {
    fi: 'Etsimääsi sivua ei löytynyt – se on ehkä siirretty tai poistettu. Palaa etusivulle tai jatka alla olevista linkeistä.',
    en: 'The page you were looking for could not be found – it may have been moved or removed. Head back home or continue below.',
  },
  home: { fi: 'Etusivulle', en: 'Back to home' },
}

const LINKS: PageId[] = ['services', 'work', 'pricing', 'contact']

export default function NotFoundPage() {
  usePageSeo('notFound')
  const t = useT()
  const locale = useLocale()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Old-site URLs in any letter case (the static redirect pages cover the common spellings).
  useEffect(() => {
    const target = matchLegacy(pathname)
    if (target) void navigate(pathFor(target, locale), { replace: true })
  }, [pathname, locale, navigate])

  return (
    <section className="not-found">
      <div className="container not-found__inner intro">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="h-1">
          {t(copy.title)} <em className="accent">{t(copy.accent)}</em>
        </h1>
        <p className="lead">{t(copy.lead)}</p>
        <ButtonLink to={pathFor('home', locale)}>{t(copy.home)}</ButtonLink>
        <ul className="tag-list">
          {LINKS.map((id) => (
            <li key={id}>
              <PageLink id={id} className="chip" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
