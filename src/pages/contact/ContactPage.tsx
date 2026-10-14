import { Icon } from '../../components/Icon'
import { PageHero } from '../../components/ui'
import { business } from '../../data/business'
import { ContactForm } from '../../features/contact/ContactForm'
import { useT } from '../../i18n/locale'
import { stagger } from '../../lib/motion'
import { usePageSeo } from '../../seo/usePageSeo'
import type { PageProps } from '../registry'

const copy = {
  eyebrow: { fi: 'Ota yhteyttä', en: 'Contact' },
  title: { fi: 'Kerro', en: 'Tell us about' },
  accent: { fi: 'projektistasi.', en: 'your project.' },
  lead: {
    fi: 'Pyydä maksuton tarjous tai kysy mitä tahansa verkkosivuista. Vastaamme yleensä 24 tunnin kuluessa arkipäivisin.',
    en: 'Ask for a free quote or anything about websites. We usually reply within 24 hours on business days.',
  },
  direct: { fi: 'Suoraan meille', en: 'Reach us directly' },
  email: { fi: 'Sähköposti', en: 'Email' },
  phone: { fi: 'Puhelin', en: 'Phone' },
  location: { fi: 'Sijainti', en: 'Location' },
  reply: { fi: 'Vastausaika', en: 'Response time' },
}

export default function ContactPage({ id }: PageProps) {
  usePageSeo(id)
  const t = useT()

  return (
    <>
      <PageHero id={id} eyebrow={t(copy.eyebrow)} title={t(copy.title)} accent={t(copy.accent)} lead={t(copy.lead)} />

      <section className="section section--tight" aria-label={t(copy.eyebrow)}>
        <div className="container contact-grid">
          <div data-reveal="">
            <ContactForm />
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
                <div>
                  <dt>
                    <Icon name="clock" /> {t(copy.reply)}
                  </dt>
                  <dd className="muted">{t(business.responseTime)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
