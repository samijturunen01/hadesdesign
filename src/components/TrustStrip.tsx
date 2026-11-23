import { testimonial } from '../data/content'
import { projects } from '../data/projects'
import { useLocale, useT } from '../i18n/locale'
import { AppLink } from '../lib/AppLink'
import { pathFor } from '../routes'
import { Icon } from './Icon'

const copy = {
  label: { fi: 'Asiakkaan sanoin', en: 'In a client’s words' },
  work: { fi: 'Toteuttamiamme verkkosivustoja', en: 'Websites we have built' },
  all: { fi: 'Katso referenssit', en: 'See our work' },
}

/**
 * Proof next to a decision (pricing, contact): the published testimonial and
 * the real projects. Nothing here may be invented – see docs/CONTENT-SOURCES.md.
 */
export function TrustStrip() {
  const t = useT()
  const locale = useLocale()
  return (
    <div className="trust glass" data-reveal="">
      <figure className="trust__quote">
        <Icon name="quote" className="trust__mark" />
        <blockquote>
          <p>{t(testimonial.quote)}</p>
        </blockquote>
        <figcaption>
          <strong>{testimonial.author}</strong> · {t(testimonial.role)}
        </figcaption>
      </figure>
      <div className="trust__work">
        <p className="eyebrow">{t(copy.work)}</p>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <AppLink to={`${pathFor('work', locale)}#${project.id}`}>
                <strong>{project.name}</strong>
                <span>{t(project.category)}</span>
                <Icon name="arrowUpRight" />
              </AppLink>
            </li>
          ))}
        </ul>
        <AppLink to={pathFor('work', locale)} className="link">
          {t(copy.all)} <Icon name="arrow" />
        </AppLink>
      </div>
    </div>
  )
}
