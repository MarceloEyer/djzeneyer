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
    primary: '2× World Champion Brazilian Zouk DJ (Current Champion)',
    event: 'Ilha do Zouk DJ Championship',
    eventUrl: 'https://alexdecarvalho.com.br/ilhadozouk/dj-championship/',
    location: 'Ilha Grande, Rio de Janeiro, Brazil',
    year: 2022,
    categories: ['DJ Championship', 'Best Remix'],
    description:
      'Champion in the DJ Championship and Best Remix categories at Ilha do Zouk 2022, current title holder.',
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
    countriesPlayed: 11,
    eventsPlayed: (CURRENT_YEAR - START_YEAR) * 50,
    streamsTotal: 'N/A',
    followersTotal: 'N/A',
    lastUpdated: new Date().toISOString().split('T')[0],
  },

  // 🌎 Festivais de Destaque
  // Datas adicionadas baseadas nos anos informados e calendário típico dos eventos
  // NOTA: Datas mantidas intencionalmente no passado para fins de autoridade/histórico.
  // NÃO ATUALIZAR para datas futuras estimadas a menos que confirmado.
  festivals: [
    {
      name: 'One Zouk Congress',
      country: 'Australia',
      flag: '🇦🇺',
      url: 'https://www.onezoukcongress.com/',
      date: '2022-05-19', // Edição de 2022 (Maio)
    },
    {
      name: 'Dutch Zouk',
      country: 'Netherlands',
      flag: '🇳🇱',
      url: 'https://www.dutchzouk.nl/',
      date: '2025-10-15', // Edição de 2025 (Outubro)
    },
    {
      name: 'Prague Zouk Congress',
      country: 'Czech Republic',
      flag: '🇨🇿',
      url: 'https://www.praguezoukcongress.com/',
      date: '2017-07-27', // Edição de 2017 (Julho/Agosto)
    },
    {
      name: 'LA Zouk Marathon',
      country: 'United States',
      flag: '🇺🇸',
      url: 'https://www.lazoukmarathon.com/',
      date: '2024-06-07', // Edição de 2024 (Junho)
    },
    {
      name: 'Zurich Zouk Congress',
      country: 'Switzerland',
      flag: '🇨🇭',
      url: 'https://www.zurichzoukcongress.com/',
      date: '2023-09-22', // Data estimada baseada no calendário anual (Setembro)
    },
    {
      name: 'Rio Zouk Congress',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.riozoukcongress.com/',
      date: '2025-01-10', // Edição de 2025 (Janeiro)
    },
    {
      name: 'IZC Brazil',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.instagram.com/izcbrazil/',
      date: '2024-01-20', // Data estimada (Geralmente segue a temporada de Janeiro/Fev)
    },
    {
      name: 'Polish Zouk Festival - Katowice',
      country: 'Poland',
      flag: '🇵🇱',
      url: 'https://www.polishzoukfestival.pl/',
      upcoming: true,
      date: '2025-11-20', // Data estimada para edição futura
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
    deezer: { url: 'https://www.deezer.com/artist/52900762' },
    bandsintown: { url: 'https://www.bandsintown.com/a/15619775' },
    mixcloud: { url: 'https://www.mixcloud.com/djzeneyer' },
    bandcamp: { url: 'https://djzeneyer.bandcamp.com' },
    lastfm: { url: 'https://www.last.fm/music/Zen+Eyer' },
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
      email: 'contato@djzeneyer.com',
      url: 'https://wise.com/pay/me/marceloe131',
      eur: {
        accountName: 'Marcelo Eyer Fernandes',
        iban: 'BE09967420872757',
        swiftCode: 'TRWIBEB1XXX',
        bankName: 'Wise (Brussels, Belgium)',
      },
    },
    paypal: {
      email: 'contato@djzeneyer.com',
      me: 'https://paypal.me/djzeneyer',
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

const getFullTitle = () =>
  `${ARTIST.identity.stageName} - ${ARTIST.titles.primary}`;

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
  ARTIST.identifiers.musicbrainzUrl,
  ARTIST.identifiers.discogsUrl,
  ARTIST.identifiers.residentAdvisorUrl,
  ARTIST.identifiers.danceWikiFandom,
];

// Schema.org Person base
export const ARTIST_SCHEMA_BASE = {
  '@type': 'Person',
  '@id': `${ARTIST.site.baseUrl}/#artist`,
  name: ARTIST.identity.stageName,
  alternateName: [ARTIST.identity.shortName, ARTIST.identity.fullName],
  jobTitle: 'Brazilian Zouk DJ and music producer',
  description: `${ARTIST.titles.primary}. Member of ${ARTIST.mensa.organization}. Known for the "${ARTIST.philosophy.style}" musical style.`,
  genre: ['Brazilian Zouk', 'Zouk', 'Dance Music'],
  knowsAbout: ['Brazilian Zouk', 'DJing', 'Music Production', 'Remixing', 'Festival Performance'],
  url: ARTIST.site.baseUrl,
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  sameAs: [...getSocialUrls(), ...getVerificationUrls()],
  award: [
    {
      '@type': 'Award',
      name: 'Ilha do Zouk DJ Championship winner',
      datePublished: '2022',
    },
    {
      '@type': 'Award',
      name: 'Ilha do Zouk Best Remix winner',
      datePublished: '2022',
    },
  ],
  memberOf: {
    '@type': 'Organization',
    name: ARTIST.mensa.organization,
    url: ARTIST.mensa.url,
  },
};
