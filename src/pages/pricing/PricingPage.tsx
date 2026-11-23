import { Icon } from '../../components/Icon'
import { MaintenancePlan } from '../../components/MaintenancePlan'
import { CALCULATOR_ID, TierCard } from '../../components/pricing/TierCard'
import { CtaBand, FaqList, PageHero, SectionHead } from '../../components/ui'
import { pricingFaq } from '../../data/content'
import { vatNote } from '../../data/packages'
import { TIER_IDS } from '../../data/pricing'
import { useLocale, useT } from '../../i18n/locale'
import { AppLink } from '../../lib/AppLink'
import { pathFor } from '../../routes'
import { offerNodes } from '../../seo/schema'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'
import { AddonDetails } from './AddonDetails'
import { ConversionFirst } from './ConversionFirst'
import { CostClarity } from './CostClarity'
import { TierComparison } from './TierComparison'
import { WhyApollo } from './WhyApollo'
import { ZeusCalculator } from './ZeusCalculator'

const copy = {
  eyebrow: { fi: 'Hinnasto', en: 'Pricing' },
  title: { fi: 'Suunniteltu näyttämään hyvältä.', en: 'Designed to look good.' },
  accent: { fi: 'Rakennettu myymään.', en: 'Built to sell.' },
  lead: {
    fi: 'Kolme selkeää pakettia, yksi periaate: Conversion First. Jokainen sivusto suunnitellaan herättämään kiinnostusta, rakentamaan luottamusta ja tuomaan yhteydenottoja – sinä valitset laajuuden.',
    en: 'Three clear packages, one principle: Conversion First. Every site is designed to spark interest, build trust and bring in enquiries – you choose the scope.',
  },
  jump: { fi: 'Hinnaston osiot', en: 'On this page' },
  jumpPackages: { fi: 'Paketit', en: 'Packages' },
  jumpCompare: { fi: 'Vertailu', en: 'Comparison' },
  jumpCalc: { fi: 'Zeus-laskuri', en: 'Zeus calculator' },
  jumpFaq: { fi: 'Usein kysyttyä', en: 'FAQ' },
  packagesLabel: { fi: 'Verkkosivupaketit', en: 'Website packages' },
  oneTime: {
    fi: 'Kaikki hinnat ovat kertahintoja. Ylläpito ja hosting ovat valinnaisia, erikseen laskutettavia palveluita.',
    en: 'All prices are one-time prices. Maintenance and hosting are optional, separately billed services.',
  },
  storeLink: { fi: 'Tarvitsetko verkkokaupan?', en: 'Need an online store?' },
  cfEyebrow: { fi: 'Conversion First – kaikissa paketeissa', en: 'Conversion First – in every package' },
  cfTitle: { fi: 'Kaunis ulkoasu on', en: 'Good looks are' },
  cfAccent: { fi: 'vasta alkua.', en: 'only the beginning.' },
  cfLead: {
    fi: 'Conversion First tarkoittaa, että suunnittelemme sivuston asiakkaasi näkökulmasta: mitä hän etsii, mikä saa hänet luottamaan sinuun ja miten yhteydenotosta tulee vaivatonta.',
    en: 'Conversion First means we design the site from your customer’s point of view: what they are looking for, what makes them trust you and how getting in touch becomes effortless.',
  },
  apolloEyebrow: { fi: 'Suosituksemme: Apollo', en: 'Our recommendation: Apollo' },
  apolloTitle: { fi: 'Miksi Apollo sopii', en: 'Why Apollo suits' },
  apolloAccent: { fi: 'useimmille yrityksille?', en: 'most businesses.' },
  compareEyebrow: { fi: 'Vertailu', en: 'Comparison' },
  compareTitle: { fi: 'Pakettien erot', en: 'The packages,' },
  compareAccent: { fi: 'yhdellä silmäyksellä.', en: 'side by side.' },
  compareLead: {
    fi: 'Kaikissa paketeissa on sama laatu ja sama Conversion First -periaate. Erot ovat laajuudessa ja lisätoiminnoissa.',
    en: 'Every package shares the same quality and the same Conversion First principle. The differences are scope and extra functionality.',
  },
  calcEyebrow: { fi: 'Zeus-laskuri', en: 'Zeus calculator' },
  calcTitle: { fi: 'Kokoa oma', en: 'Build your' },
  calcAccent: { fi: 'kokonaisuutesi.', en: 'own package.' },
  calcLead: {
    fi: 'Zeus on Apollo-verkkosivusto, johon valitset vain tarvitsemasi lisäosat. Hinta päivittyy heti, kun muutat valintoja.',
    en: 'Zeus is the Apollo website with only the add-ons you need. The price updates as soon as you change your selection.',
  },
  addonsEyebrow: { fi: 'Lisäosat selkokielellä', en: 'The add-ons in plain language' },
  addonsTitle: { fi: 'Mitä Zeus-lisäosat', en: 'What the Zeus add-ons' },
  addonsAccent: { fi: 'tarkoittavat käytännössä?', en: 'mean in practice.' },
  clarityEyebrow: { fi: 'Läpinäkyvä hinnoittelu', en: 'Transparent pricing' },
  clarityTitle: { fi: 'Mitä hintaan sisältyy', en: 'What the price includes' },
  clarityAccent: { fi: '– ja mitä ei.', en: '– and what it doesn’t.' },
  planEyebrow: { fi: 'Ylläpito & hosting', en: 'Maintenance & hosting' },
  planTitle: { fi: 'Pidä sivustosi', en: 'Keep your site' },
  planAccent: { fi: 'huippukunnossa.', en: 'in top shape.' },
  planLead: {
    fi: 'Valinnainen jatkuva palvelu – ei sisälly pakettien kertahintoihin.',
    en: 'An optional ongoing service – not part of the one-time package prices.',
  },
  faqEyebrow: { fi: 'Usein kysyttyä', en: 'FAQ' },
  faqTitle: { fi: 'Kysymyksiä hinnoista', en: 'Questions about pricing' },
  ctaTitle: { fi: 'Et ole varma, mikä paketti sopii?', en: 'Not sure which package fits?' },
  ctaText: {
    fi: 'Kerro lyhyesti yrityksestäsi ja tavoitteistasi. Suosittelemme sopivimman kokonaisuuden – emme kalleinta. Tarjous on maksuton.',
    en: 'Tell us briefly about your business and goals. We’ll recommend the best fit – not the most expensive option. The quote is free.',
  },
}

const SECTIONS = { packages: 'paketit', compare: 'vertailu', faq: 'kysymykset' } as const

export default function PricingPage({ id }: PageProps) {
  const locale = useLocale()
  usePageSeo(id, { extra: offerNodes(locale) })
  const t = useT()

  const jumps = [
    { href: SECTIONS.packages, label: copy.jumpPackages },
    { href: SECTIONS.compare, label: copy.jumpCompare },
    { href: CALCULATOR_ID, label: copy.jumpCalc },
    { href: SECTIONS.faq, label: copy.jumpFaq },
  ]

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)}>
        <nav className="jump-nav" aria-label={t(copy.jump)}>
          {jumps.map((jump) => (
            <a key={jump.href} href={`#${jump.href}`} className="jump-nav__link">
              {t(jump.label)}
            </a>
          ))}
        </nav>
      </PageHero>

      <section id={SECTIONS.packages} className="section section--tight tiers-section" aria-label={t(copy.packagesLabel)}>
        <div className="container">
          <div className="tiers">
            {TIER_IDS.map((tierId, i) => (
              <TierCard key={tierId} id={tierId} index={i} inPage />
            ))}
          </div>
          <p className="tiers__note" data-reveal="fade">
            <span>
              {t(vatNote)} {t(copy.oneTime)}
            </span>
            <AppLink to={pathFor('ecommerce', locale)} className="link">
              {t(copy.storeLink)} <Icon name="arrow" />
            </AppLink>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="conversion-first">
        <div className="container">
          <SectionHead
            id="conversion-first"
            eyebrow={t(copy.cfEyebrow)}
            title={t(copy.cfTitle)}
            accent={t(copy.cfAccent)}
            lead={t(copy.cfLead)}
            split
          />
          <ConversionFirst />
        </div>
      </section>

      <section className="section why-apollo-section" aria-labelledby="why-apollo">
        <div className="container">
          <SectionHead id="why-apollo" eyebrow={t(copy.apolloEyebrow)} title={t(copy.apolloTitle)} accent={t(copy.apolloAccent)} />
          <WhyApollo />
        </div>
      </section>

      <section id={SECTIONS.compare} className="section" aria-labelledby="compare">
        <div className="container">
          <SectionHead
            id="compare"
            eyebrow={t(copy.compareEyebrow)}
            title={t(copy.compareTitle)}
            accent={t(copy.compareAccent)}
            lead={t(copy.compareLead)}
            split
          />
          <TierComparison />
        </div>
      </section>

      <section id={CALCULATOR_ID} className="section calc-section" aria-labelledby="calc-title">
        <div className="container">
          <SectionHead id="calc-title" eyebrow={t(copy.calcEyebrow)} title={t(copy.calcTitle)} accent={t(copy.calcAccent)} lead={t(copy.calcLead)} split />
          <ZeusCalculator />
        </div>
      </section>

      <section className="section" aria-labelledby="addons">
        <div className="container">
          <SectionHead id="addons" eyebrow={t(copy.addonsEyebrow)} title={t(copy.addonsTitle)} accent={t(copy.addonsAccent)} />
          <AddonDetails />
        </div>
      </section>

      <section className="section" aria-labelledby="clarity">
        <div className="container">
          <SectionHead id="clarity" eyebrow={t(copy.clarityEyebrow)} title={t(copy.clarityTitle)} accent={t(copy.clarityAccent)} />
          <CostClarity />
        </div>
      </section>

      <section className="section" aria-labelledby="plan">
        <div className="container">
          <SectionHead id="plan" eyebrow={t(copy.planEyebrow)} title={t(copy.planTitle)} accent={t(copy.planAccent)} lead={t(copy.planLead)} />
          <MaintenancePlan />
        </div>
      </section>

      <section id={SECTIONS.faq} className="section" aria-labelledby="pricing-faq">
        <div className="container narrow">
          <SectionHead id="pricing-faq" eyebrow={t(copy.faqEyebrow)} title={t(copy.faqTitle)} />
          <FaqList items={pricingFaq} />
        </div>
      </section>

      <CtaBand title={t(copy.ctaTitle)} text={t(copy.ctaText)} />
    </>
  )
}
