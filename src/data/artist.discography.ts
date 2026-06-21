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
    image: `${ARTIST.site.baseUrl}/images/releases/dont-stop-zen-eyer-remix.jpg`,
    spotifyUrl: 'https://open.spotify.com/track/4KY8BPuSKbNnnI3dQ5fDk9',
    appleMusicUrl: 'https://music.apple.com/us/album/dont-stop-remixes-single/1596289429?i=1596290116',
    musicBrainzUrl: 'https://musicbrainz.org/release/4ca05fa2-a3c0-4de3-818c-e64cd147dca3',
    amazonMusicUrl: 'https://www.amazon.com/dp/B09M791M5V',
    youtubeUrl: 'https://www.youtube.com/watch?v=mxQ-Y_Vh_18',
    genre: ['Caribbean', 'Brazilian Zouk', 'Zouk'],
    localizedDescription: {
      en: "Zen Eyer's remix of Kaysha's \"Don't Stop\" appears on the official Don't Stop (Remixes) release. It keeps Kaysha's Caribbean identity while reshaping the track for smoother Brazilian Zouk partner dancing.",
      pt: 'Remix de Zen Eyer para "Don\'t Stop", de Kaysha, publicado no lançamento oficial Don\'t Stop (Remixes). A versão mantém a identidade caribenha de Kaysha e adapta a faixa para uma leitura mais fluida de Zouk Brasileiro.',
    },
    releaseCountry: 'XW',
    releaseStatus: 'Official',
    labelName: 'Sushiraw',
    language: 'English',
    phonographicCopyright: '2018 Sushiraw',
    copyright: '2018 Sushiraw',
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
        isrcCode: 'FR96X1870486',
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
    image: `${ARTIST.site.baseUrl}/images/releases/na-ponta-ela-fica-cover.jpg`,
    spotifyUrl: 'https://open.spotify.com/track/2iycClzZfIrwZCMp01oHVt',
    appleMusicUrl: 'https://music.apple.com/us/album/na-ponta-ela-fica-cover-single/1867840116',
    musicBrainzUrl: 'https://musicbrainz.org/release/7b0c16b2-24a8-4923-b3e1-f3b852e5b064',
    youtubeUrl: 'https://www.youtube.com/watch?v=ACENa4vgVcY',
    genre: ['Baile Funk', 'Afro-Beat', 'Brazilian Zouk'],
    localizedDescription: {
      en: 'A Brazilian Zouk cover of "Na Ponta Ela Fica", originally associated with MC Delano. Zen Eyer keeps the recognizable hook, but places it in a smoother partner-dance arrangement for Zouk floors.',
      pt: 'Cover em Zouk Brasileiro de "Na Ponta Ela Fica", originalmente associada a MC Delano. Zen Eyer mantém o gancho reconhecível da música e leva a faixa para uma leitura mais suave, feita para a pista de Zouk.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999530909',
    catalogNumber: '199999530909',
    labelName: 'Zen Eyer',
    distributor: 'Soundrop',
    language: 'Portuguese',
    titleVersion: 'Cover',
    phonographicCopyright: '2026 Zen Eyer',
    copyright: '2026 Zen Eyer',
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
    image: `${ARTIST.site.baseUrl}/images/releases/still-loving-you-sax-cover.jpg`,
    spotifyUrl: 'https://open.spotify.com/track/0VypRkrCaIsCJh4KeOeVEE',
    appleMusicUrl: 'https://music.apple.com/us/album/still-loving-you-feat-walter-xavier-sax-cover-single/1872468504',
    genre: ['Contemporary Jazz', 'Dancehall', 'Brazilian Zouk'],
    localizedDescription: {
      en: 'A saxophone-led Brazilian Zouk cover of the Scorpions classic, featuring Walter Xavier on saxophone. Zen Eyer frames the melody with a romantic, danceable arrangement for connected Zouk moments.',
      pt: 'Cover em Zouk Brasileiro do clássico do Scorpions, com Walter Xavier no saxofone. Zen Eyer constrói uma versão romântica e dançável, pensada para momentos de conexão na pista.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999545545',
    catalogNumber: '199999545545',
    labelName: 'Zen Eyer',
    distributor: 'Soundrop',
    language: 'English',
    titleVersion: 'Sax Cover',
    phonographicCopyright: '2026 Zen Eyer',
    copyright: '2026 Zen Eyer',
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
    image: `${ARTIST.site.baseUrl}/images/releases/baila-flaquita.jpg`,
    spotifyUrl: 'https://open.spotify.com/track/6gPVyc6JpMjS8zvN1PVAnb',
    appleMusicUrl: 'https://music.apple.com/us/album/baila-flaquita/1866010767?i=1866010768',
    musicBrainzUrl: 'https://musicbrainz.org/release/aaea8061-a317-4743-bf87-fad9dc3ed93c',
    amazonMusicUrl: 'https://www.amazon.co.uk/dp/B0GDRV9WF7',
    genre: ['Reggaeton', 'Latin Urban', 'Brazilian Zouk'],
    localizedDescription: {
      en: "Zen Eyer's first original composition, released as a Spanish-language single under his own label. The track brings Latin urban energy into a compact format made for Brazilian Zouk dance floors.",
      pt: 'Primeira composição original de Zen Eyer, lançada em espanhol pelo próprio selo. A faixa traz energia latina urbana em um formato compacto, pensado para pistas de Zouk Brasileiro.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999525394',
    catalogNumber: '199999525394',
    labelName: 'Zen Eyer',
    distributor: 'Soundrop',
    language: 'Spanish',
    phonographicCopyright: '2026 Zen Eyer',
    copyright: '2026 Zen Eyer',
    tracks: [
      {
        name: 'Baila Flaquita',
        duration: 'PT1M44S',
        isrcCode: 'QZPJ32529510',
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
    image: `${ARTIST.site.baseUrl}/images/releases/porta-do-sol-cover.jpg`,
    appleMusicUrl: 'https://music.apple.com/us/album/porta-do-sol-cover-single/1867002457',
    musicBrainzUrl: 'https://musicbrainz.org/release/b1c9f977-3642-4c86-a66d-b7b5a4564064',
    genre: ['Brazilian', 'Afro-Beat', 'Brazilian Zouk'],
    localizedDescription: {
      en: 'A Brazilian Zouk cover of "Porta do Sol", originally associated with Luan Santana. Zen Eyer stretches the arrangement into a melodic, connection-focused version for slow and expressive dancing.',
      pt: 'Cover em Zouk Brasileiro de "Porta do Sol", originalmente associada a Luan Santana. Zen Eyer transforma a música em uma versão melódica, mais longa e focada em conexão para dançar com calma e expressão.',
    },
    releaseCountry: 'BR',
    releaseStatus: 'Official',
    barcode: '199999526018',
    catalogNumber: '199999526018',
    labelName: 'Zen Eyer',
    distributor: 'Soundrop',
    language: 'Portuguese',
    titleVersion: 'Cover',
    phonographicCopyright: '2025 Zen Eyer',
    copyright: '2025 Zen Eyer',
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
