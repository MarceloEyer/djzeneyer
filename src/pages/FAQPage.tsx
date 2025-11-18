// src/pages/FAQPage.tsx
// ============================================================================
// FAQ PAGE - VERSÃO REFATORADA (HEADLESS SEO)
// ============================================================================
// OTIMIZAÇÕES:
// ✅ HeadlessSEO implementado com hrefLang SSOT
// ✅ Constantes movidas para fora do componente
// ✅ FAQItem memoizado
// ✅ Schema FAQPage otimizado
// ✅ Breadcrumb schema adicionado
// ============================================================================

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ChevronDown, HelpCircle, Music, Users, Award, Globe, Brain } from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================
interface FAQQuestion {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  icon: React.ReactNode;
  title: string;
  questions: FAQQuestion[];
}

// ============================================================================
// CONSTANTES DE DADOS (FORA DO COMPONENTE)
// ============================================================================

/**
 * Dados de FAQ organizados por categoria
 */
const FAQ_DATA: FAQCategory[] = [
  {
    category: 'djzeneyer',
    icon: <Award size={24} />,
    title: 'Sobre DJ Zen Eyer',
    questions: [
      {
        question: 'Quem é DJ Zen Eyer?',
        answer: 'DJ Zen Eyer (Marcelo Fernandes) é um <strong>DJ brasileiro especializado em Zouk Brasileiro</strong>, bicampeão mundial no gênero (2022) e membro da Mensa International. Com mais de 10 anos de experiência, já se apresentou em <strong>100+ eventos em 11 países</strong>, incluindo Holanda, Espanha e Alemanha. Seu estilo único, chamado de "<strong>cremosidade</strong>", combina técnica apurada com emoção profunda, criando sets que são verdadeiras jornadas musicais para dançarinos de Zouk.'
      },
      {
        question: 'Quais prêmios DJ Zen Eyer já ganhou?',
        answer: 'DJ Zen Eyer é <strong>bicampeão mundial de Zouk Brasileiro</strong> (2022), tendo vencido nas categorias <strong>Melhor Performance</strong> e <strong>Melhor Remix</strong> no Campeonato Mundial. Esses prêmios internacionais avaliam técnica, seleção musical e conexão com o público, consolidando sua posição como um dos principais DJs do gênero globalmente. Seus títulos estão documentados em plataformas como <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Wikidata</a> e <a href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">MusicBrainz</a>.'
      },
      {
        question: 'Como contratar DJ Zen Eyer para meu evento?',
        answer: 'Para contratar DJ Zen Eyer, envie uma mensagem pelo <a href="https://wa.me/5521987413091" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">WhatsApp</a> ou email para <a href="mailto:booking@djzeneyer.com" class="text-primary hover:underline">booking@djzeneyer.com</a> com: data, local, tipo de evento e público esperado. DJ Zen Eyer está disponível para festivais, congressos e eventos privados, com experiência em <strong>11 países</strong> e mais de 100 apresentações internacionais.'
      },
      {
        question: 'O que torna DJ Zen Eyer único como DJ de Zouk Brasileiro?',
        answer: 'DJ Zen Eyer se destaca por ser <strong>ao mesmo tempo DJ e produtor musical</strong>, criando remixes exclusivos para o floor de Zouk. Como membro da Mensa International, aplica <strong>pensamento analítico</strong> à composição musical, resultando em sets que equilibram técnica e emoção. Seu título de bicampeão mundial valida sua maestria, enquanto sua experiência internacional em 11 países lhe dá entendimento profundo das comunidades de Zouk globais.'
      },
      {
        question: 'Onde DJ Zen Eyer já se apresentou internacionalmente?',
        answer: 'DJ Zen Eyer já se apresentou em <strong>11 países</strong>, incluindo: <strong>Brasil</strong>, <strong>Holanda</strong> (ZoukFest Europe), <strong>Espanha</strong> (Brazilian Zouk Congress), <strong>República Tcheca</strong> (International Zouk Week), <strong>Alemanha</strong> (Zouk Summer Fest) e <strong>Portugal</strong>. Como bicampeão mundial, é frequentemente convidado como headline DJ em congressos internacionais de Zouk.'
      }
    ]
  },
  {
    category: 'about',
    icon: <Music size={24} />,
    title: 'Sobre Zouk Brasileiro',
    questions: [
      {
        question: 'O que é Zouk Brasileiro?',
        answer: 'Zouk Brasileiro é um estilo de dança de salão que surgiu no Brasil nos anos 1990, evoluindo da Lambada. Caracteriza-se por <strong>movimentos fluidos</strong>, <strong>ondulações corporais</strong> e conexão profunda entre parceiros. DJ Zen Eyer é especializado em produzir e mixar música para Zouk Brasileiro, unindo elementos eletrônicos modernos às raízes tradicionais do gênero.'
      }
    ]
  },
  {
    category: 'music',
    icon: <Users size={24} />,
    title: 'Música e Comunidade',
    questions: [
      {
        question: 'Onde posso ouvir as músicas de DJ Zen Eyer?',
        answer: 'As músicas de DJ Zen Eyer estão disponíveis no <a href="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Spotify</a>, <a href="https://music.apple.com/us/artist/zen-eyer/1439280950" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Apple Music</a> e <a href="https://www.youtube.com/@djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">YouTube</a>. Membros da Tribo Zen têm acesso antecipado a novas músicas e remixes exclusivos.'
      }
    ]
  },
  {
    category: 'collaboration',
    icon: <Globe size={24} />,
    title: 'Colaborações e Carreira',
    questions: [
      {
        question: 'Posso colaborar com DJ Zen Eyer em um projeto musical?',
        answer: 'Sim! DJ Zen Eyer está aberto a colaborações com artistas que compartilham a paixão pelo Zouk Brasileiro. Entre em contato pelo <a href="mailto:booking@djzeneyer.com" class="text-primary hover:underline">email</a> ou <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Instagram</a> com detalhes sobre sua proposta.'
      }
    ]
  }
];

/**
 * Schema.org FAQPage
 */
const FAQ_PAGE_SCHEMA = {
  "@type": "FAQPage",
  "@id": "https://djzeneyer.com/faq#faqpage",
  "mainEntity": FAQ_DATA.flatMap(category =>
    category.questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer.replace(/<[^>]*>/g, '')
      }
    }))
  )
};

/**
 * Schema.org BreadcrumbList
 */
const BREADCRUMB_SCHEMA = {
  "@type": "BreadcrumbList",
  "@id": "https://djzeneyer.com/faq#breadcrumb",
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
      "item": "https://djzeneyer.com/faq"
    }
  ]
};

/**
 * Schema agregado (FAQPage + Breadcrumb)
 */
const COMBINED_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [FAQ_PAGE_SCHEMA, BREADCRUMB_SCHEMA]
};

// ============================================================================
// COMPONENTE FAQITEM (MEMOIZADO)
// ============================================================================
const FAQItem = memo<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}>(({ question, answer, isOpen, onToggle }) => (
  <motion.div
    className="bg-surface/50 rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/80 transition-colors"
      aria-expanded={isOpen}
    >
      <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="text-primary" size={24} />
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
            className="px-6 pb-6 text-white/80 leading-relaxed" 
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // URLs para hrefLang (SSOT)
  const currentPath = '/faq';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  return (
    <>
      {/* ====================================================================== */}
      {/* HEADLESS SEO (PADRÃO SSOT CORRETO) */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title="FAQ - DJ Zen Eyer | Perguntas Frequentes sobre Zouk Brasileiro e Bookings"
        description="Respostas para perguntas frequentes sobre DJ Zen Eyer: como contratar, prêmios, Zouk Brasileiro, equipamentos e a comunidade Tribo Zen."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-faq-og.jpg"
        ogType="website"
        schema={COMBINED_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="DJ Zen Eyer, Zouk Brasileiro, bicampeão mundial, como contratar DJ, prêmios DJ Zen Eyer, Tribo Zen, equipamentos DJ, festivais de Zouk"
      />

      {/* ====================================================================== */}
      {/* CONTEÚDO DA PÁGINA */}
      {/* ====================================================================== */}
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <HelpCircle className="inline-block mr-2" size={16} />
                PERGUNTAS FREQUENTES
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6">
              Tudo sobre <span className="text-primary">DJ Zen Eyer</span> e Zouk Brasileiro
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">
              Respostas para as dúvidas mais comuns sobre o bicampeão mundial de Zouk Brasileiro
            </p>
            
            <div className="flex items-center justify-center gap-3 text-sm text-white/60">
              <Brain size={16} className="text-primary" />
              <span>Respostas por DJ Zen Eyer (Bicampeão Mundial 2022 | Membro Mensa)</span>
            </div>
          </motion.div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-12">
            {FAQ_DATA.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-black font-display">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => {
                    const globalIndex = FAQ_DATA
                      .slice(0, categoryIndex)
                      .reduce((acc, cat) => acc + cat.questions.length, 0) + itemIndex;
                    
                    return (
                      <FAQItem
                        key={itemIndex}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === globalIndex}
                        onToggle={() => handleToggle(globalIndex)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30 max-w-3xl mx-auto">
              <h2 className="text-3xl font-black font-display mb-4">
                Ainda tem dúvidas?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Entre em contato diretamente ou junte-se à Tribo Zen para acesso exclusivo
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:booking@djzeneyer.com"
                  className="btn btn-primary btn-lg"
                >
                  Contatar DJ Zen Eyer
                </a>
                <a
                  href="/zentribe"
                  className="btn btn-outline btn-lg"
                >
                  Junte-se à Tribo Zen
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;