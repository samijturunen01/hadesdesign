/**
 * Portfolio – the two real projects published on the previous site.
 * Do not add projects here without the owner's confirmation.
 */
import type { Localized } from '../i18n/locale'

export interface Project {
  id: 'pielisen-lumo' | 'shady'
  name: string
  client: string
  domain: string
  url: string
  /**
   * Whether to link to the live site. shady.fi served a hosting provider's
   * placeholder page on 2026-10-14 (site offline, TLS certificate mismatch),
   * so the link is hidden until the site is back online.
   */
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
    id: 'shady',
    name: 'Shady',
    client: 'Shady',
    domain: 'shady.fi',
    url: 'https://shady.fi',
    linkLive: false,
    category: { fi: 'Musiikkiartisti', en: 'Music artist' },
    summary: {
      fi: 'Ammattimainen artistisivusto suomalaiselle rap-artisti Shadylle – musiikkijulkaisut ja biografia.',
      en: 'A professional artist website for Finnish rapper Shady – music releases and biography.',
    },
    description: {
      fi: 'Moderni artistisivusto, joka esittelee Shadyn uusimmat musiikkijulkaisut, debyyttialbumin ”Koska Mä Voin”, musiikkivideot ja biografian. Sivustolla on upotetut musiikkisoittimet, sosiaalisen median integraatiot ja keikkamyynnin yhteystiedot.',
      en: 'A modern artist website presenting Shady’s latest releases, the debut album “Koska Mä Voin”, music videos and biography. The site features embedded music players, social media integrations and booking information for live shows.',
    },
    highlights: {
      fi: ['Musiikkijulkaisut', 'Upotetut soittimet', 'Musiikkivideot', 'Keikkamyynti'],
      en: ['Music releases', 'Embedded players', 'Music videos', 'Booking information'],
    },
    tags: { fi: ['Musiikki', 'Artisti', 'Portfolio'], en: ['Music', 'Artist', 'Portfolio'] },
    image: 'shady',
    imageAlt: {
      fi: 'Shadyn artistisivuston etusivu: SHADY-logo, punainen ”Tuoreimmat julkaisut” -palkki ja kuva artistista graffitiseinän edessä',
      en: 'The Shady artist website home page: the SHADY logo, a red “Latest releases” banner and a photo of the artist in front of a graffiti wall',
    },
  },
]
