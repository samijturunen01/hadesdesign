/**
 * Shared, verified content blocks used on several pages: benefits, reasons to
 * choose Hades Design, the process, values, approach, FAQs and the testimonial.
 *
 * Only verified facts and policies (docs/CONTENT-SOURCES.md). Not documented –
 * so never promised here: delivery times, number of revisions, domain
 * registration, included support periods or payment schedules beyond
 * "invoice on completion".
 */
import { formatEuro, type Localized } from '../i18n/locale'
import { maintenancePlan } from './packages'
import { NO_ADDONS, PRICES, ZEUS_FROM_PRICE, ZEUS_FULL_PRICE, zeusTotal } from './pricing'

export interface TitledText {
  title: Localized
  text: Localized
}

const eur = (amount: number): Localized => ({ fi: formatEuro(amount, 'fi'), en: formatEuro(amount, 'en') })
const hermes = eur(PRICES.hermes)
const apollo = eur(PRICES.apollo)
const apolloBooking = eur(zeusTotal({ ...NO_ADDONS, booking: true }))
const zeusFrom = eur(ZEUS_FROM_PRICE)
const zeusFull = eur(ZEUS_FULL_PRICE)
const apolloPremium = eur(PRICES.apollo - PRICES.hermes)
const maintenanceMonth = eur(maintenancePlan.monthly)
const maintenanceYear = eur(maintenancePlan.yearly)

/** What every site we build does for the business – the same in every package. */
export const pillars: TitledText[] = [
  {
    title: { fi: 'Herättää luottamuksen heti', en: 'Earns trust at first sight' },
    text: {
      fi: 'Huoliteltu, yrityksesi näköinen ulkoasu kertoo ensisilmäyksellä, että asiat hoituvat ammattitaidolla.',
      en: 'A polished design that looks like your business shows at first glance that you do things properly.',
    },
  },
  {
    title: { fi: 'Auttaa asiakkaita löytämään sinut', en: 'Helps customers find you' },
    text: {
      fi: 'Hakukoneoptimointi alusta asti: sivusto rakennetaan niin, että hakukoneet ymmärtävät, mitä tarjoat ja missä.',
      en: 'Search engine optimisation from day one: the site is built so search engines understand what you offer and where.',
    },
  },
  {
    title: { fi: 'Latautuu hetkessä', en: 'Loads in an instant' },
    text: {
      fi: 'Nopeat sivut pitävät kävijän kiinnostuneena. Asiakkaasi löytävät tarvitsemansa tiedot odottamatta.',
      en: 'Fast pages keep visitors interested. Your customers find what they need without waiting.',
    },
  },
  {
    title: { fi: 'Toimii jokaisella laitteella', en: 'Works on every device' },
    text: {
      fi: 'Moni etsii palveluita puhelimella. Sivustosi on yhtä selkeä ja helppokäyttöinen pienellä näytöllä kuin suurella.',
      en: 'Many people look for services on their phone. Your site is just as clear and easy to use on a small screen as on a large one.',
    },
  },
]

export const pillarsIntro: Localized = {
  fi: 'Jokainen toteuttamamme sivusto rakennetaan näiden periaatteiden varaan – paketista riippumatta.',
  en: 'Every site we build stands on these principles – whichever package you choose.',
}

/** "Miksi Hades Design" – verified facts about working with us. */
export const reasons: TitledText[] = [
  {
    title: { fi: 'Yksilöllinen suunnittelu', en: 'Designed for you' },
    text: {
      fi: 'Jokainen sivusto suunnitellaan yrityksesi brändin, asiakkaiden ja tavoitteiden mukaan – ei valmiista massapohjista.',
      en: 'Every site is designed around your brand, customers and goals – never from mass-produced templates.',
    },
  },
  {
    title: { fi: 'Selkeät hinnat etukäteen', en: 'Clear prices up front' },
    text: {
      fi: `Hermes ${hermes.fi}, Apollo ${apollo.fi} ja Zeus-lisäominaisuudet kiinteillä hinnoilla. Tiedät kustannukset ennen kuin päätät.`,
      en: `Hermes ${hermes.en}, Apollo ${apollo.en} and fixed prices for the Zeus add-ons. You know the cost before you decide.`,
    },
  },
  {
    title: { fi: 'Maksat valmiista', en: 'Pay when it’s done' },
    text: {
      fi: 'Lasku lähetetään, kun projekti on valmis. Valmis verkkosivusto ja sen sisältö ovat sinun, kun maksu on suoritettu.',
      en: 'The invoice is sent once the project is completed. The finished website and its content are yours once payment has been made.',
    },
  },
  {
    title: { fi: 'Nopea vastaus', en: 'A quick reply' },
    text: {
      fi: 'Vastaamme yleensä 24 tunnin kuluessa arkipäivisin. Toimimme Joensuusta – paikallisesti ja etänä.',
      en: 'We usually reply within 24 hours on business days. We work from Joensuu – locally and remotely.',
    },
  },
]

/** The five-step process. */
export const processSteps: TitledText[] = [
  {
    title: { fi: 'Kartoitus', en: 'Discovery' },
    text: {
      fi: 'Perehdymme liiketoimintaasi, tavoitteisiisi ja asiakkaisiisi – ja autamme valitsemaan sopivan paketin.',
      en: 'We get to know your business, goals and customers – and help you choose the right package.',
    },
  },
  {
    title: { fi: 'Suunnittelu', en: 'Design' },
    text: {
      fi: 'Luomme sivustostasi demoversion, jota hiotaan palautteesi perusteella.',
      en: 'We create a demo version of your website and refine it based on your feedback.',
    },
  },
  {
    title: { fi: 'Toteutus', en: 'Development' },
    text: {
      fi: 'Rakennamme sivuston nopeaksi, turvalliseksi ja hakukoneystävälliseksi.',
      en: 'We build the site to be fast, secure and search-engine friendly.',
    },
  },
  {
    title: { fi: 'Julkaisu', en: 'Launch' },
    text: {
      fi: 'Testaamme kaiken perusteellisesti eri laitteilla, jotta julkaisu sujuu ja kaikki varmasti toimii.',
      en: 'We test everything thoroughly on different devices so the launch goes smoothly and everything works.',
    },
  },
  {
    title: { fi: 'Julkaisun jälkeen', en: 'After launch' },
    text: {
      fi: 'Halutessasi jatkamme yhteistyötä ylläpitosopimuksella, joka pitää sivustosi turvallisena ja ajan tasalla.',
      en: 'If you wish, we keep working together on a maintenance plan that keeps your site secure and up to date.',
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

const faq = {
  whichPackage: {
    q: { fi: 'Mikä paketti sopii minulle?', en: 'Which package is right for me?' },
    a: {
      fi: `Jos yrityksesi palvelut ja tarina mahtuvat selkeästi yhdelle sivulle, Hermes (${hermes.fi}) on hyvä valinta. Useimmille yrityksille suosittelemme Apolloa (${apollo.fi}): jokainen palvelu saa oman sivunsa ja lomake räätälöidään liiketoimintasi mukaan. Zeus kannattaa, kun tarvitset ajanvarausta, verkkomaksuja, analytiikkaa tai kieliversioita. Jos et ole varma, kerro tarpeistasi – suosittelemme sopivinta vaihtoehtoa, emme kalleinta.`,
      en: `If your services and story fit clearly on one page, Hermes (${hermes.en}) is a good choice. For most businesses we recommend Apollo (${apollo.en}): every service gets its own page and the form is tailored to your business. Zeus makes sense when you need online booking, payments, analytics or language versions. Not sure? Tell us what you need – we recommend the best fit, not the most expensive option.`,
    },
  },
  onePageVsMulti: {
    q: {
      fi: 'Mitä eroa on yksisivuisella ja monisivuisella verkkosivustolla?',
      en: 'What is the difference between a one-page and a multi-page website?',
    },
    a: {
      fi: 'Yksisivuisessa verkkosivustossa (Hermes) kaikki olennainen – yritysesittely, palvelut, referenssit ja yhteystiedot – on yhdellä selkeällä, vieritettävällä sivulla. Monisivuisessa verkkosivustossa (Apollo ja Zeus) palveluilla, yritysesittelyllä ja yhteydenotolla on omat sivunsa. Silloin jokaisesta palvelusta voi kertoa laajemmin, ja jokainen sivu voidaan optimoida hakukoneille omilla hakusanoillaan.',
      en: 'On a one-page website (Hermes) everything that matters – introduction, services, references and contact details – is on one clear, scrolling page. On a multi-page website (Apollo and Zeus) your services, company and contact each have their own pages. That leaves room to say more about every service, and each page can be optimised for search engines with its own keywords.',
    },
  },
  hermesQuality: {
    q: { fi: 'Onko Hermes yhtä laadukas kuin Apollo?', en: 'Is Hermes as high quality as Apollo?' },
    a: {
      fi: 'On. Hermes suunnitellaan samalla huolellisuudella, samalla Conversion First -periaatteella ja samalla tekniikalla kuin Apollo: yksilöllinen premium-ulkoasu, animaatiot tarpeen mukaan, responsiivisuus, hakukoneoptimointi ja nopeus kuuluvat molempiin. Eroja on kaksi: Hermes on yksisivuinen, ja siinä on yksinkertainen yhteydenottolomake.',
      en: 'Yes. Hermes is designed with the same care, the same Conversion First principle and the same technology as Apollo: a custom premium design, animations where relevant, responsive layouts, search engine optimisation and speed are part of both. There are two differences: Hermes is a one-page website, and it has a simple contact form.',
    },
  },
  apolloPrice: {
    q: { fi: `Miksi Apollo maksaa ${apolloPremium.fi} enemmän?`, en: `Why does Apollo cost ${apolloPremium.en} more?` },
    a: {
      fi: 'Apollossa on useita sivuja, ja jokainen niistä suunnitellaan ja optimoidaan erikseen: omat palvelusivut, yrityssivu ja yhteydenottosivu. Lisäksi Apollon yhteydenottolomake räätälöidään yrityksesi palveluiden mukaan, jotta saat yhteydenottoja, joihin on helppo vastata. Hintaero ei tule ulkoasusta – se on yhtä huolellinen molemmissa.',
      en: 'Apollo has several pages, and each one is designed and optimised separately: dedicated service pages, a company page and a contact page. Its contact form is also tailored to your services, so the enquiries you receive are easy to answer. The difference in price does not come from the design – that is just as careful in both.',
    },
  },
  zeusPartial: {
    q: { fi: 'Voinko valita vain osan Zeus-lisäominaisuuksista?', en: 'Can I choose only some of the Zeus add-ons?' },
    a: {
      fi: `Voit. Zeus on Apollo-verkkosivusto, johon valitset vain tarvitsemasi lisäominaisuudet, ja maksat vain niistä. Esimerkiksi Apollo ja ajanvaraus maksavat yhteensä ${apolloBooking.fi}, ja edullisin Zeus maksaa ${zeusFrom.fi}. Kaikki neljä lisäominaisuutta yhdellä lisäkielellä maksavat ${zeusFull.fi}.`,
      en: `Yes. Zeus is the Apollo website with only the add-ons you need, and you only pay for those. Apollo with online booking, for example, costs ${apolloBooking.en} in total, and the most affordable Zeus is ${zeusFrom.en}. All four add-ons with one additional language cost ${zeusFull.en}.`,
    },
  },
  addLater: {
    q: { fi: 'Voinko lisätä Zeuksen ominaisuuksia myöhemmin?', en: 'Can I add Zeus features later?' },
    a: {
      fi: 'Voit. Voit aloittaa Apollolla ja lisätä esimerkiksi ajanvarauksen tai kieliversion myöhemmin – myöhemmin lisättävän ominaisuuden toteutus ja hinta vahvistetaan tarjouksessa. Myös Hermeksestä voi laajentaa Apolloon, ja hyvitämme tällöin alkuperäisen investointisi.',
      en: 'Yes. You can start with Apollo and add online booking or a language version later, for example – the work and price for a feature added later are confirmed in a quote. You can also move from Hermes to Apollo, and we credit your original investment towards it.',
    },
  },
  needBooking: {
    q: { fi: 'Tarvitsenko ajanvarausjärjestelmää?', en: 'Do I need a booking system?' },
    a: {
      fi: 'Jos asiakkaasi varaavat aikoja – esimerkiksi hoitoihin, valmennuksiin, konsultaatioihin tai vuokraukseen – ajanvaraus vähentää puheluita ja sähköposteja ja antaa asiakkaalle mahdollisuuden varata silloin, kun hänelle sopii. Jos asiakkaasi tavallisesti pyytävät ensin tarjouksen tai kysyvät lisätietoja, Apollon räätälöity yhteydenottolomake on usein parempi valinta. Arvioimme tarpeen mielellämme kanssasi.',
      en: 'If your customers book appointments – treatments, coaching, consultations or rentals, for example – online booking cuts down on calls and emails and lets customers book whenever it suits them. If your customers usually ask for a quote or more information first, Apollo’s tailored contact form is often the better choice. We are happy to work out what you need with you.',
    },
  },
  oldWebsite: {
    q: { fi: 'Minulla on jo verkkosivut. Voitteko tehdä tilalle uudet?', en: 'I already have a website. Can you build a new one?' },
    a: {
      fi: 'Kyllä. Suunnittelemme vanhan sivuston tilalle kokonaan uuden Hermes-, Apollo- tai Zeus-verkkosivuston. Käymme nykyisen sivustosi läpi kartoitusvaiheessa, jotta uusi sivusto rakentuu sen varaan, mikä yrityksellesi on tärkeää.',
      en: 'Yes. We design a completely new Hermes, Apollo or Zeus website to replace your old one. We go through your current site during discovery, so the new one builds on what matters to your business.',
    },
  },
  ownContent: {
    q: { fi: 'Voinko toimittaa omat kuvat ja tekstit?', en: 'Can I provide my own photos and text?' },
    a: {
      fi: 'Kyllä, ja se on usein paras vaihtoehto: aidot kuvat ja omat sanasi tekevät sivustosta uskottavan. Toimitat tarvittavat tekstit, kuvat ja materiaalit, ja me suunnittelemme, miten ne esitetään sivustolla selkeästi ja yhteydenottoon ohjaavasti.',
      en: 'Yes, and it is often the best option: real photos and your own words make the site credible. You provide the text, photos and materials needed, and we design how they are presented on the site – clearly, and guiding visitors towards getting in touch.',
    },
  },
  process: {
    q: { fi: 'Miten verkkosivuprojekti etenee?', en: 'How does a website project work?' },
    a: {
      fi: 'Ensin kartoitamme liiketoimintasi, tavoitteesi ja asiakkaasi. Sen jälkeen teemme sivustosta demoversion, jota hiotaan palautteesi perusteella. Kun suunta on selvä, toteutamme sivuston, testaamme sen perusteellisesti ja julkaisemme sen. Lasku lähetetään, kun projekti on valmis, ja maksu tapahtuu pankkisiirrolla.',
      en: 'First we get to know your business, goals and customers. Then we create a demo version of your site and refine it based on your feedback. Once the direction is clear, we build the site, test it thoroughly and launch it. The invoice is sent once the project is completed, and payment is by bank transfer.',
    },
  },
  duration: {
    q: { fi: 'Kuinka kauan verkkosivujen tekeminen kestää?', en: 'How long does it take to build a website?' },
    a: {
      fi: 'Aikataulu riippuu sivuston laajuudesta, valituista lisäominaisuuksista ja siitä, kuinka nopeasti sisällöt ovat valmiina. Kerromme arvioidun aikataulun tarjouksen yhteydessä.',
      en: 'It depends on the size of the site, the add-ons you choose and how soon the content is ready. We give you an estimated schedule with the quote.',
    },
  },
  calculator: {
    q: { fi: 'Onko laskurin hinta lopullinen?', en: 'Is the calculator price final?' },
    a: {
      fi: 'Laskuri näyttää pakettien ja lisäominaisuuksien hinnat sellaisinaan. Ennen työn aloittamista vahvistamme tarjouksessa kokonaisuuden, aikataulun ja mahdolliset ulkoiset kulut, kuten maksupalvelun maksut. Jos tarvitset jotain pakettien ulkopuolelta, arvioimme sen erikseen. Laskuri ei tee tilausta – tarjouspyyntö on maksuton ja sitoumukseton.',
      en: 'The calculator shows the package and add-on prices as they are. Before any work starts, we confirm the scope, schedule and any external costs, such as payment provider fees, in the quote. Anything beyond the packages is estimated separately. The calculator does not place an order – a quote request is free and non-binding.',
    },
  },
  maintenance: {
    q: { fi: 'Sisältyykö verkkosivujen ylläpito hintaan?', en: 'Is website maintenance included in the price?' },
    a: {
      fi: `Ei. Pakettien hinnat ovat kertahintoja verkkosivuston suunnittelusta ja toteutuksesta. Julkaisun jälkeinen tekninen tuki, ylläpito ja hosting ovat erillisiä, valinnaisia palveluita: ylläpito ja hosting -paketti maksaa ${maintenanceMonth.fi}/kk tai ${maintenanceYear.fi}/vuosi, ja siihen sisältyvät päivitykset, tietoturva, varmuuskopiot ja tuki.`,
      en: `No. The package prices are one-time prices for designing and building the website. Post-launch technical support, maintenance and hosting are separate, optional services: the maintenance & hosting plan costs ${maintenanceMonth.en}/month or ${maintenanceYear.en}/year and includes updates, security, backups and support.`,
    },
  },
  ownership: {
    q: { fi: 'Kuka omistaa verkkosivuston, kun se on valmis?', en: 'Who owns the website once it is finished?' },
    a: {
      fi: 'Asiakas omistaa valmiin verkkosivuston ja sen sisällön, kun maksu on suoritettu. Sivusto toimitetaan julkaisuvalmiina.',
      en: 'You own the finished website and its content once payment has been made. The site is delivered ready to publish.',
    },
  },
} satisfies Record<string, Faq>

/** The pricing page – every purchasing question. */
export const pricingFaq: Faq[] = [
  faq.whichPackage,
  faq.onePageVsMulti,
  faq.hermesQuality,
  faq.apolloPrice,
  faq.zeusPartial,
  faq.addLater,
  faq.needBooking,
  faq.calculator,
  faq.maintenance,
  faq.ownContent,
  faq.process,
  faq.duration,
  faq.ownership,
]

/** The home page – the questions that most often stand between a visitor and an enquiry. */
export const homeFaq: Faq[] = [
  faq.whichPackage,
  faq.hermesQuality,
  faq.oldWebsite,
  faq.zeusPartial,
  faq.maintenance,
  faq.process,
]

/** The websites service page. */
export const websitesFaq: Faq[] = [faq.oldWebsite, faq.onePageVsMulti, faq.ownContent, faq.process, faq.duration]

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
