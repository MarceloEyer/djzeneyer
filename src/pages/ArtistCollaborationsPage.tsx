import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { Breadcrumb } from '../components/Breadcrumb';

const ArtistCollaborationsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('artist-collaborations', currentLang)}`;

  return (
    <>
      <HeadlessSEO
        title="Artist Collaborations & Interviews | DJ Zen Eyer"
        description="Interviews and collaborations with Zouk artists, producers, and dancers."
        url={pageUrl}
      />
      <div className="min-h-screen bg-background px-4 pb-20 pt-24 text-white">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumb items={[{ label: 'Collaborations' }]} className="mb-10" />
          <h1 className="mb-6 font-display text-4xl font-black md:text-6xl text-primary">Artist Collaborations</h1>
          <p className="text-white/70">Content coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default React.memo(ArtistCollaborationsPage);
