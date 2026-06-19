import { ARTIST } from './artistData';
import type { Release } from './artist.schema';

export const DISCOGRAPHY: Release[] = [
  {
    id: 'dont-stop-zen-eyer-remix',
    name: "Don't Stop (feat. Zen Eyer) [Zen Eyer Remix]",
    newsSlugs: {
      en: 'dont-stop-zen-eyer-remix-kaysha',
      pt: 'dont-stop-remix-zen-eyer-kaysha',
    },
    type: 'remix',
    artistCredit: 'Kaysha feat. Zen Eyer',
    releaseDate: '2018-10-25',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    spotifyUrl: 'https://open.spotify.com/track/4KY8BPuSKbNnnI3dQ5fDk9',
    appleMusicUrl: 'https://music.apple.com/us/album/dont-stop-remixes-single/1596289429?i=1596290116',
    musicBrainzUrl: 'https://musicbrainz.org/release/4ca05fa2-a3c0-4de3-818c-e64cd147dca3',
    amazonMusicUrl: 'https://www.amazon.com/dp/B09M791M5V',
    youtubeUrl: 'https://www.youtube.com/watch?v=mxQ-Y_Vh_18',
    genre: ['Brazilian Zouk', 'Zouk'],
    localizedDescription: {
      en: "Brazilian Zouk remix of Kaysha's \"Don't Stop\", reshaped by Zen Eyer for smooth partner dancing.",
      pt: 'Remix em Zouk Brasileiro de "Don\'t Stop", de Kaysha, adaptado por Zen Eyer para danca a dois.',
    },
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
    spotifyUrl: 'https://open.spotify.com/track/2iycClzZfIrwZCMp01oHVt',
    appleMusicUrl: 'https://music.apple.com/us/album/na-ponta-ela-fica-cover-single/1867840116',
    musicBrainzUrl: 'https://musicbrainz.org/release/7b0c16b2-24a8-4923-b3e1-f3b852e5b064',
    youtubeUrl: 'https://www.youtube.com/watch?v=ACENa4vgVcY',
    genre: ['Brazilian Zouk', 'Zouk'],
    localizedDescription: {
      en: 'Brazilian Zouk cover of the MC Delano hit, keeping the hook in a smoother partner-dance arrangement.',
      pt: 'Cover em Zouk Brasileiro do sucesso de MC Delano, com o gancho em uma leitura mais suave para dancar a dois.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999530909',
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
        spotifyUrl: 'https://open.spotify.com/track/2iycClzZfIrwZCMp01oHVt',
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
    artistCredit: 'Zen Eyer feat. Walter Xavier',
    releaseDate: '2026-01-27',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    spotifyUrl: 'https://open.spotify.com/track/0VypRkrCaIsCJh4KeOeVEE',
    appleMusicUrl: 'https://music.apple.com/us/album/still-loving-you-feat-walter-xavier-sax-cover-single/1872468504',
    genre: ['Brazilian Zouk', 'Zouk'],
    localizedDescription: {
      en: 'Brazilian Zouk sax cover of the Scorpions classic, featuring Walter Xavier over a romantic Zouk groove.',
      pt: 'Cover em Zouk Brasileiro do classico do Scorpions, com Walter Xavier no sax sobre uma base romantica.',
    },
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
        spotifyUrl: 'https://open.spotify.com/track/0VypRkrCaIsCJh4KeOeVEE',
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
    releaseDate: '2026-01-02',
    image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`,
    spotifyUrl: 'https://open.spotify.com/track/6gPVyc6JpMjS8zvN1PVAnb',
    musicBrainzUrl: 'https://musicbrainz.org/release/aaea8061-a317-4743-bf87-fad9dc3ed93c',
    amazonMusicUrl: 'https://www.amazon.co.uk/dp/B0GDRV9WF7',
    genre: ['Brazilian Zouk', 'Zouk'],
    localizedDescription: {
      en: "Zen Eyer's first original composition: a Spanish/Portuguese track made for Brazilian Zouk.",
      pt: 'Primeira composicao original de Zen Eyer: uma faixa em espanhol/portugues feita para Zouk Brasileiro.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999525394',
    tracks: [
      {
        name: 'Baila Flaquita',
        duration: 'PT1M44S',
        spotifyUrl: 'https://open.spotify.com/track/6gPVyc6JpMjS8zvN1PVAnb',
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
    genre: ['Brazilian Zouk', 'Zouk'],
    localizedDescription: {
      en: 'Brazilian Zouk cover of "Porta do Sol", with a longer arrangement focused on melody and connection.',
      pt: 'Cover em Zouk Brasileiro de "Porta do Sol", com arranjo mais longo focado em melodia e conexao.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999526018',
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
