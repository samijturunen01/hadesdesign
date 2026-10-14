import { Icon } from '../../components/Icon'
import { ResponsiveImage } from '../../components/ResponsiveImage'
import { CtaBand, PageHero } from '../../components/ui'
import { testimonial } from '../../data/content'
import { projects } from '../../data/projects'
import { useT } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { stagger } from '../../lib/motion'
import { usePageSeo } from '../../seo/usePageSeo'
import images from '../../generated/images.json'
import type { PageProps } from '../registry'

const copy = {
  eyebrow: { fi: 'Referenssit', en: 'Our work' },
  title: { fi: 'Työ puhuu', en: 'The work speaks' },
  accent: { fi: 'puolestaan.', en: 'for itself.' },
  lead: {
    fi: 'Jokainen sivusto suunnitellaan asiakkaan tarpeiden ja brändin mukaan – ei valmiista massapohjista. Tässä muutama toteuttamamme projekti.',
    en: 'Every site is designed around the client’s needs and brand – never from mass-produced templates. Here are some of the projects we have delivered.',
  },
  client: { fi: 'Asiakas', en: 'Client' },
  sector: { fi: 'Toimiala', en: 'Sector' },
  site: { fi: 'Sivusto', en: 'Website' },
  contents: { fi: 'Sivuston sisältö', en: 'What the site includes' },
  ctaTitle: { fi: 'Seuraava referenssi voi olla sinun.', en: 'The next project could be yours.' },
}

export default function WorkPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)} />

      {projects.map((project, index) => {
        const hasMobile = `${project.image}-mobile` in images
        return (
          <section
            key={project.id}
            id={project.id}
            className={`section case${index % 2 ? ' case--flip' : ''}`}
            aria-labelledby={`case-${project.id}`}
          >
            <div className="container case__grid">
              <div className="case__media" data-tilt="" data-reveal="scale">
                <div className="case__browser glass">
                  <div className="stage__bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>{project.domain}</span>
                  </div>
                  <ResponsiveImage
                    name={`${project.image}-desktop`}
                    alt={t(project.imageAlt)}
                    sizes="(min-width: 62rem) 40rem, 92vw"
                  />
                </div>
                {hasMobile && (
                  <div className="case__phone stage__phone">
                    <ResponsiveImage name={`${project.image}-mobile`} alt="" sizes="10rem" />
                  </div>
                )}
              </div>

              <div className="case__body">
                <p className="card-index" data-reveal="fade">
                  0{index + 1}
                </p>
                <h2 id={`case-${project.id}`} className="h-1" data-reveal="">
                  {project.name}
                </h2>
                <p className="lead" data-reveal="" style={stagger(1)}>
                  {t(project.description)}
                </p>

                <dl className="case__facts" data-reveal="" style={stagger(2)}>
                  <div>
                    <dt>{t(copy.client)}</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div>
                    <dt>{t(copy.sector)}</dt>
                    <dd>{t(project.category)}</dd>
                  </div>
                  <div>
                    <dt>{t(copy.site)}</dt>
                    <dd>{project.domain}</dd>
                  </div>
                </dl>

                <div data-reveal="" style={stagger(3)}>
                  <h3 className="case__subhead">{t(copy.contents)}</h3>
                  <ul className="check-list">
                    {t(project.highlights).map((item) => (
                      <li key={item}>
                        <Icon name="check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="tag-list" data-reveal="fade" style={stagger(4)}>
                  {t(project.tags).map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>

                {project.linkLive && (
                  <a className="btn btn--ghost" href={project.url} target="_blank" rel="noopener" data-magnetic="">
                    <span>
                      {t(ui.visitSite)} <span className="visually-hidden">{t(ui.opensInNewTab)}</span>
                    </span>
                    <Icon name="external" />
                  </a>
                )}

                {testimonial.author === project.client && (
                  <figure className="case__quote glass" data-reveal="">
                    <blockquote>
                      <p>”{t(testimonial.quote)}”</p>
                    </blockquote>
                    <figcaption>
                      <strong>{testimonial.author}</strong> · {t(testimonial.role)}
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </section>
        )
      })}

      <CtaBand title={t(copy.ctaTitle)} />
    </>
  )
}
