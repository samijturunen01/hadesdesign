import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router'
import { business } from '../data/business'
import { ctaLabel, pageNames, parentOf, primaryNav } from '../data/navigation'
import { getService } from '../data/services'
import { LOCALE_META, useLocale, useT } from '../i18n/locale'
import { ui } from '../i18n/strings'
import { AppLink } from '../lib/AppLink'
import { hasFinePointer } from '../lib/motion'
import { matchPage, pathFor, translatePath } from '../routes'
import { Icon } from './Icon'
import { LogoMark } from './Logo'
import { ButtonLink, ContactLines } from './ui'

export function Header() {
  const t = useT()
  const locale = useLocale()
  const { pathname } = useLocation()
  const current = matchPage(pathname)?.id
  const otherLocale = locale === 'fi' ? 'en' : 'fi'
  const headerRef = useRef<HTMLElement>(null)
  const closeTimer = useRef(0)

  // Menus remember the path they were opened on, so any navigation closes them.
  const [servicesOpenAt, setServicesOpenAt] = useState<string | null>(null)
  const [mobileOpenAt, setMobileOpenAt] = useState<string | null>(null)
  const servicesOpen = servicesOpenAt === pathname
  const mobileOpen = mobileOpenAt === pathname

  // Glass bar appears once the page scrolls.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!servicesOpen && !mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setServicesOpenAt(null)
      setMobileOpenAt(null)
    }
    const onClick = (event: MouseEvent) => {
      if (servicesOpen && !(event.target as Element).closest('.nav-item--services')) setServicesOpenAt(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    if (mobileOpen) document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
      document.documentElement.style.overflow = ''
    }
  }, [servicesOpen, mobileOpen])

  const hoverOpen = () => {
    if (!hasFinePointer()) return
    window.clearTimeout(closeTimer.current)
    setServicesOpenAt(pathname)
  }
  const hoverClose = () => {
    if (!hasFinePointer()) return
    closeTimer.current = window.setTimeout(() => setServicesOpenAt(null), 180)
  }

  const isActive = (id: string) => current === id || (current && parentOf[current] === id)
  const services = primaryNav.find((item) => item.id === 'services')?.children ?? []

  return (
    <header className="site-header" ref={headerRef} data-open={mobileOpen ? '' : undefined}>
      <div className="container">
        <div className="site-header__bar">
          <AppLink to={pathFor('home', locale)} className="brand-link" aria-label={t(ui.homeLink)}>
            <LogoMark />
            <span aria-hidden="true">{business.name}</span>
          </AppLink>

          <nav className="nav" aria-label={t(ui.mainNav)}>
            <ul>
              {primaryNav.map((item) =>
                item.children ? (
                  <li key={item.id} className="nav-item nav-item--services" onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
                    <button
                      type="button"
                      className="nav-link"
                      aria-expanded={servicesOpen}
                      aria-controls="services-menu"
                      data-active={isActive(item.id) ? '' : undefined}
                      onClick={() => setServicesOpenAt(servicesOpen ? null : pathname)}
                    >
                      {t(pageNames[item.id])}
                      <Icon name="chevron" />
                    </button>
                    <div id="services-menu" className="menu-panel glass" data-open={servicesOpen ? '' : undefined}>
                      <ul>
                        {item.children.map((id) => {
                          const service = getService(id)
                          return (
                            <li key={id}>
                              <AppLink to={pathFor(id, locale)} aria-current={current === id ? 'page' : undefined}>
                                <strong>
                                  {t(service.name)}
                                  {service.price && <small>{t(service.price)}</small>}
                                </strong>
                                <span>{t(service.summary)}</span>
                              </AppLink>
                            </li>
                          )
                        })}
                        <li className="menu-panel__all-item" style={{ gridColumn: '1 / -1' }}>
                          <AppLink to={pathFor('services', locale)} className="menu-panel__all">
                            {t(ui.allServices)}
                            <Icon name="arrow" className="menu-arrow" />
                          </AppLink>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.id}>
                    <AppLink
                      to={pathFor(item.id, locale)}
                      className="nav-link"
                      aria-current={current === item.id ? 'page' : undefined}
                    >
                      {t(pageNames[item.id])}
                    </AppLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="header-actions">
            <AppLink
              to={translatePath(pathname, otherLocale)}
              className="lang-switch"
              hrefLang={LOCALE_META[otherLocale].htmlLang}
              lang={LOCALE_META[otherLocale].htmlLang}
              aria-label={t(ui.switchLanguage)}
            >
              {LOCALE_META[otherLocale].short}
            </AppLink>
            <ButtonLink to={pathFor('contact', locale)} size="sm" className="header-cta">
              {t(ctaLabel)}
            </ButtonLink>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t(ui.closeMenu) : t(ui.openMenu)}
              onClick={() => setMobileOpenAt(mobileOpen ? null : pathname)}
            >
              <span />
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={mobileOpen ? '' : undefined} inert={!mobileOpen}>
        <nav aria-label={t(ui.mainNav)}>
          <ul className="mobile-menu__primary">
            {[{ id: 'home' as const }, ...primaryNav, { id: 'contact' as const }].map((item, i) => (
              <li key={item.id} style={{ '--i': i } as CSSProperties}>
                <AppLink to={pathFor(item.id, locale)} aria-current={current === item.id ? 'page' : undefined}>
                  {t(pageNames[item.id])}
                  <Icon name="arrow" className="menu-arrow" />
                </AppLink>
                {item.id === 'services' && (
                  <ul className="mobile-menu__sub">
                    {services.map((id) => (
                      <li key={id}>
                        <AppLink to={pathFor(id, locale)} className="chip" aria-current={current === id ? 'page' : undefined}>
                          {t(pageNames[id])}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__footer" style={{ '--i': 7 } as CSSProperties}>
          <ButtonLink to={pathFor('contact', locale)}>{t(ctaLabel)}</ButtonLink>
          <ContactLines />
        </div>
      </div>
    </header>
  )
}
