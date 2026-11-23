import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Icon } from '../../components/Icon'
import { ADDON_ICONS } from '../../components/pricing/addonIcons'
import { languagesLabel, lineItemLabel, zeusSubtitle } from '../../components/pricing/labels'
import { TierEmblem } from '../../components/pricing/TierEmblem'
import { isContactFormConfigured } from '../../config/site'
import { recommendedLabel, vatShort } from '../../data/packages'
import {
  addons,
  clampLanguages,
  getTier,
  hasAddons,
  headlinePrice,
  lineItems,
  MAX_EXTRA_LANGUAGES,
  NO_ADDONS,
  quoteFromSelection,
  quoteToSearch,
  ZEUS_FROM_PRICE,
  zeusTotal,
  type AddonKey,
  type TierId,
  type ZeusSelection,
} from '../../data/pricing'
import { formatEuro, useLocale, useT, type Localized } from '../../i18n/locale'
import { AppLink } from '../../lib/AppLink'
import { pathFor } from '../../routes'
import {
  BACKEND_SERVICE,
  emptyContact,
  isTierOption,
  LIMITS,
  SERVICE_OPTIONS,
  serviceOptions,
  validateContact,
  type ContactValues,
  type FieldErrors,
  type FieldName,
  type ServiceOption,
} from './fields'
import { quoteSummary } from './quote'
import { getRecaptchaToken, loadRecaptcha } from './recaptcha'
import { ContactError, contactErrorMessage, submitContact } from './submit'

const copy = {
  name: { fi: 'Nimi', en: 'Name' },
  email: { fi: 'Sähköposti', en: 'Email' },
  phone: { fi: 'Puhelin', en: 'Phone' },
  company: { fi: 'Yritys', en: 'Company' },
  service: { fi: 'Mistä olet kiinnostunut?', en: 'What are you interested in?' },
  addons: { fi: 'Mitkä lisäominaisuudet kiinnostavat?', en: 'Which add-ons interest you?' },
  addonsHint: {
    fi: 'Voit valita useita tai jättää valinnan myöhemmäksi.',
    en: 'Choose as many as you like, or decide later.',
  },
  languageCount: { fi: 'Lisäkielten määrä', en: 'Number of additional languages' },
  fewer: { fi: 'Yksi lisäkieli vähemmän', en: 'One language fewer' },
  more: { fi: 'Yksi lisäkieli lisää', en: 'One more language' },
  message: { fi: 'Viesti', en: 'Message' },
  optional: { fi: '(valinnainen)', en: '(optional)' },
  send: { fi: 'Lähetä viesti', en: 'Send message' },
  sendQuote: { fi: 'Lähetä tarjouspyyntö', en: 'Send quote request' },
  sending: { fi: 'Lähetetään…', en: 'Sending…' },
  sentTitle: { fi: 'Kiitos, viesti on lähetetty!', en: 'Thank you, your message has been sent!' },
  sentText: {
    fi: 'Vastaamme yleensä 24 tunnin kuluessa arkipäivisin.',
    en: 'We usually reply within 24 hours on business days.',
  },
  another: { fi: 'Lähetä uusi viesti', en: 'Send another message' },
  privacy: {
    fi: 'Käsittelemme tietojasi vain yhteydenottoosi vastaamiseksi. Lue lisää',
    en: 'We only use your details to reply to your enquiry. Read more in our',
  },
  privacyLink: { fi: 'tietosuojaselosteesta', en: 'privacy policy' },
  recaptcha: {
    fi: 'Lomake on suojattu reCAPTCHA-palvelulla, ja siihen sovelletaan Googlen',
    en: 'This form is protected by reCAPTCHA and the Google',
  },
  and: { fi: 'ja', en: 'and' },
  gPrivacy: { fi: 'tietosuojakäytäntöä', en: 'Privacy Policy' },
  gTerms: { fi: 'käyttöehtoja', en: 'Terms of Service' },
  gApply: { fi: '.', en: ' apply.' },
  quoteEyebrow: { fi: 'Valintasi', en: 'Your selection' },
  oneTime: { fi: 'Kertahinta', en: 'One-time price' },
  from: { fi: 'alk.', en: 'from' },
  noAddons: { fi: 'Valitse kiinnostavat lisäominaisuudet yllä', en: 'Pick the add-ons you are interested in above' },
  quoteNote: {
    fi: 'Valintasi lähetetään viestisi mukana. Tämä on maksuton tarjouspyyntö – ei tilaus.',
    en: 'Your selection is sent with your message. This is a free quote request – not an order.',
  },
  openCalculator: { fi: 'Avaa Zeus-laskuri', en: 'Open the Zeus calculator' },
  comparePackages: { fi: 'Vertaa paketteja', en: 'Compare the packages' },
}

/** The message placeholder follows the choice, so the visitor knows what is useful to tell. */
const placeholders: Record<ServiceOption | '', Localized> = {
  '': {
    fi: 'Kerro lyhyesti yrityksestäsi ja siitä, millaiset verkkosivut tarvitset.',
    en: 'Tell us briefly about your business and what kind of website you need.',
  },
  hermes: {
    fi: 'Kerro lyhyesti yrityksestäsi, palveluistasi ja siitä, mitä toivot uusilta verkkosivuilta.',
    en: 'Tell us briefly about your business, your services and what you want from your new website.',
  },
  apollo: {
    fi: 'Kerro lyhyesti yrityksestäsi, palveluistasi ja siitä, mitä toivot uusilta verkkosivuilta.',
    en: 'Tell us briefly about your business, your services and what you want from your new website.',
  },
  zeus: {
    fi: 'Kerro lyhyesti yrityksestäsi ja siitä, mihin tarvitset ajanvarausta, verkkomaksuja tai muita lisäominaisuuksia.',
    en: 'Tell us briefly about your business and what you need online booking, payments or other add-ons for.',
  },
  unsure: {
    fi: 'Kerro lyhyesti yrityksestäsi ja tavoitteistasi – suosittelemme sopivimman paketin.',
    en: 'Tell us briefly about your business and goals – we’ll recommend the package that fits.',
  },
  maintenance: {
    fi: 'Kerro lyhyesti nykyisestä sivustostasi ja siitä, millaista ylläpitoa tarvitset.',
    en: 'Tell us briefly about your current website and the maintenance you need.',
  },
  other: {
    fi: 'Kerro lyhyesti, miten voimme auttaa.',
    en: 'Tell us briefly how we can help.',
  },
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** What the form starts with – e.g. a package brought from the pricing page (?package=…). */
export interface ContactInitial {
  service: ServiceOption | ''
  /** Zeus add-ons (used when service is 'zeus'). */
  selection: ZeusSelection
}

const isOn = (selection: ZeusSelection, id: AddonKey) => (id === 'languages' ? selection.languages > 0 : selection[id])

export function ContactForm({ initial }: { initial?: ContactInitial }) {
  const t = useT()
  const locale = useLocale()
  const [values, setValues] = useState<ContactValues>(() => ({ ...emptyContact, service: initial?.service ?? '' }))
  const [selection, setSelection] = useState<ZeusSelection>(initial?.selection ?? NO_ADDONS)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const shownAt = useRef(0)
  const warmed = useRef(false)
  // Set synchronously, so a second submit in the same tick (double click, Enter + click)
  // cannot slip through before React re-renders with status 'sending'.
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    shownAt.current = Date.now()
  }, [])

  // The success card is shorter than the form: keep it in view, clear of the sticky header.
  useEffect(() => {
    if (status === 'sent') successRef.current?.scrollIntoView({ block: 'nearest' })
  }, [status])

  // Load reCAPTCHA only when someone starts filling in the form.
  const warmUp = () => {
    if (warmed.current || !isContactFormConfigured) return
    warmed.current = true
    loadRecaptcha(locale).catch(() => (warmed.current = false))
  }

  // The choice travels in front of the message, so the message itself gets less room.
  const prefixFor = (service: ContactValues['service'], addonSelection: ZeusSelection) => {
    const summary = quoteSummary(service, addonSelection, locale)
    return summary ? `${summary}\n\n` : ''
  }
  const prefix = prefixFor(values.service, selection)
  const messageMax = LIMITS.message.max - prefix.length

  const revalidate = (nextValues: ContactValues, nextSelection: ZeusSelection) => {
    if (attempted) {
      setErrors(validateContact(nextValues, locale, LIMITS.message.max - prefixFor(nextValues.service, nextSelection).length))
    }
  }

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [event.target.name]: event.target.value }
    setValues(next)
    revalidate(next, selection)
  }

  const changeSelection = (next: ZeusSelection) => {
    setSelection(next)
    revalidate(values, next)
  }
  const toggleAddon = (id: AddonKey) =>
    changeSelection(
      id === 'languages'
        ? { ...selection, languages: selection.languages > 0 ? 0 : 1 }
        : { ...selection, [id]: !selection[id] },
    )
  const stepLanguages = (delta: 1 | -1) =>
    changeSelection({ ...selection, languages: Math.max(1, clampLanguages(selection.languages + delta)) })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || status === 'sending') return
    const found = validateContact(values, locale, messageMax)
    setAttempted(true)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    if (!isContactFormConfigured) {
      setStatus('error')
      setErrorMessage(contactErrorMessage('not-configured', locale))
      return
    }

    submitting.current = true
    setStatus('sending')
    setErrorMessage('')
    try {
      let token: string
      try {
        token = await getRecaptchaToken(locale)
      } catch {
        throw new ContactError('recaptcha-unavailable', contactErrorMessage('recaptcha-unavailable', locale))
      }
      await submitContact(
        {
          ...values,
          service: values.service ? BACKEND_SERVICE[values.service] : '',
          message: prefix + values.message,
          token,
          elapsed: Date.now() - shownAt.current,
          page: window.location.href,
        },
        locale,
      )
      setStatus('sent')
      setValues(emptyContact)
      setSelection(NO_ADDONS)
      setAttempted(false)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof ContactError ? error.message : contactErrorMessage('network', locale))
    } finally {
      submitting.current = false
    }
  }

  if (status === 'sent') {
    return (
      <div ref={successRef} className="form-success glass" role="status">
        <span className="form-success__icon">
          <Icon name="check" />
        </span>
        <h2 className="h-3">{t(copy.sentTitle)}</h2>
        <p className="muted">{t(copy.sentText)}</p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            shownAt.current = Date.now()
            setStatus('idle')
          }}
        >
          {t(copy.another)}
        </button>
      </div>
    )
  }

  const field = (name: FieldName) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: update,
    className: 'input',
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  })
  const error = (name: FieldName) =>
    errors[name] ? (
      <p className="field-error" id={`contact-${name}-error`}>
        {errors[name]}
      </p>
    ) : null

  const tier: TierId | null = isTierOption(values.service) ? values.service : null

  return (
    <form ref={formRef} className="contact-form glass" noValidate onSubmit={onSubmit} onFocus={warmUp}>
      <fieldset className="choice-group">
        <legend>
          {t(copy.service)} <span className="optional">{t(copy.optional)}</span>
        </legend>
        <div className="choices">
          {SERVICE_OPTIONS.map((option) => (
            <label key={option} className={`choice${isTierOption(option) ? ` tier--${option}` : ''}`}>
              <input
                type="radio"
                name="service"
                value={option}
                checked={values.service === option}
                onChange={update}
                className="choice__input"
              />
              <span className="choice__name">
                {isTierOption(option) && <TierEmblem tier={option} className="choice__emblem" />}
                {t(serviceOptions[option].label)}
                {option === 'apollo' && <span className="choice__badge">{t(recommendedLabel)}</span>}
              </span>
              <span className="choice__hint">{t(serviceOptions[option].hint)}</span>
            </label>
          ))}
        </div>
        {error('service')}
      </fieldset>

      {values.service === 'zeus' && (
        <fieldset className="choice-group tier--zeus">
          <legend>
            {t(copy.addons)} <span className="optional">{t(copy.addonsHint)}</span>
          </legend>
          <div className="addon-choices">
            {addons.map((addon) => (
              <label key={addon.id} className="addon-choice">
                <input
                  type="checkbox"
                  checked={isOn(selection, addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="choice__input"
                />
                <Icon name={ADDON_ICONS[addon.id]} />
                <span className="addon-choice__name">{t(addon.short)}</span>
                <span className="addon-choice__price">
                  +{formatEuro(addon.price, locale)}
                  {addon.unit && <small> {t(addon.unit)}</small>}
                </span>
              </label>
            ))}
          </div>
          {selection.languages > 0 && (
            <div className="stepper form-stepper" role="group" aria-label={t(copy.languageCount)}>
              <button
                type="button"
                className="stepper__btn"
                aria-label={t(copy.fewer)}
                aria-disabled={selection.languages <= 1}
                onClick={() => stepLanguages(-1)}
              >
                <Icon name="minus" />
              </button>
              <span className="stepper__value" aria-hidden="true">
                {selection.languages}
              </span>
              <button
                type="button"
                className="stepper__btn"
                aria-label={t(copy.more)}
                aria-disabled={selection.languages >= MAX_EXTRA_LANGUAGES}
                onClick={() => stepLanguages(1)}
              >
                <Icon name="plus" />
              </button>
              <span className="stepper__state" aria-live="polite">
                {languagesLabel(selection.languages, locale)}
              </span>
            </div>
          )}
        </fieldset>
      )}

      {tier && (
        <div className={`quote-card tier--${tier}`}>
          <div className="quote-card__head">
            <span className="tier__emblem">
              <TierEmblem tier={tier} />
            </span>
            <div className="quote-card__title">
              <p className="quote-card__eyebrow">{t(copy.quoteEyebrow)}</p>
              <p className="quote-card__name">{getTier(tier).name}</p>
              <p className="quote-card__sub">
                {tier === 'zeus' ? (zeusSubtitle(selection, locale) ?? t(copy.noAddons)) : t(getTier(tier).kind)}
              </p>
            </div>
            <p className="quote-card__total" aria-live="polite">
              {tier === 'zeus' && !hasAddons(selection) && `${t(copy.from)} `}
              {formatEuro(
                tier === 'zeus' ? (hasAddons(selection) ? zeusTotal(selection) : ZEUS_FROM_PRICE) : headlinePrice(tier),
                locale,
              )}
              <small>
                {t(copy.oneTime)} · {t(vatShort)}
              </small>
            </p>
          </div>
          {tier === 'zeus' && hasAddons(selection) && (
            <ul className="quote-card__lines">
              {lineItems(selection).map((item) => (
                <li key={item.id}>
                  <span>{lineItemLabel(item, locale)}</span>
                  <span>{formatEuro(item.amount, locale)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="quote-card__note">{t(copy.quoteNote)}</p>
          <div className="quote-card__actions">
            <AppLink
              to={
                tier === 'zeus'
                  ? `${pathFor('pricing', locale)}${quoteToSearch(quoteFromSelection(selection))}#laskuri`
                  : `${pathFor('pricing', locale)}#vertailu`
              }
              className="link"
            >
              {t(tier === 'zeus' ? copy.openCalculator : copy.comparePackages)} <Icon name="arrow" />
            </AppLink>
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="contact-name">{t(copy.name)}</label>
          <input {...field('name')} type="text" autoComplete="name" maxLength={LIMITS.name.max} required />
          {error('name')}
        </div>
        <div className="field">
          <label htmlFor="contact-email">{t(copy.email)}</label>
          <input {...field('email')} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email.max} required />
          {error('email')}
        </div>
        <div className="field">
          <label htmlFor="contact-phone">
            {t(copy.phone)} <span className="optional">{t(copy.optional)}</span>
          </label>
          <input {...field('phone')} type="tel" autoComplete="tel" maxLength={LIMITS.phone.max} />
          {error('phone')}
        </div>
        <div className="field">
          <label htmlFor="contact-company">
            {t(copy.company)} <span className="optional">{t(copy.optional)}</span>
          </label>
          <input {...field('company')} type="text" autoComplete="organization" maxLength={LIMITS.company.max} />
          {error('company')}
        </div>
        <div className="field field--full">
          <label htmlFor="contact-message">{t(copy.message)}</label>
          <textarea
            {...field('message')}
            rows={6}
            maxLength={messageMax}
            placeholder={t(placeholders[values.service])}
            required
          />
          <div className="field-row">
            {error('message') ?? <span />}
            <span className="field-hint">
              {values.message.length} / {messageMax}
            </span>
          </div>
        </div>
      </div>

      {/* Honeypot: hidden from people, bots fill it in */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
      </div>

      {status === 'error' && errorMessage && (
        <div className="alert alert--error" role="alert">
          <Icon name="alert" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="form-footer">
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'} data-magnetic="">
          <span>
            {status === 'sending'
              ? t(copy.sending)
              : t(tier || values.service === 'unsure' ? copy.sendQuote : copy.send)}
          </span>
          <Icon name="arrow" />
        </button>
        <p className="field-hint">
          {t(copy.privacy)} <AppLink to={pathFor('privacy', locale)}>{t(copy.privacyLink)}</AppLink>.{' '}
          {isContactFormConfigured && (
            <>
              {t(copy.recaptcha)}{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                {t(copy.gPrivacy)}
              </a>{' '}
              {t(copy.and)}{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener">
                {t(copy.gTerms)}
              </a>
              {t(copy.gApply)}
            </>
          )}
        </p>
      </div>
    </form>
  )
}
