import { useState } from 'react'
import { ctaLabel } from '../data/navigation'
import { maintenancePlan } from '../data/packages'
import { formatEuro, useLocale, useT } from '../i18n/locale'
import { ui } from '../i18n/strings'
import { pathFor } from '../routes'
import { Icon, type IconName } from './Icon'
import { ButtonLink } from './ui'

const FEATURE_ICONS: IconName[] = ['refresh', 'server', 'shield', 'layers', 'clock', 'spark']

const copy = {
  billing: { fi: 'Laskutus', en: 'Billing' },
  monthly: { fi: 'Kuukausittain', en: 'Monthly' },
  yearly: { fi: 'Vuosittain', en: 'Yearly' },
  save: { fi: 'säästä', en: 'save' },
  yearlyNote: { fi: 'laskutetaan vuosittain', en: 'billed yearly' },
  monthlyNote: { fi: 'laskutetaan kuukausittain', en: 'billed monthly' },
}

/** The maintenance & hosting plan with a monthly / yearly switch. */
export function MaintenancePlan() {
  const t = useT()
  const locale = useLocale()
  const [yearly, setYearly] = useState(false)
  const plan = maintenancePlan

  return (
    <div className="plan glass" data-reveal="scale">
      <div className="plan__price">
        <h3 className="h-3">{t(plan.name)}</h3>
        <p className="muted">{t(plan.tagline)}</p>

        <div className="toggle" role="group" aria-label={t(copy.billing)}>
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>
            {t(copy.monthly)}
          </button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
            {t(copy.yearly)} <span className="chip chip--ember">−{plan.yearlySavingPercent}%</span>
          </button>
        </div>

        <p className="plan__amount" aria-live="polite">
          <strong>{formatEuro(yearly ? plan.yearly : plan.monthly, locale)}</strong>
          <span>{yearly ? t(ui.perYear) : t(ui.perMonth)}</span>
        </p>
        <p className="plan__note">
          {yearly
            ? `${formatEuro(plan.yearlyPerMonth, locale)}${t(ui.perMonth)} · ${t(copy.save)} ${formatEuro(plan.yearlySaving, locale)} · ${t(copy.yearlyNote)}`
            : t(copy.monthlyNote)}
        </p>
        <ButtonLink to={pathFor('contact', locale)}>{t(ctaLabel)}</ButtonLink>
      </div>

      <ul className="plan__features">
        {plan.features.map((feature, i) => (
          <li key={feature.title.fi}>
            <span className="facet">
              <Icon name={FEATURE_ICONS[i] ?? 'check'} />
            </span>
            <div>
              <h4>{t(feature.title)}</h4>
              <p className="muted">{t(feature.description)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
