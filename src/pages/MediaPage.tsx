import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Download, Image as ImageIcon } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const MediaPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  const clippingData = ARTIST.mediaClipping || [];

  const mediaAssets = [
    {
      title: t('media_page.high_res_photos'),
      description: t('media_page.high_res_photos_desc'),
      icon: ImageIcon,
      available: true,
      url: 'https://photos.djzeneyer.com'
    },
    {
      title: t('media_page.official_bio'),
      description: t('media_page.official_bio_desc'),
      icon: Newspaper,
      available: true,
      url: '/media/dj-zen-eyer-bio.pdf'
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
      <HeadlessSEO
        title={`${t('media_page.title')} | ${ARTIST.identity.stageName}`}
        description={t('media_page.subtitle')}
        url={`https://djzeneyer.com/${getLocalizedRoute('media', currentLang).replace(/^\//, '')}`}
        image="/images/zen-eyer-og-image.png"
      />

      <div className="min-h-screen pt-40 pb-24 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 text-sm font-bold tracking-widest uppercase">
              <Newspaper size={16} /> {t('media_page.verified_profiles')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display mb-8 text-white tracking-tighter uppercase leading-[0.9]">
              Press & Media
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Explore media coverage, press mentions, and the official press kit of DJ Zen Eyer.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content: Clipping List */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-3xl font-black font-display text-white uppercase tracking-widest mb-8 border-l-4 border-primary pl-6">
                {t('media_page.press_highlights')}
              </h2>
              
              <div className="grid gap-6">
                {clippingData.map((item, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group block card p-6 bg-surface/30 backdrop-blur-md border hover:border-primary/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/5 text-primary text-xs font-bold uppercase tracking-widest border border-white/5 group-hover:bg-primary/20 transition-colors">
                          {item.type}
                        </span>
                        <span className="text-white/40 text-xs font-mono">{item.date}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary/70">
                        <span>{item.source}</span>
                        <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More <ExternalLink size={14} />
                        </span>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar: Assets & Quick Facts */}
            <div className="space-y-12">
              <section>
                <h3 className="text-xl font-black font-display text-white uppercase tracking-widest mb-6">
                  {t('media_page.media_assets')}
                </h3>
                <div className="grid gap-4">
                  {mediaAssets.map((asset, index) => (
                    <div key={index} className="card p-5 bg-surface/50 border-white/5 hover:border-primary/30 transition-all flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary`}>
                        <asset.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm uppercase">{asset.title}</h4>
                        <p className="text-white/40 text-xs line-clamp-1">{asset.description}</p>
                      </div>
                      {asset.available ? (
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold uppercase">
                          {t('media_page.download')} <Download size={18} />
                        </a>
                      ) : (
                        <span className="text-[10px] text-white/20 uppercase font-black">{t('media_page.coming_soon')}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border border-white/5">
                <h3 className="text-xl font-black font-display text-white uppercase tracking-widest mb-6">
                  {t('media_page.quick_facts')}
                </h3>
                <div className="space-y-6">
                  {[
                    { label: t('media_page.artist_name'), value: ARTIST.identity.stageName },
                    { label: t('media_page.legal_name'), value: ARTIST.identity.fullName },
                    { label: t('media_page.genre'), value: t('media_page.genre_value') },
                    { label: t('media_page.location'), value: t('media_page.location_value') },
                    { label: t('media_page.cnpj'), value: ARTIST.identity.taxId },
                  ].map((fact, i) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">{fact.label}</div>
                      <div className="text-white font-bold text-sm">{fact.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-8 bg-primary/10 border-primary/20 text-center">
                <h3 className="text-xl font-black font-display text-white uppercase tracking-tight mb-4">
                  {t('media_page.press_inquiries')}
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  {t('media_page.press_inquiries_desc')}
                </p>
                <a
                  href={`mailto:${ARTIST.contact.email}`}
                  className="btn btn-primary btn-sm w-full justify-center px-6 py-4 font-black uppercase tracking-widest"
                >
                  {t('media_page.contact_press_office')}
                </a>
              </section>
            </div>
          </div>

          {/* Social Proof / Footer IDs */}
          <div className="mt-32 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity">
            <a href={ARTIST.identifiers.wikidataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
              <span className="font-display font-black text-xl tracking-tighter">Wikidata</span>
              <ExternalLink size={14} />
            </a>
            <a href={ARTIST.identifiers.musicbrainzUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
               <span className="font-display font-black text-xl tracking-tighter">MusicBrainz</span>
               <ExternalLink size={14} />
             </a>
             <a href={ARTIST.identifiers.discogsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
               <span className="font-display font-black text-xl tracking-tighter">Discogs</span>
               <ExternalLink size={14} />
             </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(MediaPage);
