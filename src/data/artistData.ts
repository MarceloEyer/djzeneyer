// src/data/artistData.ts

// ============================================================================
// SINGLE SOURCE OF TRUTH (SSOT) - DJ ZEN EYER
// ============================================================================

import type { Festival, SocialLink } from '../types';

// Ano estimado de início da carreira como DJ, conforme o próprio artista lembra (2015)
// Pode ser ajustado se forem encontrados registros mais antigos confirmados.
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
    birthDate: '1985-08-20',
    nationality: 'Brazilian',
  },

  // 🏆 Títulos e Credenciais
  titles: {
    primary: 'Bicampeão Mundial de Zouk Brasileiro (Atual Campeão)',
    event: 'Ilha do Zouk DJ Championship', // Nome oficial da competição
    eventUrl: 'https://alexdecarvalho.com.br/ilhadozouk/dj-championship/',
    location: 'Ilha Grande, RJ, Brasil', // Local correto do evento
    year: 2022, // Ano da última competição
    categories: ['DJ Championship', 'Melhor Remix'], // Nome exato das categorias
    description: 'Campeão nas categorias de DJ Championship e Melhor Remix no Ilha do Zouk em 2022. Atual campeão nestas categorias.',
  },

  // 🧠 Diferencial (Mensa)
  mensa: {
    isMember: true,
    organization: 'Mensa International',
    url: 'https://www.mensa.org',
    description: 'Membro da sociedade de alto QI (Top 2%)',
  },

  // 📊 Estatísticas (Valores estimados ou placeholders, pois os exatos não estão confirmados)
  // Poderiam ser atualizados com dados reais de APIs de redes sociais e plataformas musicais no futuro.
  stats: {
    yearsActive: CURRENT_YEAR - START_YEAR, // Calcula automático (ex: 10 anos em 2025)
    countriesPlayed: 11, // Valor conforme o arquivo original
    eventsPlayed: (CURRENT_YEAR - START_YEAR) * 50, // Estimativa: ~500+ (conforme original)
    streamsTotal: 'N/A', // Não consta valores exatos, mantém como N/A ou placeholder
    followersTotal: 'N/A', // Não consta valores exatos, mantém como N/A ou placeholder
    lastUpdated: new Date().toISOString().split('T')[0], // Data de hoje
  },

  // 🌎 Festivais de Destaque
  festivals: [
    { name: 'One Zouk Congress', country: 'Austrália', flag: '🇦🇺', url: 'https://www.onezoukcongress.com/' },
    { name: 'Dutch Zouk', country: 'Holanda', flag: '🇳🇱', url: 'https://www.dutchzouk.nl/' },
    { name: 'Prague Zouk Congress', country: 'República Tcheca', flag: '🇨🇿', url: 'https://www.praguezoukcongress.com/' },
    { name: 'LA Zouk Marathon', country: 'EUA', flag: '🇺🇸', url: 'https://www.lazoukmarathon.com/' },
    { name: 'Zurich Zouk Congress', country: 'Suíça', flag: '🇨🇭', url: 'https://www.zurichzoukcongress.com/' },
    { name: 'Rio Zouk Congress', country: 'Brasil', flag: '🇧🇷', url: 'https://www.riozoukcongress.com/' },
    { name: 'IZC Brazil', country: 'Brasil', flag: '🇧🇷', url: 'https://www.instagram.com/izcbrazil/' },
    { name: 'Polish Zouk Festival - Katowice', country: 'Polônia', flag: '🇵🇱', url: 'https://www.polishzoukfestival.pl/', upcoming: true }, // Nome do local adicionado
  ] as Festival[],

  // 🔗 Identificadores de Autoridade (SEO Técnico)
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
    // Página dedicada ao Zen Eyer na Dance Wiki, conforme fornecido
    danceWikiFandom: 'https://dance.fandom.com/wiki/Zen_Eyer', 
  },

  // 📱 Redes Sociais
  social: {
    instagram: { handle: '@djzeneyer', url: 'https://instagram.com/djzeneyer' },
    facebook: { handle: 'djzeneyer', url: 'https://facebook.com/djzeneyer' },
    youtube: { handle: '@djzeneyer', url: 'https://www.youtube.com/@djzeneyer' },
    soundcloud: { handle: 'djzeneyer', url: 'https://soundcloud.com/djzeneyer' },
    spotify: { id: '68SHKGndTlq3USQ2LZmyLw', url: 'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw' },
    appleMusic: { url: 'https://music.apple.com/us/artist/zen-eyer/1439280950' },
    bandsintown: { url: 'https://www.bandsintown.com/a/15552355-dj-zen-eyer' },
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
      country: 'Brasil',
    },
  },

  // 💡 Filosofia & Marca
  philosophy: {
    slogan: 'A pressa é inimiga da cremosidade',
    style: 'Cremosidade',
    styleDefinition: 'Fluidez harmônica e manutenção da tensão musical através de transições longas e imperceptíveis',
    mission: 'Criar um espaço seguro onde as pessoas podem ser quem realmente são através da música',
  },

  // 🌐 URLs Internas
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
// 🛠️ HELPERS EXPORTADOS
// ============================================================================

const getFullTitle = () => 
  `${ARTIST.identity.stageName} - ${ARTIST.titles.primary}`;

export const getWhatsAppUrl = (message?: string) => {
  const defaultMsg = "Olá Zen Eyer! Gostaria de conversar sobre booking.";
  return `https://wa.me/${ARTIST.contact.whatsapp.number}?text=${encodeURIComponent(message || defaultMsg)}`;
};

// Gera lista plana de URLs para Schema
const getSocialUrls = () => Object.values(ARTIST.social).map(s => s.url);

// Gera lista de URLs de verificação
const getVerificationUrls = () => [
  ARTIST.identifiers.wikidataUrl,
  ARTIST.identifiers.musicbrainzUrl,
  ARTIST.identifiers.discogsUrl,
  ARTIST.identifiers.residentAdvisorUrl,
  ARTIST.identifiers.danceWikiFandom,
];

// Schema.org Person (Base para injetar nas páginas)
export const ARTIST_SCHEMA_BASE = {
  "@type": "Person",
  "@id": `${ARTIST.site.baseUrl}/#artist`,
  "name": ARTIST.identity.stageName,
  "alternateName": [ARTIST.identity.shortName, ARTIST.identity.fullName],
  "jobTitle": "DJ e Produtor Musical de Zouk Brasileiro",
  "description": `${ARTIST.titles.primary}. Membro da ${ARTIST.mensa.organization}. Especialista em ${ARTIST.philosophy.style}.`,
  "url": ARTIST.site.baseUrl,
  "image": `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`,
  "sameAs": [...getSocialUrls(), ...getVerificationUrls()],
  "award": [
    {
      "@type": "Award",
      "name": "Campeão Ilha do Zouk DJ Championship",
      "datePublished": "2022"
    },
    {
      "@type": "Award",
      "name": "Campeão Ilha do Zouk - Melhor Remix",
      "datePublished": "2022"
    }
  ],
  "memberOf": {
    "@type": "Organization",
    "name": ARTIST.mensa.organization,
    "url": ARTIST.mensa.url,
  },
};