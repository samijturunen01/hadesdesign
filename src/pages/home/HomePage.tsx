import { Icon, type IconName } from '../../components/Icon'
import { Process } from '../../components/Process'
import { ResponsiveImage } from '../../components/ResponsiveImage'
import { ButtonLink, CtaBand, SectionHead } from '../../components/ui'
import { pillars, pillarsIntro, testimonial } from '../../data/content'
import { packages, popularLabel } from '../../data/packages'
import { projects } from '../../data/projects'
import { services } from '../../data/services'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { AppLink } from '../../lib/AppLink'
import { stagger } from '../../lib/motion'
import { pathFor } from '../../routes'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'
import { Hero } from './Hero'

const PILLAR_ICONS: IconName[] = ['bolt', 'shield', 'search', 'devices']

const copy = {
  servicesEyebrow: { fi: 'Palvelut', en: 'Services' },
  servicesTitle: { fi: 'Verkkosivuista ylläpitoon –', en: 'From websites to maintenance –' },
  servicesAccent: { fi: 'yhdestä paikasta.', en: 'all in one place.' },
  servicesLead: {
    fi: 'Suunnittelu, toteutus, uudistus ja ylläpito saman tekijän käsistä. Sinun ei tarvitse koordinoida useaa toimittajaa.',
    en: 'Design, development, redesign and maintenance from the same hands. No need to coordinate several suppliers.',
  },
  whyEyebrow: { fi: 'Miksi Hades Design', en: 'Why Hades Design' },
  whyTitle: { fi: 'Sivut, jotka toimivat', en: 'Sites that work' },
  whyAccent: { fi: 'yhtä hyvin kuin näyttävät.', en: 'as well as they look.' },
  workEyebrow: { fi: 'Referenssit', en: 'Selected work' },
  workTitle: { fi: 'Projekteja, joista olemme', en: 'Work we are' },
  workAccent: { fi: 'ylpeitä.', en: 'proud of.' },
  processEyebrow: { fi: 'Prosessi', en: 'Process' },
  processTitle: { fi: 'Näin projekti', en: 'How a project' },
  processAccent: { fi: 'etenee.', en: 'comes together.' },
  processLead: {
    fi: 'Selkeä prosessi kartoituksesta julkaisuun. Tiedät koko ajan, missä mennään.',
    en: 'A clear process from discovery to launch. You always know where things stand.',
  },
  pricingEyebrow: { fi: 'Hinnasto', en: 'Pricing' },
  pricingTitle: { fi: 'Selkeät paketit,', en: 'Clear packages,' },
  pricingAccent: { fi: 'selkeät hinnat.', en: 'clear prices.' },
  pricingLead: {
    fi: 'Hinnat sisältävät ALV:n. Valitse yrityksellesi sopiva paketti.',
    en: 'Prices include VAT. Choose the package that suits your business.',
  },
  quoteLabel: { fi: 'Asiakkaan sanoin', en: 'In a client’s words' },
}

export default function HomePage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()
  const locale = useLocale()

  return (
    <>
      <Hero />

      {/* Services – an editorial index */}
      <section className="section" aria-labelledby="home-services">
        <div className="container">
          <SectionHead
            id="home-services"
            eyebrow={t(copy.servicesEyebrow)}
            title={t(copy.servicesTitle)}
            accent={t(copy.servicesAccent)}
            lead={t(copy.servicesLead)}
            split
          />
          <ol className="service-index">
            {services.map((service, i) => (
              <li key={service.id} data-reveal="" style={stagger(i)}>
                <AppLink to={pathFor(service.id, locale)} className="service-row" data-spotlight="">
                  <span className="service-row__no">0{i + 1}</span>
                  <span className="service-row__name">{t(service.name)}</span>
                  <span className="service-row__text">{t(service.summary)}</span>
                  <span className="service-row__price">{service.price ? t(service.price) : t(ui.priceOnRequest)}</span>
                  <span className="service-row__go" aria-hidden="true">
                    <Icon name="arrowUpRight" />
                  </span>
                </AppLink>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why – glass pillars over an ember stage */}
      <section className="section why" aria-labelledby="home-why">
        <div className="container">
          <SectionHead
            id="home-why"
            eyebrow={t(copy.whyEyebrow)}
            title={t(copy.whyTitle)}
            accent={t(copy.whyAccent)}
            lead={t(pillarsIntro)}
          />
          <div className="grid grid--4">
            {pillars.map((pillar, i) => (
              <article key={pillar.title.fi} className="card glass pillar" data-spotlight="" data-reveal="" style={stagger(i)}>
                <span className="facet">
                  <Icon name={PILLAR_ICONS[i] ?? 'spark'} />
                </span>
                <h3>{t(pillar.title)}</h3>
                <p>{t(pillar.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="section" aria-labelledby="home-work">
        <div className="container">
          <SectionHead id="home-work" eyebrow={t(copy.workEyebrow)} title={t(copy.workTitle)} accent={t(copy.workAccent)} />
          <div className="work-teasers">
            {projects.map((project, i) => (
              <AppLink
                key={project.id}
                to={`${pathFor('work', locale)}#${project.id}`}
                className="work-teaser glass"
                data-spotlight=""
                data-reveal=""
                style={stagger(i)}
              >
                <div className="work-teaser__media">
                  <ResponsiveImage
                    name={`${project.image}-desktop`}
                    alt={t(project.imageAlt)}
                    sizes="(min-width: 72rem) 24rem, (min-width: 56rem) 45vw, 92vw"
                  />
                </div>
                <div className="work-teaser__body">
                  <p className="chip chip--ember">{t(project.category)}</p>
                  <h3 className="h-3">{project.name}</h3>
                  <p className="muted">{t(project.summary)}</p>
                  <span className="link">
                    {t(ui.readMore)} <Icon name="arrow" />
                  </span>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      {/* Process – a timeline whose ember line fills as you scroll */}
      <section className="section" aria-labelledby="home-process">
        <div className="container">
          <SectionHead
            id="home-process"
            eyebrow={t(copy.processEyebrow)}
            title={t(copy.processTitle)}
            accent={t(copy.processAccent)}
            lead={t(copy.processLead)}
            split
          />
          <Process />
        </div>
      </section>

      {/* Testimonial */}
      <section className="section section--tight" aria-label={t(copy.quoteLabel)}>
        <div className="container">
          <figure className="testimonial glass" data-reveal="scale">
            <Icon name="quote" className="testimonial__mark" />
            <blockquote>
              <p>{t(testimonial.quote)}</p>
            </blockquote>
            <figcaption>
              <strong>{testimonial.author}</strong>
              <span>{t(testimonial.role)}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section" aria-labelledby="home-pricing">
        <div className="container">
          <SectionHead
            id="home-pricing"
            eyebrow={t(copy.pricingEyebrow)}
            title={t(copy.pricingTitle)}
            accent={t(copy.pricingAccent)}
            lead={t(copy.pricingLead)}
            split
          />
          <div className="grid grid--3">
            {packages.map((pkg, i) => (
              <AppLink
                key={pkg.id}
                to={pathFor('pricing', locale)}
                className={`card glass price-teaser${pkg.popular ? ' is-popular' : ''}`}
                data-spotlight=""
                data-reveal=""
                style={stagger(i)}
              >
                <div className="price-teaser__top">
                  <h3>{t(pkg.name)}</h3>
                  {pkg.popular && <span className="chip chip--ember">{t(popularLabel)}</span>}
                </div>
                <p className="price-teaser__price">{formatEuro(pkg.price, locale)}</p>
                <p className="muted">
                  {t(pkg.pages)} · {t(pkg.description)}
                </p>
                <span className="link">
                  {t(ui.seePricing)} <Icon name="arrow" />
                </span>
              </AppLink>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: '2rem' }} data-reveal="fade">
            <ButtonLink to={pathFor('pricing', locale)} variant="ghost">
              {t(ui.seePricing)}
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
