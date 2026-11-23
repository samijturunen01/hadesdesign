import { recommendedLabel, vatShort } from '../../data/packages'
import { addons, getTier, headlinePrice, quoteForTier, quoteToSearch, ZEUS_FROM_PRICE, type TierId } from '../../data/pricing'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { stagger } from '../../lib/motion'
import { pathFor } from '../../routes'
import { Icon } from '../Icon'
import { ButtonLink } from '../ui'
import { ADDON_ICONS } from './addonIcons'
import { TierEmblem } from './TierEmblem'

const copy = {
  oneTime: { fi: 'Kertahinta', en: 'One-time price' },
  allAddons: { fi: 'Kaikilla lisäosilla', en: 'With every add-on' },
  orFrom: { fi: 'Tai vain tarvitsemasi lisäosat – alk.', en: 'Or only the add-ons you need – from' },
  idealFor: { fi: 'Sopii', en: 'Best for' },
  quote: { fi: 'Pyydä tarjous', en: 'Request a quote' },
  build: { fi: 'Kokoa oma Zeus', en: 'Build your Zeus' },
  payForChoices: { fi: 'Maksat vain valitsemistasi lisäosista.', en: 'You only pay for the add-ons you choose.' },
}

/** Calculator anchor on the pricing page. */
export const CALCULATOR_ID = 'laskuri'

/**
 * A Hermes / Apollo / Zeus package card. `inPage` = the calculator is on this
 * page, so Zeus links to it with a plain anchor instead of a route change.
 */
export function TierCard({ id, index = 0, inPage = false }: { id: TierId; index?: number; inPage?: boolean }) {
  const t = useT()
  const locale = useLocale()
  const tier = getTier(id)
  const zeus = id === 'zeus'

  return (
    <article
      className={`tier tier--${id} glass${tier.recommended ? ' is-recommended' : ''}`}
      data-spotlight=""
      data-reveal=""
      style={stagger(index)}
      aria-labelledby={`tier-${id}`}
    >
      <span className="tier__meander" aria-hidden="true" />
      {tier.recommended && (
        <p className="tier__badge">
          <Icon name="spark" />
          {t(recommendedLabel)}
        </p>
      )}

      <header className="tier__head">
        <span className="tier__emblem">
          <TierEmblem tier={id} />
        </span>
        <div>
          <h3 id={`tier-${id}`} className="tier__name">
            {tier.name}
          </h3>
          <p className="tier__kind">{t(tier.kind)}</p>
        </div>
      </header>

      <p className="tier__myth">{t(tier.myth)}</p>
      <p className="tier__desc">{t(tier.description)}</p>

      <div className="tier__price">
        <p className="tier__amount">{formatEuro(headlinePrice(id), locale)}</p>
        <span className="tier__price-note">
          {zeus && <strong>{t(copy.allAddons)} · </strong>}
          {t(copy.oneTime)} · {t(vatShort)}
        </span>
        {zeus && (
          <p className="tier__from">
            {t(copy.orFrom)} <strong>{formatEuro(ZEUS_FROM_PRICE, locale)}</strong>
          </p>
        )}
      </div>

      <p className="tier__ideal">
        <span>{t(copy.idealFor)}</span>
        {t(tier.idealFor)}
      </p>

      <div className="tier__includes">
        {tier.includesLead && <p className="tier__lead">{t(tier.includesLead)}</p>}
        {zeus ? (
          <>
            <ul className="tier__addons">
              {addons.map((addon) => (
                <li key={addon.id}>
                  <Icon name={ADDON_ICONS[addon.id]} />
                  <span>{t(addon.name)}</span>
                  <span className="tier__addon-price">
                    +{formatEuro(addon.price, locale)}
                    {addon.unit && <small> {t(addon.unit)}</small>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="tier__fine">{t(copy.payForChoices)}</p>
          </>
        ) : (
          <ul className="check-list">
            {t(tier.features).map((feature) => (
              <li key={feature}>
                <Icon name="check" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tier__cta">
        {zeus ? (
          <ButtonLink to={`${inPage ? '' : pathFor('pricing', locale)}#${CALCULATOR_ID}`} variant="ghost">
            {t(copy.build)}
          </ButtonLink>
        ) : (
          <ButtonLink
            to={pathFor('contact', locale) + quoteToSearch(quoteForTier(id))}
            variant={tier.recommended ? 'primary' : 'ghost'}
          >
            {t(copy.quote)}
            <span className="visually-hidden">: {tier.name}</span>
          </ButtonLink>
        )}
      </div>
    </article>
  )
}
