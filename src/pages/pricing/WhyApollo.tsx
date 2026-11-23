import { useState } from 'react'
import { Icon, type IconName } from '../../components/Icon'
import { TierEmblem } from '../../components/pricing/TierEmblem'
import { ButtonLink } from '../../components/ui'
import { PRICES, quoteForTier, quoteToSearch } from '../../data/pricing'
import { formatEuro, useLocale, useT, type Localized } from '../../i18n/locale'
import { stagger } from '../../lib/motion'
import { pathFor } from '../../routes'

const reasons: Array<{ icon: IconName; title: Localized; text: Localized }> = [
  {
    icon: 'layers',
    title: { fi: 'Jokaiselle palvelulle oma sivu', en: 'A page for every service' },
    text: {
      fi: 'Asiakas löytää juuri etsimänsä, ja hakukoneet ymmärtävät paremmin, mitä tarjoat.',
      en: 'Customers find exactly what they are looking for, and search engines better understand what you offer.',
    },
  },
  {
    icon: 'mail',
    title: { fi: 'Lomake, joka kysyy oikeat asiat', en: 'A form that asks the right questions' },
    text: {
      fi: 'Yhteydenottolomake suunnitellaan liiketoimintasi mukaan, joten saat tarjouspyyntöjä, joihin on helppo vastata.',
      en: 'The contact form is designed around your business, so the enquiries you receive are easy to answer.',
    },
  },
  {
    icon: 'spark',
    title: { fi: 'Tilaa kertoa enemmän', en: 'Room to say more' },
    text: {
      fi: 'Yrityssivu, referenssit ja laajempi sisältö vastaavat asiakkaan kysymyksiin ja rakentavat luottamusta jo ennen yhteydenottoa.',
      en: 'A company page, references and fuller content answer your customers’ questions and build trust before they get in touch.',
    },
  },
]

interface Example {
  id: string
  label: Localized
  fields: Array<{ label: Localized; value: Localized; select?: boolean }>
}

/** Illustrations only – each real form is planned with the client. */
const examples: Example[] = [
  {
    id: 'construction',
    label: { fi: 'Rakennusyritys', en: 'Construction company' },
    fields: [
      { label: { fi: 'Mitä palvelua tarvitset?', en: 'Which service do you need?' }, value: { fi: 'Kylpyhuoneremontti', en: 'Bathroom renovation' }, select: true },
      { label: { fi: 'Kohteen paikkakunta', en: 'Site location' }, value: { fi: 'Joensuu', en: 'Joensuu' } },
      { label: { fi: 'Toivottu aloitusajankohta', en: 'Preferred start' }, value: { fi: 'Keväällä', en: 'In spring' }, select: true },
    ],
  },
  {
    id: 'venue',
    label: { fi: 'Juhlatila', en: 'Event venue' },
    fields: [
      { label: { fi: 'Tilaisuuden tyyppi', en: 'Type of event' }, value: { fi: 'Hääjuhla', en: 'Wedding' }, select: true },
      { label: { fi: 'Toivottu päivämäärä', en: 'Preferred date' }, value: { fi: '14.6.', en: '14 June' } },
      { label: { fi: 'Vierasmäärä', en: 'Number of guests' }, value: { fi: '80', en: '80' } },
    ],
  },
  {
    id: 'photographer',
    label: { fi: 'Valokuvaaja', en: 'Photographer' },
    fields: [
      { label: { fi: 'Kuvauksen tyyppi', en: 'Type of shoot' }, value: { fi: 'Yrityskuvaus', en: 'Corporate shoot' }, select: true },
      { label: { fi: 'Kuvauspaikka', en: 'Location' }, value: { fi: 'Asiakkaan tiloissa', en: 'At your premises' } },
      { label: { fi: 'Kuvattavien määrä', en: 'Number of people' }, value: { fi: '6', en: '6' } },
    ],
  },
]

const copy = {
  demoTitle: { fi: 'Sama lomake, eri yritys', en: 'One form, different businesses' },
  demoLead: {
    fi: 'Esimerkki siitä, miten Apollon lomake mukautuu liiketoimintaan.',
    en: 'An example of how Apollo’s form adapts to the business.',
  },
  pick: { fi: 'Valitse esimerkkiyritys', en: 'Choose an example business' },
  name: { fi: 'Nimi', en: 'Name' },
  email: { fi: 'Sähköposti', en: 'Email' },
  tailored: { fi: 'Räätälöity', en: 'Tailored' },
  standard: { fi: 'Vakiokenttä', en: 'Standard field' },
  cta: { fi: 'Pyydä tarjous Apollosta', en: 'Request a quote for Apollo' },
}

export function WhyApollo() {
  const t = useT()
  const locale = useLocale()
  const [active, setActive] = useState(examples[0]?.id ?? '')
  const example = examples.find((e) => e.id === active) ?? examples[0]

  return (
    <div className="why-apollo">
      <div className="why-apollo__reasons">
        <ul className="why-apollo__list">
          {reasons.map((reason, i) => (
            <li key={reason.title.fi} data-reveal="" style={stagger(i)}>
              <span className="facet">
                <Icon name={reason.icon} />
              </span>
              <div>
                <h3>{t(reason.title)}</h3>
                <p className="muted">{t(reason.text)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="btn-row" data-reveal="fade">
          <ButtonLink to={pathFor('contact', locale) + quoteToSearch(quoteForTier('apollo'))}>
            {t(copy.cta)} · {formatEuro(PRICES.apollo, locale)}
          </ButtonLink>
        </div>
      </div>

      {example && (
        <figure className="form-demo glass tier--apollo" data-reveal="scale" aria-labelledby="form-demo-title">
          <div className="form-demo__head">
            <span className="form-demo__emblem">
              <TierEmblem tier="apollo" />
            </span>
            <div>
              <p id="form-demo-title" className="form-demo__title">
                {t(copy.demoTitle)}
              </p>
              <p className="form-demo__lead">{t(copy.demoLead)}</p>
            </div>
          </div>

          <div className="form-demo__switch" role="group" aria-label={t(copy.pick)}>
            {examples.map((e) => (
              <button key={e.id} type="button" aria-pressed={e.id === active} onClick={() => setActive(e.id)}>
                {t(e.label)}
              </button>
            ))}
          </div>

          <dl className="form-demo__fields">
            <div className="form-demo__field is-base">
              <dt>{t(copy.name)}</dt>
              <dd>
                <span className="visually-hidden">{t(copy.standard)}</span>
              </dd>
            </div>
            <div className="form-demo__field is-base">
              <dt>{t(copy.email)}</dt>
              <dd>
                <span className="visually-hidden">{t(copy.standard)}</span>
              </dd>
            </div>
            {example.fields.map((field, i) => (
              <div key={`${example.id}-${field.label.fi}`} className="form-demo__field is-tailored" style={stagger(i)}>
                <dt>
                  {t(field.label)} <span className="form-demo__tag">{t(copy.tailored)}</span>
                </dt>
                <dd>
                  {t(field.value)}
                  {field.select && <Icon name="chevron" />}
                </dd>
              </div>
            ))}
          </dl>
        </figure>
      )}
    </div>
  )
}
