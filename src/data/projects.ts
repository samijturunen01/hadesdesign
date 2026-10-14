/**
 * Portfolio – real projects confirmed by the owner. Facts come from the live sites
 * (checked 2026-10-14). Do not add projects here without the owner's confirmation.
 */
import type { Localized } from '../i18n/locale'

export interface Project {
  id: 'pielisen-lumo' | 'okkuva' | 'kuljetus-jumppanen'
  name: string
  client: string
  domain: string
  url: string
  /** Whether to link to the live site (hide it if the site goes offline). */
  linkLive: boolean
  category: Localized
  summary: Localized
  description: Localized
  /** What the site contains (from the published project description). */
  highlights: Localized<string[]>
  tags: Localized<string[]>
  /** Base name of the responsive images in /public/images/work. */
  image: string
  imageAlt: Localized
}

export const projects: Project[] = [
  {
    id: 'pielisen-lumo',
    name: 'Pielisen Lumo',
    client: 'Pielisen Lumo Kulttuuriseura ry',
    domain: 'pielisenlumo.net',
    url: 'https://pielisenlumo.net',
    linkLive: true,
    category: { fi: 'Matkailu ja kulttuuri', en: 'Tourism & culture' },
    summary: {
      fi: 'Verkkosivusto Pielisen Lumo Kulttuuriseura ry:lle – kulttuuritapahtumat, majoitus, elämykset, kahvilapalvelut ja Paaterin kulttuurikohteet yhdessä paikassa.',
      en: 'A website for Pielisen Lumo Kulttuuriseura ry – cultural events, accommodation, experiences, café services and the cultural sites of Paateri in one place.',
    },
    description: {
      fi: 'Pielisen Lumo on kattava matkailu- ja kulttuurisivusto, joka kokoaa yhteen alueen tapahtumat, majoituspalvelut, elämykset, kahvilat ja kulttuurikohteet. Sivusto suunniteltiin moderniksi, mobiiliystävälliseksi ja helposti päivitettäväksi kokonaisuudeksi, joka auttaa kävijöitä löytämään palvelut nopeasti ja parantaa yhdistyksen näkyvyyttä verkossa.',
      en: 'Pielisen Lumo is a comprehensive tourism and culture website that brings together the area’s events, accommodation, experiences, cafés and cultural attractions. It was designed to be modern, mobile-friendly and easy to update – helping visitors find services quickly while improving the association’s visibility online.',
    },
    highlights: {
      fi: ['Kulttuuritapahtumat', 'Majoitus ja elämykset', 'Kahvilapalvelut', 'Paaterin kulttuurikohteet'],
      en: ['Cultural events', 'Accommodation & experiences', 'Café services', 'The cultural sites of Paateri'],
    },
    tags: { fi: ['Matkailu', 'Kulttuuri', 'Tapahtumat'], en: ['Tourism', 'Culture', 'Events'] },
    image: 'pielisen-lumo',
    imageAlt: {
      fi: 'Pielisen Lumon verkkosivuston etusivu: ilmakuva Pielisen järvimaisemasta ja otsikko kulttuuritoiminnasta',
      en: 'The Pielisen Lumo website home page: an aerial view of the Pielinen lake landscape and a headline about cultural activities',
    },
  },
  {
    id: 'okkuva',
    name: 'Okkuva',
    client: 'Okkuva',
    domain: 'okkuva.fi',
    url: 'https://okkuva.fi/',
    linkLive: true,
    category: { fi: 'Videotuotanto', en: 'Video production' },
    summary: {
      fi: 'Verkkosivusto Okkuvalle – yritysten lyhytvideopalvelulle, jonka videoreferenssit, hinnasto ja yhteydenotto löytyvät selkeästi yhdestä paikasta.',
      en: 'A website for Okkuva – a short-form video service for businesses, with video references, pricing and contact in one clear place.',
    },
    description: {
      fi: 'Okkuva tekee yrityksille somessa toimivia lyhytvideoita käsikirjoituksesta kuvaukseen ja editointiin. Sivusto rakentuu Okkuvan rohkean, leikkisän ilmeen ympärille: etusivu kiteyttää palvelun yhteen lauseeseen, videoreferenssit avautuvat katsottaviksi suoraan sivulla, ja neljän askeleen prosessi sekä selkeä pakettihinnasto madaltavat yhteydenoton kynnystä.',
      en: 'Okkuva makes short-form social media videos for businesses, from script to filming and editing. The site is built around Okkuva’s bold, playful identity: the home page sums up the service in a single line, video references open for viewing right on the page, and a four-step process and clear package pricing make it easy to get in touch.',
    },
    highlights: {
      fi: ['Videoreferenssit', 'Pakettihinnasto', 'Neljän askeleen prosessi', 'Yhteydenotto'],
      en: ['Video references', 'Package pricing', 'Four-step process', 'Contact'],
    },
    tags: { fi: ['Video', 'Some', 'Palveluyritys'], en: ['Video', 'Social media', 'Service business'] },
    image: 'okkuva',
    imageAlt: {
      fi: 'Okkuvan verkkosivuston etusivu: OKKUVA-logo, oranssilinssiset aurinkolasit ja otsikko ”Videoita, jotka pysäyttävät scrollaamisen”',
      en: 'The Okkuva website home page: the OKKUVA logo, sunglasses with orange lenses and the headline “Videoita, jotka pysäyttävät scrollaamisen” (Videos that stop the scroll)',
    },
  },
  {
    id: 'kuljetus-jumppanen',
    name: 'Kuljetus Jumppanen',
    client: 'Kuljetus Jumppanen Oy',
    domain: 'kuljetusjumppanen.fi',
    url: 'https://kuljetusjumppanen.fi/',
    linkLive: true,
    category: { fi: 'Tavarankuljetus', en: 'Freight transport' },
    summary: {
      fi: 'Verkkosivusto joensuulaiselle tavarankuljetusyritykselle – kuljetuspalvelut, selkeä hinnasto ja suora yhteys yrittäjään.',
      en: 'A website for a freight transport company in Joensuu – transport services, clear pricing and a direct line to the owner.',
    },
    description: {
      fi: 'Kuljetus Jumppanen Oy on kesäkuussa 2026 perustettu joensuulainen tavarankuljetusyritys, joka hoitaa kuljetukset lava-autolla. Uudelle yritykselle rakennettu sivusto kertoo suoraan, mitä kuljetetaan, mitä se maksaa ja kenen kanssa asioidaan: kuljetuspalvelut, paino- ja kilometriluokkiin perustuva hinnasto, yritysesittely ja yhteystiedot löytyvät kukin omalta sivultaan.',
      en: 'Kuljetus Jumppanen Oy is a freight transport company from Joensuu, founded in June 2026, that handles deliveries with a flatbed truck. Built for a new business, the site says plainly what gets transported, what it costs and who you deal with: transport services, pricing based on weight and distance classes, a company introduction and contact details each have their own page.',
    },
    highlights: {
      fi: ['Kuljetuspalvelut', 'Paino- ja matkaperusteinen hinnasto', 'Yritysesittely', 'Yhteystiedot'],
      en: ['Transport services', 'Weight- and distance-based pricing', 'Company introduction', 'Contact details'],
    },
    tags: { fi: ['Kuljetus', 'Paikallinen yritys', 'Joensuu'], en: ['Transport', 'Local business', 'Joensuu'] },
    image: 'kuljetus-jumppanen',
    imageAlt: {
      fi: 'Kuljetus Jumppasen verkkosivuston etusivu: tumma yläosa, otsikko ”Kuljetukset Joensuusta luotettavasti perille” ja kuvitus lava-autosta',
      en: 'The Kuljetus Jumppanen website home page: a dark hero, the headline “Kuljetukset Joensuusta luotettavasti perille” (Reliable transport from Joensuu) and an illustration of a flatbed truck',
    },
  },
]
