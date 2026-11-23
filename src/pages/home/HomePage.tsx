import type { CSSProperties } from 'react'
import { ConversionFirst } from '../../components/ConversionFirst'
import { Icon, type IconName } from '../../components/Icon'
import { Process } from '../../components/Process'
import { ResponsiveImage } from '../../components/ResponsiveImage'
import { TierEmblem } from '../../components/pricing/TierEmblem'
import { ButtonLink, CtaBand, FaqList, SectionHead } from '../../components/ui'
import { homeFaq, pillars, pillarsIntro, reasons, testimonial } from '../../data/content'
import { ctaLabel } from '../../data/navigation'
import { maintenancePlan, recommendedLabel, vatNote } from '../../data/packages'
import { headlinePrice, tiers } from '../../data/pricing'
import { projects } from '../../data/projects'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { AppLink } from '../../lib/AppLink'
import { stagger } from '../../lib/motion'
import { pathFor } from '../../routes'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'
import { Hero } from './Hero'

const PILLAR_ICONS: IconName[] = ['spark', 'search', 'bolt', 'devices']

const copy = {
  cfEyebrow: { fi: 'Conversion First', en: 'Conversion First' },
  cfTitle: { fi: 'Kaunis ulkoasu on', en: 'Good looks are' },
  cfAccent: { fi: 'vasta alkua.', en: 'only the beginning.' },
  cfLead: {
    fi: 'Conversion First tarkoittaa, että suunnittelemme sivustosi asiakkaasi näkökulmasta: mitä hän etsii, mikä saa hänet luottamaan sinuun ja miten yhteydenotosta tulee vaivatonta. Jokainen ratkaisu rakenteesta otsikoihin ja painikkeisiin palvelee tätä polkua.',
    en: 'Conversion First means we design your site from your customer’s point of view: what they are looking for, what makes them trust you and how getting in touch becomes effortless. Every decision, from structure to headlines and buttons, serves that path.',
  },
  benefitsEyebrow: { fi: 'Mitä saat', en: 'What you get' },
  benefitsTitle: { fi: 'Sivut, jotka toimivat', en: 'Sites that work' },
  benefitsAccent: { fi: 'yhtä hyvin kuin näyttävät.', en: 'as well as they look.' },
  workEyebrow: { fi: 'Referenssit', en: 'Selected work' },
  workTitle: { fi: 'Projekteja, joista olemme', en: 'Work we are' },
  workAccent: { fi: 'ylpeitä.', en: 'proud of.' },
  workLead: {
    fi: 'Jokainen sivusto on suunniteltu asiakkaan liiketoiminnan ja asiakkaiden mukaan – katso, miltä se näyttää käytännössä.',
    en: 'Every site is designed around the client’s business and customers – see what that looks like in practice.',
  },
  allWork: { fi: 'Katso kaikki referenssit', en: 'See all our work' },
  quoteLabel: { fi: 'Asiakkaan sanoin', en: 'In a client’s words' },
  pricingEyebrow: { fi: 'Verkkosivupaketit', en: 'Website packages' },
  pricingTitle: { fi: 'Kolme pakettia,', en: 'Three packages,' },
  pricingAccent: { fi: 'sama laatu.', en: 'one standard of quality.' },
  pricingLead: {
    fi: 'Jokainen paketti suunnitellaan samalla Conversion First -periaatteella ja premium-laadulla. Valitset vain laajuuden: yksi sivu, useita sivuja tai Apollo lisäominaisuuksilla.',
    en: 'Every package is designed on the same Conversion First principle and to the same premium standard. You only choose the scope: one page, several pages or Apollo with add-ons.',
  },
  allAddons: { fi: 'kaikilla lisäominaisuuksilla', en: 'with every add-on' },
  seePackage: { fi: 'Katso paketin sisältö', en: 'See what’s included' },
  compare: { fi: 'Vertaa paketteja', en: 'Compare the packages' },
  pricingNote: {
    fi: `Kertahintoja. Ylläpito ja hosting halutessasi erikseen ${formatEuro(maintenancePlan.monthly, 'fi')}/kk.`,
    en: `One-time prices. Maintenance and hosting separately if you wish, ${formatEuro(maintenancePlan.monthly, 'en')}/month.`,
  },
  whyEyebrow: { fi: 'Miksi Hades Design', en: 'Why Hades Design' },
  whyTitle: { fi: 'Selkeä yhteistyö,', en: 'Clear to work with,' },
  whyAccent: { fi: 'ei yllätyksiä.', en: 'no surprises.' },
  processEyebrow: { fi: 'Prosessi', en: 'Process' },
  processTitle: { fi: 'Näin projekti', en: 'How a project' },
  processAccent: { fi: 'etenee.', en: 'comes together.' },
  processLead: {
    fi: 'Selkeä prosessi kartoituksesta julkaisuun. Tiedät koko ajan, missä mennään.',
    en: 'A clear process from discovery to launch. You always know where things stand.',
  },
  faqEyebrow: { fi: 'Usein kysyttyä', en: 'FAQ' },
  faqTitle: { fi: 'Ennen kuin', en: 'Before you' },
  faqAccent: { fi: 'otat yhteyttä.', en: 'get in touch.' },
  faqMore: { fi: 'Lisää kysymyksiä paketeista ja hinnoista', en: 'More questions about packages and pricing' },
}

export default function HomePage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()
  const locale = useLocale()

  return (
    <>
      <Hero />

      {/* Conversion First – what it means */}
      <section className="section" aria-labelledby="home-cf">
        <div className="container">
          <SectionHead
            id="home-cf"
            eyebrow={t(copy.cfEyebrow)}
            title={t(copy.cfTitle)}
            accent={t(copy.cfAccent)}
            lead={t(copy.cfLead)}
            split
          />
          <ConversionFirst />
        </div>
      </section>

      {/* Benefits – glass pillars over an ember stage */}
      <section className="section why" aria-labelledby="home-benefits">
        <div className="container">
          <SectionHead
            id="home-benefits"
            eyebrow={t(copy.benefitsEyebrow)}
            title={t(copy.benefitsTitle)}
            accent={t(copy.benefitsAccent)}
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

      {/* References, with the client's words right next to them */}
      <section className="section" aria-labelledby="home-work">
        <div className="container">
          <SectionHead
            id="home-work"
            eyebrow={t(copy.workEyebrow)}
            title={t(copy.workTitle)}
            accent={t(copy.workAccent)}
            lead={t(copy.workLead)}
            split
          />
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

          <figure className="testimonial glass home-quote" data-reveal="scale" aria-label={t(copy.quoteLabel)}>
            <Icon name="quote" className="testimonial__mark" />
            <blockquote>
              <p>{t(testimonial.quote)}</p>
            </blockquote>
            <figcaption>
              <strong>{testimonial.author}</strong>
              <span>{t(testimonial.role)}</span>
            </figcaption>
          </figure>

          <div className="btn-row section-actions" data-reveal="fade">
            <ButtonLink to={pathFor('work', locale)} variant="ghost">
              {t(copy.allWork)}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Packages – Apollo highlighted, prices easy to compare */}
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
          <div className="grid grid--3 price-teasers">
            {tiers.map((tier, i) => (
              <AppLink
                key={tier.id}
                to={`${pathFor('pricing', locale)}#paketit`}
                className={`card glass price-teaser tier--${tier.id}${tier.recommended ? ' is-popular' : ''}`}
                data-spotlight=""
                data-reveal=""
                style={stagger(i)}
              >
                <div className="price-teaser__top">
                  <span className="price-teaser__name">
                    <span className="tier__emblem">
                      <TierEmblem tier={tier.id} />
                    </span>
                    <h3>{tier.name}</h3>
                  </span>
                  {tier.recommended && <span className="chip chip--ember">{t(recommendedLabel)}</span>}
                </div>
                <p className="price-teaser__price">
                  {formatEuro(headlinePrice(tier.id), locale)}
                  {tier.id === 'zeus' && <small>{t(copy.allAddons)}</small>}
                </p>
                <p className="price-teaser__kind">{t(tier.kind)}</p>
                <p className="muted">{t(tier.description)}</p>
                <span className="link">
                  {t(copy.seePackage)} <Icon name="arrow" />
                </span>
              </AppLink>
            ))}
          </div>
          <div className="price-teasers__foot" data-reveal="fade">
            <p className="muted">
              {t(vatNote)} {t(copy.pricingNote)}
            </p>
            <div className="btn-row">
              <ButtonLink to={pathFor('pricing', locale)}>{t(copy.compare)}</ButtonLink>
              <ButtonLink to={pathFor('contact', locale)} variant="ghost" icon={null}>
                {t(ctaLabel)}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Why Hades Design – verified facts about working with us */}
      <section className="section" aria-labelledby="home-why">
        <div className="container">
          <SectionHead id="home-why" eyebrow={t(copy.whyEyebrow)} title={t(copy.whyTitle)} accent={t(copy.whyAccent)} />
          <ol className="reasons">
            {reasons.map((reason, i) => (
              <li key={reason.title.fi} className="reason" data-reveal="" style={{ '--i': i } as CSSProperties}>
                <span className="reason__no" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{t(reason.title)}</h3>
                <p className="muted">{t(reason.text)}</p>
              </li>
            ))}
          </ol>
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

      {/* FAQ – the questions that most often stand between a visitor and an enquiry */}
      <section className="section" aria-labelledby="home-faq">
        <div className="container narrow">
          <SectionHead id="home-faq" eyebrow={t(copy.faqEyebrow)} title={t(copy.faqTitle)} accent={t(copy.faqAccent)} />
          <FaqList items={homeFaq} />
          <p className="faq-more" data-reveal="fade">
            <AppLink to={`${pathFor('pricing', locale)}#kysymykset`} className="link">
              {t(copy.faqMore)} <Icon name="arrow" />
            </AppLink>
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
