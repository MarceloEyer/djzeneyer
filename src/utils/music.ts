import type { Release } from '../data/artist.schema';

/**
 * Maps DISCOGRAPHY entries to release cards enriched with a localized detail path.
 * `getReleasePath` receives the resolved slug and returns the full route string.
 */
export function buildReleaseCards<T extends Pick<Release, 'id' | 'newsSlugs'>>(
  discography: T[],
  lang: string,
  getReleasePath: (slug: string) => string,
): (T & { path: string })[] {
  return discography.map((release) => ({
    ...release,
    path: getReleasePath(release.newsSlugs?.[lang.slice(0, 2) as 'en' | 'pt'] || release.id),
  }));
}

interface DiscographySchemaOpts {
  baseUrl: string;
  getNewsDetailPath: (slug: string) => string;
  lang: string;
  artistSocialUrls: Set<string>;
}

/**
 * Builds the JSON-LD ListItem array for a discography ItemList node.
 * Each release becomes a MusicRecording or MusicAlbum ListItem.
 */
export function buildDiscographyListItems(
  discography: Release[],
  opts: DiscographySchemaOpts,
): Record<string, unknown>[] {
  const { baseUrl, getNewsDetailPath, lang, artistSocialUrls } = opts;

  const isReleaseSpecificUrl = (url: string | undefined): url is string =>
    !!url && !artistSocialUrls.has(url);

  return discography.map((release, index) => {
    const localizedSlug = release.newsSlugs?.[lang.slice(0, 2) as 'en' | 'pt'] || release.id;
    const releasePath = getNewsDetailPath(localizedSlug);
    const releaseUrl = `${baseUrl}${releasePath}`;

    const schemaType =
      release.type === 'album' || release.type === 'ep' ? 'MusicAlbum' : 'MusicRecording';

    const releaseNode: Record<string, unknown> = {
      '@type': schemaType,
      '@id': `${releaseUrl}#recording`,
      name: release.name,
      url: releaseUrl,
      image: release.image,
      genre: ['Brazilian Zouk', 'Zouk'],
      byArtist: release.byArtist || { '@id': `${baseUrl}/#musicgroup` },
    };

    if (release.contributor) releaseNode.contributor = release.contributor;

    if (release.releaseDate && release.releaseDate !== '2024-01-01') {
      releaseNode.datePublished = release.releaseDate;
    }

    if (release.description) releaseNode.description = release.description;

    const sameAsLinks = [
      release.spotifyUrl,
      release.appleMusicUrl,
      release.musicBrainzUrl,
      release.deezerUrl,
      release.tidalUrl,
      release.amazonMusicUrl,
      release.youtubeMusicUrl,
      release.youtubeUrl,
      release.soundcloudUrl,
    ].filter(isReleaseSpecificUrl);
    if (sameAsLinks.length > 0) releaseNode.sameAs = sameAsLinks;

    if (release.tracks.length > 0 && schemaType === 'MusicAlbum') {
      releaseNode.track = release.tracks.map((track) => {
        const trackNode: Record<string, unknown> = {
          '@type': 'MusicRecording',
          name: track.name,
          byArtist: { '@id': `${baseUrl}/#musicgroup` },
        };
        if (track.duration) trackNode.duration = track.duration;
        if (track.isrcCode) trackNode.isrcCode = track.isrcCode;
        const trackSameAs = [track.spotifyUrl, track.youtubeMusicUrl, track.youtubeUrl].filter(
          isReleaseSpecificUrl,
        );
        if (trackSameAs.length > 0) trackNode.sameAs = trackSameAs;
        return trackNode;
      });
    }

    if (schemaType === 'MusicRecording' && release.tracks[0]) {
      const t0 = release.tracks[0];
      if (t0.duration) releaseNode.duration = t0.duration;
      if (t0.isrcCode) releaseNode.isrcCode = t0.isrcCode;
    }

    const listenUrl = release.spotifyUrl || release.appleMusicUrl || release.youtubeMusicUrl || release.youtubeUrl;
    if (listenUrl) {
      releaseNode.potentialAction = {
        '@type': 'ListenAction',
        target: listenUrl,
      };
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: releaseNode,
    };
  });
}
