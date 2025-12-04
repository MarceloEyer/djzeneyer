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
    birthDate: '1985-08-20', // Wikidata + MusicBrainz [attached_file:1][web:44]
    nationality: 'Brazilian',
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
  festivals: [
    {
      name: 'One Zouk Congress',
      country: 'Australia',
      flag: '🇦🇺',
      url: 'https://www.onezoukcongress.com/',
    },
    {
      name: 'Dutch Zouk',
      country: 'Netherlands',
      flag: '🇳🇱',
      url: 'https://www.dutchzouk.nl/',
    },
    {
      name: 'Prague Zouk Congress',
      country: 'Czech Republic',
      flag: '🇨🇿',
      url: 'https://www.praguezoukcongress.com/',
    },
    {
      name: 'LA Zouk Marathon',
      country: 'United States',
      flag: '🇺🇸',
      url: 'https://www.lazoukmarathon.com/',
    },
    {
      name: 'Zurich Zouk Congress',
      country: 'Switzerland',
      flag: '🇨🇭',
      url: 'https://www.zurichzoukcongress.com/',
    },
    {
      name: 'Rio Zouk Congress',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.riozoukcongress.com/',
    },
    {
      name: 'IZC Brazil',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.instagram.com/izcbrazil/',
    },
    {
      name: 'Polish Zouk Festival - Katowice',
      country: 'Poland',
      flag: '🇵🇱',
      url: 'https://www.polishzoukfestival.pl/',
      upcoming: true,
    },
  ] as Festival[],

  // 🔗 Identificadores de Autoridade
  identifiers: {
    wikidata: 'Q136551855',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q136551855', // [attached_file:1]
    musicbrainz: '13afa63c-8164-4697-9cad-c5100062a154',
    musicbrainzUrl: 'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154', // [web:44]
    isni: '0000000528931015',
    discogs: '16872046',
    discogsUrl: 'https://www.discogs.com/artist/16872046',
    residentAdvisor: 'djzeneyer',
    residentAdvisorUrl: 'https://pt-br.ra.co/dj/djzeneyer',
    danceWikiFandom: 'https://dance.fandom.com/wiki/Zen_Eyer',
  },

  // 📱 Redes Sociais / Plataformas
  social: {
    instagram: { handle: '@djzeneyer', url: 'https://instagram.com/djzeneyer' },
    facebook: { handle: 'djzeneyer', url: 'https://facebook.com/djzeneyer' },
    youtube: { handle: '@djzeneyer', url: 'https://www.youtube.com/@djzeneyer' },
    soundcloud: { handle: 'djzeneyer', url: 'https://soundcloud.com/djzeneyer' }, // [web:36]
    spotify: {
      id: '68SHKGndTlq3USQ2LZmyLw',
      url: 'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw', // [web:39]
    },
    appleMusic: { url: 'https://music.apple.com/us/artist/zen-eyer/1439280950' },
    bandsintown: { url: 'https://www.bandsintown.com/a/15552355-dj-zen-eyer' },
    mixcloud: { url: 'https://www.mixcloud.com/zeneyer' }, // citado na release [web:42]
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
      areaDetail: 'Born in Rio de Janeiro, based in Niterói', // alinhado ao MusicBrainz [web:44]
    },
  },

  // 💡 Filosofia & Marca
  philosophy: {
    slogan: 'A pressa é inimiga da cremosidade',
    style: 'Cremosidade',
    styleDefinition:
      'Smooth, continuous Brazilian Zouk musical flow with long, seamless transitions that preserve emotional tension on the dance floor.',
    mission:
      'Bring the soul and passion of Brazilian Zouk to dancers around the world through immersive DJ sets and creative remixes.', // coerente com release [web:42]
  },

  // 🌐 Site / Navegação
  site: {
    baseUrl: 'https://djzeneyer.com',
    defaultDescription:
      'Official website of DJ Zen Eyer, Brazilian Zouk DJ and music producer from Rio de Janeiro, member of Mensa International and 2× world champion at Ilha do Zouk DJ Championship.', // resume Wikidata + press [attached_file:1][web:42]
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
  url: ARTIST.site.baseUrl,
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`,
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
