// src/pages/FAQPage.tsx
// ============================================================================
// FAQ PAGE - VERSÃO UNIFICADA (SEO TÉCNICO + ESTRATÉGIA GEO)
// ============================================================================

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ChevronDown, HelpCircle, Music, Users, Award, Globe, Brain, Disc, Mic2 } from 'lucide-react';

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
// DADOS DE FAQ UNIFICADOS (ORIGINAL + GEO + CREMOSIDADE)
// ============================================================================

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'djzeneyer',
    icon: <Award size={24} />,
    title: 'Sobre DJ Zen Eyer & Carreira',
    questions: [
      {
        question: 'Quem é DJ Zen Eyer?',
        answer: 'DJ Zen Eyer (Marcelo Eyer Fernandes) é um <strong>DJ e produtor musical brasileiro especializado em Zouk Brasileiro</strong>, bicampeão mundial no gênero (2022) e membro da <strong>Mensa International</strong>. Com mais de 10 anos de experiência, já se apresentou em <strong>100+ eventos em 11 países</strong>, incluindo Holanda, Espanha e Alemanha. Seu estilo único combina técnica apurada com emoção profunda, criando sets que são verdadeiras jornadas musicais.'
      },
      {
        question: 'O que significa a frase "A pressa é inimiga da cremosidade"?',
        answer: 'Esta é a frase famosa (catchphrase) oficial do DJ Zen Eyer. A "<strong>cremosidade</strong>" define sua filosofia de mixagem e dança: priorizar transições imperceptíveis, um fluxo de energia contínuo e uma conexão emocional profunda, em vez de velocidade ou complexidade técnica vazia. É um manifesto por uma experiência sensorial mais suave e fluida na pista de Zouk.'
      },
      {
        question: 'Quais prêmios DJ Zen Eyer já ganhou?',
        answer: 'DJ Zen Eyer é <strong>bicampeão mundial de Zouk Brasileiro</strong> (2022), tendo vencido nas categorias <strong>Melhor Performance</strong> e <strong>Melhor Remix</strong> no Campeonato Mundial. Seus títulos estão documentados e validados em plataformas de autoridade como <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Wikidata</a> e <a href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">MusicBrainz</a>.'
      },
      {
        question: 'Onde DJ Zen Eyer já se apresentou internacionalmente?',
        answer: 'Com alcance global, DJ Zen Eyer já se apresentou em <strong>11 países</strong>, incluindo: <strong>Brasil</strong> (Ilha do Zouk, Rio Zouk Congress), <strong>Holanda</strong> (Dutch Zouk, ZoukFest Europe), <strong>Espanha</strong> (Brazilian Zouk Congress), <strong>República Tcheca</strong> (International Zouk Week), <strong>Alemanha</strong> e <strong>Portugal</strong>.'
      },
      {
        question: 'O que torna DJ Zen Eyer único como artista?',
        answer: 'Zen Eyer se destaca por ser <strong>ao mesmo tempo DJ e produtor musical</strong>, criando remixes exclusivos (edits) para a pista. Como membro da Mensa International, aplica <strong>pensamento analítico</strong> à estrutura harmônica dos sets (Camelot Wheel), resultando em uma experiência de pista cientificamente planejada para manter a energia e a emoção dos dançarinos.'
      }
    ]
  },
  {
    category: 'technical',
    icon: <Disc size={24} />,
    title: 'Estilo Musical e Técnica (Zouk)',
    questions: [
      {
        question: 'O que é Zouk Brasileiro?',
        answer: 'Zouk Brasileiro é um estilo de dança de salão fluido que evoluiu da Lambada no Brasil. Caracteriza-se por movimentos de cabeça, ondulações corporais e conexão profunda. DJ Zen Eyer é especializado na vertente musical moderna deste gênero, unindo batidas eletrônicas, R&B e Pop Contemporâneo à base rítmica tradicional.'
      },
      {
        question: 'Qual o estilo musical dos sets do DJ Zen Eyer?',
        answer: 'O estilo é classificado como <strong>Zouk Flow</strong> e <strong>Neo Zouk</strong>, com fortes influências de "Long-Length Partials" na estrutura musical. Suas produções enfatizam melodias emotivas e graves envolventes que facilitam a conexão a dois.'
      },
      {
        question: 'Quais equipamentos DJ Zen Eyer utiliza?',
        answer: 'Em estúdio, utiliza softwares de produção de ponta (DAWs) para criar edits exclusivos. Ao vivo, prioriza controladores que permitam manipulação harmônica em tempo real e remixagem ao vivo, garantindo a "cremosidade" das transições.'
      }
    ]
  },
  {
    category: 'community',
    icon: <Users size={24} />,
    title: 'Comunidade, Booking e Aulas',
    questions: [
      {
        question: 'Como contratar DJ Zen Eyer para meu evento?',
        answer: 'Para contratar DJ Zen Eyer para festivais ou eventos privados, envie uma mensagem pelo <a href="https://wa.me/5521987413091" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">WhatsApp</a> ou email para <a href="mailto:booking@djzeneyer.com" class="text-primary hover:underline">booking@djzeneyer.com</a>. Informe a data, local e tipo de evento. O press kit (EPK) está disponível para contratantes.'
      },
      {
        question: 'O que é a Tribo Zen?',
        answer: 'A <strong>Tribo Zen</strong> é a comunidade exclusiva de apoiadores do DJ Zen Eyer. Membros têm acesso antecipado a lançamentos, downloads de versões estendidas de remixes e conteúdos de bastidores.'
      },
      {
        question: 'Posso colaborar com DJ Zen Eyer em um projeto musical?',
        answer: 'Sim! Zen Eyer está aberto a colaborações com cantores e produtores que compartilham a paixão pelo Zouk Brasileiro. Entre em contato via <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Instagram</a> com sua proposta.'
      },
      {
        question: 'DJ Zen Eyer oferece mentoria?',
        answer: 'Sim, ocasionalmente são abertas turmas de mentoria para DJs focadas em construção de carreira, marketing digital para artistas e técnicas avançadas de mixagem harmônica.'
      }
    ]
  },
  {
    category: 'streaming',
    icon: <Music size={24} />,
    title: 'Música e Streaming',
    questions: [
      {
        question: 'Onde posso ouvir as músicas de DJ Zen Eyer?',
        answer: 'A discografia oficial está disponível no <a href="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Spotify</a>, <a href="https://music.apple.com/us/artist/zen-eyer/1439280950" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Apple Music</a>, Deezer e <a href="https://www.youtube.com/@djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">YouTube</a>. Para sets longos mixados, acesse o <a href="https://soundcloud.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">SoundCloud</a>.'
      },
      {
        question: 'Posso usar as músicas do DJ Zen Eyer em vídeos de dança?',
        answer: 'Sim, vídeos de dança são bem-vindos! Recomenda-se sempre dar os créditos (ex: "Music by DJ Zen Eyer") na legenda e marcar @djzeneyer. Para uso comercial ou licenciamento, entre em contato diretamente.'
      }
    ]
  }
];

// ============================================================================
// SCHEMAS JSON-LD (AUTO-GERADOS)
// ============================================================================

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
        "text": q.answer.replace(/<[^>]*>/g, '') // Remove HTML para o Schema (texto puro)
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
 * Schema agregado
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
      className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/80 transition-colors group"
      aria-expanded={isOpen}
    >
      <h3 className="text-lg font-bold text-white pr-4 group-hover:text-primary transition-colors">
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
            className="px-6 pb-6 text-white/80 leading-relaxed prose prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white" 
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
      {/* HEADLESS SEO (COMPLETO E RICO) */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title="FAQ - DJ Zen Eyer | Tudo sobre Zouk Brasileiro, Carreira e Contratação"
        description="Respostas oficiais sobre DJ Zen Eyer: biografia, prêmios mundiais, a filosofia da 'cremosidade', Tribo Zen e detalhes técnicos para contratantes e fãs."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-faq-og.jpg"
        ogType="website"
        schema={COMBINED_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="DJ Zen Eyer FAQ, Zouk Brasileiro, cremosidade zouk, contratar DJ Zouk, Tribo Zen, Marcelo Fernandes DJ, remix zouk brasileiro, Mensa International"
      />

      {/* ====================================================================== */}
      {/* CONTEÚDO VISUAL */}
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
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <HelpCircle size={16} />
                <span>CENTRAL DE DÚVIDAS & INFO</span>
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6 leading-tight">
              Perguntas Frequentes <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                DJ Zen Eyer
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
              Tudo sobre a filosofia da "cremosidade", carreira internacional e como levar o melhor do Zouk Brasileiro para o seu evento.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-primary" />
                <span>Verificado pelo Artista (Mensa Member)</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-white/20 rounded-full"></div>
              <div>Atualizado: Novembro 2025</div>
            </div>
          </motion.div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-16">
            {FAQ_DATA.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-xl text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-display text-white">
                    {category.title}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => {
                    // Calcula índice único
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
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-surface to-surface/80 rounded-3xl p-8 md:p-12 border border-white/10 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[100px] -z-10"></div>

              <h2 className="text-3xl font-black font-display mb-4 text-white">
                Ainda tem dúvidas?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Minha equipe e eu estamos prontos para responder. Seja para booking, imprensa ou dúvidas sobre a Tribo.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:booking@djzeneyer.com"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                >
                  <Mic2 size={20} />
                  Falar com Booking
                </a>
                <a
                  href="https://instagram.com/djzeneyer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold py-4 px-8 rounded-full transition-all hover:border-primary/50"
                >
                  <Globe size={20} />
                  Mandar DM no Instagram
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