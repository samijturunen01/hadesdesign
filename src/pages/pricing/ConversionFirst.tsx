import type { CSSProperties } from 'react'
import { Icon } from '../../components/Icon'
import type { Localized } from '../../i18n/locale'
import { useT } from '../../i18n/locale'

/** What every Hades Design site is designed to do – the visitor's path from first look to enquiry. */
const steps: Array<{ title: Localized; text: Localized }> = [
  {
    title: { fi: 'Herättää huomion', en: 'Captures attention' },
    text: {
      fi: 'Ensivaikutelma, joka saa kävijän jäämään ja erottaa sinut kilpailijoista.',
      en: 'A first impression that makes visitors stay and sets you apart.',
    },
  },
  {
    title: { fi: 'Kertoo selvästi, mitä tarjoat', en: 'Says clearly what you offer' },
    text: {
      fi: 'Kävijä ymmärtää nopeasti, mitä teet, kenelle ja miksi juuri sinä.',
      en: 'Visitors quickly understand what you do, who it is for and why you.',
    },
  },
  {
    title: { fi: 'Rakentaa luottamusta', en: 'Builds trust' },
    text: {
      fi: 'Huoliteltu toteutus, referenssit ja selkeät yhteystiedot kertovat, että asiat hoituvat.',
      en: 'Careful craft, references and clear contact details show you can be relied on.',
    },
  },
  {
    title: { fi: 'Perustelee hyödyt', en: 'Explains the benefits' },
    text: {
      fi: 'Puhumme asiakkaasi kieltä: mitä hän saa – ei vain sitä, mitä sinä teet.',
      en: 'We speak your customer’s language: what they get – not just what you do.',
    },
  },
  {
    title: { fi: 'Tekee yhteydenotosta helppoa', en: 'Makes contact easy' },
    text: {
      fi: 'Selkeät toimintakehotteet ja vaivaton lomake jokaisella laitteella.',
      en: 'Clear calls to action and an effortless form on every device.',
    },
  },
  {
    title: { fi: 'Tukee asiakashankintaa', en: 'Supports customer acquisition' },
    text: {
      fi: 'Nopea ja hakukoneystävällinen sivusto auttaa uusia asiakkaita löytämään sinut.',
      en: 'A fast, search-friendly site helps new customers find you.',
    },
  },
]

const scope: Localized = {
  fi: 'Pakettien ero on laajuudessa ja toiminnallisuudessa – ei siinä, suunnitellaanko sivusto myymään. Se tehdään aina.',
  en: 'The packages differ in scope and functionality – not in whether the site is designed to sell. It always is.',
}

export function ConversionFirst() {
  const t = useT()
  return (
    <>
      <ol className="cf-path">
        {steps.map((step, i) => (
          <li
            key={step.title.fi}
            className="cf-step"
            data-reveal=""
            style={{ '--i': i, '--heat': (i + 1) / steps.length } as CSSProperties}
          >
            <span className="cf-step__no" aria-hidden="true">
              0{i + 1}
            </span>
            <h3>{t(step.title)}</h3>
            <p className="muted">{t(step.text)}</p>
          </li>
        ))}
      </ol>
      <p className="cf-scope glass" data-reveal="">
        <Icon name="spark" />
        <span>{t(scope)}</span>
      </p>
    </>
  )
}
