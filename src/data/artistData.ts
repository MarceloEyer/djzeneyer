// src/data/artistData.ts
// ============================================================================
// SINGLE SOURCE OF TRUTH (SSOT) - DADOS DO ARTISTA
// ============================================================================
// REGRA: Todas as páginas DEVEM importar daqui. Nunca hardcode dados do artista.
// Atualizar APENAS este arquivo quando houver mudanças.
// ============================================================================

export const ARTIST = {
  // Identidade
  name: {
    stage: 'DJ Zen Eyer',
    short: 'Zen Eyer',
    full: 'Marcelo Eyer Fernandes',
    display: 'Zen Eyer', // Para uso em textos corridos
  },

  // Títulos e Credenciais (VERIFICÁVEIS)
  titles: {
    primary: 'Bicampeão Mundial de Zouk Brasileiro (2022)',
    categories: ['Melhor Performance', 'Melhor Remix'],
    event: 'Brazilian Zouk World Championships',
    eventUrl: 'https://www.brazilianzoukworldchampionships.com/',
    location: 'Phoenix, Arizona, EUA',
    year: 2022,
  },

  // Mensa (diferencial único)
  mensa: {
    isMember: true,
    organization: 'Mensa International',
    url: 'https://www.mensa.org',
    description: 'Sociedade internacional para pessoas com QI no top 2% da população',
  },

  // Carreira (NÚMEROS VERIFICÁVEIS - atualizar mensalmente)
  stats: {
    yearsActive: 10, // Desde 2015
    countriesPlayed: 11,
    eventsPlayed: 500, // Ser específico: 10 anos x ~1 evento/semana
    streamsTotal: 500000, // Somar Spotify + SoundCloud + YouTube
    followersTotal: 15000, // Somar todas as redes
    lastUpdated: '2025-01-15',
  },

  // Festivais Confirmados (COM URLS PARA BACKLINKS)
  festivals: [
    { name: 'One Zouk Congress', country: 'Austrália', flag: '🇦🇺', url: 'https://www.onezoukcongress.com/' },
    { name: 'Dutch Zouk', country: 'Holanda', flag: '🇳🇱', url: 'https://www.dutchzouk.nl/' },
    { name: 'Prague Zouk Congress', country: 'República Tcheca', flag: '🇨🇿', url: 'https://www.praguezoukcongress.com/' },
    { name: 'LA Zouk Marathon', country: 'EUA', flag: '🇺🇸', url: 'https://www.lazoukmarathon.com/' },
    { name: 'Zurich Zouk Congress', country: 'Suíça', flag: '🇨🇭', url: 'https://www.zurichzoukcongress.com/' },
    { name: 'Rio Zouk Congress', country: 'Brasil', flag: '🇧🇷', url: 'https://www.riozoukcongress.com/' },
    { name: 'IZC Brazil', country: 'Brasil', flag: '🇧🇷', url: 'https://www.instagram.com/izcbrazil/' },
    { name: 'Polish Zouk Festival', country: 'Polônia', flag: '🇵🇱', url: 'https://www.polishzoukfestival.pl/', upcoming: true },
  ],

  // Identifiers (para Schema.org e verificação)
  identifiers: {
    wikidata: 'Q136551855',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q136551855',
    musicbrainz: '13afa63c-8164-4697-9cad-c5100062a154',
    musicbrainzUrl: 'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
    isni: '0000000528931015',
    discogs: '16872046',
    discogsUrl: 'https://www.discogs.com/artist/16872046',
    residentAdvisor: 'djzeneyer',
    residentAdvisorUrl: 'https://pt-br.ra.co/dj/djzeneyer',
    danceWikiFandom: 'https://dance.fandom.com/wiki/Brazilian_Zouk', // Você é citado aqui!
  },

  // Redes Sociais
  social: {
    instagram: { handle: '@djzeneyer', url: 'https://instagram.com/djzeneyer' },
    youtube: { handle: '@djzeneyer', url: 'https://www.youtube.com/@djzeneyer' },
    soundcloud: { handle: 'djzeneyer', url: 'https://soundcloud.com/djzeneyer' },
    spotify: { id: '68SHKGndTlq3USQ2LZmyLw', url: 'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw' },
    appleMusic: { url: 'https://music.apple.com/us/artist/zen-eyer/1439280950' },
    bandsintown: { url: 'https://www.bandsintown.com/a/15552355-dj-zen-eyer' },
  },

  // Contato
  contact: {
    email: 'booking@djzeneyer.com',
    whatsapp: {
      number: '5521987413091',
      display: '+55 21 98741-3091',
    },
    location: {
      city: 'Niterói',
      state: 'RJ',
      country: 'Brasil',
    },
  },

  // Filosofia (para consistência de messaging)
  philosophy: {
    slogan: 'A pressa é inimiga da cremosidade',
    style: 'cremosidade',
    styleDefinition: 'Fluidez harmônica e manutenção da tensão musical através de transições longas e imperceptíveis',
    mission: 'Criar um espaço seguro onde as pessoas podem ser quem realmente são através da música',
  },

  // URLs do Site
  site: {
    baseUrl: 'https://djzeneyer.com',
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
// HELPERS
// ============================================================================

export const getFullTitle = () => 
  `${ARTIST.name.stage} - ${ARTIST.titles.primary}`;

export const getWhatsAppUrl = (message?: string) => {
  const defaultMsg = "Olá Zen Eyer! Gostaria de conversar sobre booking.";
  return `https://wa.me/${ARTIST.contact.whatsapp.number}?text=${encodeURIComponent(message || defaultMsg)}`;
};

export const getSocialUrls = () => Object.values(ARTIST.social).map(s => s.url);

export const getVerificationUrls = () => [
  ARTIST.identifiers.wikidataUrl,
  ARTIST.identifiers.musicbrainzUrl,
  ARTIST.identifiers.discogsUrl,
  ARTIST.identifiers.residentAdvisorUrl,
  ARTIST.identifiers.danceWikiFandom,
];

// Schema.org Person (usar em todas as páginas)
export const ARTIST_SCHEMA = {
  "@type": "Person",
  "@id": `${ARTIST.site.baseUrl}/#artist`,
  "name": ARTIST.name.stage,
  "alternateName": [ARTIST.name.short, ARTIST.name.full],
  "jobTitle": "DJ e Produtor Musical de Zouk Brasileiro",
  "description": `${ARTIST.titles.primary}. Membro da ${ARTIST.mensa.organization}. Especialista em criar sets 'cremosos' que unem técnica e emoção.`,
  "url": ARTIST.site.baseUrl,
  "image": `${ARTIST.site.baseUrl}/images/zen-eyer-official.jpg`,
  "sameAs": getSocialUrls().concat(getVerificationUrls()),
  "award": ARTIST.titles.categories.map(cat => ({
    "@type": "Award",
    "name": `${cat} - ${ARTIST.titles.event}`,
    "datePublished": ARTIST.titles.year.toString(),
  })),
  "memberOf": {
    "@type": "Organization",
    "name": ARTIST.mensa.organization,
    "url": ARTIST.mensa.url,
  },
};