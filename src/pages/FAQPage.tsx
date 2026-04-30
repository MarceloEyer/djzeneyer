import React, { useState, memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ChevronDown, Users, Award, Globe, Brain, Mic2, BookOpen, HeartPulse } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { stripHtml } from '../utils/text';

// ============================================================================
// COMPONENTE FAQITEM
// ============================================================================
const FAQItem = memo<{
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}>(({ id, question, answer, isOpen, onToggle }: { id: string; question: string; answer: string; isOpen: boolean; onToggle: (id: string) => void }) => (
  <motion.div
    className="bg-surface/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <button
      onClick={() => onToggle(id)}
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

    <motion.div
      initial={false}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        className="px-6 pb-6 text-white/80 leading-relaxed prose prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white border-t border-white/5 pt-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }}
      />
    </motion.div>
  </motion.div>
));
FAQItem.displayName = 'FAQItem';

const CATEGORIES = ['djzeneyer', 'rankings', 'technical', 'culture', 'community'];
const FAQ_QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5'];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const FAQPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenIndex(prev => prev === id ? null : id);
  }, []);



  // Categorias mapeadas dinamicamente das traduções
  const faqData = useMemo(() => CATEGORIES.map(cat => ({
    category: cat,
    title: t(`faq.categories.${cat}.title`),
    description: t(`faq.categories.${cat}.desc`),
    icon: cat === 'djzeneyer' ? <Award size={24} /> :
      cat === 'rankings' ? <Globe size={24} /> :
        cat === 'technical' ? <Brain size={24} /> :
          cat === 'culture' ? <HeartPulse size={24} /> :
            <Users size={24} />,
    questions: FAQ_QUESTIONS
      .filter(qKey =>
        i18n.exists(`faq.categories.${cat}.${qKey}.q`) &&
        i18n.exists(`faq.categories.${cat}.${qKey}.a`)
      )
      .map(qKey => ({
        question: t(`faq.categories.${cat}.${qKey}.q`),
        answer: t(`faq.categories.${cat}.${qKey}.a`)
      }))
  })), [t, i18n]);

  // SSR/Prerender context
  const currentUrl = useMemo(
    () => `${ARTIST.site.baseUrl}${location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`}`,
    [location.pathname]
  );

  // Extract FAQs for the HeadlessSEO component to generate the FAQPage schema
  const faqList = useMemo(() => {
    return faqData.reduce((acc, category) => {
      for (const q of category.questions) {
        acc.push({
          q: (q.question as unknown) as string,
          a: stripHtml((q.answer as unknown) as string) // Clean text for robots/LLMs
        });
      }
      return acc;
    }, [] as Array<{ q: string; a: string }>);
  }, [faqData]);

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background Decorations - Premium Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] left-[60%] w-[35%] h-[35%] bg-blue-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full" />
        <div className="absolute top-[40%] left-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[80px] rounded-full" />
      </div>
      <HeadlessSEO
        title={t('faq.title')}
        description={t('faq.subtitle')}
        url={safeUrl(currentUrl, ARTIST.site.baseUrl)}
        faqs={faqList}
        keywords={t('faq.seo.keywords')}
        leadAnswer={t('faq.seo.lead_answer')}
      />

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
          <h1 className="text-4xl md:text-6xl font-black font-display mb-6 text-white leading-tight">
            <Trans i18nKey="faq.title">
              Perguntas <span className="text-primary">Frequentes</span>
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
                      id={uniqueId}
                      question={q.question}
                      answer={q.answer}
                      isOpen={openIndex === uniqueId}
                      onToggle={handleToggle}
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
            <a href={`https://wa.me/${ARTIST.contact.whatsapp.number}?text=${encodeURIComponent(t('about.cta.whatsapp_msg'))}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <Mic2 size={18} /> {t('faq.cta_whatsapp')}
            </a>
            <a href={`mailto:${ARTIST.contact.email}`} className="btn btn-outline px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 transition-transform hover:scale-105">
              <Globe size={18} /> {t('faq.cta_email')}
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary React reconciliation loops when parent layout components (like routers) trigger render cycles.
export default React.memo(FAQPage);