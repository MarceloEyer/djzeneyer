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
        title={t('hub_pages.artist_collaborations.seo_title')}
        description={t('hub_pages.artist_collaborations.seo_description')}
        url={pageUrl}
        noindex
      />
      <div className="min-h-screen bg-background px-4 pb-20 pt-24 text-white">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumb items={[{ label: t('hub_pages.artist_collaborations.breadcrumb') }]} className="mb-10" />
          <h1 className="mb-6 font-display text-4xl font-black md:text-6xl text-primary">{t('hub_pages.artist_collaborations.h1')}</h1>
          <p className="text-white/70">{t('hub_pages.coming_soon')}</p>
        </div>
      </div>
    </>
  );
};

export default React.memo(ArtistCollaborationsPage);
