import { Icon } from '../../components/Icon'
import { MaintenancePlan } from '../../components/MaintenancePlan'
import { CALCULATOR_ID, TierCard } from '../../components/pricing/TierCard'
import { TrustStrip } from '../../components/TrustStrip'
import { CtaBand, FaqList, PageHero, SectionHead } from '../../components/ui'
import { pricingFaq } from '../../data/content'
import { vatNote } from '../../data/packages'
import { TIER_IDS } from '../../data/pricing'
import { UNSURE_SEARCH } from '../../features/contact/fields'
import { useLocale, useT } from '../../i18n/locale'
import { AppLink } from '../../lib/AppLink'
import { pathFor } from '../../routes'
import { offerNodes } from '../../seo/schema'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'
import { AddonDetails } from './AddonDetails'
import { CostClarity } from './CostClarity'
import { PackageDifferences } from './PackageDifferences'
import { TierComparison } from './TierComparison'
import { WhyApollo } from './WhyApollo'
import { ZeusCalculator } from './ZeusCalculator'

const copy = {
  eyebrow: { fi: 'Hinnasto', en: 'Pricing' },
  title: { fi: 'Suunniteltu näyttämään hyvältä.', en: 'Designed to look good.' },
  accent: { fi: 'Rakennettu myymään.', en: 'Built to sell.' },
  lead: {
    fi: 'Kolme selkeää pakettia, yksi periaate: Conversion First. Jokainen sivusto suunnitellaan samalla huolellisuudella herättämään kiinnostusta, rakentamaan luottamusta ja tekemään yhteydenotosta helppoa – sinä valitset laajuuden.',
    en: 'Three clear packages, one principle: Conversion First. Every site is designed with the same care to spark interest, build trust and make getting in touch easy – you choose the scope.',
  },
  jump: { fi: 'Hinnaston osiot', en: 'On this page' },
  jumpPackages: { fi: 'Paketit', en: 'Packages' },
  jumpDiffs: { fi: 'Erot lyhyesti', en: 'Differences' },
  jumpCompare: { fi: 'Vertailu', en: 'Comparison' },
  jumpCalc: { fi: 'Zeus-laskuri', en: 'Zeus calculator' },
  jumpFaq: { fi: 'Usein kysyttyä', en: 'FAQ' },
  packagesLabel: { fi: 'Verkkosivupaketit', en: 'Website packages' },
  oneTime: {
    fi: 'Kaikki hinnat ovat kertahintoja verkkosivuston suunnittelusta ja toteutuksesta. Ylläpito ja hosting ovat valinnaisia, erikseen laskutettavia palveluita.',
    en: 'All prices are one-time prices for designing and building the website. Maintenance and hosting are optional, separately billed services.',
  },
  unsure: { fi: 'Et ole varma? Pyydä suositus', en: 'Not sure? Ask for a recommendation' },
  diffsEyebrow: { fi: 'Erot lyhyesti', en: 'The differences in brief' },
  diffsTitle: { fi: 'Ero on laajuudessa,', en: 'The difference is scope,' },
  diffsAccent: { fi: 'ei laadussa.', en: 'not quality.' },
  diffsLead: {
    fi: 'Jokainen paketti suunnitellaan samalla Conversion First -periaatteella ja samalla huolellisuudella. Valitset vain, kuinka laaja sivustosi on ja mitä sen pitää osata.',
    en: 'Every package is designed on the same Conversion First principle and with the same care. You only choose how large your site is and what it needs to do.',
  },
  apolloEyebrow: { fi: 'Suosituksemme: Apollo', en: 'Our recommendation: Apollo' },
  apolloTitle: { fi: 'Miksi Apollo sopii', en: 'Why Apollo suits' },
  apolloAccent: { fi: 'useimmille yrityksille?', en: 'most businesses.' },
  compareEyebrow: { fi: 'Vertailu', en: 'Comparison' },
  compareTitle: { fi: 'Pakettien erot', en: 'The packages,' },
  compareAccent: { fi: 'yhdellä silmäyksellä.', en: 'side by side.' },
  compareLead: {
    fi: 'Merkit kertovat, mikä sisältyy hintaan, mikä on valinnainen lisäominaisuus ja mikä ei sisälly.',
    en: 'The markers show what is included in the price, what is an optional add-on and what is not included.',
  },
  calcEyebrow: { fi: 'Zeus-laskuri', en: 'Zeus calculator' },
  calcTitle: { fi: 'Räätälöi oma', en: 'Configure your' },
  calcAccent: { fi: 'kokonaisuutesi.', en: 'own Zeus.' },
  calcLead: {
    fi: 'Zeus on Apollo-verkkosivusto, johon valitset vain tarvitsemasi lisäominaisuudet. Hinta päivittyy heti, kun muutat valintoja.',
    en: 'Zeus is the Apollo website with only the add-ons you need. The price updates as soon as you change your selection.',
  },
  addonsEyebrow: { fi: 'Lisäominaisuudet selkokielellä', en: 'The add-ons in plain language' },
  addonsTitle: { fi: 'Mitä Zeus-lisäominaisuudet', en: 'What the Zeus add-ons' },
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
  trustLabel: { fi: 'Referenssit ja asiakaspalaute', en: 'References and client feedback' },
  faqEyebrow: { fi: 'Usein kysyttyä', en: 'FAQ' },
  faqTitle: { fi: 'Kysymyksiä paketeista', en: 'Questions about' },
  faqAccent: { fi: 'ja hinnoista.', en: 'packages and pricing.' },
  ctaTitle: { fi: 'Et ole varma, mikä paketti sopii?', en: 'Not sure which package fits?' },
  ctaText: {
    fi: 'Kerro lyhyesti yrityksestäsi ja tavoitteistasi. Suosittelemme sopivimman kokonaisuuden – emme kalleinta. Tarjous on maksuton ja sitoumukseton.',
    en: 'Tell us briefly about your business and goals. We’ll recommend the best fit – not the most expensive option. The quote is free and non-binding.',
  },
}

const SECTIONS = { packages: 'paketit', diffs: 'erot', compare: 'vertailu', faq: 'kysymykset' } as const

export default function PricingPage({ id }: PageProps) {
  const locale = useLocale()
  usePageSeo(id, { extra: offerNodes(locale) })
  const t = useT()

  const jumps = [
    { href: SECTIONS.packages, label: copy.jumpPackages },
    { href: SECTIONS.diffs, label: copy.jumpDiffs },
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
            <AppLink to={pathFor('contact', locale) + UNSURE_SEARCH} className="link">
              {t(copy.unsure)} <Icon name="arrow" />
            </AppLink>
          </p>
        </div>
      </section>

      <section id={SECTIONS.diffs} className="section section--tight" aria-labelledby="diffs-title">
        <div className="container">
          <SectionHead
            id="diffs-title"
            eyebrow={t(copy.diffsEyebrow)}
            title={t(copy.diffsTitle)}
            accent={t(copy.diffsAccent)}
            lead={t(copy.diffsLead)}
            split
          />
          <PackageDifferences />
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

      <section className="section section--tight" aria-label={t(copy.trustLabel)}>
        <div className="container">
          <TrustStrip />
        </div>
      </section>

      <section id={SECTIONS.faq} className="section" aria-labelledby="pricing-faq">
        <div className="container narrow">
          <SectionHead id="pricing-faq" eyebrow={t(copy.faqEyebrow)} title={t(copy.faqTitle)} accent={t(copy.faqAccent)} />
          <FaqList items={pricingFaq} />
        </div>
      </section>

      <CtaBand title={t(copy.ctaTitle)} text={t(copy.ctaText)} to={pathFor('contact', locale) + UNSURE_SEARCH} />
    </>
  )
}
