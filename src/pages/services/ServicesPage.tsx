import { Icon } from '../../components/Icon'
import { SERVICE_ICONS } from '../../components/serviceIcons'
import { Process } from '../../components/Process'
import { ButtonLink, CtaBand, PageHero, SectionHead } from '../../components/ui'
import { services } from '../../data/services'
import { useLocale, useT } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { stagger } from '../../lib/motion'
import { pathFor } from '../../routes'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const copy = {
  eyebrow: { fi: 'Palvelut', en: 'Services' },
  title: { fi: 'Verkkosivut, verkkokaupat', en: 'Websites, online stores' },
  accent: { fi: 'ja ylläpito.', en: 'and maintenance.' },
  lead: {
    fi: 'Suunnittelemme ja rakennamme yrityksille verkkosivut ja verkkokaupat, uudistamme vanhat sivustot sekä hoidamme ylläpidon ja hostingin – kaikki samasta paikasta.',
    en: 'We design and build websites and online stores for businesses, redesign outdated sites and take care of maintenance and hosting – all in one place.',
  },
  includes: { fi: 'Sisältää muun muassa', en: 'Includes, among other things' },
  processEyebrow: { fi: 'Prosessi', en: 'Process' },
  processTitle: { fi: 'Kartoituksesta', en: 'From discovery' },
  processAccent: { fi: 'jatkuvaan tukeen.', en: 'to ongoing support.' },
}

export default function ServicesPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()
  const locale = useLocale()

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)} />

      <section className="section" aria-label={t(copy.eyebrow)}>
        <div className="container service-panels">
          {services.map((service, i) => (
            <article key={service.id} className="service-panel" aria-labelledby={`svc-${service.id}`}>
              <div className="service-panel__intro" data-reveal="">
                <span className="card-index">0{i + 1}</span>
                <h2 id={`svc-${service.id}`} className="h-2">
                  {t(service.title)}
                </h2>
                <p className="lead">{t(service.description)}</p>
                <p className="service-panel__price">{service.price ? t(service.price) : t(ui.priceOnRequest)}</p>
                <ButtonLink to={pathFor(service.id, locale)} variant="ghost">
                  {t(ui.readMore)}
                </ButtonLink>
              </div>
              <div className="card glass service-panel__card" data-spotlight="" data-reveal="scale" style={stagger(1)}>
                <span className="facet">
                  <Icon name={SERVICE_ICONS[service.id]} />
                </span>
                <p className="eyebrow">{t(copy.includes)}</p>
                <ul className="check-list">
                  {t(service.benefits).map((benefit) => (
                    <li key={benefit}>
                      <Icon name="check" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="services-process">
        <div className="container">
          <SectionHead
            id="services-process"
            eyebrow={t(copy.processEyebrow)}
            title={t(copy.processTitle)}
            accent={t(copy.processAccent)}
          />
          <Process />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
