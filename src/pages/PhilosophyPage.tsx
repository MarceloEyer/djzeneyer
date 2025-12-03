import React from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Brain, Heart, Music2, Sparkles } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { useTranslation } from 'react-i18next';

const PhilosophyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadlessSEO
        title={`${t('footer_music_philosophy')} | ${ARTIST.identity.stageName}`}
        description={`${ARTIST.philosophy.slogan}. ${ARTIST.philosophy.styleDefinition}`}
        path="/my-philosophy"
        type="article"
      />

      <div className="min-h-screen bg-background text-white">
        <section className="container mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
                <Brain size={40} className="text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                {t('footer_music_philosophy')}
              </h1>
              <p className="text-xl text-white/70 italic">
                "{ARTIST.philosophy.slogan}"
              </p>
            </div>

            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Music2 size={32} className="text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Cremosidade</h2>
                    <p className="text-white/80 leading-relaxed">
                      {ARTIST.philosophy.styleDefinition}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Heart size={32} className="text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Missão</h2>
                    <p className="text-white/80 leading-relaxed">
                      {ARTIST.philosophy.mission}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Sparkles size={32} className="text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Em Breve</h2>
                    <p className="text-white/80 leading-relaxed">
                      Mais conteúdo sobre a filosofia musical de {ARTIST.identity.stageName} será
                      adicionado em breve. Acompanhe nas redes sociais para não perder novidades!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default PhilosophyPage;
