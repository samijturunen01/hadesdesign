/**
 * Privacy policy and terms of service.
 *
 * Terms: the previous site's terms, unchanged in substance (dated January 2025).
 * Privacy policy: the previous policy, extended to describe what THIS website
 * actually does (contact form via Google Apps Script, reCAPTCHA, GitHub Pages
 * hosting; no analytics or other tracking). The owner should review it before
 * launch – see docs/CONTENT-SOURCES.md.
 *
 * Inline links use [label](href).
 */
import type { Localized } from '../../i18n/locale'
import { business } from '../../data/business'

export interface LegalSection {
  title: string
  /** Paragraphs and bullet lists, in order. */
  body: Array<string | string[]>
}

export interface LegalDocument {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

const email = `[${business.email}](mailto:${business.email})`
const phone = `[${business.phone.display}](${business.phone.href})`

export const privacyPolicy: Localized<LegalDocument> = {
  fi: {
    title: 'Tietosuojaseloste',
    updated: 'Viimeksi päivitetty: lokakuu 2026',
    intro:
      'Hades Designilla suhtaudumme yksityisyyteesi vakavasti. Tämä tietosuojaseloste kertoo, miten keräämme, käytämme, luovutamme ja suojaamme tietojasi, kun vierailet verkkosivustollamme tai käytät palveluitamme.',
    sections: [
      {
        title: 'Rekisterinpitäjä',
        body: [`Hades Design, ${business.location.city}. Sähköposti ${email}, puhelin ${phone}.`],
      },
      {
        title: 'Keräämämme tiedot',
        body: [
          'Keräämme tietoja, jotka annat meille suoraan, kuten:',
          [
            'yhteydenottolomakkeella antamasi tiedot: nimi, sähköpostiosoite, puhelinnumero ja yritys (vapaaehtoisia), kiinnostuksen kohde sekä viesti',
            'nimi ja yhteystiedot',
            'yrityksen tai organisaation tiedot',
            'projektin vaatimukset ja toiveet',
            'viestintähistoria kanssamme',
            'maksutiedot (käsitellään turvallisesti kolmannen osapuolen palveluntarjoajien kautta)',
          ],
          'Lisäksi sivuston käytöstä syntyy teknisiä tietoja:',
          [
            'Sivuston palvelin (GitHub Pages) käsittelee teknisiä tietoja, kuten IP-osoitetta ja selaimen tietoja, sivujen toimittamiseksi ja palvelun suojaamiseksi.',
            'Kun alat täyttää yhteydenottolomaketta, Google reCAPTCHA v3 käsittelee teknisiä tietoja (esimerkiksi IP-osoite, selaimen tiedot ja sivuston käyttötapa) automaattisen roskapostin tunnistamiseksi.',
          ],
          'Emme käytä sivustolla kävijäanalytiikkaa, markkinointia tai muuta seurantaa.',
        ],
      },
      {
        title: 'Miten käytämme tietojasi',
        body: [
          'Käytämme keräämiämme tietoja:',
          [
            'yhteydenottoihin, kysymyksiin ja tarjouspyyntöihin vastaamiseen',
            'palveluidemme tarjoamiseen, ylläpitämiseen ja parantamiseen',
            'tilausten ja laskutuksen käsittelyyn',
            'teknisten ilmoitusten ja tukiviestien lähettämiseen',
            'palveluihimme liittyvään viestintään',
            'yhteydenottolomakkeen suojaamiseen roskapostilta ja sivuston tietoturvan varmistamiseen',
          ],
        ],
      },
      {
        title: 'Käsittelyn oikeusperusteet',
        body: [
          [
            'Sopimus ja sopimusta edeltävät toimenpiteet: tarjouspyyntöihin vastaaminen ja palveluiden toimittaminen.',
            'Oikeutettu etu: yhteydenottoihin vastaaminen, roskapostin torjunta ja sivuston tietoturva.',
            'Lakisääteinen velvoite: esimerkiksi kirjanpitoon liittyvät tiedot.',
          ],
        ],
      },
      {
        title: 'Tietojen käsittelijät ja siirrot',
        body: [
          'Saatamme käyttää kolmannen osapuolen yrityksiä helpottamaan palveluitamme tai tarjoamaan palveluita puolestamme. Näillä osapuolilla on pääsy henkilötietoihisi vain näiden tehtävien suorittamiseksi. Verkkosivustomme käyttää seuraavia palveluita:',
          [
            'GitHub (GitHub Pages): verkkosivuston hosting',
            'Google (Google Apps Script ja Gmail): yhteydenottolomakkeen viestien välittäminen sähköpostiimme',
            'Google reCAPTCHA: lomakkeen suojaaminen roskapostilta',
          ],
          'Nämä palveluntarjoajat voivat käsitellä tietoja myös EU:n ja ETA:n ulkopuolella, kuten Yhdysvalloissa. Tällöin siirrot perustuvat Euroopan komission hyväksymiin mekanismeihin, kuten EU:n ja Yhdysvaltojen väliseen tietosuojakehykseen (Data Privacy Framework) tai vakiosopimuslausekkeisiin.',
        ],
      },
      {
        title: 'Evästeet',
        body: [
          'Sivusto ei itse aseta evästeitä eikä käytä analytiikka- tai markkinointievästeitä.',
          'Yhteydenottolomakkeen roskapostisuojaus on poikkeus: Google reCAPTCHA ladataan vasta, kun alat täyttää lomaketta, ja se tallentaa selaimeesi evästeen _GRECAPTCHA Googlen verkkotunnukseen (säilytysaika 6 kuukautta) sekä tunnisteen _grecaptcha tämän sivuston paikalliseen tallennustilaan (localStorage, säilyy kunnes poistat sen). Niitä käytetään lomakkeen suojaamiseen automaattisilta viesteiltä ja väärinkäytöksiltä. Jos et käytä lomaketta, reCAPTCHAa ei ladata. Voit aina ottaa yhteyttä myös sähköpostilla tai puhelimitse.',
          'Sivuston aiempi versio käytti evästettä cookie_consent sekä Google Analyticsin evästeitä _ga ja _ga_*. Nykyinen sivusto ei lue eikä käytä niitä. Jos niitä on jäänyt selaimeesi, voit poistaa ne selaimen asetuksista, joista voit myös estää evästeet.',
        ],
      },
      {
        title: 'Säilytysaika',
        body: [
          'Säilytämme henkilötietoja vain niin kauan kuin se on tarpeen tässä selosteessa kuvattuihin tarkoituksiin tai lainsäädännön edellyttämän ajan, esimerkiksi kirjanpitoaineiston osalta.',
        ],
      },
      {
        title: 'Tietoturva',
        body: [
          'Toteutamme asianmukaiset tekniset ja organisatoriset toimenpiteet suojataksemme henkilötietojasi luvattomalta pääsyltä, muuttamiselta, luovuttamiselta tai tuhoamiselta. Mikään tiedonsiirtomenetelmä internetin kautta ei kuitenkaan ole täysin turvallinen.',
        ],
      },
      {
        title: 'Oikeutesi',
        body: [
          'Sinulla on oikeus:',
          [
            'päästä käsiksi henkilötietoihisi',
            'korjata virheelliset tiedot',
            'pyytää tietojesi poistamista',
            'vastustaa tietojesi käsittelyä tai pyytää sen rajoittamista',
            'pyytää tietojen siirtoa',
            'tehdä valitus valvontaviranomaiselle (Tietosuojavaltuutetun toimisto, [tietosuoja.fi](https://tietosuoja.fi))',
          ],
        ],
      },
      {
        title: 'Muutokset tähän selosteeseen',
        body: [
          'Saatamme päivittää tietosuojaselostetta ajoittain. Ilmoitamme muutoksista julkaisemalla päivitetyn selosteen tällä sivulla ja päivittämällä ”Viimeksi päivitetty” -päivämäärän.',
        ],
      },
      {
        title: 'Ota yhteyttä',
        body: [`Jos sinulla on kysyttävää tästä tietosuojaselosteesta, ota meihin yhteyttä: ${email}.`],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: 'Last updated: October 2026',
    intro:
      'At Hades Design we take your privacy seriously. This privacy policy explains how we collect, use, disclose and protect your information when you visit our website or use our services.',
    sections: [
      {
        title: 'Data controller',
        body: [`Hades Design, ${business.location.city}, Finland. Email ${email}, phone ${phone}.`],
      },
      {
        title: 'Information we collect',
        body: [
          'We collect information you provide to us directly, such as:',
          [
            'what you enter in the contact form: name, email address, phone number and company (optional), the service you are interested in and your message',
            'name and contact information',
            'company or organisation details',
            'project requirements and preferences',
            'communication history with us',
            'payment information (processed securely through third-party providers)',
          ],
          'Using the website also produces technical data:',
          [
            'The website’s host (GitHub Pages) processes technical data such as your IP address and browser information to deliver the pages and protect the service.',
            'When you start filling in the contact form, Google reCAPTCHA v3 processes technical data (for example your IP address, browser information and how you use the site) to detect automated spam.',
          ],
          'We do not use visitor analytics, marketing or any other tracking on this website.',
        ],
      },
      {
        title: 'How we use your information',
        body: [
          'We use the information we collect to:',
          [
            'respond to your enquiries, questions and quote requests',
            'provide, maintain and improve our services',
            'process orders and invoicing',
            'send you technical notices and support messages',
            'communicate with you about our services',
            'protect the contact form against spam and keep the website secure',
          ],
        ],
      },
      {
        title: 'Legal bases',
        body: [
          [
            'Contract and pre-contractual steps: answering quote requests and delivering our services.',
            'Legitimate interest: responding to enquiries, preventing spam and keeping the website secure.',
            'Legal obligation: for example bookkeeping records.',
          ],
        ],
      },
      {
        title: 'Service providers and transfers',
        body: [
          'We may employ third-party companies to facilitate our services or provide services on our behalf. They have access to your personal data only to perform these tasks for us. Our website uses the following services:',
          [
            'GitHub (GitHub Pages): website hosting',
            'Google (Google Apps Script and Gmail): delivering contact form messages to our inbox',
            'Google reCAPTCHA: protecting the contact form against spam',
          ],
          'These providers may also process data outside the EU and EEA, for example in the United States. Such transfers rely on mechanisms approved by the European Commission, such as the EU–US Data Privacy Framework or standard contractual clauses.',
        ],
      },
      {
        title: 'Cookies',
        body: [
          'The website itself does not set cookies and uses no analytics or marketing cookies.',
          'The contact form’s spam protection is the exception: Google reCAPTCHA is loaded only when you start filling in the form, and it stores the cookie _GRECAPTCHA under Google’s domain (kept for 6 months) and the identifier _grecaptcha in this website’s local storage (kept until you delete it). They are used to protect the form against automated messages and abuse. If you do not use the form, reCAPTCHA is not loaded. You can always contact us by email or phone instead.',
          'A previous version of this website used the cookie cookie_consent and the Google Analytics cookies _ga and _ga_*. The current website does not read or use them. If they remain in your browser, you can delete them in your browser settings, where you can also block cookies.',
        ],
      },
      {
        title: 'Retention',
        body: [
          'We keep personal data only for as long as necessary for the purposes described in this policy or as required by law, for example for bookkeeping records.',
        ],
      },
      {
        title: 'Data security',
        body: [
          'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure or destruction. However, no method of transmission over the internet is completely secure.',
        ],
      },
      {
        title: 'Your rights',
        body: [
          'You have the right to:',
          [
            'access your personal data',
            'have inaccurate data corrected',
            'request deletion of your data',
            'object to or request restriction of processing',
            'request data portability',
            'lodge a complaint with the supervisory authority (the Office of the Data Protection Ombudsman, [tietosuoja.fi](https://tietosuoja.fi/en))',
          ],
        ],
      },
      {
        title: 'Changes to this policy',
        body: [
          'We may update this privacy policy from time to time. We will post the updated policy on this page and update the “Last updated” date.',
        ],
      },
      {
        title: 'Contact us',
        body: [`If you have any questions about this privacy policy, please contact us at ${email}.`],
      },
    ],
  },
}

export const termsOfService: Localized<LegalDocument> = {
  fi: {
    title: 'Käyttöehdot',
    updated: 'Viimeksi päivitetty: tammikuu 2025',
    intro:
      'Lue nämä käyttöehdot huolellisesti ennen palveluidemme käyttöä. Käyttämällä palveluitamme sitoudut noudattamaan näitä ehtoja.',
    sections: [
      {
        title: '1. Palvelut',
        body: [
          'Hades Design tarjoaa verkkosuunnittelu- ja kehityspalveluita, mukaan lukien mutta ei rajoittuen verkkosivujen suunnitteluun, kehitykseen, ylläpitoon ja niihin liittyviin konsultointipalveluihin. Palveluiden tarkka laajuus määritellään yksittäisissä projektisopimuksissa.',
        ],
      },
      {
        title: '2. Asiakkaan vastuut',
        body: [
          'Asiakkaana sitoudut:',
          [
            'antamaan tarkat ja täydelliset tiedot',
            'vastaamaan palautepyyntöihin oikea-aikaisesti',
            'toimittamaan tarvittavan sisällön, kuvat ja materiaalit',
            'suorittamaan maksut sovitusti',
            'noudattamaan kaikkia sovellettavia lakeja ja säädöksiä',
          ],
        ],
      },
      {
        title: '3. Maksuehdot',
        body: [
          'Maksuehdot määritellään yksittäisissä projektisopimuksissa. Maksu suoritetaan projektin valmistuttua sovitun aikataulun mukaisesti. Myöhästyneet tai maksamattomat maksut voivat johtaa palveluiden keskeyttämiseen ja lisämaksuihin.',
        ],
      },
      {
        title: '4. Immateriaalioikeudet',
        body: [
          'Kun maksu on suoritettu kokonaisuudessaan, omistat oikeudet lopullisiin toimituksiin. Hades Design pidättää kuitenkin oikeuden käyttää työtä portfoliossaan ja markkinointimateriaaleissaan. Olemassa olevat materiaalit, mallit ja koodikirjastot pysyvät omistajiensa omaisuutena.',
        ],
      },
      {
        title: '5. Revisiot ja muutokset',
        body: [
          'Revisiokierrosten määrä määritellään projektisopimuksessa. Sovitun laajuuden ylittävät lisärevisiot voivat aiheuttaa lisäkustannuksia. Merkittävät muutokset projektin laajuuteen voivat vaatia uuden sopimuksen ja lisäveloituksia.',
        ],
      },
      {
        title: '6. Projektin aikataulu',
        body: [
          'Tarjoamme arvioidut aikataulut projektin valmistumiselle. Aikataulut riippuvat kuitenkin asiakkaan oikea-aikaisesta palautteesta ja sisällön toimittamisesta. Asiakkaan aiheuttamat viivästykset voivat pidentää projektin aikataulua vastaavasti.',
        ],
      },
      {
        title: '7. Tuki ja ylläpito',
        body: [
          'Tukijaksot määritellään yksittäisissä sopimuksissa. Tukijakson jälkeen jatkuva ylläpito ja tukipalvelut ovat saatavilla erillisten ylläpitosopimusten kautta.',
        ],
      },
      {
        title: '8. Takuut ja vastuuvapauslausekkeet',
        body: [
          'Takaamme, että palvelumme suoritetaan ammattimaisesti. Emme kuitenkaan anna takuita tietyistä tuloksista tai lopputulemista. Palvelumme tarjotaan ”sellaisenaan” ilman minkäänlaista takuuta.',
        ],
      },
      {
        title: '9. Vastuunrajoitus',
        body: [
          'Vastuumme kaikista palveluistamme johtuvista vaatimuksista ei ylitä asiakkaan kyseisestä projektista maksamaa kokonaissummaa.',
        ],
      },
      {
        title: '10. Irtisanominen',
        body: [
          'Kumpikin osapuoli voi irtisanoa sopimuksen kirjallisella ilmoituksella. Irtisanomistilanteessa asiakas maksaa kaikesta irtisanomispäivään mennessä tehdystä työstä. Ennakkomaksuja ei palauteta.',
        ],
      },
      {
        title: '11. Sovellettava laki',
        body: ['Näihin ehtoihin sovelletaan Suomen lakia, huomioimatta sen lainvalintasäännöksiä.'],
      },
      {
        title: '12. Muutokset ehtoihin',
        body: [
          'Pidätämme oikeuden muuttaa näitä ehtoja milloin tahansa. Muutokset tulevat voimaan välittömästi, kun ne on julkaistu verkkosivustollamme.',
        ],
      },
      {
        title: 'Ota yhteyttä',
        body: [`Jos sinulla on kysyttävää näistä käyttöehdoista, ota meihin yhteyttä: ${email}.`],
      },
    ],
  },
  en: {
    title: 'Terms of service',
    updated: 'Last updated: January 2025',
    intro:
      'Please read these terms of service carefully before using our services. By using our services, you agree to be bound by these terms.',
    sections: [
      {
        title: '1. Services',
        body: [
          'Hades Design provides web design and development services, including but not limited to website design, development, maintenance and related consulting services. The specific scope of services is defined in individual project agreements.',
        ],
      },
      {
        title: '2. Client responsibilities',
        body: [
          'As a client, you agree to:',
          [
            'provide accurate and complete information',
            'respond to requests for feedback in a timely manner',
            'provide the necessary content, images and materials',
            'make payments as agreed',
            'comply with all applicable laws and regulations',
          ],
        ],
      },
      {
        title: '3. Payment terms',
        body: [
          'Payment terms are defined in individual project agreements. Payment is made upon project completion according to the agreed schedule. Late or unpaid payments may result in suspension of services and additional fees.',
        ],
      },
      {
        title: '4. Intellectual property',
        body: [
          'Upon full payment, you own the rights to the final deliverables. However, Hades Design retains the right to use the work in its portfolio and marketing materials. Pre-existing materials, templates and code libraries remain the property of their respective owners.',
        ],
      },
      {
        title: '5. Revisions and changes',
        body: [
          'The number of revision rounds is specified in the project agreement. Additional revisions beyond the agreed scope may incur additional costs. Significant changes to the project scope may require a new agreement and additional charges.',
        ],
      },
      {
        title: '6. Project timeline',
        body: [
          'We provide estimated timelines for project completion. However, timelines depend on timely client feedback and content delivery. Delays caused by the client may extend the project timeline accordingly.',
        ],
      },
      {
        title: '7. Support and maintenance',
        body: [
          'Support periods are defined in individual agreements. After the support period, ongoing maintenance and support services are available through separate maintenance agreements.',
        ],
      },
      {
        title: '8. Warranties and disclaimers',
        body: [
          'We warrant that our services will be performed professionally. However, we make no warranties regarding specific results or outcomes. Our services are provided “as is” without any warranty of any kind.',
        ],
      },
      {
        title: '9. Limitation of liability',
        body: [
          'Our liability for any claims arising from our services shall not exceed the total amount paid by the client for the project in question.',
        ],
      },
      {
        title: '10. Termination',
        body: [
          'Either party may terminate the agreement with written notice. Upon termination, the client pays for all work completed up to the termination date. Deposits are non-refundable.',
        ],
      },
      {
        title: '11. Governing law',
        body: ['These terms are governed by the laws of Finland, without regard to its conflict of law provisions.'],
      },
      {
        title: '12. Changes to the terms',
        body: [
          'We reserve the right to modify these terms at any time. Changes take effect immediately upon publication on our website.',
        ],
      },
      {
        title: 'Contact us',
        body: [`If you have any questions about these terms of service, please contact us at ${email}.`],
      },
    ],
  },
}
