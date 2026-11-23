import { useLocation } from 'react-router'
import { Icon } from '../../components/Icon'
import { PageHero } from '../../components/ui'
import { business } from '../../data/business'
import { testimonial } from '../../data/content'
import { NO_ADDONS, quoteFromSearch, quoteToSearch } from '../../data/pricing'
import { ContactForm, type ContactInitial } from '../../features/contact/ContactForm'
import { serviceFromSearch } from '../../features/contact/fields'
import { useT } from '../../i18n/locale'
import { stagger } from '../../lib/motion'
import { useHydrated } from '../../lib/useHydrated'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const copy = {
  eyebrow: { fi: 'Ota yhteyttä', en: 'Contact' },
  title: { fi: 'Kerro', en: 'Tell us about' },
  accent: { fi: 'projektistasi.', en: 'your project.' },
  lead: {
    fi: 'Pyydä maksuton tarjous tai kysy suositusta sopivasta paketista. Vastaamme yleensä 24 tunnin kuluessa arkipäivisin.',
    en: 'Ask for a free quote or a recommendation for the right package. We usually reply within 24 hours on business days.',
  },
  direct: { fi: 'Suoraan meille', en: 'Reach us directly' },
  email: { fi: 'Sähköposti', en: 'Email' },
  phone: { fi: 'Puhelin', en: 'Phone' },
  location: { fi: 'Sijainti', en: 'Location' },
  nextTitle: { fi: 'Mitä tapahtuu seuraavaksi?', en: 'What happens next?' },
  quoteLabel: { fi: 'Asiakkaan sanoin', en: 'In a client’s words' },
}

const nextSteps = [
  {
    fi: 'Vastaamme yleensä 24 tunnin kuluessa arkipäivisin.',
    en: 'We usually reply within 24 hours on business days.',
  },
  {
    fi: 'Käymme tarpeesi läpi ja suosittelemme sopivimman paketin – emme kalleinta.',
    en: 'We go through what you need and recommend the package that fits best – not the most expensive one.',
  },
  {
    fi: 'Saat maksuttoman tarjouksen. Tarjouspyyntö ei sido sinua mihinkään.',
    en: 'You get a free quote. A quote request does not commit you to anything.',
  },
]

export default function ContactPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()
  // A package chosen on the pricing page arrives as ?package=…. The page is
  // prerendered without it, so it is read after hydration; the key gives the
  // form a fresh start with that choice.
  const { search } = useLocation()
  const hydrated = useHydrated()
  const quote = hydrated ? quoteFromSearch(search) : null
  const unsure = hydrated ? serviceFromSearch(search) : null
  const initial: ContactInitial | undefined = quote
    ? { service: quote.tier, selection: quote.selection }
    : unsure
      ? { service: unsure, selection: NO_ADDONS }
      : undefined

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)} />

      <section className="section section--tight" aria-label={t(copy.eyebrow)}>
        <div className="container contact-grid">
          <div data-reveal="">
            <ContactForm key={quote ? quoteToSearch(quote) : (unsure ?? '')} initial={initial} />
          </div>

          <aside className="contact-aside" aria-labelledby="contact-direct">
            <div className="card glass contact-card" data-reveal="" style={stagger(1)}>
              <h2 id="contact-direct" className="h-3">
                {t(copy.direct)}
              </h2>
              <dl className="contact-dl">
                <div>
                  <dt>
                    <Icon name="mail" /> {t(copy.email)}
                  </dt>
                  <dd>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icon name="phone" /> {t(copy.phone)}
                  </dt>
                  <dd>
                    <a href={business.phone.href}>{business.phone.display}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icon name="pin" /> {t(copy.location)}
                  </dt>
                  <dd>
                    {business.location.city}, {t(business.location.country)}
                    <span className="muted"> – {t(business.location.workMode)}</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card glass next-steps" data-reveal="" style={stagger(2)}>
              <h2 className="next-steps__title">{t(copy.nextTitle)}</h2>
              <ol>
                {nextSteps.map((step, i) => (
                  <li key={step.fi}>
                    <span className="next-steps__no" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>{t(step)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <figure className="card glass contact-quote" data-reveal="" style={stagger(3)} aria-label={t(copy.quoteLabel)}>
              <blockquote>
                <p>”{t(testimonial.quote)}”</p>
              </blockquote>
              <figcaption>
                <strong>{testimonial.author}</strong> · {t(testimonial.role)}
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </>
  )
}
