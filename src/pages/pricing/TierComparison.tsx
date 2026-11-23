import { Icon } from '../../components/Icon'
import { TierEmblem } from '../../components/pricing/TierEmblem'
import { recommendedLabel } from '../../data/packages'
import { comparison, getAddon, getTier, headlinePrice, TIER_IDS, type CompareCell, type TierId } from '../../data/pricing'
import { formatEuro, useLocale, useT } from '../../i18n/locale'

const copy = {
  caption: { fi: 'Hermes-, Apollo- ja Zeus-pakettien vertailu', en: 'Hermes, Apollo and Zeus compared' },
  feature: { fi: 'Ominaisuus', en: 'Feature' },
  included: { fi: 'Sisältyy', en: 'Included' },
  notIncluded: { fi: 'Ei sisälly', en: 'Not included' },
  optional: { fi: 'valinnainen lisäosa', en: 'optional add-on' },
  allAddons: { fi: 'kaikilla lisäosilla', en: 'with every add-on' },
}

function Cell({ cell }: { cell: CompareCell }) {
  const t = useT()
  const locale = useLocale()
  if (cell === true) return <Icon name="check" className="yes" label={t(copy.included)} />
  if (cell === false) {
    return (
      <span className="no" role="img" aria-label={t(copy.notIncluded)}>
        –
      </span>
    )
  }
  if ('addon' in cell) {
    const addon = getAddon(cell.addon)
    return (
      <span className="cmp-addon">
        <span className="visually-hidden">{t(copy.optional)}: </span>+{formatEuro(addon.price, locale)}
        {addon.unit && <small> {t(addon.unit)}</small>}
      </span>
    )
  }
  return <span className="cmp-text">{t(cell)}</span>
}

function PriceLine({ id }: { id: TierId }) {
  const t = useT()
  const locale = useLocale()
  return (
    <span className="cmp-price">
      {formatEuro(headlinePrice(id), locale)}
      {id === 'zeus' && <small> {t(copy.allAddons)}</small>}
    </span>
  )
}

/** Desktop: one semantic table. Phones: the same rows stacked, with a sticky package legend. */
export function TierComparison() {
  const t = useT()

  return (
    <>
      <div className="cmp-table glass" data-reveal="">
        <table>
          <caption className="visually-hidden">{t(copy.caption)}</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">{t(copy.feature)}</span>
              </th>
              {TIER_IDS.map((id) => {
                const tier = getTier(id)
                return (
                  <th key={id} scope="col" className={`tier--${id}${tier.recommended ? ' is-hot' : ''}`}>
                    {tier.recommended && <span className="cmp-badge">{t(recommendedLabel)}</span>}
                    <span className="cmp-tier">
                      <TierEmblem tier={id} className="cmp-emblem" />
                      {tier.name}
                    </span>
                    <PriceLine id={id} />
                  </th>
                )
              })}
            </tr>
          </thead>
          {comparison.map((group) => (
            <tbody key={group.title.fi}>
              <tr className="cmp-group">
                <th scope="rowgroup">{t(group.title)}</th>
                {TIER_IDS.map((id) => (
                  <td key={id} className={getTier(id).recommended ? 'is-hot' : undefined} />
                ))}
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label.fi}>
                  <th scope="row">
                    {t(row.label)}
                    {row.note && <span className="cmp-note">{t(row.note)}</span>}
                  </th>
                  {TIER_IDS.map((id) => (
                    <td key={id} className={getTier(id).recommended ? 'is-hot' : undefined}>
                      <Cell cell={row.cells[id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <div className="cmp-stack">
        <div className="cmp-legend glass glass--strong" aria-hidden="true">
          {TIER_IDS.map((id) => (
            <span key={id} className={`cmp-legend__tier tier--${id}${getTier(id).recommended ? ' is-hot' : ''}`}>
              <TierEmblem tier={id} className="cmp-emblem" />
              <strong>{getTier(id).name}</strong>
              <PriceLine id={id} />
            </span>
          ))}
        </div>
        {comparison.map((group, g) => (
          <section key={group.title.fi} className="cmp-card glass" aria-labelledby={`cmp-group-${g}`}>
            <h3 id={`cmp-group-${g}`}>{t(group.title)}</h3>
            <ul>
              {group.rows.map((row) => (
                <li key={row.label.fi}>
                  <p className="cmp-card__label">{t(row.label)}</p>
                  {row.note && <p className="cmp-note">{t(row.note)}</p>}
                  <dl className="cmp-card__cells">
                    {TIER_IDS.map((id) => (
                      <div key={id} className={getTier(id).recommended ? 'is-hot' : undefined}>
                        <dt className="visually-hidden">{getTier(id).name}</dt>
                        <dd>
                          <Cell cell={row.cells[id]} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
