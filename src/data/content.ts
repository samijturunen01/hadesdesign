/**
 * Shared, verified content blocks used on several pages: the four reasons to
 * choose Hades Design, the process, values, approach, FAQs and the testimonial.
 */
import type { Localized } from '../i18n/locale'

export interface TitledText {
  title: Localized
  text: Localized
}

/** "Miksi valita Hades Design?" */
export const pillars: TitledText[] = [
  {
    title: { fi: 'Salamannopea', en: 'Lightning fast' },
    text: {
      fi: 'Optimoimme sivut mahdollisimman nopeiksi, jotta kävijä ei joudu odottamaan.',
      en: 'We optimise every site to be as fast as possible, so visitors never wait.',
    },
  },
  {
    title: { fi: 'Luotettava ja turvallinen', en: 'Reliable & secure' },
    text: {
      fi: 'Rakennamme sivut tietoturvaa noudattaen – yhteys on aina suojattu koko käynnin ajan.',
      en: 'We build with security in mind – the connection stays protected throughout every visit.',
    },
  },
  {
    title: { fi: 'Hakukoneystävällinen', en: 'Search-engine friendly' },
    text: {
      fi: 'Jokainen rakentamamme sivusto on hakukoneoptimoitu alusta alkaen, jotta se sijoittuu hakutuloksissa.',
      en: 'Every site we build is search-engine optimised from day one, so it can rank in search results.',
    },
  },
  {
    title: { fi: 'Täysin responsiivinen', en: 'Fully responsive' },
    text: {
      fi: 'Sivustosi toimii moitteettomasti kaikilla laitteilla – älypuhelimista suuriin näyttöihin.',
      en: 'Your site works flawlessly on every device – from smartphones to large screens.',
    },
  },
]

export const pillarsIntro: Localized = {
  fi: 'Suunnittelemme yrityksellesi selkeät verkkosivut, jotka näyttävät ammattimaisilta ja tarjoavat asiakkaillesi sujuvan käyntikokemuksen.',
  en: 'We design clear websites for your business that look professional and give your customers a smooth experience.',
}

/** The five-step process. */
export const processSteps: TitledText[] = [
  {
    title: { fi: 'Kartoitus', en: 'Discovery' },
    text: {
      fi: 'Perehdymme liiketoimintaasi, tavoitteisiisi ja kohderyhmääsi, jotta sivut puhuttelevat juuri sinun asiakkaitasi.',
      en: 'We get to know your business, goals and target audience so the site speaks to your customers.',
    },
  },
  {
    title: { fi: 'Suunnittelu', en: 'Design' },
    text: {
      fi: 'Luomme sivustostasi demoversion, jota hiotaan tarpeidesi mukaan.',
      en: 'We create a demo version of your website and refine it to fit your needs.',
    },
  },
  {
    title: { fi: 'Kehitys', en: 'Development' },
    text: {
      fi: 'Herätämme sivuston eloon modernilla koodilla.',
      en: 'We bring the site to life with modern code.',
    },
  },
  {
    title: { fi: 'Julkaisu', en: 'Launch' },
    text: {
      fi: 'Testaamme kaiken perusteellisesti, jotta julkaisu sujuu ja kaikki varmasti toimii.',
      en: 'We test everything thoroughly so the launch goes smoothly and everything works.',
    },
  },
  {
    title: { fi: 'Tuki', en: 'Support' },
    text: {
      fi: 'Jatkuva tuki pitää sivustosi toiminnassa ja reagoi nopeasti muutoksiin.',
      en: 'Ongoing support keeps your site running and responds quickly to change.',
    },
  },
]

/** About page: values. */
export const values: TitledText[] = [
  {
    title: { fi: 'Intohimo suunnitteluun', en: 'Passion for design' },
    text: {
      fi: 'Rakastamme sitä, mitä teemme – ja se näkyy jokaisessa pikselissä, koodirivissä ja asiakaskohtaamisessa.',
      en: 'We love what we do, and it shows in every pixel, every line of code and every client conversation.',
    },
  },
  {
    title: { fi: 'Tuloshakuisuus', en: 'Results-driven' },
    text: {
      fi: 'Kaunis ulkoasu on vasta alkua. Keskitymme sivustoihin, jotka auttavat saavuttamaan liiketoimintasi tavoitteet.',
      en: 'Beautiful design is only the start. We focus on websites that help you reach your business goals.',
    },
  },
  {
    title: { fi: 'Asiakaslähtöisyys', en: 'Client-focused' },
    text: {
      fi: 'Sinun menestyksesi on meidän menestyksemme. Työskentelemme tiiviisti kanssasi koko prosessin ajan.',
      en: 'Your success is our success. We work closely with you throughout the whole process.',
    },
  },
  {
    title: { fi: 'Innovaatio edellä', en: 'Innovation first' },
    text: {
      fi: 'Pysymme trendien ja teknologioiden kärjessä tarjotaksemme huippuluokan ratkaisuja.',
      en: 'We stay ahead of trends and technology to deliver cutting-edge solutions.',
    },
  },
]

/** About page: how we work, in three steps. */
export const approach: TitledText[] = [
  {
    title: { fi: 'Kuuntele ja ymmärrä', en: 'Listen & understand' },
    text: {
      fi: 'Aloitamme ymmärtämällä liiketoimintasi, tavoitteesi, kohderyhmäsi ja juuri sinun haasteesi.',
      en: 'We start by understanding your business, your goals, your audience and your particular challenges.',
    },
  },
  {
    title: { fi: 'Suunnittele ja kehitä', en: 'Design & develop' },
    text: {
      fi: 'Luomme kauniin ja intuitiivisen ulkoasun ja herätämme sen eloon siistillä, suorituskykyisellä koodilla.',
      en: 'We craft a beautiful, intuitive design and bring it to life with clean, high-performance code.',
    },
  },
  {
    title: { fi: 'Julkaise ja tue', en: 'Launch & support' },
    text: {
      fi: 'Varmistamme sujuvan julkaisun. Halutessasi jatkamme yhteistyötä ylläpitosopimuksella, jotta menestyt pitkällä aikavälillä.',
      en: 'We make sure the launch goes smoothly. If you wish, we keep working together on a maintenance plan, so you succeed in the long run.',
    },
  },
]

export interface Faq {
  q: Localized
  a: Localized
}

export const pricingFaq: Faq[] = [
  {
    q: { fi: 'Mitä maksutapoja hyväksytte?', en: 'Which payment methods do you accept?' },
    a: {
      fi: 'Hyväksymme pankkisiirrot. Lasku lähetetään, kun projekti on valmis.',
      en: 'We accept bank transfers. The invoice is sent once the project is completed.',
    },
  },
  {
    q: { fi: 'Kuinka kauan verkkosivujen tekeminen kestää?', en: 'How long does it take to build a website?' },
    a: {
      fi: 'Aikataulu riippuu projektin laajuudesta. Kevyt verkkosivupaketti valmistuu tyypillisesti 1–2 viikossa, Verkkosivupaketti 2–3 viikossa ja Verkkokauppapaketti 3–4 viikossa.',
      en: 'Timelines depend on the scope of the project. A Light website package typically takes 1–2 weeks, a Website package 2–3 weeks and an Online store package 3–4 weeks.',
    },
  },
  {
    q: { fi: 'Sisältyykö julkaisun jälkeinen tuki pakettiin?', en: 'Is post-launch support included in the package?' },
    a: {
      fi: 'Julkaisun jälkeinen tekninen tuki ja ylläpito ovat saatavilla erillisinä maksullisina palveluina. Ylläpito ja hosting -paketti maksaa 40 €/kk tai 360 €/vuosi.',
      en: 'Post-launch technical support and maintenance are available as separately paid services. The maintenance & hosting plan costs €40/month or €360/year.',
    },
  },
  {
    q: { fi: 'Voinko päivittää pakettiani myöhemmin?', en: 'Can I upgrade my package later?' },
    a: {
      fi: 'Ehdottomasti. Voit laajentaa sivustoasi milloin tahansa – hyvitämme alkuperäisen investointisi ja käytämme sen päivitettyyn pakettiin.',
      en: 'Absolutely. You can upgrade your site at any time – we credit your original investment towards the upgraded package.',
    },
  },
  {
    q: { fi: 'Tarjoatteko hosting-palvelua?', en: 'Do you provide hosting?' },
    a: {
      fi: 'Kyllä. Tarjoamme täysin hallitun hostingin: sivustosi toimii turvallisessa ja optimoidussa palvelinympäristössä, johon sisältyvät säännöllinen ylläpito, varmuuskopiot ja tuki. Hosting laskutetaan erikseen osana ylläpitosopimusta.',
      en: 'Yes. We offer fully managed hosting: your site runs in a secure, optimised server environment with regular maintenance, backups and support included. Hosting is billed separately as part of a maintenance plan.',
    },
  },
  {
    q: { fi: 'Kuka omistaa verkkosivuston, kun se on valmis?', en: 'Who owns the website once it is finished?' },
    a: {
      fi: 'Asiakas omistaa valmiin verkkosivuston ja sen sisällön, kun maksu on suoritettu. Sivusto toimitetaan julkaisuvalmiina.',
      en: 'You own the finished website and its content once payment has been made. The site is delivered ready to publish.',
    },
  },
]

export const maintenanceFaq: Faq[] = [
  {
    q: { fi: 'Mitä ylläpitopakettiin sisältyy?', en: 'What is included in the maintenance plan?' },
    a: {
      fi: 'Paketti sisältää hallitun ylläpidon, turvallisen hostingin, tietoturvan ja seurannan, sisältöpäivitykset, automaattiset varmuuskopiot sekä prioriteettituen.',
      en: 'The plan includes managed maintenance, secure hosting, security and uptime monitoring, content updates, automatic backups and priority support.',
    },
  },
  {
    q: { fi: 'Voinko peruuttaa tilauksen milloin tahansa?', en: 'Can I cancel at any time?' },
    a: {
      fi: 'Kyllä. Tilaus pysyy voimassa jo maksetun kauden loppuun, eikä se uusiudu sen jälkeen.',
      en: 'Yes. Your plan stays active until the end of the period you have already paid for and does not renew after that.',
    },
  },
  {
    q: { fi: 'Mitä tapahtuu, jos sivustoni kaatuu?', en: 'What happens if my website goes down?' },
    a: {
      fi: 'Valvontamme havaitsee ongelmat välittömästi, ja reagoimme nopeasti mahdollisten katkosten korjaamiseksi. Takaamme 99,9 %:n käytettävyyden.',
      en: 'Our monitoring detects issues immediately and we respond quickly to resolve any downtime. We guarantee 99.9% uptime.',
    },
  },
  {
    q: { fi: 'Siirrättekö olemassa olevan sivuston?', en: 'Do you migrate existing websites?' },
    a: {
      fi: 'Kyllä. Siirrämme nykyisen sivustosi hosting-ympäristöömme ilman lisäkustannuksia.',
      en: 'Yes. We migrate your existing website to our hosting environment at no additional cost.',
    },
  },
  {
    q: { fi: 'Kuinka usein varmuuskopiot otetaan?', en: 'How often are backups taken?' },
    a: {
      fi: 'Otamme automaattiset varmuuskopiot päivittäin ja säilytämme niitä 30 päivää. Voit myös pyytää erillisen varmuuskopion milloin tahansa.',
      en: 'We take automatic backups every day and keep them for 30 days. You can also request a manual backup at any time.',
    },
  },
]

/**
 * The only client testimonial published on the previous site. Quote text is verbatim –
 * do not edit. Attribution moved from Shady to Okkuva on the owner's request (2026-10-14).
 */
export const testimonial = {
  quote: {
    fi: 'Suosittelen Hadesta jokaiselle, joka haluaa tyylikkäät nettisivut. Laatu, luovuus ja yksityiskohtien huomiointi on aivan omaa luokkaansa.',
    en: 'I recommend Hades to everyone who wants a stylish website. The quality, creativity and attention to detail are on another level.',
  } satisfies Localized,
  /** Must equal the project's `client` so the Work page shows the quote under that project. */
  author: 'Okkuva',
  role: { fi: 'Lyhytvideoita yrityksille', en: 'Short-form video for businesses' } satisfies Localized,
} as const
