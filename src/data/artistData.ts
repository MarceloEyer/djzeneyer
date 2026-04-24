// src/data/artistData.ts

// ============================================================================
// SINGLE SOURCE OF TRUTH (SSOT) - DJ ZEN EYER
// ============================================================================

import type { Festival, SocialLink } from '../types';

const START_YEAR = 2015;
export const CURRENT_YEAR = new Date().getFullYear();

// --- DADOS PRINCIPAIS ---
export const ARTIST = {
  // 🆔 Identidade
  identity: {
    stageName: 'DJ Zen Eyer',
    shortName: 'Zen Eyer',
    fullName: 'Marcelo Eyer Fernandes',
    realName: 'Marcelo Eyer Fernandes',
    birthDate: '1989-08-30',
    taxId: '44.063.765/0001-46',
    city: 'Niterói',
    state: 'RJ',
    country: 'Brasil',
    isni: '0000 0005 2893 1015',
    cnpj: '44.063.765/0001-46',
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
    startingYear: START_YEAR,
    yearsActive: CURRENT_YEAR - START_YEAR,
    countriesPlayed: 10,
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
      name: 'Zouk Day Congress',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.zoukdaycongress.com.br/',
      date: '2024-05-15',
    },
    {
      name: 'Lisbon Zouk Marathon',
      country: 'Portugal',
      flag: '🇵🇹',
      url: 'https://www.lisbonzoukmaraton.com/',
      date: '2024-03-20',
    },
    {
      name: 'Rio Zouk Congress',
      country: 'Brazil',
      flag: '🇧🇷',
      url: 'https://www.riozoukcongress.com/',
      date: '2025-01-10',
    },
    {
      name: 'Katowice Zouk Meetup',
      country: 'Poland',
      flag: '🇵🇱',
      url: 'https://www.facebook.com/zoukatowice/',
      date: '2024-11-20',
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

  // 📰 Clipping / Na Mídia
  mediaClipping: [
    {
      title: 'Brazilian DJ Zen Eyer and Kaysha Unite Brazil and Africa in Epic Zouk Remix of Diamonds',
      description: 'Article detailing the collaboration between DJ Zen Eyer and Kaysha, bridging Brazil and Africa through music.',
      url: 'https://myza.co.za/entertainment/brazilian-dj-zen-eyer-and-kaysha-unite-brazil-and-africa-in-epic-zouk-remix-of-diamonds/',
      source: 'MyZA Entertainment',
      date: '2024-08-15',
      type: 'News'
    },
    {
      title: 'Brazilian Zouk DJ Zen Eyer Bridges Brazil and Africa with Kizomba Remix Featuring Kaysha',
      description: 'Detailed press release about the Kizomba remix project and its impact on the global Zouk scene.',
      url: 'https://www.issuewire.com/brazilian-zouk-dj-zen-eyer-bridges-brazil-and-africa-with-kizomba-remix-featuring-kaysha-1847934953275206',
      source: 'IssueWire',
      date: '2024-08-10',
      type: 'Press Release'
    },
    {
      title: 'The Global Rise of Brazilian Zouk Music and Cultural Evolution',
      description: 'In-depth article on the cultural evolution and global growth of Brazilian Zouk, citing Zen Eyers influence.',
      url: 'https://timebusinessnews.com/the-global-rise-of-brazilian-zouk-music-and-cultural-evolution/',
      source: 'Time Business News',
      date: '2025-12-05',
      type: 'Media'
    },
    {
      title: 'Brazilian Zouk DJ Zen Eyer Announces Award Winning International Tour',
      description: 'Report on the announcement of the 2026 international tour covering Europe, North America, and Brazil.',
      url: 'https://mypr.co.za/international/brazilian-zouk-dj-zen-eyer-announces-award-winning-international-tour/',
      source: 'MyPR South Africa',
      date: '2025-11-20',
      type: 'Report'
    },
    {
      title: 'DJ Zen Eyer - World Champion DJ Profile',
      description: 'Professional profile highlighting the two world titles won at the Ilha do Zouk DJ Championship.',
      url: 'https://alexdecarvalho.com.br/ilhadozouk/noticias/',
      source: 'Ilha do Zouk',
      date: '2022-12-05',
      type: 'Official'
    },
    {
      title: 'Encontros de Zouk e a Filosofia da Cremosidade',
      description: 'Biographical entry discussing the philosophy of connection and the unique sound of Zen Eyer.',
      url: 'https://pt.everybodywiki.com/DJ_Zen_Eyer',
      source: 'EverybodyWiki',
      date: '2024-01-10',
      type: 'Wiki'
    },
    {
      title: 'Danxer Artist Profile',
      description: 'Detailed artist page on the dedicated dance community platform Danxer.',
      url: 'https://danxer.com/artist/1022/zen-eyer',
      source: 'Danxer',
      date: '2024',
      type: 'Profile'
    },
    {
      title: 'Viberate Music Industry Analytics',
      description: 'Music industry metrics and professional analytics for DJ Zen Eyer.',
      url: 'https://www.viberate.com/artist/zen-eyer/',
      source: 'Viberate',
      date: '2024',
      type: 'Analytics'
    },
    {
      title: 'go&dance Professional Directory',
      description: 'Artist profile in the global social dance directory go&dance.',
      url: 'https://www.goandance.com/en/artist/4684/zen-eyer',
      source: 'go&dance',
      date: '2024',
      type: 'Profile'
    }
  ],

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
      displayArea: 'Rio de Janeiro / Niterói',
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
    media: {
      photosUrl: 'https://photos.djzeneyer.com',
      epkPdf: '/media/dj-zen-eyer-bio.pdf',
      logosZip: '/media/dj-zen-eyer-logos.zip',
    },
    pages: {
      home: '/',
      about: '/about',
      events: '/events',
      music: '/music',
      tribe: '/zentribe',
      presskit: '/work-with-me',
      shop: '/shop',
      faq: '/faq',
      media: '/na-midia',
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

// Schema.org Person base (consolidated for Knowledge Graph)
export const ARTIST_SCHEMA_SAME_AS = [
  'https://www.wikidata.org/wiki/Q136551855',
  'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
  'https://www.discogs.com/artist/16872046',
  'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
  'https://music.apple.com/artist/1439280950',
  'https://www.deezer.com/artist/52900762',
  'https://soundcloud.com/djzeneyer',
  'https://www.instagram.com/djzeneyer/',
  'https://www.youtube.com/@djzeneyer',
  'https://www.tiktok.com/@djzeneyer',
  'https://www.facebook.com/pages/685038544932605',
  'https://www.songkick.com/artists/8815204',
] as const;

export const ARTIST_SCHEMA_BASE = {
  '@type': 'Person',
  '@id': `${ARTIST.site.baseUrl}/#artist`,
  name: 'Zen Eyer',
  alternateName: [ARTIST.identity.stageName, ARTIST.identity.fullName],
  description: 'Zen Eyer is a Brazilian Zouk DJ, music producer and remixer.',
  genre: ['Brazilian Zouk', 'Zouk', 'Dance Music'],
  jobTitle: ['DJ', 'Music Producer', 'Remixer'],
  url: ARTIST.site.baseUrl,
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  sameAs: ARTIST_SCHEMA_SAME_AS,
  identifier: [
    {
      '@type': 'PropertyValue',
      propertyID: 'Wikidata',
      value: 'Q136551855',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'MusicBrainz',
      value: '13afa63c-8164-4697-9cad-c5100062a154',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Spotify',
      value: '68SHKGndTlq3USQ2LZmyLw',
    },
  ],
  nationality: {
    '@type': 'Country',
    name: 'Brazil',
  },
  award: [
    {
      '@type': 'Award',
      name: 'World Champion Brazilian Zouk DJ - Best DJ Performance',
      datePublished: '2022',
    },
    {
      '@type': 'Award',
      name: 'World Champion Brazilian Zouk DJ - Best Remix',
      datePublished: '2022',
    },
  ],
  knowsAbout: [
    'Brazilian Zouk',
    'DJing',
    'Music Production',
    'Remixing',
    'Cremosidade',
  ],
  // A página About é a Entity Home canônica da Person no Knowledge Graph
  mainEntityOfPage: {
    '@id': `${ARTIST.site.baseUrl}/about#webpage`,
  },
  // Provas externas: páginas públicas indexáveis que falam sobre o artista
  subjectOf: [
    {
      '@type': 'WebPage',
      url: 'https://pt.everybodywiki.com/DJ_Zen_Eyer',
      name: 'DJ Zen Eyer — EverybodyWiki',
    },
    {
      '@type': 'WebPage',
      url: 'https://myza.co.za/entertainment/brazilian-dj-zen-eyer-and-kaysha-unite-brazil-and-africa-in-epic-zouk-remix-of-diamonds/',
      name: 'Brazilian DJ Zen Eyer and Kaysha Unite Brazil and Africa — MyZA Entertainment',
    },
    {
      '@type': 'WebPage',
      url: 'https://timebusinessnews.com/the-global-rise-of-brazilian-zouk-music-and-cultural-evolution/',
      name: 'The Global Rise of Brazilian Zouk Music — Time Business News',
    },
    {
      '@type': 'WebPage',
      url: 'https://danxer.com/artist/1022/zen-eyer',
      name: 'Zen Eyer — Danxer Artist Profile',
    },
    {
      '@type': 'WebPage',
      url: 'https://alexdecarvalho.com.br/ilhadozouk/noticias/',
      name: 'DJ Zen Eyer — World Champion DJ — Ilha do Zouk',
    },
  ],
};
