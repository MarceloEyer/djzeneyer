import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';

const PressKitDownloadPage: React.FC = () => {
  const { t } = useTranslation();

  const pressKitUrl = useMemo(
    () => `${ARTIST.site.baseUrl}${ARTIST.site.media.epkPdf}`,
    []
  );

  useEffect(() => {
    window.location.assign(pressKitUrl);
  }, [pressKitUrl]);

  return (
    <>
      <HeadlessSEO
        title={t('presskit.download_page_title')}
        description={t('presskit.download_page_desc')}
        url={pressKitUrl}
        noindex
      />
      <main className="min-h-screen bg-background px-4 pt-32 text-white">
        <div className="mx-auto max-w-xl rounded-lg border border-white/10 bg-white/5 p-8 text-center">
          <Download className="mx-auto mb-4 text-primary" size={32} aria-hidden="true" />
          <h1 className="mb-3 text-2xl font-black">{t('presskit.download_page_title')}</h1>
          <p className="mb-6 text-white/60">{t('presskit.redirecting_pdf')}</p>
          <a
            href={pressKitUrl}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-background transition-colors hover:bg-white"
          >
            {t('presskit.download_pdf_now')}
          </a>
        </div>
      </main>
    </>
  );
};

export default React.memo(PressKitDownloadPage);
