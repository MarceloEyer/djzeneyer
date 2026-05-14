import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { Book, Search, Sparkles, ChevronRight } from 'lucide-react';
import { ZOUK_ENCYCLOPEDIA } from '../data/zoukEncyclopedia';
import { useTranslation } from 'react-i18next';
import { ARTIST } from '../data/artistData';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const EncyclopediaPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('encyclopedia', currentLang)}`;

  const encyclopediaSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: currentLang === 'pt' ? 'Enciclopédia do Zouk Brasileiro' : 'Brazilian Zouk Encyclopedia',
        description: currentLang === 'pt' ? 'O guia definitivo sobre termos, história e técnica do Zouk Brasileiro por Zen Eyer.' : 'The definitive guide to Brazilian Zouk terms, history, and technique by Zen Eyer.',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('home'), item: `${ARTIST.site.baseUrl}${getLocalizedRoute('home', currentLang)}` },
            { '@type': 'ListItem', position: 2, name: 'Encyclopedia', item: pageUrl },
          ],
        },
      },
      ...ZOUK_ENCYCLOPEDIA.map(item => ({
        '@type': 'DefinedTerm',
        'name': item.term[currentLang],
        'description': item.definition[currentLang],
        'inDefinedTermSet': pageUrl
      }))
    ],
  }), [t, pageUrl, currentLang]);

  return (
    <>
      <HeadlessSEO
        title={`${currentLang === 'pt' ? 'Enciclopédia Zouk' : 'Zouk Encyclopedia'} | ${ARTIST.identity.stageName}`}
        description={currentLang === 'pt' ? 'Aprenda tudo sobre o Zouk Brasileiro: termos, história e a filosofia da cremosidade.' : 'Learn everything about Brazilian Zouk: terms, history, and the philosophy of cremosidade.'}
        url={pageUrl}
        schema={encyclopediaSchema}
        leadAnswer={ZOUK_ENCYCLOPEDIA[0].definition[currentLang]}
      />

      <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumb items={[{ label: 'Encyclopedia' }]} className="mb-12" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Book size={14} /> {currentLang === 'pt' ? 'Base de Conhecimento' : 'Knowledge Base'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6 tracking-tight">
              {currentLang === 'pt' ? 'Enciclopédia' : 'Encyclopedia'}{' '}
              <span className="text-primary">Zouk</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              {currentLang === 'pt' 
                ? 'Explore os fundamentos, a história e a terminologia da dança que está conquistando o mundo.' 
                : 'Explore the foundations, history, and terminology of the dance taking the world by storm.'}
            </p>
          </motion.div>

          {/* Search Placeholder */}
          <div className="relative max-w-xl mx-auto mb-20">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder={currentLang === 'pt' ? 'Buscar termos...' : 'Search terms...'}
              className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="grid gap-8">
            {ZOUK_ENCYCLOPEDIA.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-surface/30 border border-white/5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold font-display text-white group-hover:text-primary transition-colors">
                        {item.term[currentLang]}
                      </h2>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed mb-6" data-speakable>
                      {item.definition[currentLang]}
                    </p>

                    {item.expertInsight && (
                      <div className="mb-6 p-4 rounded-2xl bg-primary/5 border-l-4 border-primary italic text-white/80 text-sm">
                        <div className="font-bold text-primary mb-1 uppercase tracking-widest text-[10px]">
                          {currentLang === 'pt' ? 'Insight do Expert' : 'Expert Insight'}
                        </div>
                        "{item.expertInsight[currentLang]}"
                      </div>
                    )}

                    {item.relatedTerms && (
                      <div className="flex flex-wrap gap-2">
                        {item.relatedTerms.map(related => (
                          <span key={related} className="text-xs text-primary/60 font-medium flex items-center gap-1 hover:text-primary transition-colors cursor-pointer bg-white/5 px-2 py-1 rounded-lg">
                            <ChevronRight size={10} /> {related.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expert Quote */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/5 text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-display font-light italic text-white/80 mb-6">
              "{currentLang === 'pt' ? 'O Zouk não é apenas uma dança, é um estado de espírito cremoso.' : 'Zouk is not just a dance, it is a creamy state of mind.'}"
            </blockquote>
            <cite className="text-primary font-bold uppercase tracking-widest not-italic">
              — Zen Eyer
            </cite>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EncyclopediaPage;
