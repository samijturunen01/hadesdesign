import { Icon } from '../../components/Icon'
import { maintenancePlan } from '../../data/packages'
import { formatEuro, useLocale, useT, type Locale, type Localized } from '../../i18n/locale'
import { ui } from '../../i18n/strings'
import { stagger } from '../../lib/motion'

const copy = {
  inTitle: { fi: 'Sisältyy kertahintaan', en: 'Included in the one-time price' },
  outTitle: { fi: 'Ei sisälly – sovitaan tai laskutetaan erikseen', en: 'Not included – agreed or billed separately' },
}

const included: Localized[] = [
  {
    fi: 'Verkkosivuston suunnittelu ja toteutus valitun paketin laajuudessa',
    en: 'Designing and building the website to the scope of your package',
  },
  { fi: 'Valitsemiesi Zeus-lisäosien käyttöönotto', en: 'Setting up the Zeus add-ons you choose' },
  {
    fi: 'Conversion First -suunnittelu, responsiivisuus ja hakukoneoptimointi paketin mukaisesti',
    en: 'Conversion First planning, responsive layouts and SEO as described for your package',
  },
  {
    fi: 'Julkaisuvalmis sivusto, jonka omistat, kun maksu on suoritettu',
    en: 'A ready-to-publish website that you own once payment has been made',
  },
]

function excluded(locale: Locale): string[] {
  const plan = maintenancePlan
  const maintenance =
    locale === 'fi'
      ? `Ylläpito ja hosting – valinnainen jatkuva palvelu, ${formatEuro(plan.monthly, 'fi')}${ui.perMonth.fi} tai ${formatEuro(plan.yearly, 'fi')}${ui.perYear.fi}`
      : `Maintenance and hosting – an optional ongoing service, ${formatEuro(plan.monthly, 'en')}${ui.perMonth.en} or ${formatEuro(plan.yearly, 'en')}${ui.perYear.en}`
  const rest: Localized[] = [
    { fi: 'Julkaisun jälkeinen tuki ja sisältöpäivitykset', en: 'Post-launch support and content updates' },
    {
      fi: 'Maksupalveluntarjoajan transaktio- ja kuukausimaksut',
      en: 'Payment provider transaction and monthly fees',
    },
    {
      fi: 'Ulkoisten palveluiden tilausmaksut ja mahdolliset kolmansien osapuolten lisenssit',
      en: 'Subscriptions to external services and any third-party licences',
    },
    {
      fi: 'Laajat käännöstyöt ja ulkopuolinen käännöstarkastus',
      en: 'Extensive translation work and external translation review',
    },
    {
      fi: 'Pakettien ulkopuoliset toiminnot ja räätälöity ohjelmistokehitys',
      en: 'Functionality beyond the packages and custom software development',
    },
  ]
  return [maintenance, ...rest.map((item) => item[locale])]
}

export function CostClarity() {
  const t = useT()
  const locale = useLocale()
  return (
    <div className="clarity">
      <div className="clarity__col card glass" data-reveal="">
        <h3>
          <span className="clarity__mark is-yes">
            <Icon name="check" />
          </span>
          {t(copy.inTitle)}
        </h3>
        <ul className="check-list">
          {included.map((item) => (
            <li key={item.fi}>
              <Icon name="check" />
              <span>{t(item)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="clarity__col card glass" data-reveal="" style={stagger(1)}>
        <h3>
          <span className="clarity__mark is-no">
            <Icon name="plus" />
          </span>
          {t(copy.outTitle)}
        </h3>
        <ul className="clarity__list">
          {excluded(locale).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
