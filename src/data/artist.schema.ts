// src/data/artist.schema.ts
// JSON-LD schema nodes: Person (ARTIST_SCHEMA_BASE), MusicGroup, Organization, Discography.
// Imports ARTIST from artistData.ts — all URL/identity values come from there.

import { ARTIST } from './artistData';

// Descrição de desambiguação única fonética (SSOT)
export const DISAMBIGUATING_DESCRIPTION =
  'Zen Eyer is pronounced /zɛn ˈaɪər/. DJ Zen Eyer is a commonly used stage-name variant; Zen Ayer is a common misspelling, not an official artist name.';

// Schema.org sameAs list (consolidated for Knowledge Graph)
export const ARTIST_SCHEMA_SAME_AS = [
  'https://www.wikidata.org/wiki/Q136551855',
  'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
  'https://www.discogs.com/artist/16872046',
  'https://isni.org/isni/0000000528931015',
  'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
  'https://music.apple.com/us/artist/1439280950',
  'https://www.youtube.com/@djzeneyer',
  'https://www.instagram.com/djzeneyer/',
  'https://www.facebook.com/djzeneyer/',
  'https://www.linkedin.com/in/eyermarcelo',
  'https://soundcloud.com/djzeneyer',
  'https://www.deezer.com/artist/52900762',
  'https://tidal.com/artist/10492592',
  'https://djzeneyer.bandcamp.com',
  'https://music.amazon.com/artists/B07JKCDCG8',
  'https://www.mixcloud.com/djzeneyer',
  'https://www.last.fm/music/Zen+Eyer',
  'https://www.songkick.com/artists/8815204-zen-eyer',
  'https://www.bandsintown.com/a/15619775-zen-eyer',
  'https://ra.co/dj/djzeneyer',
  'https://bsky.app/profile/djzeneyer.bsky.social',
  'https://www.threads.net/@djzeneyer',
  'https://www.shazam.com/artist/1439280950',
  'https://www.patreon.com/djzeneyer',
  'https://medium.com/@djzeneyer',
] as const;

export const ARTIST_SCHEMA_BASE = {
  '@type': 'Person',
  '@id': `${ARTIST.site.baseUrl}/#artist`,
  name: 'Zen Eyer',
  alternateName: ['DJ Zen Eyer'],
  birthName: ARTIST.identity.fullName,
  description: 'Zen Eyer is a Brazilian Zouk DJ and music producer, two-time World Champion at the Zouk DJ Championship 2022.',
  disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
  genre: ['Brazilian Zouk', 'Zouk', 'Dance Music'],
  jobTitle: ['DJ', 'Music Producer'],
  url: ARTIST.site.baseUrl,
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  knowsLanguage: ['pt-BR', 'en'],
  sameAs: [...ARTIST_SCHEMA_SAME_AS],
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
      propertyID: 'ISNI',
      value: '0000000528931015',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Discogs',
      value: '16872046',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Google KG ID',
      value: '/g/11ff3mhh10',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Spotify',
      value: '68SHKGndTlq3USQ2LZmyLw',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Apple Music',
      value: '1439280950',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'YouTube',
      value: 'djzeneyer',
    },
  ],
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      propertyID: 'IPA pronunciation',
      value: ARTIST.identity.pronunciationIPA,
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Pronunciation guide',
      value: ARTIST.philosophy.identityAid.pronunciationGuide,
    },
  ],
  nationality: {
    '@type': 'Country',
    name: 'Brazil',
  },
  birthPlace: {
    '@type': 'City',
    name: 'Rio de Janeiro',
    addressCountry: 'BR',
  },
  homeLocation: {
    '@type': 'Place',
    name: 'Niterói, Rio de Janeiro, Brazil',
  },
  memberOf: [
    {
      '@type': 'Organization',
      name: 'Mensa International',
      url: 'https://www.mensa.org',
      description: 'High-IQ society for individuals in the top 2% of intelligence.',
    },
    // Ligação bidirecional com o nó MusicGroup do projeto artístico
    { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
  ],
  award: [
    'World Champion Brazilian Zouk DJ - Best DJ Performance, 2022',
    'World Champion Brazilian Zouk DJ - Best Remix, 2022',
  ],
  knowsAbout: [
    'Brazilian Zouk',
    'Zouk Brasileiro',
    'DJing',
    'Music Production',
    'Remixing',
    'Cremosidade',
    'Partner Dancing',
    'Latin Dance Music',
    'Dance Music Production',
    'Brazilian Music',
    'Social Dancing',
    'DJ Mixing Techniques',
    'Music Curation',
    'Festival DJ Sets',
    'Lambazouk',
    'Zouk Music History',
  ],
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'DJ',
      occupationLocation: {
        '@type': 'Country',
        name: 'Brazil',
      },
      description:
      'Professional DJ specializing in Brazilian Zouk, performing at international festivals and congresses in 14 countries across 4 continents.',
      skills: 'DJ Mixing, Music Curation, Live Performance, Cremosidade Transitions',
    },
    {
      '@type': 'Occupation',
      name: 'Music Producer',
      description:
        'Music producer creating original tracks, remixes, and edits for Brazilian Zouk dancing.',
      skills: 'Music Production, Remixing, Arranging, Sound Design',
    },
  ],
  // A página About é a Entity Home canônica da Person no Knowledge Graph
  mainEntityOfPage: {
    '@id': `${ARTIST.site.baseUrl}/about-dj-zen-eyer#webpage`,
  },
  // Provas externas: páginas oficiais de eventos reais que listam Zen Eyer como DJ
  subjectOf: [
    {
      '@type': 'WebPage',
      url: 'https://www.allaboutjazz.com/musicians/zen-eyer',
      name: 'Zen Eyer - All About Jazz Musician Profile',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.brazilianzoukcouncil.com/professionals',
      name: 'Brazilian Zouk Council - Professionals Directory',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.dutchzouk.nl/artists',
      name: 'Dutch International Zouk Congress — Artists',
    },
    {
      '@type': 'WebPage',
      url: 'https://slovenianzoukmarathon.com/mood-makers/',
      name: 'Slovenian Zouk Marathon — Mood Makers & DJs',
    },
    {
      '@type': 'WebPage',
      url: 'https://latindancecalendar.com/festivals/la-zouk-marathon-2023/',
      name: 'LA Zouk Marathon 2023 — Latin Dance Calendar',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.lisbonzoukmarathon.com/march2026',
      name: 'Lisbon Zouk Marathon March 2026',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.praguezouk.com',
      name: 'Prague Zouk Congress',
    },
    {
      '@type': 'WebPage',
      url: 'https://neozouk.com/',
      name: 'Neo Festival — DJs Confirmados',
    },
    {
      '@type': 'WebPage',
      url: 'https://alexdecarvalho.com.br/ilhadozouk/nossos-djs-our-djs/',
      name: 'Ilha do Zouk — DJs',
    },
    {
      '@type': 'WebPage',
      url: 'https://renatapecanha.wixsite.com/zoukinrio/c%C3%B3pia-artistas',
      name: 'Zouk in Rio — Artists and Deejays',
    },
    {
      '@type': 'WebPage',
      url: 'https://danxer.com/artist/1022/zen-eyer',
      name: 'Zen Eyer — Danxer Artist Profile',
    },
    {
      '@type': 'WebPage',
      url: 'https://pt-br.ra.co/events/2297675',
      name: 'Resident Advisor - Zen Eyer Event Listing',
    },
  ],
  // Eventos reais em que Zen Eyer é performer — prova direta de atuação (bidirecional com performerIn)
  // REGRA: todos os MusicEvent devem ter eventStatus, endDate, description, image, offers, location.address completo.
  // Atualizar availability quando eventos passarem: InStock → Discontinued.
  performerIn: [
    {
      '@type': 'MusicEvent',
      name: 'Dutch International Zouk Congress 2026',
      url: 'https://www.dutchzouk.nl/',
      startDate: '2026-10-15',
      endDate: '2026-10-18',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer performs at the Dutch International Zouk Congress 2026, one of Europe\'s premier Brazilian Zouk festivals in Etten-Leur, Netherlands.',
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
      location: {
        '@type': 'Place',
        name: 'Etten-Leur, Netherlands',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Etten-Leur',
          addressCountry: 'NL',
        },
      },
      performer: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      offers: {
        '@type': 'Offer',
        url: 'https://www.dutchzouk.nl/',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'MusicEvent',
      name: 'Lisbon Zouk Marathon 2026',
      url: 'https://www.lisbonzoukmarathon.com/march2026',
      startDate: '2026-03-25',
      endDate: '2026-03-30',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer performs at the Lisbon Zouk Marathon 2026, a leading Brazilian Zouk event in Lisbon, Portugal.',
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
      location: {
        '@type': 'Place',
        name: 'Lisbon, Portugal',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lisbon',
          addressCountry: 'PT',
        },
      },
      performer: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      offers: {
        '@type': 'Offer',
        url: 'https://www.lisbonzoukmarathon.com/march2026',
        availability: 'https://schema.org/Discontinued',
      },
    },
    {
      '@type': 'MusicEvent',
      name: 'Slovenian Zouk Marathon 2026',
      url: 'https://slovenianzoukmarathon.com/',
      startDate: '2026-04-09',
      endDate: '2026-04-13',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer performs at the Slovenian Zouk Marathon 2026 in Ljubljana, Slovenia.',
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
      location: {
        '@type': 'Place',
        name: 'Ljubljana, Slovenia',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ljubljana',
          addressCountry: 'SI',
        },
      },
      performer: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      offers: {
        '@type': 'Offer',
        url: 'https://slovenianzoukmarathon.com/',
        availability: 'https://schema.org/Discontinued',
      },
    },
    {
      '@type': 'MusicEvent',
      name: 'Neo Festival 2026',
      url: 'https://neozouk.com/',
      startDate: '2026-01-04',
      endDate: '2026-01-07',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer performs at Neo Festival 2026, a Brazilian Zouk festival in Rio de Janeiro, Brazil.',
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
      location: {
        '@type': 'Place',
        name: 'Rio de Janeiro, Brazil',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Rio de Janeiro',
          addressCountry: 'BR',
        },
      },
      performer: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      offers: {
        '@type': 'Offer',
        url: 'https://neozouk.com/',
        availability: 'https://schema.org/Discontinued',
      },
    },
    {
      '@type': 'MusicEvent',
      name: 'Zouk in Rio 2026',
      url: 'https://renatapecanha.wixsite.com/zoukinrio/c%C3%B3pia-artistas',
      startDate: '2026-06-26',
      endDate: '2026-06-28',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer performs at Zouk in Rio 2026, a Brazilian Zouk festival in Rio de Janeiro, Brazil.',
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
      location: {
        '@type': 'Place',
        name: 'Rio de Janeiro, Brazil',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Rio de Janeiro',
          addressCountry: 'BR',
        },
      },
      performer: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      offers: {
        '@type': 'Offer',
        url: 'https://renatapecanha.wixsite.com/zoukinrio/c%C3%B3pia-artistas',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'MusicEvent',
      name: 'Zouk DJ Championship 2022',
      url: 'https://alexdecarvalho.com.br/ilhadozouk/nossos-djs-our-djs/',
      startDate: '2022-04-20',
      endDate: '2022-04-24',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer wins two world titles at the Zouk DJ Championship 2022 — Best DJ Performance and Best Remix — in Ilha Grande, Rio de Janeiro, Brazil.',
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
      location: {
        '@type': 'Place',
        name: 'Ilha Grande, Rio de Janeiro, Brazil',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ilha Grande',
          addressRegion: 'Rio de Janeiro',
          addressCountry: 'BR',
        },
      },
      performer: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      offers: {
        '@type': 'Offer',
        url: 'https://alexdecarvalho.com.br/ilhadozouk/nossos-djs-our-djs/',
        availability: 'https://schema.org/Discontinued',
      },
    },
  ],
};

// ============================================================================
// 🎵 DISCOGRAFIA — SSOT
// Fonte: Spotify / MusicBrainz / Discogs
// Campos: name, type, releaseDate, spotifyId, spotifyUrl, image, tracks[]
// ============================================================================

export interface ReleaseTrack {
  name: string;
  duration?: string; // ISO 8601; omit if not verified.
  isrcCode?: string;
  spotifyUrl?: string;
  youtubeMusicUrl?: string;
  youtubeUrl?: string;
}

export interface Release {
  id: string;
  name: string;
  newsSlugs?: Partial<Record<'en' | 'pt', string>>;
  type: 'single' | 'ep' | 'album' | 'remix';
  releaseDate?: string; // YYYY-MM-DD; omit if not verified.
  releaseYear?: string;
  image: string;
  spotifyId?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  musicBrainzUrl?: string;
  deezerUrl?: string;
  tidalUrl?: string;
  amazonMusicUrl?: string;
  youtubeMusicUrl?: string;
  youtubeUrl?: string;
  soundcloudUrl?: string;
  description?: string;
  byArtist?: Record<string, unknown>;
  contributor?: Record<string, unknown> | Record<string, unknown>[];
  tracks: ReleaseTrack[];
}

export const DISCOGRAPHY: Release[] = [
  {
    id: 'dont-stop-zen-eyer-remix',
    name: "Don't Stop (feat. Zen Eyer) [Zen Eyer Remix]",
    newsSlugs: {
      en: 'dont-stop-zen-eyer-remix-kaysha',
      pt: 'dont-stop-remix-zen-eyer-kaysha',
    },
    type: 'remix',
    releaseDate: '2018-10-25',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    appleMusicUrl: 'https://music.apple.com/us/song/1596290116',
    musicBrainzUrl: 'https://musicbrainz.org/release/4ca05fa2-a3c0-4de3-818c-e64cd147dca3',
    description: "Brazilian Zouk remix of Kaysha's Don't Stop. Apple Music lists the track in Don't Stop (Remixes) - Single, released October 25, 2018.",
    byArtist: {
      '@type': 'Person',
      name: 'Kaysha',
      sameAs: [
        'https://kaysha.com/',
        'https://musicbrainz.org/artist/2eecd1cd-31ae-42f3-9e30-300ffbd7f2ef',
        'https://www.wikidata.org/wiki/Q740711',
      ],
    },
    contributor: {
      '@id': `${ARTIST.site.baseUrl}/#musicgroup`,
      roleName: 'Remixer',
    },
    tracks: [
      {
        name: "Don't Stop (feat. Zen Eyer) [Zen Eyer Remix]",
        duration: 'PT3M39S',
      },
    ],
  },
  {
    id: 'na-ponta-ela-fica-cover',
    name: 'Na Ponta Ela Fica - Cover',
    newsSlugs: {
      en: 'na-ponta-ela-fica-brazilian-zouk-cover',
      pt: 'na-ponta-ela-fica-cover-zouk-brasileiro',
    },
    type: 'single',
    releaseDate: '2026-01-09',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    appleMusicUrl: 'https://music.apple.com/us/album/na-ponta-ela-fica-cover-single/1867840116',
    musicBrainzUrl: 'https://musicbrainz.org/release/7b0c16b2-24a8-4923-b3e1-f3b852e5b064',
    tracks: [
      {
        name: 'Na Ponta Ela Fica - Cover',
        duration: 'PT2M22S',
      },
    ],
  },
  {
    id: 'still-loving-you-sax-cover',
    name: 'Still Loving You (feat. Walter Xavier) [Sax Cover]',
    newsSlugs: {
      en: 'still-loving-you-sax-cover-walter-xavier',
      pt: 'still-loving-you-cover-sax-walter-xavier',
    },
    type: 'single',
    releaseDate: '2026-01-27',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    appleMusicUrl: 'https://music.apple.com/us/album/still-loving-you-feat-walter-xavier-sax-cover-single/1872468504',
    tracks: [
      {
        name: 'Still Loving You (feat. Walter Xavier) [Sax Cover]',
        duration: 'PT4M24S',
      },
    ],
  },
  {
    id: 'baila-flaquita',
    name: 'Baila Flaquita',
    newsSlugs: {
      en: 'baila-flaquita-original-single',
      pt: 'baila-flaquita-single-original',
    },
    type: 'single',
    releaseYear: '2026',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    musicBrainzUrl: 'https://musicbrainz.org/release/aaea8061-a317-4743-bf87-fad9dc3ed93c',
    tracks: [
      {
        name: 'Baila Flaquita',
        duration: 'PT1M44S',
      },
    ],
  },
  {
    id: 'porta-do-sol-cover',
    name: 'Porta Do Sol - Cover',
    newsSlugs: {
      en: 'porta-do-sol-brazilian-zouk-cover',
      pt: 'porta-do-sol-cover-zouk-brasileiro',
    },
    type: 'single',
    releaseDate: '2026-01-06',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    appleMusicUrl: 'https://music.apple.com/us/album/porta-do-sol-cover-single/1867002457',
    musicBrainzUrl: 'https://musicbrainz.org/release/b1c9f977-3642-4c86-a66d-b7b5a4564064',
    tracks: [
      {
        name: 'Porta Do Sol - Cover',
        duration: 'PT5M7S',
      },
    ],
  },
];

// ============================================================================
// 🎸 MUSICGROUP — nó separado do grafo Knowledge Graph
// Representa o projeto artístico "Zen Eyer" como entidade musical.
// Coexiste com ARTIST_SCHEMA_BASE (Person) — ligados por member/memberOf.
// @id: /#musicgroup  (distinto de /#artist que é a Person)
// ============================================================================

// ============================================================================
// Related organization node for the secondary Google Knowledge Graph entity.
// The primary artist KGMID remains on Person/MusicGroup; this avoids conflation.
// ============================================================================

export const ARTIST_BUSINESS_SCHEMA = {
  '@type': 'Organization',
  '@id': `${ARTIST.site.baseUrl}/#business`,
  name: ARTIST.identity.stageName,
  alternateName: [ARTIST.identity.djAlias],
  legalName: ARTIST.identity.fullName,
  url: ARTIST.site.baseUrl,
  logo: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  description:
    'Organization entity for Zen Eyer bookings, press, music releases, and official artist business operations.',
  identifier: [
    {
      '@type': 'PropertyValue',
      propertyID: 'Google KG ID (secondary related entity)',
      value: ARTIST.identifiers.secondaryKnowledgeGraphId,
    },
  ],
  founder: { '@id': `${ARTIST.site.baseUrl}/#artist` },
  member: [{ '@id': `${ARTIST.site.baseUrl}/#artist` }],
  brand: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
};

// ============================================================================
// MUSICGROUP - separate Knowledge Graph node for the artist project.
// Coexists with ARTIST_SCHEMA_BASE (Person), linked by member/memberOf.
// @id: /#musicgroup (distinct from /#artist, which is the Person).
// ============================================================================

export const MUSICGROUP_SCHEMA = {
  '@type': 'MusicGroup',
  '@id': `${ARTIST.site.baseUrl}/#musicgroup`,
  name: 'Zen Eyer',
  alternateName: [ARTIST.identity.djAlias],
  description:
    'Zen Eyer is the official artist name for Brazilian Zouk DJ performances, remixes, edits, and official releases. DJ Zen Eyer is a commonly used stage-name variant.',
  disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
  url: ARTIST.site.baseUrl,
  image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
  genre: ['Brazilian Zouk', 'Zouk', 'Dance Music', 'Latin Dance Music'],
  foundingDate: String(ARTIST.stats.startingYear),
  foundingLocation: {
    '@type': 'Place',
    name: 'Rio de Janeiro, Brazil',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rio de Janeiro',
      addressCountry: 'BR',
    },
  },
  // Ligação bidirecional com a entidade Person
  member: [{ '@id': `${ARTIST.site.baseUrl}/#artist` }],
  award: [
    'World Champion 2022 (DJ) at the Zouk DJ Championship',
    'World Champion 2022 (Remix) at the Zouk DJ Championship',
  ],
  influencedBy: ['Lambada'],
  sameAs: [...ARTIST_SCHEMA_SAME_AS],
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
      propertyID: 'ISNI',
      value: '0000000528931015',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Discogs',
      value: '16872046',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Google KG ID',
      value: '/g/11ff3mhh10',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Spotify',
      value: '68SHKGndTlq3USQ2LZmyLw',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Apple Music',
      value: '1439280950',
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'YouTube',
      value: 'djzeneyer',
    },
  ],
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      propertyID: 'IPA pronunciation',
      value: ARTIST.identity.pronunciationIPA,
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'Pronunciation guide',
      value: ARTIST.philosophy.identityAid.pronunciationGuide,
    },
  ],
};
