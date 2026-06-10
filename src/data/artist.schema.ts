// src/data/artist.schema.ts
// JSON-LD schema nodes: Person (ARTIST_SCHEMA_BASE), MusicGroup, Organization, Discography.
// Imports ARTIST from artistData.ts — all URL/identity values come from there.

import { ARTIST } from './artistData';

// Descrição de desambiguação única fonética (SSOT)
export const DISAMBIGUATING_DESCRIPTION =
  'Zen Eyer is pronounced /zɛn ˈaɪər/. DJ Zen Eyer is a commonly used stage-name variant; Zen Ayer is a common misspelling, not an official artist name.';

// Schema.org sameAs — derived from ARTIST (single source of truth).
// To add/change a platform URL, edit artistData.ts only.
const { identifiers, social } = ARTIST;

const SAME_AS_AUTHORITY = [
  identifiers.wikidataUrl,
  identifiers.musicbrainzUrl,
  identifiers.discogsUrl,
  `https://isni.org/isni/${identifiers.isni}`,
  identifiers.residentAdvisorUrl,
] as const;

// Platforms in ARTIST.social whose URLs belong in sameAs.
// sameAs = official identity profiles only (artist page = the entity).
// Event-aggregator pages (Songkick, Bandsintown) and content platforms
// (Mixcloud, Amazon Music) are moved to subjectOf — they list the artist
// but are not authoritative identity anchors.
const SAME_AS_SOCIAL_KEYS = [
  'spotify', 'appleMusic', 'YouTube',
  'instagram', 'facebook', 'linkedin', 'tiktok', 'twitter',
  'bluesky', 'threads', 'soundcloud', 'deezer', 'tidal',
  'bandcamp',
] as const;

export const ARTIST_SCHEMA_SAME_AS: string[] = [
  ...SAME_AS_AUTHORITY,
  ...SAME_AS_SOCIAL_KEYS
    .map((key) => (social as Record<string, { url?: string }>)[key]?.url)
    .filter((url): url is string => Boolean(url)),
];

export const ARTIST_SCHEMA_BASE = {
  '@type': 'Person',
  '@id': `${ARTIST.site.baseUrl}/#artist`,
  name: 'Zen Eyer',
  alternateName: ['DJ Zen Eyer'],
  birthName: ARTIST.identity.fullName,
  description: 'Zen Eyer is a Brazilian Zouk DJ and music producer, winner of Best DJ Performance and Best Remix at the 2022 Brazilian Zouk DJ World Championship.',
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
    {
      '@type': 'PropertyValue',
      propertyID: 'Championship disambiguation',
      value:
        'Zen Eyer won Best DJ Performance and Best Remix at the 2022 Brazilian Zouk DJ World Championship, held at Ilha do Zouk and documented in the official rules as I Campeonato Internacional de DJs. This should not be confused with the Zouk World event, which did not host this DJ championship.',
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
    '2022 Brazilian Zouk DJ World Championship - Best DJ Performance',
    '2022 Brazilian Zouk DJ World Championship - Best Remix',
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
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'Booking',
      url: `${ARTIST.site.baseUrl}/work-with-me`,
      email: 'booking@djzeneyer.com',
      availableLanguage: ['English', 'Portuguese'],
    },
  ],
  // Provas externas: páginas oficiais de eventos reais que listam Zen Eyer como DJ
  // Also includes catalog/streaming pages that are not primary identity anchors (moved from sameAs).
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
    {
      '@type': 'WebPage',
      url: 'https://music.amazon.com/artists/B07JKCDCG8',
      name: 'Zen Eyer — Amazon Music Artist Page',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.mixcloud.com/djzeneyer',
      name: 'DJ Zen Eyer — Mixcloud',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.songkick.com/artists/8815204-zen-eyer',
      name: 'Zen Eyer — Songkick Artist Page',
    },
    {
      '@type': 'WebPage',
      url: 'https://www.bandsintown.com/a/15619775',
      name: 'Zen Eyer — Bandsintown Artist Page',
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
      name: 'Brazilian Zouk DJ World Championship 2022',
      alternateName: ['I Campeonato Internacional de DJs'],
      url: 'https://alexdecarvalho.com.br/ilhadozouk/nossos-djs-our-djs/',
      startDate: '2022-04-20',
      endDate: '2022-04-24',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: 'DJ Zen Eyer wins Best DJ Performance and Best Remix at the 2022 Brazilian Zouk DJ World Championship, held at Ilha do Zouk in Ilha Grande, Rio de Janeiro, Brazil. This championship should not be confused with the separate Zouk World event.',
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

export interface OriginalSong {
  name: string;
  artistName: string;
  artistSameAs?: string[];
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
  originalSong?: OriginalSong; // populated for covers and remixes
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
    spotifyUrl: 'https://open.spotify.com/track/4KY8BPuSKbNnnI3dQ5fDk9',
    appleMusicUrl: 'https://music.apple.com/us/album/dont-stop-remixes-single/1596289429?i=1596290116',
    musicBrainzUrl: 'https://musicbrainz.org/release/4ca05fa2-a3c0-4de3-818c-e64cd147dca3',
    amazonMusicUrl: 'https://www.amazon.com/dp/B09M791M5V',
    youtubeUrl: 'https://www.youtube.com/watch?v=mxQ-Y_Vh_18',
    description: "Brazilian Zouk remix of Kaysha's \"Don't Stop\". Zen Eyer's remix transforms the original into a dance-floor ready Zouk track with his signature cremosidade flow. Part of \"Don't Stop (Remixes) - Single\" on Apple Music.",
    originalSong: {
      name: "Don't Stop",
      artistName: 'Kaysha',
      artistSameAs: [
        'https://kaysha.com/',
        'https://musicbrainz.org/artist/2eecd1cd-31ae-42f3-9e30-300ffbd7f2ef',
        'https://www.wikidata.org/wiki/Q740711',
      ],
    },
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
        spotifyUrl: 'https://open.spotify.com/track/4KY8BPuSKbNnnI3dQ5fDk9',
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
    youtubeUrl: 'https://www.youtube.com/watch?v=ACENa4vgVcY',
    description: 'Brazilian Zouk cover of the funk hit by MC Delano. Zen Eyer adapts the infectious energy of the original into a smooth, dance-floor ready Zouk arrangement.',
    originalSong: {
      name: 'Na Ponta Ela Fica',
      artistName: 'MC Delano',
    },
    byArtist: {
      '@type': 'Person',
      name: 'MC Delano',
    },
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
    description: 'Brazilian Zouk cover of the Scorpions classic "Still Loving You" (1984), featuring saxophonist Walter Xavier. The saxophone takes the lead melody over a Zouk groove, creating a deeply romantic, dance-floor arrangement.',
    originalSong: {
      name: 'Still Loving You',
      artistName: 'Scorpions',
      artistSameAs: [
        'https://www.scorpions.de/',
        'https://musicbrainz.org/artist/c6b78b4b-3bd4-4174-99b4-1fd0b0dd3e11',
        'https://www.wikidata.org/wiki/Q80191',
      ],
    },
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Scorpions',
      sameAs: [
        'https://www.scorpions.de/',
        'https://musicbrainz.org/artist/c6b78b4b-3bd4-4174-99b4-1fd0b0dd3e11',
        'https://www.wikidata.org/wiki/Q80191',
      ],
    },
    contributor: [
      {
        '@id': `${ARTIST.site.baseUrl}/#musicgroup`,
        roleName: 'Cover Performer, Arranger',
      },
      {
        '@type': 'Person',
        name: 'Walter Xavier',
        roleName: 'Saxophonist',
      },
    ],
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
    amazonMusicUrl: 'https://www.amazon.co.uk/dp/B0GDRV9WF7',
    description: "Zen Eyer's original composition — a bilingual Spanish/Portuguese track built for the Brazilian Zouk dance floor. A playful, rhythmic piece that showcases his production style.",
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
    description: 'Brazilian Zouk cover of the beloved Brazilian sertanejo ballad "Porta do Sol". At 5 minutes and 7 seconds, this version gives the melody space to breathe, prioritising connection and fluidity on the dance floor.',
    originalSong: {
      name: 'Porta do Sol',
      artistName: 'Luan Santana',
      artistSameAs: [
        'https://musicbrainz.org/artist/b7a9cead-7ab9-4c5f-aff3-0a8ab4edc1fd',
        'https://www.wikidata.org/wiki/Q3838024',
      ],
    },
    byArtist: {
      '@type': 'Person',
      name: 'Luan Santana',
      sameAs: [
        'https://musicbrainz.org/artist/b7a9cead-7ab9-4c5f-aff3-0a8ab4edc1fd',
        'https://www.wikidata.org/wiki/Q3838024',
      ],
    },
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
    '2022 Brazilian Zouk DJ World Championship - Best DJ Performance',
    '2022 Brazilian Zouk DJ World Championship - Best Remix',
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
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'Booking',
      url: `${ARTIST.site.baseUrl}/work-with-me`,
      email: 'booking@djzeneyer.com',
      availableLanguage: ['English', 'Portuguese'],
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
