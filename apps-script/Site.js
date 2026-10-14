/**
 * Site-specific settings for the contact form backend (Code.js).
 * Nothing secret here: RECAPTCHA_SECRET and TO_EMAIL are in Script properties.
 */
var SITE = {
  name: 'Hades Design',
  senderName: 'Hades Design – verkkosivut',
  subjectPrefix: 'Uusi yhteydenotto verkkosivuilta',
  /** Must match grecaptcha.execute(siteKey, { action }) on the website (src/config/site.ts). */
  recaptchaAction: 'contact',
  minScore: 0.5,
  /**
   * Hostnames a reCAPTCHA token may come from. Subdomains are included, so
   * 'hadesdesign.fi' also covers www.hadesdesign.fi. The GitHub Pages preview
   * and localhost are allowed for testing – keep this list identical to the
   * reCAPTCHA key's domains.
   */
  allowedHostnames: ['hadesdesign.fi', 'samijturunen01.github.io', 'localhost'],
  /** Accent colour for the long-text blocks in the email. */
  accentColor: '#ff6a3d',
  /**
   * Form fields in email order. The website sends the same keys
   * (src/features/contact/fields.ts) – keep the limits identical.
   * type: 'email' | 'phone' | 'long' (multi-line) | omitted (one line)
   * options: { value: 'Label', ... } limits the value to a fixed list.
   */
  fields: [
    { key: 'name', label: 'Nimi', required: true, min: 2, max: 80 },
    { key: 'email', label: 'Sähköposti', required: true, max: 120, type: 'email' },
    { key: 'phone', label: 'Puhelin', max: 30, type: 'phone' },
    { key: 'company', label: 'Yritys', max: 100 },
    {
      key: 'service',
      label: 'Kiinnostaa',
      options: {
        light: 'Kevyt verkkosivupaketti (790 €)',
        website: 'Verkkosivupaketti (990 €)',
        store: 'Verkkokauppapaketti (1 990 €)',
        redesign: 'Verkkosivujen uudistus',
        maintenance: 'Ylläpito & hosting',
        other: 'Muu / en ole vielä varma',
      },
    },
    { key: 'message', label: 'Viesti', required: true, min: 10, max: 2000, type: 'long' },
  ],
}
