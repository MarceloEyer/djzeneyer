import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getHrefLangUrls } from '../utils/seo';
import { ChevronDown, Users, Award, Globe, Brain, Mic2, BookOpen, HeartPulse } from 'lucide-react';
import { ARTIST } from '../data/artistData';

// ============================================================================
// COMPONENTE FAQITEM
// ============================================================================
const FAQItem = memo<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}>(({ question, answer, isOpen, onToggle }) => (
  <motion.div
    className="bg-surface/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/50 transition-colors group"
      aria-expanded={isOpen}
    >
      <h3 className="text-lg font-bold text-white pr-4 group-hover:text-primary transition-colors font-display">
        {question}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="text-primary/70 group-hover:text-primary transition-colors" size={24} />
      </motion.div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            className="px-6 pb-6 text-white/80 leading-relaxed prose prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white border-t border-white/5 pt-4"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));
FAQItem.displayName = 'FAQItem';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const currentPath = '/faq';
  const currentUrl = `https://djzeneyer.com${currentPath}`;

  // Categorias mapeadas dinamicamente das traduções
  const categories = ['djzeneyer', 'rankings', 'technical', 'culture', 'community'];

  const faqData = categories.map(cat => ({
    category: cat,
    title: t(`faq.categories.${cat}.title`),
    description: t(`faq.categories.${cat}.desc`),
    icon: cat === 'djzeneyer' ? <Award size={24} /> :
      cat === 'rankings' ? <Globe size={24} /> :
        cat === 'technical' ? <Brain size={24} /> :
          cat === 'culture' ? <HeartPulse size={24} /> :
            <Users size={24} />,
    questions: ['q1', 'q2', 'q3'].map(qKey => ({
      question: t(`faq.categories.${cat}.${qKey}.q`),
      answer: t(`faq.categories.${cat}.${qKey}.a`)
    }))
  }));

  // Schema JSON-LD dinâmico baseado no idioma atual
  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${currentUrl}#faqpage`,
    "mainEntity": faqData.flatMap(category =>
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer.replace(/<[^>]*>/g, '') // Texto limpo para robots/LLMs
        }
      }))
    )
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${currentUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://djzeneyer.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": currentUrl
      }
    ]
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [faqSchema, breadcrumbSchema]
  };

  return (
    <>
      <HeadlessSEO
        title={`${t('faq.badge')} | DJ Zen Eyer`}
        description={t('faq.subtitle')}
        url={currentUrl}
        ogType="website"
        schema={combinedSchema}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="Zouk Brasileiro FAQ, o que é zouk, DJ Zen Eyer, DJ Kakah, DJ Mafie Zouker, DJ Ju Sanper, DJ Alan Z, Brazilian Zouk Council, BZDC, cremosidade, musicalidade zouk, contratar DJ, aulas de zouk, best zouk djs, zouk rhythms, reggaeton zouk, kizomba zouk, planada zouk, bônus zouk, renata peçanha zouk, adílio porto, lambada history"
      />

      <div className="min-h-screen bg-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">

          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 text-sm font-bold tracking-widest uppercase">
              <BookOpen size={16} /> {t('faq.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6">
              <Trans i18nKey="faq.title">
                Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Frequentes</span>
              </Trans>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </motion.div>

          {/* Conteúdo do FAQ */}
          <div className="max-w-4xl mx-auto space-y-16">
            {faqData.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-surface rounded-xl text-primary border border-white/10 shadow-lg shadow-primary/5">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="text-white/50 text-sm">{category.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {category.questions.map((q, qIndex) => {
                    const uniqueId = `${category.category}-${qIndex}`;
                    return (
                      <FAQItem
                        key={uniqueId}
                        question={q.question}
                        answer={q.answer}
                        isOpen={openIndex === uniqueId}
                        onToggle={() => handleToggle(uniqueId)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Footer */}
          <motion.div
            className="mt-24 text-center border-t border-white/10 pt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-display font-bold mb-6">{t('faq.not_found')}</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={`https://wa.me/5521987413091?text=${encodeURIComponent(t('about.cta.whatsapp_msg'))}`} className="btn btn-primary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <Mic2 size={18} /> {t('faq.cta_whatsapp')}
              </a>
              <a href={`mailto:${ARTIST.contact.email}`} className="btn btn-outline px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 transition-transform hover:scale-105">
                <Globe size={18} /> {t('faq.cta_email')}
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default FAQPage;
