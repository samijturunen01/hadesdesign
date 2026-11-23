import { Icon } from '../../components/Icon'
import { TierEmblem } from '../../components/pricing/TierEmblem'
import { addons, comparison, getTier, PRICES } from '../../data/pricing'
import { formatEuro, useLocale, useT } from '../../i18n/locale'
import { stagger } from '../../lib/motion'

const copy = {
  sharedTitle: { fi: 'Kaikissa paketeissa', en: 'In every package' },
  sharedNote: {
    fi: 'Hermes ei ole riisuttu versio: se suunnitellaan yrityksesi brändin mukaan samalla huolellisuudella ja tekniikalla kuin Apollo – vain yhdelle sivulle.',
    en: 'Hermes is not a stripped-down version: it is designed around your brand with the same care and technology as Apollo – on a single page.',
  },
  diffTitle: { fi: 'Hermes ja Apollo eroavat kahdessa asiassa', en: 'Hermes and Apollo differ in two things' },
  site: { fi: 'Sivusto', en: 'Website' },
  form: { fi: 'Yhteydenottolomake', en: 'Contact form' },
  zeus: { fi: 'Zeus = koko Apollo', en: 'Zeus = the complete Apollo' },
  zeusPlus: { fi: '+ valitsemasi lisäominaisuudet:', en: '+ the add-ons you choose:' },
}

/**
 * The five-second answer to "what is the difference?": what every package
 * shares, the two things that separate Hermes and Apollo, and what Zeus adds.
 * Built from the same data as the comparison table, so the two never disagree.
 */
export function PackageDifferences() {
  const t = useT()
  const locale = useLocale()
  const shared = comparison[0]?.rows ?? []
  const hermes = getTier('hermes')
  const apollo = getTier('apollo')
  const formOf = (tier: typeof hermes) => tier.specs.find((s) => s.key === 'form')?.label

  const rows = [
    { label: copy.site, hermes: hermes.kind, apollo: apollo.kind },
    { label: copy.form, hermes: formOf(hermes), apollo: formOf(apollo) },
  ]

  return (
    <div className="diffs">
      <div className="diffs__shared card glass" data-reveal="">
        <h3 className="diffs__title">
          <Icon name="check" />
          {t(copy.sharedTitle)}
        </h3>
        <ul className="diffs__chips">
          {shared.map((row) => (
            <li key={row.label.fi} className="chip">
              {t(row.label)}
            </li>
          ))}
        </ul>
        <p className="diffs__note">{t(copy.sharedNote)}</p>
      </div>

      <div className="diffs__compare card glass" data-reveal="" style={stagger(1)}>
        <h3 className="diffs__title">
          <Icon name="layers" />
          {t(copy.diffTitle)}
        </h3>
        <table className="diffs__table">
          <thead>
            <tr>
              <td />
              <th scope="col" className="tier--hermes">
                <TierEmblem tier="hermes" className="diffs__emblem" />
                Hermes <span>{formatEuro(PRICES.hermes, locale)}</span>
              </th>
              <th scope="col" className="tier--apollo">
                <TierEmblem tier="apollo" className="diffs__emblem" />
                Apollo <span>{formatEuro(PRICES.apollo, locale)}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label.fi}>
                <th scope="row">{t(row.label)}</th>
                <td className="tier--hermes">{row.hermes && t(row.hermes)}</td>
                <td className="tier--apollo">{row.apollo && t(row.apollo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="diffs__zeus tier--zeus">
          <TierEmblem tier="zeus" className="diffs__emblem" />
          <span>
            <strong>{t(copy.zeus)}</strong> {t(copy.zeusPlus)}{' '}
            {addons.map((addon) => t(addon.short)).join(', ').toLocaleLowerCase(locale === 'fi' ? 'fi-FI' : 'en-GB')}.
          </span>
        </p>
      </div>
    </div>
  )
}
