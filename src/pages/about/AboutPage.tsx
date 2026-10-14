import type { CSSProperties } from 'react'
import { Icon, type IconName } from '../../components/Icon'
import { LogoMark } from '../../components/Logo'
import { CtaBand, PageHero, SectionHead } from '../../components/ui'
import { business, story } from '../../data/business'
import { approach, values } from '../../data/content'
import { useT } from '../../i18n/locale'
import { stagger } from '../../lib/motion'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const VALUE_ICONS: IconName[] = ['spark', 'bolt', 'devices', 'layers']

const copy = {
  eyebrow: { fi: 'Meistä', en: 'About' },
  title: { fi: 'Verkkosivuja, jotka', en: 'Websites that' },
  accent: { fi: 'palvelevat yrityksiä.', en: 'serve businesses.' },
  lead: {
    fi: 'Hades Design on joensuulainen verkkosivujen suunnittelun ja toteutuksen tekijä. Työskentelemme asiakkaiden kanssa paikallisesti ja etänä.',
    en: 'Hades Design designs and builds websites from Joensuu, Finland. We work with clients locally and remotely.',
  },
  storyEyebrow: { fi: 'Tarina', en: 'Our story' },
  valuesEyebrow: { fi: 'Arvot', en: 'Values' },
  valuesTitle: { fi: 'Mihin', en: 'What we' },
  valuesAccent: { fi: 'uskomme.', en: 'believe in.' },
  approachEyebrow: { fi: 'Toimintatapa', en: 'How we work' },
  approachTitle: { fi: 'Kolme vaihetta,', en: 'Three steps,' },
  approachAccent: { fi: 'yksi tavoite.', en: 'one goal.' },
  where: { fi: 'Missä toimimme', en: 'Where we work' },
}

export default function AboutPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)} />

      <section className="section" aria-labelledby="about-story">
        <div className="container story">
          <div className="story__text stack" style={{ '--stack': '1.25rem' } as CSSProperties}>
            <p className="eyebrow" id="about-story" data-reveal="fade">
              {t(copy.storyEyebrow)}
            </p>
            {t(story).map((paragraph, i) => (
              <p key={i} className={i === 0 ? 'story__first' : 'lead'} data-reveal="" style={stagger(i)}>
                {paragraph}
              </p>
            ))}
          </div>

          <aside className="story__aside">
            <figure className="founder glass" data-reveal="scale" data-tilt="">
              <div className="founder__mark" aria-hidden="true">
                <LogoMark />
              </div>
              <blockquote>
                <p>”{t(business.founder.quote)}”</p>
              </blockquote>
              <figcaption>
                <strong>{business.founder.name}</strong>
                <span>{t(business.founder.role)}</span>
              </figcaption>
            </figure>
            <div className="card glass where" data-reveal="" style={stagger(1)}>
              <span className="facet">
                <Icon name="pin" />
              </span>
              <div>
                <h2 className="where__title">{t(copy.where)}</h2>
                <p className="muted">
                  {business.location.city}, {t(business.location.country)}. {t(business.location.workMode)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" aria-labelledby="about-values">
        <div className="container">
          <SectionHead id="about-values" eyebrow={t(copy.valuesEyebrow)} title={t(copy.valuesTitle)} accent={t(copy.valuesAccent)} />
          <div className="grid grid--4">
            {values.map((value, i) => (
              <article key={value.title.fi} className="card glass pillar" data-spotlight="" data-reveal="" style={stagger(i)}>
                <span className="facet">
                  <Icon name={VALUE_ICONS[i] ?? 'spark'} />
                </span>
                <h3>{t(value.title)}</h3>
                <p>{t(value.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-approach">
        <div className="container">
          <SectionHead
            id="about-approach"
            eyebrow={t(copy.approachEyebrow)}
            title={t(copy.approachTitle)}
            accent={t(copy.approachAccent)}
          />
          <ol className="approach">
            {approach.map((step, i) => (
              <li key={step.title.fi} className="approach__step" data-reveal="" style={stagger(i)}>
                <span className="approach__no" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="h-3">{t(step.title)}</h3>
                <p className="muted">{t(step.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
