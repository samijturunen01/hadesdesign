import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Icon } from '../../components/Icon'
import { isContactFormConfigured } from '../../config/site'
import { useLocale, useT } from '../../i18n/locale'
import { AppLink } from '../../lib/AppLink'
import { pathFor } from '../../routes'
import {
  emptyContact,
  LIMITS,
  SERVICE_OPTIONS,
  serviceLabels,
  validateContact,
  type ContactValues,
  type FieldErrors,
  type FieldName,
} from './fields'
import { getRecaptchaToken, loadRecaptcha } from './recaptcha'
import { ContactError, contactErrorMessage, submitContact } from './submit'

const copy = {
  name: { fi: 'Nimi', en: 'Name' },
  email: { fi: 'Sähköposti', en: 'Email' },
  phone: { fi: 'Puhelin', en: 'Phone' },
  company: { fi: 'Yritys', en: 'Company' },
  service: { fi: 'Mistä olet kiinnostunut?', en: 'What are you interested in?' },
  choose: { fi: 'Valitse (valinnainen)', en: 'Choose (optional)' },
  message: { fi: 'Viesti', en: 'Message' },
  messagePlaceholder: {
    fi: 'Kerro lyhyesti yrityksestäsi ja siitä, millaiset sivut tarvitset.',
    en: 'Tell us briefly about your business and what kind of website you need.',
  },
  optional: { fi: '(valinnainen)', en: '(optional)' },
  send: { fi: 'Lähetä viesti', en: 'Send message' },
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
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const t = useT()
  const locale = useLocale()
  const [values, setValues] = useState<ContactValues>(emptyContact)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const shownAt = useRef(0)
  const warmed = useRef(false)
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

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [event.target.name]: event.target.value }
    setValues(next)
    if (attempted) setErrors(validateContact(next, locale))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    const found = validateContact(values, locale)
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
        { ...values, token, elapsed: Date.now() - shownAt.current, page: window.location.href },
        locale,
      )
      setStatus('sent')
      setValues(emptyContact)
      setAttempted(false)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof ContactError ? error.message : contactErrorMessage('network', locale))
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

  return (
    <form ref={formRef} className="contact-form glass" noValidate onSubmit={onSubmit} onFocus={warmUp}>
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
          <label htmlFor="contact-service">{t(copy.service)}</label>
          <select {...field('service')}>
            <option value="">{t(copy.choose)}</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(serviceLabels[option])}
              </option>
            ))}
          </select>
          {error('service')}
        </div>
        <div className="field field--full">
          <label htmlFor="contact-message">{t(copy.message)}</label>
          <textarea
            {...field('message')}
            rows={6}
            maxLength={LIMITS.message.max}
            placeholder={t(copy.messagePlaceholder)}
            required
          />
          <div className="field-row">
            {error('message') ?? <span />}
            <span className="field-hint">
              {values.message.length} / {LIMITS.message.max}
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
          <span>{status === 'sending' ? t(copy.sending) : t(copy.send)}</span>
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
