import { useEffect, useRef } from 'react'
import { ResponsiveImage } from '../../components/ResponsiveImage'
import { ButtonLink } from '../../components/ui'
import { Icon } from '../../components/Icon'
import { LogoMark } from '../../components/Logo'
import { STARTING_PRICE } from '../../data/pricing'
import { useLocale, useT, formatEuro } from '../../i18n/locale'
import { onIdle, prefersReducedMotion, stagger } from '../../lib/motion'
import { pathFor } from '../../routes'

const copy = {
  eyebrow: { fi: 'Verkkosivut yrityksille · Conversion First', en: 'Websites for businesses · Conversion First' },
  title: { fi: 'Verkkosivut, jotka näyttävät hyvältä', en: 'Websites that look good' },
  accent: { fi: 'ja auttavat myymään.', en: 'and help you sell.' },
  lead: {
    fi: 'Suunnittelemme yrityksellesi yksilölliset, nopeat ja myyntiin keskittyvät verkkosivut, jotka herättävät kiinnostusta ja tekevät yhteydenotosta helppoa.',
    en: 'We design distinctive, fast websites for your business that are focused on selling – built to spark interest and make getting in touch easy.',
  },
  packages: { fi: 'Katso verkkosivupaketit', en: 'See the website packages' },
  work: { fi: 'Tutustu toteutuksiin', en: 'See our work' },
  from: { fi: 'Verkkosivut alk.', en: 'Websites from' },
  fromFact: { fi: 'verkkosivupakettien aloitushinta', en: 'starting price for website packages' },
  satisfaction: { fi: '100 %', en: '100%' },
  satisfactionFact: { fi: 'asiakastyytyväisyys', en: 'customer satisfaction' },
  availableFact: { fi: 'verkkosivusi asiakkaiden saatavilla', en: 'your website available to customers' },
  speedChip: { fi: 'Nopeat ja hakukoneoptimoidut sivut', en: 'Fast, SEO-optimized websites' },
  stageLabel: {
    fi: 'Esimerkki työstämme: Pielisen Lumon verkkosivusto tietokoneella ja puhelimella',
    en: 'An example of our work: the Pielisen Lumo website on desktop and mobile',
  },
}

export function Hero() {
  const t = useT()
  const locale = useLocale()
  const heroRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Stacked (mobile/tablet) layouts anchor the ember glow to the end of the copy,
  // not to the bottom of the hero where the stage sits: --hero-fold is that line.
  useEffect(() => {
    const hero = heroRef.current
    const copy = copyRef.current
    if (!hero || !copy) return
    const update = () => {
      const fold = copy.getBoundingClientRect().bottom - hero.getBoundingClientRect().top
      hero.style.setProperty('--hero-fold', `${Math.round(fold)}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(hero)
    observer.observe(copy)
    return () => observer.disconnect()
  }, [])

  // The WebGL field is progressive enhancement, loaded once the page is idle.
  useEffect(() => {
    const canvas = canvasRef.current
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!canvas || connection?.saveData) return
    let stop: (() => void) | undefined
    let cancelled = false
    const cancelIdle = onIdle(() => {
      void import('./emberField').then(({ startEmberField }) => {
        if (cancelled) return
        const small = window.innerWidth < 720
        const stacked = window.matchMedia('(max-width: 61.99rem)').matches
        stop = startEmberField(canvas, {
          still: prefersReducedMotion(),
          scale: small ? 0.35 : 0.5,
          origin: stacked ? [0.5, 0.2] : undefined,
          onReady: () => canvas.classList.add('is-live'),
        })
      })
    }, 1200)
    return () => {
      cancelled = true
      cancelIdle()
      stop?.()
    }
  }, [])

  return (
    <section ref={heroRef} className="hero" data-tilt="" aria-labelledby="hero-title">
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="container hero__grid">
        <div ref={copyRef} className="hero__copy intro">
          <p className="eyebrow" style={stagger(0)}>
            {t(copy.eyebrow)}
          </p>
          <h1 id="hero-title" className="h-display" style={stagger(1)}>
            {t(copy.title)} <em className="accent">{t(copy.accent)}</em>
          </h1>
          <p className="lead" style={stagger(2)}>
            {t(copy.lead)}
          </p>
          <div className="btn-row" style={stagger(3)}>
            <ButtonLink to={pathFor('pricing', locale)}>{t(copy.packages)}</ButtonLink>
            <ButtonLink to={pathFor('work', locale)} variant="ghost" icon={null}>
              {t(copy.work)}
            </ButtonLink>
          </div>
          <ul className="hero__facts" style={stagger(4)}>
            <li>
              <strong>{formatEuro(STARTING_PRICE, locale)}</strong>
              <span>{t(copy.fromFact)}</span>
            </li>
            <li>
              <strong>{t(copy.satisfaction)}</strong>
              <span>{t(copy.satisfactionFact)}</span>
            </li>
            <li>
              <strong>24/7</strong>
              <span>{t(copy.availableFact)}</span>
            </li>
          </ul>
        </div>

        <div className="hero__stage" role="img" aria-label={t(copy.stageLabel)}>
          <div className="stage">
            <div className="stage__shard" aria-hidden="true">
              <LogoMark />
            </div>
            <div className="stage__browser glass">
              <div className="stage__bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>pielisenlumo.net</span>
              </div>
              <ResponsiveImage name="pielisen-lumo-desktop" alt="" sizes="(min-width: 62rem) 34rem, 90vw" priority />
            </div>
            <div className="stage__phone">
              <ResponsiveImage name="pielisen-lumo-mobile" alt="" sizes="9rem" />
            </div>
            <div className="stage__chip stage__chip--price glass">
              <span className="dot" />
              <span>
                {t(copy.from)} <strong>{formatEuro(STARTING_PRICE, locale)}</strong>
              </span>
            </div>
            <div className="stage__chip stage__chip--speed glass">
              <Icon name="bolt" />
              <span>{t(copy.speedChip)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
