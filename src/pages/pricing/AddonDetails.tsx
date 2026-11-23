import { Icon } from '../../components/Icon'
import { ADDON_ICONS } from '../../components/pricing/addonIcons'
import { addons } from '../../data/pricing'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { stagger } from '../../lib/motion'

const copy = {
  what: { fi: 'Mitä saat', en: 'What you get' },
  when: { fi: 'Hyödyllinen', en: 'Useful' },
  note: { fi: 'Hyvä tietää', en: 'Good to know' },
}

/** What each Zeus add-on means in practice – benefits first, limits stated plainly. */
export function AddonDetails() {
  const t = useT()
  const locale = useLocale()
  return (
    <div className="grid grid--2 addon-details">
      {addons.map((addon, i) => (
        <article key={addon.id} className="card glass addon-detail" data-reveal="" style={stagger(i)} aria-labelledby={`addon-${addon.id}`}>
          <header className="addon-detail__head">
            <span className="facet">
              <Icon name={ADDON_ICONS[addon.id]} />
            </span>
            <h3 id={`addon-${addon.id}`}>{t(addon.name)}</h3>
            <p className="addon-detail__price">
              +{formatEuro(addon.price, locale)}
              {addon.unit && <small> {t(addon.unit)}</small>}
            </p>
          </header>
          <dl className="addon-detail__list">
            <div>
              <dt>{t(copy.what)}</dt>
              <dd>{t(addon.what)}</dd>
            </div>
            <div>
              <dt>{t(copy.when)}</dt>
              <dd>{t(addon.when)}</dd>
            </div>
            <div className="is-note">
              <dt>{t(copy.note)}</dt>
              <dd>{t(addon.note)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}
