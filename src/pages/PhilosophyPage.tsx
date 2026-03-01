import React from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Heart, Music2, Sparkles } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { useTranslation } from 'react-i18next';

const PhilosophyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadlessSEO
        title={`${t('philosophy.page_title')} | ${ARTIST.identity.stageName}`}
        description={t('philosophy.coming_soon_desc', { name: ARTIST.identity.stageName })}
      />

      <div className="min-h-screen pt-24 pb-16 px-4 bg-background text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-black font-display mb-8">
              {t('philosophy.page_title')}
            </h1>

            <div className="grid md:grid-cols-2 gap-8 mb-16 text-left">
              <div className="card p-8 bg-surface/50 border border-white/10 hover:border-primary/50 transition-all rounded-2xl">
                <Music2 className="w-10 h-10 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-primary">
                  {t('philosophy.style_title')}
                </h2>
                <p className="text-white/80 leading-relaxed italic">
                  "{t('about.philosophy.quote')}"
                </p>
                <div className="mt-4 text-sm text-white/50">— {ARTIST.identity.stageName}</div>
              </div>

              <div className="card p-8 bg-surface/50 border border-white/10 hover:border-accent/50 transition-all rounded-2xl">
                <Heart className="w-10 h-10 text-accent mb-4" />
                <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-accent">
                  {t('philosophy.mission_title')}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {t('about.hero.subtitle')}
                </p>
              </div>
            </div>

            <div className="card p-12 bg-white/5 border border-dashed border-white/10 rounded-3xl mb-12">
              <h2 className="text-2xl font-display font-bold mb-4">
                {t('philosophy.coming_soon_title')}
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                {t('philosophy.coming_soon_desc', { name: ARTIST.identity.stageName })}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PhilosophyPage;
