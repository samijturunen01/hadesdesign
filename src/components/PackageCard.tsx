import { ctaLabel } from '../data/navigation'
import { FEATURES, popularLabel, vatNote, type WebsitePackage } from '../data/packages'
import { formatEuro, useLocale, useT } from '../i18n/locale'
import { stagger } from '../lib/motion'
import { pathFor } from '../routes'
import { Icon } from './Icon'
import { ButtonLink } from './ui'

const timelineLabel = { fi: 'Valmis tyypillisesti', en: 'Typically ready in' }

export function PackageCard({ pkg, index = 0 }: { pkg: WebsitePackage; index?: number }) {
  const t = useT()
  const locale = useLocale()
  return (
    <article
      className={`card glass package${pkg.popular ? ' is-popular' : ''}`}
      data-spotlight=""
      data-reveal=""
      style={stagger(index)}
      aria-labelledby={`pkg-${pkg.id}`}
    >
      <div className="package__head">
        <h3 id={`pkg-${pkg.id}`}>{t(pkg.name)}</h3>
        {pkg.popular && <span className="chip chip--ember">{t(popularLabel)}</span>}
      </div>
      <p className="muted">{t(pkg.description)}</p>
      <p className="package__price">
        {formatEuro(pkg.price, locale)}
        <small>{t(vatNote)}</small>
      </p>
      <dl className="package__meta">
        <div>
          <dt className="visually-hidden">{locale === 'fi' ? 'Sivumäärä' : 'Pages'}</dt>
          <dd>
            <Icon name="layers" /> {t(pkg.pages)}
          </dd>
        </div>
        <div>
          <dt className="visually-hidden">{t(timelineLabel)}</dt>
          <dd>
            <Icon name="clock" /> {t(timelineLabel)} {t(pkg.timeline)}
          </dd>
        </div>
      </dl>
      <ul className="check-list">
        {pkg.included.map((feature) => (
          <li key={feature}>
            <Icon name="check" />
            <span>{t(FEATURES[feature])}</span>
          </li>
        ))}
      </ul>
      <ButtonLink to={pathFor('contact', locale)} variant={pkg.popular ? 'primary' : 'ghost'} className="package__cta">
        {t(ctaLabel)}
      </ButtonLink>
    </article>
  )
}
