import type { Track } from '../types/music';

/**
 * Master list of DJ Zen Eyer tracks, edits, and releases.
 * Add real entries here as the catalog grows.
 */
export const tracks: Track[] = [
  {
    id: 'example-zen-track',
    title: 'Example Zen Track',
    slug: 'example-zen-track',
    bpm: 96,
    key: 'Am',
    energy: 'medium',
    moodTags: ['zouk', 'sensual', 'neo-zouk'],
    language: 'pt',
    releaseType: 'single',
    primaryArtist: 'DJ Zen Eyer',
    featuring: [],
    isrc: undefined,
    artworkUrl: '/images/tracks/example-zen-track.jpg',
    releaseDate: '2026-01-01',
    links: [
      {
        platform: 'spotify',
        label: 'Spotify',
        url: 'https://open.spotify.com/track/PLACEHOLDER',
      },
    ],
    credits: [
      {
        role: 'producer',
        name: 'DJ Zen Eyer',
      },
    ],
  },
];
