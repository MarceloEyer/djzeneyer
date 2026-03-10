// src/data/artistData.ts

// ============================================================================
// SINGLE SOURCE OF TRUTH (SSOT) - DJ ZEN EYER
// ============================================================================

import type { Festival, SocialLink } from '../types';

const START_YEAR = 2015;
const CURRENT_YEAR = new Date().getFullYear();

// --- DADOS PRINCIPAIS ---
export const ARTIST = {
  // 🆔 Identidade
  identity: {
    stageName: 'DJ Zen Eyer',
    shortName: 'Zen Eyer',
    fullName: 'Marcelo Eyer Fernandes',
    displayTitle: 'Zen Eyer',
    birthDate: '1985-08-20', // Wikidata + MusicBrainz
    nationality: 'Brazilian',
    legalName: 'Marcelo Eyer Fernandes 44063765000146', // Wikidata CNPJ
    taxId: '44.063.765/0001-46',
  },

  // 🏆 Títulos e Credenciais (informação complementar, não contradiz Wikidata)
  titles: {
    primary: 'World Champion Brazilian Zouk DJ (Best Remix & Best Performance)',
    event: 'Ilha do Zouk DJ Championship',
    eventUrl: 'https://alexdecarvalho.com.br/ilhadozouk/dj-championship/',
    location: 'Ilha Grande, Rio de Janeiro, Brazil',
    year: 2022,
    categories: ['Best DJ Performance', 'Best Remix'],
    description:
      'Winner of two world titles at Ilha do Zouk 2022: Best DJ Performance and Best Remix.',
  },

  // 🧠 Diferencial (Mensa)
  mensa: {
    isMember: true,
    organization: 'Mensa International',
    url: 'https://www.mensa.org',
    description: 'Member of the high IQ society (top 2%).',
  },

  // 📊 Estatísticas (estimativas / não conflitam com fontes externas)
  stats: {
    yearsActive: CURRENT_YEAR - START_YEAR,
    countriesPlayed: 10,
    eventsPlayed: 500,
    streamsTotal: 'Milhares',
    followersTotal: 'Conta Verificada',
    lastUpdated: new Date().toISOString().split('T')[0],
  },

  // 🌍 Festivais de Destaque
  // Datas adicionadas baseadas nos anos informados e calendário típico dos eventos
  // NOTA: Datas mantidas intencionalmente no passado para fins de autoridade/histórico.
  // NÃO ATUALIZAR para datas futuras estimadas a menos que confirmado.
  festivals: [
    {
      name: 'One Zouk Congress',
      country: 'Australia',
      flag: '🇦🇺',
      url: 'https://www.onezoukcongress.com/',
      date: '2022-05-19',
    },
    {
      name: 'Dutch Zouk',
      country: 'Netherlands',
      flag: '🇳🇱',
      url: 'https://www.dutchzouk.nl/',
      date: '2025-10-15',
    },
    {
      name: 'Prague Zouk Congress',
      country: 'Czech Republic',
      flag: '🇨🇿',
      url: 'https://www.praguezoukcongress.com/',
      date: '2017-07-27',
    },
    {
      name: 'LA Zouk Marathon',
      country: 'United States',
      flag: '🇺🇸',
      url: 'https://www.lazoukmarathon.com/',
      date: '2024-06-07',
    },
    {
      name: 'Zurich Zouk Congress',
      country: 'Switzerland',
      flag: '🇨🇭',
      url: 'https://www.zurichzoukcongress.com/',
      date: '2023-09-22',
    },
    {
      name: 'Berlin Zouk Congress',
      country: 'Germany',
      flag: '🇩🇪',
      url: 'https://www.berlinzoukcongress.com/',
      date: '2022-06-15',
    },
    {
      name: 'Portugal Zouk Congress',
      country: 'Portugal',
      flag: '🇵🇹',
      url: 'https://www.portugalzouk.com/',
      date: '2022-10-01',
    },
    {
      name: 'Rio Zouk Congress',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.riozoukcongress.com/',
      date: '2025-01-10',
    },
    {
      name: 'Russian Zouk Congress (Online)',
      country: 'Russia',
      flag: '🇷🇺',
      url: 'https://vk.com/zoukrussia',
      date: '2021-11-15',
    },
    {
      name: 'IZC Brazil',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.instagram.com/izcbrazil/',
      date: '2024-01-20',
    },
    {
      name: 'Polish Zouk Festival - Katowice',
      country: 'Poland',
      flag: '🇵🇱',
      url: 'https://www.polishzoukfestival.pl/',
      upcoming: true,
      date: '2025-11-20',
    },
  ] as Festival[],

  // 🔗 Identificadores de Autoridade
  identifiers: {
    wikidata: 'Q136551855',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q136551855',
    musicbrainz: '13afa63c-8164-4697-9cad-c5100062a154',
    musicbrainzUrl: 'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
    isni: '0000000528931015',
    discogs: '16872046',
    discogsUrl: 'https://www.discogs.com/artist/16872046',
    residentAdvisor: 'djzeneyer',
    residentAdvisorUrl: 'https://ra.co/dj/djzeneyer',
    danceWikiFandom: 'https://dance.fandom.com/wiki/Zen_Eyer',
    orcid: '0009-0006-2948-2148',
    knowledgeGraphId: '/g/11ff3mhh10',
    knowledgeGraphUrl: 'https://www.google.com/search?kgmid=/g/11ff3mhh10',
  },

  // 📱 Redes Sociais / Plataformas
  social: {
    instagram: { handle: '@djzeneyer', url: 'https://instagram.com/djzeneyer' },
    facebook: { handle: 'djzeneyer', url: 'https://facebook.com/djzeneyer' },
    youtube: { handle: '@djzeneyer', url: 'https://www.youtube.com/@djzeneyer' },
    tiktok: { handle: '@djzeneyer', url: 'https://www.tiktok.com/@djzeneyer' },
    twitter: { handle: '@djzeneyer', url: 'https://x.com/djzeneyer' },
    twitch: { handle: 'djzeneyer', url: 'https://www.twitch.tv/djzeneyer' },
    linkedin: { handle: 'eyermarcelo', url: 'https://www.linkedin.com/in/eyermarcelo' },
    telegram: { handle: 'djzeneyer', url: 'https://t.me/djzeneyer' },
    soundcloud: { handle: 'djzeneyer', url: 'https://soundcloud.com/djzeneyer' },
    spotify: {
      id: '68SHKGndTlq3USQ2LZmyLw',
      url: 'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
    },
    appleMusic: { url: 'https://music.apple.com/artist/1439280950' },
    youtubeMusic: { url: 'https://music.youtube.com/channel/UCEVHG-5iyNLWK3Zeungvdqg' },
    deezer: { url: 'https://www.deezer.com/artist/52900762' },
    bandsintown: { url: 'https://www.bandsintown.com/a/15619775' },
    mixcloud: { url: 'https://www.mixcloud.com/djzeneyer' },
    bandcamp: { url: 'https://djzeneyer.bandcamp.com' },
    lastfm: { url: 'https://www.last.fm/music/Zen+Eyer' },
    songkick: { url: 'https://www.songkick.com/artists/8815204-zen-eyer' },
    tidal: { url: 'https://tidal.com/artist/10492592' },
    genius: { url: 'https://genius.com/artists/Zen-eyer' },
    musixmatch: { url: 'https://www.musixmatch.com/pt/artista/Zen-Eyer' },
    amazonMusic: { url: 'https://music.amazon.com/artists/B07JKCDCG8' },
    audiomack: { url: 'https://audiomack.com/djzeneyer' },
    boomplay: { url: 'https://www.boomplay.com/artists/35157982' },
    napster: { url: 'https://us.napster.com/artist/art.626690096' },
    qobuz: { url: 'https://www.qobuz.com/artist/7501129' },
    reddit: { url: 'https://www.reddit.com/user/djzeneyer' },
    crunchbase: { url: 'https://www.crunchbase.com/organization/zen-eyer' },
    pinterest: { url: 'https://www.pinterest.com/djzeneyer' },
  } as Record<string, SocialLink>,

  // 📍 Contato
  contact: {
    email: 'booking@djzeneyer.com',
    whatsapp: {
      number: '5521987413091',
      display: '+55 21 98741-3091',
    },
    location: {
      city: 'Niterói',
      state: 'RJ',
      country: 'Brazil',
      areaDetail: 'Born in Rio de Janeiro, based in Niterói',
    },
  },

  // 💰 Pagamentos & Doações (SSOT)
  payment: {
    interGlobal: {
      usd: {
        accountName: 'MARCELO EYER FERNANDES',
        accountNumber: '889693163-5',
        achRouting: '026073150',
        wireRouting: '026073008',
        bankName: 'Community Federal Savings Bank',
        bankAddress: '5 Penn Plaza, New York, NY 10001',
        beneficiaryBank: 'Banco Inter SA',
        swiftCode: 'ITEMBRSP',
        intermediaryBank: {
          name: 'JP Morgan Chase N.A.',
          swift: 'CHASUS33',
          aba: '021000021',
          account: '360556937',
        },
        iban: 'BR9600416968000010007524137C1',
      },
      eur: {
        accountName: 'MARCELO EYER FERNANDES',
        beneficiaryBank: 'Banco Inter S.A.',
        swiftCode: 'ITEMBRSP',
        intermediaryBank: {
          name: 'J.P.Morgan AG',
          swift: 'CHASDEFX',
        },
        iban: 'BR9600416968000010007524137C1',
      },
      gbp: {
        accountName: 'MARCELO EYER FERNANDES',
        beneficiaryBank: 'Banco Inter S.A.',
        swiftCode: 'ITEMBRSP',
        intermediaryBank: {
          name: 'JPMORGAN CHASE BANK N.A., LONDON BRANCH',
          swift: 'CHASGB2L',
        },
        iban: 'BR9600416968000010007524137C1',
      },
      brazil: {
        accountName: 'MARCELO EYER FERNANDES',
        cpf: '113.739.157-06',
        bank: 'Banco Inter (077)',
        branch: '0001',
        account: '752413-7',
        pixKey: '21987413091',
      },
    },
    wise: {
      email: 'eyer.marcelo@gmail.com',
      url: 'https://wise.com/pay/me/marceloe131',
      eur: {
        accountName: 'Marcelo Eyer Fernandes',
        iban: 'BE09967420872757',
        swiftCode: 'TRWIBEB1XXX',
        bankName: 'Wise (Brussels, Belgium)',
        bankAddress: 'Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium',
      },
    },
    paypal: {
      email: 'eyer.marcelo@gmail.com',
      phone: '+5521987413091',
      businessId: '6BBTGNK7ZWUHY',
      me: 'https://paypal.me/djzeneyer',
      donateUrl: 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=6BBTGNK7ZWUHY&item_name=Mensagem%20Personalizada&currency_code=BRL&no_recurring=0',
    },
  },

  // 💡 Filosofia & Marca
  philosophy: {
    slogan: 'A pressa é inimiga da cremosidade',
    style: 'Cremosidade',
    styleDefinition:
      'Smooth, continuous Brazilian Zouk musical flow with long, seamless transitions that preserve emotional tension on the dance floor.',
    mission:
      'Bring the soul and passion of Brazilian Zouk to dancers around the world through immersive DJ sets and creative remixes.',
  },

  // 🌐 Site / Navegação
  site: {
    baseUrl: 'https://djzeneyer.com',
    defaultDescription:
      'Official website of DJ Zen Eyer, Brazilian Zouk DJ and music producer from Rio de Janeiro, member of Mensa International and 2× world champion at Ilha do Zouk DJ Championship.',
    pages: {
      home: '/',
      about: '/about',
      events: '/events',
      music: '/music',
      tribe: '/zentribe',
      presskit: '/work-with-me',
      shop: '/shop',
      faq: '/faq',
    },
  },
} as const;

// ============================================================================
// 🛠️ HELPERS EXPORTADOS
// ============================================================================

export const getWhatsAppUrl = (message?: string) => {
  const defaultMsg =
    'Olá Zen Eyer! Gostaria de conversar sobre booking.';
  return `https://wa.me/${ARTIST.contact.whatsapp.number}?text=${encodeURIComponent(
    message || defaultMsg
  )}`;
};

const getSocialUrls = () => Object.values(ARTIST.social).map(s => s.url);

const getVerificationUrls = () => [
  ARTIST.identifiers.wikidataUrl,
  ARTIST.identifiers.knowledgeGraphUrl,
  ARTIST.identifiers.musicbrainzUrl,
  `https://isni.org/isni/${ARTIST.identifiers.isni}`,
  `https://orcid.org/${ARTIST.identifiers.orcid}`,
  ARTIST.identifiers.discogsUrl,
  ARTIST.identifiers.residentAdvisorUrl,
  ARTIST.identifiers.danceWikiFandom,
];

// Schema.org MusicGroup base (consolidated for Knowledge Graph)
export const ARTIST_SCHEMA_BASE = {
  '@type': 'MusicGroup',
  '@id': `${ARTIST.site.baseUrl}/#artist`,
  name: ARTIST.identity.stageName,
  alternateName: [ARTIST.identity.shortName, ARTIST.identity.fullName],
  description: `${ARTIST.titles.primary}. Known for the "${ARTIST.philosophy.style}" musical style.`,
  genre: ['Brazilian Zouk', 'Zouk', 'Dance Music', 'Electronic'],

  url: ARTIST.site.baseUrl,
  foundingLocation: {
    '@type': 'Place',
    name: `${ARTIST.contact.location.city}, ${ARTIST.contact.location.country}`,
  },
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  sameAs: [...getSocialUrls(), ...getVerificationUrls()],
  award: [
    {
      '@type': 'Award',
      name: 'World Champion Brazilian Zouk DJ - Best Performance',
      datePublished: '2022',
    },
    {
      '@type': 'Award',
      name: 'World Champion Brazilian Zouk DJ - Best Remix',
      datePublished: '2022',
    },
  ],
  memberOf: {
    '@type': 'Organization',
    name: ARTIST.mensa.organization,
    url: ARTIST.mensa.url,
  },
  // 🌎 Conexão semântica com pioneiros e autoridades do Zouk Brasileiro
  // (fortalece o Grafo de Conhecimento e os sinais E-E-A-T)
  knowsAbout: [
    'Brazilian Zouk',
    'DJing',
    'Music Production',
    'Remixing',
    'Festival Performance',
    'Dance Music',
    'Lambada',
    'Cremosidade',
    'Zouk Music Theory',
  ],
  mentions: [
    {
      '@type': 'Person',
      name: 'Renata Peçanha',
      description: 'Pioneer and major figure of Brazilian Zouk. Founder of Rio Zouk Congress.',
      url: 'https://en.wikipedia.org/wiki/Brazilian_Zouk',
    },
    {
      '@type': 'Person',
      name: 'Adílio Porto',
      description: 'Pioneer of Brazilian Zouk and Lambada, who helped systematize the foundational techniques of the dance.',
    },
    {
      '@type': 'Organization',
      name: 'Brazilian Zouk Council',
      alternateName: 'BZC',
      description:
        'International governing body for Brazilian Zouk, defining official techniques and standards.',
      url: 'https://www.brazilianzoukcouncil.com/',
    },
  ],
  performerIn: [
    {
      '@type': 'DanceEvent',
      name: 'Rio Zouk Congress',
      description: 'Largest Brazilian Zouk congress in Brazil, organized by Renata Peçanha.',
      location: {
        '@type': 'Place',
        name: 'Rio de Janeiro, Brazil',
      },
      organizer: {
        '@type': 'Person',
        name: 'Renata Peçanha',
      },
    },
    {
      '@type': 'DanceEvent',
      name: 'Ilha do Zouk DJ Championship',
      description:
        'Brazilian Zouk World Championship event in Ilha Grande, Rio de Janeiro, Brazil.',
      location: {
        '@type': 'Place',
        name: 'Ilha Grande, Rio de Janeiro, Brazil',
      },
      startDate: '2022',
    },
  ],
};
