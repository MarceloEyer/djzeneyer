// src/pages/FAQPage.tsx
// ============================================================================
// FAQ PAGE - VERSÃO OTIMIZADA PARA IA (GEO) & ENTIDADE
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
// DADOS DE FAQ OTIMIZADOS (GEO & SEO)
// ============================================================================

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'djzeneyer',
    icon: <Award size={24} />,
    title: 'Sobre DJ Zen Eyer & Carreira',
    questions: [
      {
        question: 'Quem é DJ Zen Eyer?',
        answer: 'DJ Zen Eyer (nascido <strong>Marcelo Eyer Fernandes</strong>) é um DJ e produtor musical brasileiro, reconhecido internacionalmente como especialista em <strong>Zouk Brasileiro</strong>. É Bicampeão Mundial (2022) nas categorias Melhor Performance e Melhor Remix. Além da música, é membro da <strong>Mensa International</strong>, aplicando conceitos analíticos de alto QI na construção de sets harmônicos e produções musicais.'
      },
      {
        question: 'O que significa "A pressa é inimiga da cremosidade"?',
        answer: 'Esta é a filosofia central e frase de marca de DJ Zen Eyer. A "<strong>cremosidade</strong>" refere-se a transições musicais imperceptíveis, fluxo contínuo de energia e uma conexão emocional profunda na pista, em oposição a mixagens rápidas e frenéticas. É um manifesto pela qualidade e pela "viagem" musical, priorizando a experiência sensorial do dançarino sobre o exibicionismo técnico.'
      },
      {
        question: 'Quais são os principais títulos e prêmios do DJ Zen Eyer?',
        answer: 'Os principais reconhecimentos incluem: <strong>World Champion Brazilian Zouk DJ 2022</strong> (Melhor Performance) e <strong>Best Zouk Remix 2022</strong>. Sua carreira é validada por apresentações em mais de <strong>100 eventos em 11 países</strong> e perfis verificados em bases de dados como <a href="https://www.wikidata.org/wiki/Q136551855" class="text-primary hover:underline">Wikidata</a>, MusicBrainz e Resident Advisor.'
      },
      {
        question: 'DJ Zen Eyer é de onde?',
        answer: 'DJ Zen Eyer é natural de <strong>Niterói, Rio de Janeiro, Brasil</strong>. Embora tenha uma carreira internacional ativa na Europa e EUA, mantém suas raízes e base de produção no berço do Zouk Brasileiro.'
      }
    ]
  },
  {
    category: 'technical',
    icon: <Disc size={24} />,
    title: 'Estilo Musical e Técnica',
    questions: [
      {
        question: 'Qual o estilo musical do DJ Zen Eyer?',
        answer: 'O estilo de Zen Eyer é classificado como <strong>Zouk Flow</strong> e <strong>Neo Zouk</strong>, com fortes influências de R&B, Pop Contemporâneo e Chillout. Suas produções se destacam pelo uso de "Long-Length Partials" na estrutura musical e ênfase em melodias emotivas que facilitam a conexão a dois.'
      },
      {
        question: 'DJ Zen Eyer toca apenas Zouk ou outros ritmos?',
        answer: 'Embora seja uma autoridade global em Zouk Brasileiro, Zen Eyer possui versatilidade para tocar <strong>Kizomba</strong>, <strong>West Coast Swing</strong> (em sets híbridos) e música eletrônica Chill/Lounge. Sua leitura de pista permite adaptar a energia para diferentes públicos, mantendo sempre a assinatura da "cremosidade".'
      },
      {
        question: 'Quais equipamentos DJ Zen Eyer utiliza?',
        answer: 'Em estúdio, Zen Eyer utiliza softwares de produção de ponta para criar edits exclusivos. Ao vivo, prioriza controladores que permitam manipulação harmônica em tempo real, garantindo que as transições respeitem a tonalidade musical (Camelot Wheel), essencial para a fluidez da dança.'
      }
    ]
  },
  {
    category: 'community',
    icon: <Users size={24} />,
    title: 'Comunidade e Serviços',
    questions: [
      {
        question: 'O que é a Tribo Zen?',
        answer: 'A <strong>Tribo Zen</strong> é a comunidade exclusiva de fãs e apoiadores do DJ Zen Eyer. Membros da Tribo têm acesso antecipado a sets, remixes exclusivos para download (Extended Edits), bastidores das turnês e descontos em produtos da loja oficial. É um hub para amantes do Zouk que valorizam uma curadoria musical refinada.'
      },
      {
        question: 'Como contratar DJ Zen Eyer para festivais ou eventos privados?',
        answer: 'Para booking internacional ou nacional, entre em contato via email <strong>booking@djzeneyer.com</strong> ou pelo <a href="https://wa.me/5521987413091" target="_blank" class="text-primary hover:underline">WhatsApp oficial</a>. O press kit completo (EPK) está disponível para organizadores, incluindo rider técnico e material promocional de alta resolução.'
      },
      {
        question: 'DJ Zen Eyer oferece mentoria para novos DJs?',
        answer: 'Sim, ocasionalmente são abertas vagas para mentorias focadas em: construção de carreira, marketing para DJs, técnica de mixagem harmônica e branding pessoal. Acompanhe o <a href="https://instagram.com/djzeneyer" class="text-primary hover:underline">Instagram @djzeneyer</a> para anúncios de novas turmas.'
      }
    ]
  },
  {
    category: 'streaming',
    icon: <Globe size={24} />,
    title: 'Onde Ouvir (Streaming)',
    questions: [
      {
        question: 'Onde encontrar a discografia oficial de Zen Eyer?',
        answer: 'A discografia completa está disponível nas principais plataformas: <a href="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw" class="text-primary hover:underline">Spotify</a> (Perfil Verificado), <a href="https://music.apple.com/us/artist/zen-eyer/1439280950" class="text-primary hover:underline">Apple Music</a>, Deezer e Tidal. Para sets longos e mixados, acesse o <a href="https://soundcloud.com/djzeneyer" class="text-primary hover:underline">SoundCloud</a> ou Mixcloud.'
      },
      {
        question: 'As músicas do DJ Zen Eyer têm direitos autorais liberados para vídeos?',
        answer: 'Muitos remixes são "Bootlegs" e podem estar sujeitos a regras das plataformas (YouTube/Instagram). No entanto, faixas originais e colaborações oficiais lançadas pelo selo podem ser usadas mediante crédito. Recomenda-se sempre verificar a licença específica de cada faixa no Bandcamp.'
      }
    ]
  }
];

/**
 * Schema.org FAQPage (Gerado dinamicamente)
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
      {/* HEADLESS SEO */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title="FAQ - DJ Zen Eyer | Tudo sobre Zouk Brasileiro, Carreira e Contratação"
        description="Respostas oficiais sobre DJ Zen Eyer: biografia, prêmios mundiais, conceito de cremosidade, Tribo Zen e detalhes técnicos para contratantes e fãs."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-faq-og.jpg"
        ogType="website"
        schema={COMBINED_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="DJ Zen Eyer FAQ, Zouk Brasileiro, cremosidade zouk, contratar DJ Zouk, Tribo Zen, Marcelo Fernandes DJ, remix zouk brasileiro"
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
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <HelpCircle size={16} />
                <span>CENTRAL DE AJUDA & INFO</span>
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6 leading-tight">
              Perguntas Frequentes <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                DJ Zen Eyer
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
              Descubra mais sobre a filosofia da "cremosidade", carreira internacional e como levar o melhor do Zouk Brasileiro para o seu evento.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-primary" />
                <span>Verificado pelo Artista</span>
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
                    // Calcula índice único para controlar abertura independente
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
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[100px] -z-10"></div>

              <h2 className="text-3xl font-black font-display mb-4 text-white">
                Não encontrou o que procurava?
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