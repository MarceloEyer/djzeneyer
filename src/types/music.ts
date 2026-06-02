export type EnergyLevel = 'chill' | 'medium' | 'high';

export interface TrackLink {
  platform: 'spotify' | 'appleMusic' | 'youtube' | 'soundcloud' | 'beatport' | 'other';
  label: string;
  url: string;
}

export interface TrackCredit {
  role: 'producer' | 'composer' | 'lyricist' | 'remixer' | 'featured-artist' | 'dj-edit';
  name: string;
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  bpm?: number;
  key?: string;
  energy?: EnergyLevel;
  moodTags: string[];
  language?: string;
  releaseType: 'single' | 'ep' | 'album' | 'edit' | 'bootleg';
  primaryArtist: string;
  featuring?: string[];
  isrc?: string;
  artworkUrl?: string;
  releaseDate?: string; // ISO 8601 date string e.g. '2026-01-01'
  links: TrackLink[];
  credits: TrackCredit[];
}
