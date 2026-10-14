import { Icon } from '../../components/Icon'
import { MaintenancePlan } from '../../components/MaintenancePlan'
import { PackageCard } from '../../components/PackageCard'
import { CtaBand, FaqList, PageHero, SectionHead } from '../../components/ui'
import { pricingFaq } from '../../data/content'
import { FEATURE_ORDER, FEATURES, packages, vatNote } from '../../data/packages'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { offerNodes } from '../../seo/schema'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const copy = {
  eyebrow: { fi: 'Hinnasto', en: 'Pricing' },
  title: { fi: 'Selkeät paketit', en: 'Clear packages' },
  accent: { fi: 'jokaiseen tarpeeseen.', en: 'for every need.' },
  lead: {
    fi: 'Valitse yrityksellesi sopiva paketti. Hinnat sisältävät ALV:n.',
    en: 'Choose the package that suits your business. Prices include VAT.',
  },
  compareEyebrow: { fi: 'Vertailu', en: 'Comparison' },
  compareTitle: { fi: 'Pakettien', en: 'Packages' },
  compareAccent: { fi: 'erot yhdellä silmäyksellä.', en: 'side by side.' },
  feature: { fi: 'Ominaisuus', en: 'Feature' },
  included: { fi: 'Sisältyy', en: 'Included' },
  notIncluded: { fi: 'Ei sisälly', en: 'Not included' },
  planEyebrow: { fi: 'Ylläpito & hosting', en: 'Maintenance & hosting' },
  planTitle: { fi: 'Pidä sivustosi', en: 'Keep your site' },
  planAccent: { fi: 'huippukunnossa.', en: 'in top shape.' },
  faqEyebrow: { fi: 'Usein kysyttyä', en: 'FAQ' },
  faqTitle: { fi: 'Kysymyksiä hinnoista', en: 'Questions about pricing' },
}

export default function PricingPage({ id }: PageProps) {
  const locale = useLocale()
  usePageSeo(id, { extra: offerNodes(locale) })
  const t = useT()

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)} />

      <section className="section section--tight" aria-label={t(copy.eyebrow)}>
        <div className="container grid grid--3 packages">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="compare">
        <div className="container">
          <SectionHead id="compare" eyebrow={t(copy.compareEyebrow)} title={t(copy.compareTitle)} accent={t(copy.compareAccent)} />
          {/* A scrollable region must be reachable by keyboard (WCAG 2.1.1). */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <div className="table-wrap glass" data-reveal="" tabIndex={0} role="region" aria-labelledby="compare">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">{t(copy.feature)}</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} scope="col" className={pkg.popular ? 'is-hot' : undefined}>
                      {t(pkg.name)}
                      <span>{formatEuro(pkg.price, locale)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{locale === 'fi' ? 'Sivumäärä' : 'Pages'}</th>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className={pkg.popular ? 'is-hot' : undefined}>{t(pkg.pages)}</td>
                  ))}
                </tr>
                {FEATURE_ORDER.map((feature) => (
                  <tr key={feature}>
                    <th scope="row">{t(FEATURES[feature])}</th>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className={pkg.popular ? 'is-hot' : undefined}>
                        {pkg.included.includes(feature) ? (
                          <Icon name="check" className="yes" label={t(copy.included)} />
                        ) : (
                          <span className="no" role="img" aria-label={t(copy.notIncluded)}>
                            –
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="field-hint" style={{ marginTop: '1rem' }}>
            {t(vatNote)}
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="plan">
        <div className="container">
          <SectionHead id="plan" eyebrow={t(copy.planEyebrow)} title={t(copy.planTitle)} accent={t(copy.planAccent)} />
          <MaintenancePlan />
        </div>
      </section>

      <section className="section" aria-labelledby="pricing-faq">
        <div className="container narrow">
          <SectionHead id="pricing-faq" eyebrow={t(copy.faqEyebrow)} title={t(copy.faqTitle)} />
          <FaqList items={pricingFaq} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
