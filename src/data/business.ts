/**
 * Verified company facts (source: the previous hadesdesign.fi, 2026-10).
 * Do not add facts here that the owner has not published – see
 * docs/CONTENT-SOURCES.md for what is known and what is not.
 */
import type { Localized } from '../i18n/locale'

export const business = {
  name: 'Hades Design',
  founder: {
    name: 'Sami Turunen',
    role: { fi: 'Perustaja ja toimitusjohtaja', en: 'Founder & CEO' } satisfies Localized,
    quote: {
      fi: 'Digitaalisen markkinoinnin avain on laadukkaat verkkosivut – Hades Design toimittaa niistä parhaat.',
      en: 'The key to digital marketing is quality websites – and Hades Design delivers the best of them.',
    } satisfies Localized,
  },
  email: 'contact.hadesdesign@gmail.com',
  phone: {
    display: '+358 45 108 8807',
    href: 'tel:+358451088807',
  },
  location: {
    city: 'Joensuu',
    country: { fi: 'Suomi', en: 'Finland' } satisfies Localized,
    countryCode: 'FI',
    workMode: {
      fi: 'Työskentelemme asiakkaiden kanssa paikallisesti ja etänä.',
      en: 'We work with clients locally and remotely.',
    } satisfies Localized,
  },
  responseTime: {
    fi: 'Vastaamme yleensä kaikkiin tiedusteluihin 24 tunnin kuluessa arkipäivisin. Voit myös soittaa suoraan.',
    en: 'We usually reply to every enquiry within 24 hours on business days. You can also call us directly.',
  } satisfies Localized,
  /** Post-launch support included in every website package. */
  includedSupportDays: 60,
} as const

export const story: Localized<string[]> = {
  fi: [
    'Hades Design syntyi tarpeesta tehdä verkkosivuja, jotka oikeasti palvelevat yrityksiä. Liian usein yrityksellä ei ole omia verkkosivuja – tai ne ovat olemassa, mutta eivät tue liiketoimintaa eivätkä tuo asiakkaita.',
    'Uskomme, että hyvä verkkosivusto on selkeä, nopea ja helppo käyttää. Sen pitää kertoa yhdellä silmäyksellä, mitä yritys tekee ja miksi siihen kannattaa luottaa. Verkkosivusto on usein ensimmäinen kohtaaminen yrityksen ja asiakkaan välillä, ja siksi sillä on suuri merkitys.',
    'Tavoitteemme on tukea yritysten kasvua toimivien ja laadukkaiden verkkosivujen avulla.',
  ],
  en: [
    'Hades Design was born from the need for websites that genuinely serve businesses. Too often a company has no website at all – or it has one, but it neither supports the business nor brings in customers.',
    'We believe a good website is clear, fast and easy to use. It should tell at a glance what the company does and why it is worth trusting. A website is often the very first encounter between a company and its customer, which is why it matters so much.',
    'Our goal is to support the growth of businesses through functional, high-quality websites.',
  ],
}
