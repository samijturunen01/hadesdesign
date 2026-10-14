import { Icon } from '../../components/Icon'
import { MaintenancePlan } from '../../components/MaintenancePlan'
import { PackageCard } from '../../components/PackageCard'
import { Process } from '../../components/Process'
import { SERVICE_ICONS } from '../../components/serviceIcons'
import { ButtonLink, CtaBand, FaqList, PageHero, SectionHead } from '../../components/ui'
import { maintenanceFaq } from '../../data/content'
import { ctaLabel, pageNames } from '../../data/navigation'
import { packages } from '../../data/packages'
import { getService, services } from '../../data/services'
import { useLocale, useT } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { AppLink } from '../../lib/AppLink'
import { stagger } from '../../lib/motion'
import { pathFor, SERVICE_PAGE_IDS, type ServicePageId } from '../../routes'
import { serviceNode } from '../../seo/schema'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const copy = {
  benefitsEyebrow: { fi: 'Mitä saat', en: 'What you get' },
  benefitsTitle: { fi: 'Kaikki olennainen,', en: 'Everything that matters,' },
  benefitsAccent: { fi: 'huolella tehtynä.', en: 'done with care.' },
  packagesEyebrow: { fi: 'Paketit', en: 'Packages' },
  packagesTitle: { fi: 'Valitse sopiva', en: 'Choose the right' },
  packagesAccent: { fi: 'lähtötaso.', en: 'starting point.' },
  planEyebrow: { fi: 'Ylläpitopaketti', en: 'Maintenance plan' },
  planTitle: { fi: 'Me hoidamme tekniikan,', en: 'We handle the technology,' },
  planAccent: { fi: 'sinä liiketoiminnan.', en: 'you run the business.' },
  processEyebrow: { fi: 'Näin uudistus etenee', en: 'How a redesign works' },
  processTitle: { fi: 'Uusi ilme,', en: 'A new look,' },
  processAccent: { fi: 'saavutukset säilyvät.', en: 'your results intact.' },
  faqEyebrow: { fi: 'Usein kysyttyä', en: 'FAQ' },
  faqTitle: { fi: 'Kysymyksiä ylläpidosta', en: 'Questions about maintenance' },
  moreEyebrow: { fi: 'Muut palvelut', en: 'Other services' },
}

export default function ServicePage({ id }: PageProps) {
  const locale = useLocale()
  const serviceId = (SERVICE_PAGE_IDS as readonly string[]).includes(id) ? (id as ServicePageId) : 'websites'
  usePageSeo(id, { extra: [serviceNode(serviceId, locale)] })
  const t = useT()
  const service = getService(serviceId)
  const related = packages.filter((p) => (serviceId === 'ecommerce' ? p.id === 'store' : p.id !== 'store'))

  return (
    <>
      <PageHero
        id={id}
        eyebrow={t(pageNames[serviceId])}
        title={t(service.title)}
        lead={t(service.description)}
      >
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <ButtonLink to={pathFor('contact', locale)}>{t(ctaLabel)}</ButtonLink>
          <span className="chip chip--ember">
            <span className="dot" />
            {service.price ? t(service.price) : t(ui.priceOnRequest)}
          </span>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="svc-benefits">
        <div className="container">
          <SectionHead
            id="svc-benefits"
            eyebrow={t(copy.benefitsEyebrow)}
            title={t(copy.benefitsTitle)}
            accent={t(copy.benefitsAccent)}
          />
          <ul className="grid grid--3 benefit-grid">
            {t(service.benefits).map((benefit, i) => (
              <li key={benefit} className="card glass benefit" data-spotlight="" data-reveal="" style={stagger(i)}>
                <span className="facet">
                  <Icon name={i === 0 ? SERVICE_ICONS[serviceId] : 'check'} />
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {(serviceId === 'websites' || serviceId === 'ecommerce') && (
        <section className="section" aria-labelledby="svc-packages">
          <div className="container">
            <SectionHead
              id="svc-packages"
              eyebrow={t(copy.packagesEyebrow)}
              title={t(copy.packagesTitle)}
              accent={t(copy.packagesAccent)}
            />
            <div className={`grid ${related.length > 1 ? 'grid--2' : 'package-single'}`}>
              {related.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {serviceId === 'redesign' && (
        <section className="section" aria-labelledby="svc-process">
          <div className="container">
            <SectionHead
              id="svc-process"
              eyebrow={t(copy.processEyebrow)}
              title={t(copy.processTitle)}
              accent={t(copy.processAccent)}
            />
            <Process />
          </div>
        </section>
      )}

      {serviceId === 'maintenance' && (
        <>
          <section className="section" aria-labelledby="svc-plan">
            <div className="container">
              <SectionHead id="svc-plan" eyebrow={t(copy.planEyebrow)} title={t(copy.planTitle)} accent={t(copy.planAccent)} />
              <MaintenancePlan />
            </div>
          </section>
          <section className="section" aria-labelledby="svc-faq">
            <div className="container narrow">
              <SectionHead id="svc-faq" eyebrow={t(copy.faqEyebrow)} title={t(copy.faqTitle)} />
              <FaqList items={maintenanceFaq} />
            </div>
          </section>
        </>
      )}

      <section className="section section--tight" aria-labelledby="svc-more">
        <div className="container">
          <p className="eyebrow" id="svc-more" style={{ marginBottom: '1.5rem' }}>
            {t(copy.moreEyebrow)}
          </p>
          <ul className="grid grid--3 more-services">
            {services
              .filter((s) => s.id !== serviceId)
              .map((s, i) => (
                <li key={s.id} data-reveal="" style={stagger(i)}>
                  <AppLink to={pathFor(s.id, locale)} className="card glass more-service" data-spotlight="">
                    <span className="facet">
                      <Icon name={SERVICE_ICONS[s.id]} />
                    </span>
                    <span className="more-service__name">{t(s.name)}</span>
                    <span className="muted">{t(s.summary)}</span>
                    <Icon name="arrowUpRight" className="more-service__go" />
                  </AppLink>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
