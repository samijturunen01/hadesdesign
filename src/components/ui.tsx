import type { CSSProperties, ReactNode } from 'react'
import { business } from '../data/business'
import type { Faq } from '../data/content'
import { pageNames, trailTo } from '../data/navigation'
import { useLocale, useT } from '../i18n/locale'
import { ui } from '../i18n/strings'
import { AppLink } from '../lib/AppLink'
import { stagger } from '../lib/motion'
import { pathFor, type PageId } from '../routes'
import { Icon, type IconName } from './Icon'

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size,
  icon = 'arrow',
  className = '',
}: {
  to: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'sm'
  icon?: IconName | null
  className?: string
}) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`.trim()
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} />}
    </>
  )
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a className={cls} href={to} data-magnetic="">
        {content}
      </a>
    )
  }
  return (
    <AppLink className={cls} to={to} data-magnetic="">
      {content}
    </AppLink>
  )
}

/** Link to a page by id in the active language. */
export function PageLink({ id, children, className }: { id: PageId; children?: ReactNode; className?: string }) {
  const locale = useLocale()
  return (
    <AppLink to={pathFor(id, locale)} className={className}>
      {children ?? pageNames[id][locale]}
    </AppLink>
  )
}

export function Breadcrumbs({ id }: { id: PageId }) {
  const t = useT()
  const trail = trailTo(id)
  if (!trail.length) return null
  return (
    <nav className="breadcrumbs" aria-label={t(ui.breadcrumbs)}>
      <ol>
        {trail.map((crumb, i) =>
          i === trail.length - 1 ? (
            <li key={crumb} aria-current="page">
              {t(pageNames[crumb])}
            </li>
          ) : (
            <li key={crumb}>
              <PageLink id={crumb} />
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}

/** Inner-page header: breadcrumbs, eyebrow, title (with an optional ember accent), lead. */
export function PageHero({
  id,
  eyebrow,
  title,
  accent,
  lead,
  children,
}: {
  id: PageId
  eyebrow?: string
  title: string
  accent?: string
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="page-hero">
      <div className="container">
        <div className="page-hero__inner intro">
          <div style={stagger(0)}>
            <Breadcrumbs id={id} />
          </div>
          {eyebrow && (
            <p className="eyebrow" style={stagger(1)}>
              {eyebrow}
            </p>
          )}
          <h1 style={stagger(2)}>
            {title}
            {accent && (
              <>
                {' '}
                <em className="accent">{accent}</em>
              </>
            )}
          </h1>
          {lead && (
            <p className="lead" style={stagger(3)}>
              {lead}
            </p>
          )}
          {children && <div style={stagger(4)}>{children}</div>}
        </div>
      </div>
    </header>
  )
}

export function SectionHead({
  eyebrow,
  title,
  accent,
  lead,
  split = false,
  id,
}: {
  eyebrow?: string
  title: string
  accent?: string
  lead?: ReactNode
  split?: boolean
  id?: string
}) {
  return (
    <div className={`section-head${split ? ' section-head--split' : ''}`}>
      <div className="stack" style={{ '--stack': '1.1rem' } as CSSProperties}>
        {eyebrow && (
          <p className="eyebrow" data-reveal="fade">
            {eyebrow}
          </p>
        )}
        <h2 className="h-1" id={id} data-reveal="">
          {title}
          {accent && (
            <>
              {' '}
              <em className="accent">{accent}</em>
            </>
          )}
        </h2>
      </div>
      {lead && (
        <p className="lead" data-reveal="" style={stagger(1)}>
          {lead}
        </p>
      )}
    </div>
  )
}

export function FaqList({ items }: { items: Faq[] }) {
  const t = useT()
  return (
    <div className="faq">
      {items.map((item, i) => (
        <details key={item.q.fi} className="glass" data-reveal="" style={stagger(i)}>
          <summary>
            <span>{t(item.q)}</span>
            <span className="plus" aria-hidden="true" />
          </summary>
          <p className="answer">{t(item.a)}</p>
        </details>
      ))}
    </div>
  )
}

export function ContactLines() {
  return (
    <ul className="contact-lines">
      <li>
        <a href={`mailto:${business.email}`}>
          <Icon name="mail" />
          {business.email}
        </a>
      </li>
      <li>
        <a href={business.phone.href}>
          <Icon name="phone" />
          {business.phone.display}
        </a>
      </li>
    </ul>
  )
}

/** Closing call to action used at the bottom of most pages. */
export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const t = useT()
  const locale = useLocale()
  return (
    <section className="section section--tight" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band glass" data-reveal="scale">
          <div className="stack" style={{ '--stack': '1.2rem' } as CSSProperties}>
            <p className="eyebrow">{t(ui.quotePrompt)}</p>
            <h2 id="cta-title">{title ?? t(ui.ctaTitle)}</h2>
            <p className="lead">{text ?? t(ui.ctaText)}</p>
          </div>
          <div className="stack" style={{ '--stack': '1.5rem' } as CSSProperties}>
            <ButtonLink to={pathFor('contact', locale)}>{t(ui.contactUs)}</ButtonLink>
            <ContactLines />
          </div>
        </div>
      </div>
    </section>
  )
}
