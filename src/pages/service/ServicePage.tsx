import { Icon, type IconName } from '../../components/Icon'
import { MaintenancePlan } from '../../components/MaintenancePlan'
import { TierCard } from '../../components/pricing/TierCard'
import { Process } from '../../components/Process'
import { SERVICE_ICONS } from '../../components/serviceIcons'
import { ButtonLink, CtaBand, FaqList, PageHero, SectionHead } from '../../components/ui'
import { maintenanceFaq, websitesFaq } from '../../data/content'
import { ctaLabel, pageNames } from '../../data/navigation'
import { PRICES, TIER_IDS } from '../../data/pricing'
import { getService } from '../../data/services'
import { formatEuro, useLocale, useT, type Localized } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { AppLink } from '../../lib/AppLink'
import { stagger } from '../../lib/motion'
import { pathFor, SERVICE_PAGE_IDS, type PageId, type ServicePageId } from '../../routes'
import { serviceNode } from '../../seo/schema'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const copy = {
  compare: { fi: 'Vertaa paketteja', en: 'Compare the packages' },
  benefitsEyebrow: { fi: 'Mitä saat', en: 'What you get' },
  benefitsTitle: { fi: 'Kaikki olennainen,', en: 'Everything that matters,' },
  benefitsAccent: { fi: 'huolella tehtynä.', en: 'done with care.' },
  packagesEyebrow: { fi: 'Verkkosivupaketit', en: 'Website packages' },
  packagesTitle: { fi: 'Valitse sopiva', en: 'Choose the right' },
  packagesAccent: { fi: 'laajuus.', en: 'scope.' },
  packagesLead: {
    fi: 'Sama premium-laatu ja Conversion First -periaate jokaisessa paketissa. Valitse yksi sivu, useita sivuja tai Apollo lisäominaisuuksilla.',
    en: 'The same premium quality and Conversion First principle in every package. Choose one page, several pages or Apollo with add-ons.',
  },
  compareMore: { fi: 'Katso tarkka vertailu ja Zeus-laskuri', en: 'See the full comparison and the Zeus calculator' },
  processEyebrow: { fi: 'Prosessi', en: 'Process' },
  processTitle: { fi: 'Näin projekti', en: 'How a project' },
  processAccent: { fi: 'etenee.', en: 'comes together.' },
  planEyebrow: { fi: 'Ylläpitopaketti', en: 'Maintenance plan' },
  planTitle: { fi: 'Me hoidamme tekniikan,', en: 'We handle the technology,' },
  planAccent: { fi: 'sinä liiketoiminnan.', en: 'you run the business.' },
  faqEyebrow: { fi: 'Usein kysyttyä', en: 'FAQ' },
  faqWebsites: { fi: 'Kysymyksiä verkkosivuista', en: 'Questions about websites' },
  faqMaintenance: { fi: 'Kysymyksiä ylläpidosta', en: 'Questions about maintenance' },
  nextEyebrow: { fi: 'Jatka tästä', en: 'Where next' },
}

interface NextLink {
  id: PageId
  icon: IconName
  summary: Localized
}

const pricingSummary: Localized = {
  fi: `Hermes ${formatEuro(PRICES.hermes, 'fi')}, Apollo ${formatEuro(PRICES.apollo, 'fi')} ja Zeus – vertaa paketteja ja laske hinta.`,
  en: `Hermes ${formatEuro(PRICES.hermes, 'en')}, Apollo ${formatEuro(PRICES.apollo, 'en')} and Zeus – compare the packages and work out your price.`,
}
const workSummary: Localized = {
  fi: 'Katso, millaisia verkkosivuja olemme toteuttaneet yrityksille.',
  en: 'See the websites we have built for businesses.',
}

export default function ServicePage({ id }: PageProps) {
  const locale = useLocale()
  const serviceId = (SERVICE_PAGE_IDS as readonly string[]).includes(id) ? (id as ServicePageId) : 'websites'
  usePageSeo(id, { extra: [serviceNode(serviceId, locale)] })
  const t = useT()
  const service = getService(serviceId)
  const websites = serviceId === 'websites'

  const other = getService(websites ? 'maintenance' : 'websites')
  const next: NextLink[] = [
    { id: other.id, icon: SERVICE_ICONS[other.id], summary: other.summary },
    { id: 'pricing', icon: 'layers', summary: pricingSummary },
    { id: 'work', icon: 'devices', summary: workSummary },
  ]

  return (
    <>
      <PageHero id={id} eyebrow={t(pageNames[serviceId])} title={t(service.title)} lead={t(service.description)}>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <ButtonLink to={pathFor('contact', locale)}>{t(ctaLabel)}</ButtonLink>
          {websites && (
            <ButtonLink to={pathFor('pricing', locale)} variant="ghost" icon={null}>
              {t(copy.compare)}
            </ButtonLink>
          )}
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

      {websites && (
        <>
          <section className="section" aria-labelledby="svc-packages">
            <div className="container">
              <SectionHead
                id="svc-packages"
                eyebrow={t(copy.packagesEyebrow)}
                title={t(copy.packagesTitle)}
                accent={t(copy.packagesAccent)}
                lead={t(copy.packagesLead)}
                split
              />
              <div className="tiers">
                {TIER_IDS.map((tierId, i) => (
                  <TierCard key={tierId} id={tierId} index={i} />
                ))}
              </div>
              <p className="tiers__note" data-reveal="fade">
                <AppLink to={pathFor('pricing', locale)} className="link">
                  {t(copy.compareMore)} <Icon name="arrow" />
                </AppLink>
              </p>
            </div>
          </section>

          <section className="section" aria-labelledby="svc-process">
            <div className="container">
              <SectionHead id="svc-process" eyebrow={t(copy.processEyebrow)} title={t(copy.processTitle)} accent={t(copy.processAccent)} />
              <Process />
            </div>
          </section>
        </>
      )}

      {!websites && (
        <section className="section" aria-labelledby="svc-plan">
          <div className="container">
            <SectionHead id="svc-plan" eyebrow={t(copy.planEyebrow)} title={t(copy.planTitle)} accent={t(copy.planAccent)} />
            <MaintenancePlan />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="svc-faq">
        <div className="container narrow">
          <SectionHead
            id="svc-faq"
            eyebrow={t(copy.faqEyebrow)}
            title={t(websites ? copy.faqWebsites : copy.faqMaintenance)}
          />
          <FaqList items={websites ? websitesFaq : maintenanceFaq} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="svc-more">
        <div className="container">
          <p className="eyebrow" id="svc-more" style={{ marginBottom: '1.5rem' }}>
            {t(copy.nextEyebrow)}
          </p>
          <ul className="grid grid--3 more-services">
            {next.map((link, i) => (
              <li key={link.id} data-reveal="" style={stagger(i)}>
                <AppLink to={pathFor(link.id, locale)} className="card glass more-service" data-spotlight="">
                  <span className="facet">
                    <Icon name={link.icon} />
                  </span>
                  <span className="more-service__name">{t(pageNames[link.id])}</span>
                  <span className="muted">{t(link.summary)}</span>
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
