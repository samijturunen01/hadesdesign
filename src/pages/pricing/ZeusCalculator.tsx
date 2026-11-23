import { useState } from 'react'
import { useLocation } from 'react-router'
import { Icon } from '../../components/Icon'
import { ADDON_ICONS } from '../../components/pricing/addonIcons'
import { TierEmblem } from '../../components/pricing/TierEmblem'
import { ButtonLink } from '../../components/ui'
import { vatShort } from '../../data/packages'
import { addonsLabel, apolloBaseLabel, languagesLabel, languagesName, lineItemLabel, zeusSubtitle } from '../../components/pricing/labels'
import {
  ADDON_IDS,
  addonCount,
  ALL_ADDONS,
  clampLanguages,
  getAddon,
  hasAddons,
  lineItems,
  MAX_EXTRA_LANGUAGES,
  NO_ADDONS,
  PRICES,
  quoteFromSearch,
  quoteFromSelection,
  quoteToSearch,
  tierForSelection,
  zeusTotal,
  type AddonId,
  type ZeusSelection,
} from '../../data/pricing'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { useHydrated } from '../../lib/useHydrated'
import { useTweenedNumber } from '../../lib/useTweenedNumber'
import { pathFor } from '../../routes'

const copy = {
  legend: { fi: 'Valitse lisäosat', en: 'Choose your add-ons' },
  baseNote: { fi: 'Monisivuinen verkkosivusto – pohja, joka sisältyy aina', en: 'Multi-page website – the base, always included' },
  included: { fi: 'Sisältyy', en: 'Included' },
  fewer: { fi: 'Yksi lisäkieli vähemmän', en: 'One language fewer' },
  more: { fi: 'Yksi lisäkieli lisää', en: 'One more language' },
  finnishOnly: { fi: 'Sivusto on suomeksi.', en: 'The site is in Finnish.' },
  maxNote: { fi: 'Tarvitsetko useampia? Kerro siitä tarjouspyynnössä.', en: 'Need more? Mention it in your quote request.' },
  selectAll: { fi: 'Valitse kaikki lisäosat', en: 'Select every add-on' },
  clear: { fi: 'Tyhjennä valinnat', en: 'Clear selection' },
  yourChoice: { fi: 'Valintasi', en: 'Your selection' },
  apolloOnly: {
    fi: 'Ei lisäosia – tämä on Apollo-paketti sellaisenaan.',
    en: 'No add-ons – this is simply the Apollo package.',
  },
  total: { fi: 'Yhteensä', en: 'Total' },
  oneTime: { fi: 'Kertahinta', en: 'One-time price' },
  cta: { fi: 'Pyydä tarjous', en: 'Request a quote' },
  ctaMore: { fi: ' valitsemastasi kokonaisuudesta', en: ' for this selection' },
  fine: {
    fi: 'Laskuri näyttää hinnan – se ei tee tilausta. Tarjouspyyntö on maksuton eikä sido sinua mihinkään. Ulkoisten palveluiden, kuten maksupalvelun, kulut eivät sisälly hintaan.',
    en: 'The calculator shows the price – it does not place an order. A quote request is free and does not commit you to anything. Costs of external services, such as a payment provider, are not included.',
  },
}

/** The calculator. Starts from a ?package=… query when one is present (e.g. "edit" from the contact form). */
export function ZeusCalculator() {
  const { search } = useLocation()
  const hydrated = useHydrated()
  const fromUrl = hydrated ? quoteFromSearch(search) : null
  const initial = fromUrl && fromUrl.tier !== 'hermes' ? fromUrl.selection : NO_ADDONS
  return <Calculator key={quoteToSearch(quoteFromSelection(initial))} initial={initial} />
}

function Calculator({ initial }: { initial: ZeusSelection }) {
  const t = useT()
  const locale = useLocale()
  const [selection, setSelection] = useState<ZeusSelection>(initial)

  const total = zeusTotal(selection)
  const shown = useTweenedNumber(total)
  const tier = tierForSelection(selection)
  const count = addonCount(selection)
  const languages = selection.languages
  const everything = ADDON_IDS.every((id) => selection[id]) && languages >= 1
  const anything = hasAddons(selection)

  const languageAddon = getAddon('languages')

  const toggle = (id: AddonId) => setSelection((s) => ({ ...s, [id]: !s[id] }))
  const stepLanguages = (delta: 1 | -1) =>
    setSelection((s) => ({ ...s, languages: clampLanguages(s.languages + delta) }))

  const live =
    (tier === 'zeus' ? `Zeus: Apollo + ${addonsLabel(count, locale)}` : 'Apollo') +
    (languages ? `, ${languagesLabel(languages, locale)}` : '') +
    `. ${t(copy.total)} ${formatEuro(total, locale)}.`

  return (
    <div className="calc">
      <fieldset className="calc__options">
        <legend className="calc__legend">{t(copy.legend)}</legend>

        <div className="calc__base">
          <span className="calc__base-emblem">
            <TierEmblem tier="apollo" />
          </span>
          <span className="calc-option__body">
            <span className="calc-option__name">{t(apolloBaseLabel)}</span>
            <span className="calc-option__desc">{t(copy.baseNote)}</span>
          </span>
          <span className="calc-option__price">
            <span className="calc__included">{t(copy.included)}</span>
            {formatEuro(PRICES.apollo, locale)}
          </span>
        </div>

        {ADDON_IDS.map((id) => {
          const addon = getAddon(id)
          return (
            <label key={id} className={`calc-option${selection[id] ? ' is-on' : ''}`}>
              <input
                type="checkbox"
                className="calc-option__input"
                checked={selection[id]}
                onChange={() => toggle(id)}
                aria-labelledby={`calc-${id}-name calc-${id}-price`}
                aria-describedby={`calc-${id}-desc`}
              />
              <span className="calc-option__check" aria-hidden="true">
                <Icon name="check" />
              </span>
              <span className="calc-option__icon" aria-hidden="true">
                <Icon name={ADDON_ICONS[id]} />
              </span>
              <span className="calc-option__body">
                <span id={`calc-${id}-name`} className="calc-option__name">
                  {t(addon.name)}
                </span>
                <span id={`calc-${id}-desc`} className="calc-option__desc">
                  {t(addon.summary)}
                </span>
              </span>
              <span id={`calc-${id}-price`} className="calc-option__price">
                +{formatEuro(addon.price, locale)}
              </span>
            </label>
          )
        })}

        <div
          className={`calc-option calc-option--stepper${languages ? ' is-on' : ''}`}
          role="group"
          aria-labelledby="calc-languages-name"
          aria-describedby="calc-languages-desc calc-languages-state"
        >
          <span className="calc-option__icon" aria-hidden="true">
            <Icon name={ADDON_ICONS.languages} />
          </span>
          <span className="calc-option__body">
            <span id="calc-languages-name" className="calc-option__name">
              {t(languagesName)}
            </span>
            <span id="calc-languages-desc" className="calc-option__desc">
              {t(languageAddon.summary)}
            </span>
          </span>
          <span className="calc-option__price">
            <span>
              +{formatEuro(PRICES.language, locale)} {languageAddon.unit && <small>{t(languageAddon.unit)}</small>}
            </span>
          </span>
          <div className="stepper">
            <button
              type="button"
              className="stepper__btn"
              aria-label={t(copy.fewer)}
              aria-disabled={languages === 0}
              onClick={() => stepLanguages(-1)}
            >
              <Icon name="minus" />
            </button>
            <span className="stepper__value" aria-hidden="true">
              {languages}
            </span>
            <button
              type="button"
              className="stepper__btn"
              aria-label={t(copy.more)}
              aria-disabled={languages >= MAX_EXTRA_LANGUAGES}
              onClick={() => stepLanguages(1)}
            >
              <Icon name="plus" />
            </button>
            <span id="calc-languages-state" className="stepper__state">
              {languages === 0
                ? t(copy.finnishOnly)
                : locale === 'fi'
                  ? `${languagesLabel(languages, locale)} – kieliä yhteensä ${languages + 1}.`
                  : `${languagesLabel(languages, locale)} – ${languages + 1} languages in total.`}
              {languages >= MAX_EXTRA_LANGUAGES && ` ${t(copy.maxNote)}`}
            </span>
          </div>
        </div>

        <div className="calc__quick">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            aria-disabled={everything}
            onClick={() => setSelection((s) => ({ ...ALL_ADDONS, languages: Math.max(1, s.languages) }))}
          >
            <Icon name="spark" />
            <span>{t(copy.selectAll)}</span>
          </button>
          <button
            type="button"
            className="calc__clear"
            aria-disabled={!anything}
            onClick={() => setSelection(NO_ADDONS)}
          >
            <Icon name="refresh" />
            <span>{t(copy.clear)}</span>
          </button>
        </div>
      </fieldset>

      <div className="calc__aside">
        <div className={`calc__summary glass glass--strong is-${tier}`}>
          <p className="eyebrow">{t(copy.yourChoice)}</p>
          <div className="calc__tier">
            <span className={`calc__tier-emblem tier--${tier}`}>
              <TierEmblem tier={tier} />
            </span>
            <div>
              <p className="calc__tier-name">{tier === 'zeus' ? 'Zeus' : 'Apollo'}</p>
              <p className="calc__tier-sub">{zeusSubtitle(selection, locale) ?? t(copy.apolloOnly)}</p>
            </div>
          </div>
          <ul className="calc__lines">
            {lineItems(selection).map((item) => (
              <li key={item.id}>
                <span>{lineItemLabel(item, locale)}</span>
                <span>{formatEuro(item.amount, locale)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="calc__total">
          <div className="calc__sum">
            <span className="calc__sum-label">{t(copy.total)}</span>
            <span className="calc__sum-amount" aria-hidden="true">
              {formatEuro(shown, locale)}
            </span>
            <span className="calc__sum-note">
              {t(copy.oneTime)} · {t(vatShort)}
            </span>
            <p className="visually-hidden" aria-live="polite" aria-atomic="true">
              {live}
            </p>
          </div>
          <ButtonLink
            to={pathFor('contact', locale) + quoteToSearch(quoteFromSelection(selection))}
            className="calc__cta"
          >
            {t(copy.cta)}
            <span className="calc__cta-more">{t(copy.ctaMore)}</span>
          </ButtonLink>
        </div>

        <p className="calc__fine">{t(copy.fine)}</p>
      </div>
    </div>
  )
}
