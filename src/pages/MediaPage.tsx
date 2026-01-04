import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Download, Image as ImageIcon } from 'lucide-react';
import { ARTIST } from '../data/artistData';

const MediaPage: React.FC = () => {
  const { t } = useTranslation();

  const pressHighlights = [
    {
      title: t('media_page.world_champion'),
      description: t('media_page.world_champion_desc'),
      source: t('media_page.source_official_bio'),
      year: "2023"
    },
    {
      title: t('media_page.international_performances'),
      description: t('media_page.international_performances_desc'),
      source: t('media_page.source_performance_history'),
      year: t('media_page.year_range')
    }
  ];

  const mediaAssets = [
    {
      title: t('media_page.high_res_photos'),
      description: t('media_page.high_res_photos_desc'),
      icon: ImageIcon,
      available: false
    },
    {
      title: t('media_page.official_bio'),
      description: t('media_page.official_bio_desc'),
      icon: Newspaper,
      available: true
    },
    {
      title: t('media_page.press_kit_pdf'),
      description: t('media_page.press_kit_pdf_desc'),
      icon: Download,
      available: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('media_page.title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('media_page.subtitle')} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              {t('media_page.title').split('&')[0]} & <span className="text-primary">{t('media_page.title').split('&')[1] || 'Press Kit'}</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('media_page.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card mb-16 p-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6">{t('media_page.quick_facts')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{t('media_page.artist_name')}</h3>
                <p className="text-lg font-semibold">DJ Zen Eyer</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{t('media_page.legal_name')}</h3>
                <p className="text-lg font-semibold">Marcelo Eyer Fernandes</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{t('media_page.genre')}</h3>
                <p className="text-lg font-semibold">Brazilian Zouk</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{t('media_page.location')}</h3>
                <p className="text-lg font-semibold">São Paulo, Brazil</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{t('media_page.cnpj')}</h3>
                <p className="text-lg font-semibold font-mono">44.063.765/0001-46</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{t('media_page.isni')}</h3>
                <p className="text-lg font-semibold font-mono">0000 0005 2893 1015</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-8">{t('media_page.press_highlights')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pressHighlights.map((item, index) => (
                <div key={index} className="card p-6 border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="text-sm text-white/50 font-mono">{item.year}</span>
                  </div>
                  <p className="text-white/70 mb-3">{item.description}</p>
                  <p className="text-sm text-primary">{item.source}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-8">{t('media_page.media_assets')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mediaAssets.map((asset, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    asset.available ? 'bg-primary/20' : 'bg-white/5'
                  }`}>
                    <asset.icon size={28} className={asset.available ? 'text-primary' : 'text-white/30'} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{asset.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{asset.description}</p>
                  {asset.available ? (
                    <button className="btn btn-primary btn-sm w-full">
                      <Download size={16} className="mr-2" />
                      {t('media_page.download')}
                    </button>
                  ) : (
                    <span className="text-xs text-white/40 uppercase tracking-wider">{t('media_page.coming_soon')}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card p-8 text-center"
          >
            <h2 className="text-3xl font-display font-bold mb-4">{t('media_page.press_inquiries')}</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              {t('media_page.press_inquiries_desc')}
            </p>
            <a
              href={`mailto:${ARTIST.contact.email}`}
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <ExternalLink size={20} />
              {t('media_page.contact_press_office')}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-white/50 mb-4">{t('media_page.verified_profiles')}</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="https://www.wikidata.org/wiki/Q136551855"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors flex items-center gap-2"
              >
                Wikidata <ExternalLink size={14} />
              </a>
              <a
                href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors flex items-center gap-2"
              >
                MusicBrainz <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MediaPage;
