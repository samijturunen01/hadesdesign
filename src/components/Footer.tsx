import { business } from '../data/business'
import { services } from '../data/services'
import { useT } from '../i18n/locale'
import { ui } from '../i18n/strings'
import type { PageId } from '../routes'
import { Icon } from './Icon'
import { LogoMark } from './Logo'
import { ContactLines, PageLink } from './ui'

const COMPANY: PageId[] = ['work', 'pricing', 'about', 'contact']
const LEGAL: PageId[] = ['privacy', 'terms']

export function Footer() {
  const t = useT()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <PageLink id="home" className="brand-link">
              <LogoMark />
              <span>{business.name}</span>
            </PageLink>
            <p>{t(ui.footerTagline)}</p>
          </div>

          <div className="footer-col">
            <h2>{t(ui.footerServices)}</h2>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <PageLink id={service.id}>{t(service.name)}</PageLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2>{t(ui.footerCompany)}</h2>
            <ul>
              {COMPANY.map((id) => (
                <li key={id}>
                  <PageLink id={id} />
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2>{t(ui.footerContact)}</h2>
            <ContactLines />
            <p className="muted" style={{ marginTop: '0.8rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Icon name="pin" className="footer-pin" />
              {business.location.city}, {t(business.location.country)}
            </p>
          </div>
        </div>

        <p className="footer-word" aria-hidden="true">
          Hades Design
        </p>

        <div className="footer-bottom">
          <p>
            © {year} {business.name}. {t(ui.rights)}
          </p>
          <div className="footer-col">
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              {LEGAL.map((id) => (
                <li key={id}>
                  <PageLink id={id} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
