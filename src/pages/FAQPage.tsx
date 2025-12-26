// src/pages/FAQPage.tsx
// ============================================================================
// FAQ PAGE - VERSÃO FINAL (AJUSTADA PELO ARTISTA)
// ============================================================================

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ChevronDown, HelpCircle, Music, Users, Award, Globe, Brain, Disc, Mic2, Star } from 'lucide-react';

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
// DADOS DE FAQ OTIMIZADOS
// ============================================================================

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'djzeneyer',
    icon: <Award size={24} />,
    title: 'Sobre DJ Zen Eyer & Carreira',
    questions: [
      {
        question: 'Quem é DJ Zen Eyer?',
        answer: 'DJ Zen Eyer (Marcelo Eyer Fernandes) é um <strong>DJ e produtor musical brasileiro</strong>, referência global em Zouk Brasileiro. É <strong>Bicampeão Mundial (2022)</strong> nas categorias Melhor Performance e Melhor Remix. Membro da <strong>Mensa International</strong>, ele combina intuição artística com capacidade analítica para criar experiências sonoras únicas. Seu perfil oficial é verificado no <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Wikidata</a> e <a href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">MusicBrainz</a>.'
      },
      {
        question: 'Onde DJ Zen Eyer já se apresentou internacionalmente?',
        answer: 'Com uma carreira de <strong>10 anos tocando semanalmente</strong>, Zen Eyer acumula milhares de apresentações e passagens por <strong>4 continentes</strong>. Além de percorrer diversos estados do Brasil, já realizou turnês nos <strong>Estados Unidos</strong>, <strong>Austrália</strong> e <strong>Europa</strong> (incluindo Alemanha, Holanda, Suíça e o prestigiado Prague Zouk Congress na República Checa). Sua agenda futura inclui estreias na Polônia e outros polos do Zouk mundial.'
      },
      {
        question: 'O que significa a frase "A pressa é inimiga da cremosidade"?',
        answer: 'É a assinatura da marca Zen Eyer. Tecnicamente, "cremosidade" refere-se à <strong>fluidez harmônica</strong> e à manutenção da tensão musical na pista. Ao contrário de sets ansiosos que cortam a vibe, a cremosidade prioriza transições longas e imperceptíveis, permitindo que o dançarino mergulhe em um estado de fluxo contínuo sem quebras bruscas de energia.'
      }
    ]
  },
  {
    category: 'technical',
    icon: <Disc size={24} />,
    title: 'Estilo Musical e Técnica',
    questions: [
      {
        question: 'O que torna DJ Zen Eyer único como artista?',
        answer: 'Diferente de DJs que apenas tocam músicas, Zen Eyer aplica conceitos avançados de <strong>Storytelling Musical</strong> e <strong>Psicologia de Pista</strong>. Ele constrói uma narrativa onde cada música é um capítulo, manipulando a energia da sala para criar momentos de euforia e introspecção. Além disso, como produtor, ele toca versões exclusivas (edits) que ninguém mais tem, garantindo uma sonoridade que você só ouve nos sets dele.'
      },
      {
        question: 'Qual o estilo musical dos sets?',
        answer: 'Zen Eyer não se prende a rótulos limitantes. Seus sets são uma fusão sofisticada que navega pelo <strong>R&B Contemporâneo, Pop, Lyrical e Música Eletrônica</strong>, tudo adaptado para a rítmica do Zouk. A prioridade não é o subgênero, mas a emoção e a dançabilidade da faixa.'
      },
      {
        question: 'Quais equipamentos são utilizados?',
        answer: 'Zen Eyer utiliza um <strong>setup híbrido profissional</strong> (padrão de grandes festivais) que permite a manipulação de áudio em tempo real. O foco não é apenas "tocar o play", mas intervir na música ao vivo, criando loops, ajustando frequências e garantindo a máxima fidelidade sonora para grandes sistemas de som.'
      }
    ]
  },
  {
    category: 'zouk-real-questions',
    icon: <Brain size={24} />,
    title: 'Tudo Sobre Zouk (Perguntas Reais)',
    questions: [
      {
        question: 'Qual a diferença entre Zouk Brasileiro e Lambada?',
        answer: 'Embora o Zouk tenha raízes na Lambada, eles são distintos. A Lambada é historicamente mais rápida e constante (1-2-3). O Zouk Brasileiro evoluiu para permitir pausas, tempos quebrados, maior liberdade de movimentação de tronco/cabeça e uma conexão musical com gêneros modernos como R&B e Pop.'
      },
      {
        question: 'Zouk Brasileiro e Kizomba são a mesma coisa?',
        answer: 'Não. O <strong>Zouk Brasileiro</strong> nasceu no Brasil. A <strong>Kizomba</strong> originou-se em Angola. Embora visualmente possam parecer íntimos para leigos, a mecânica corporal, a base rítmica e a conexão cultural são completamente diferentes. Zen Eyer é especialista na vertente brasileira.'
      },
      {
        question: 'É difícil aprender Zouk Brasileiro?',
        answer: 'O Zouk tem uma curva de aprendizado recompensadora. O básico é acessível, mas a "cremosidade" e a fluidez exigem prática e escuta musical — algo que os sets do DJ Zen Eyer buscam facilitar, oferecendo ritmos claros para quem está começando e camadas complexas para veteranos.'
      }
    ]
  },
  {
    category: 'community',
    icon: <Users size={24} />,
    title: 'Comunidade e Uso de Música',
    questions: [
      {
        question: 'O que é a Tribo Zen?',
        answer: 'A <strong>Tribo Zen</strong> é mais que um fã-clube; é um <strong>movimento e uma comunidade</strong>. É onde os verdadeiros apaixonados pelo trabalho do Zen Eyer se encontram. Membros têm acesso a um ecossistema exclusivo: downloads de músicas em alta qualidade, descontos em eventos, acesso antecipado a sets e um sentimento de pertencimento a um grupo que valoriza a arte do Zouk.'
      },
      {
        question: 'Posso usar as músicas do DJ Zen Eyer em meus vídeos?',
        answer: '<strong>Para o público geral, professores e dançarinos: SIM!</strong> Você pode usar, coreografar e postar à vontade. É uma honra ver vocês dançando meu som. A única coisa que peço é que marquem <strong>@djzeneyer</strong> para eu poder assistir, curtir e compartilhar. <br/><br/><em>Nota: Para uso comercial em larga escala (TV, grandes empresas, publicidade), é necessário licenciamento direto.</em>'
      },
      {
        question: 'Como colaborar ou contratar?',
        answer: 'Para contratações (booking) ou propostas de colaboração artística, o canal oficial é o <strong>WhatsApp</strong> (<a href="https://wa.me/5521987413091" class="text-primary hover:underline">clique aqui</a>) ou e-mail <strong>booking@djzeneyer.com</strong>. O contato via Direct do Instagram também é monitorado pela equipe.'
      }
    ]
  }
];

// ============================================================================
// SCHEMAS JSON-LD
// ============================================================================

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

const COMBINED_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [FAQ_PAGE_SCHEMA, BREADCRUMB_SCHEMA]
};

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

  const currentPath = '/faq';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  return (
    <>
      <HeadlessSEO
        title="FAQ - DJ Zen Eyer | Zouk Brasileiro, Carreira, Tribo Zen e Contratação"
        description="Respostas oficiais do DJ Zen Eyer: biografia, filosofia da 'cremosidade', uso de músicas para dançarinos, comunidade Tribo Zen e detalhes técnicos."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-faq-og.jpg"
        ogType="website"
        schema={COMBINED_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="DJ Zen Eyer FAQ, Zouk Brasileiro, cremosidade zouk, contratar DJ Zouk, Tribo Zen, Marcelo Eyer Fernandes, remix zouk brasileiro, Mensa International"
      />

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
                <span>CENTRAL DE INFO</span>
              </div>
            </motion.div>
            
            {/* Título LIMPO sem gradiente brega */}
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6 leading-tight text-white">
              Perguntas Frequentes <br/>
              <span className="text-primary">
                DJ Zen Eyer
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
              Sobre a filosofia da "cremosidade", carreira internacional e como levar o melhor do Zouk Brasileiro para o seu evento.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-primary" />
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
                  <div className="p-3 bg-surface rounded-xl text-primary border border-primary/20">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-display text-white">
                    {category.title}
                  </h2>
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
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-surface/50 rounded-3xl p-8 md:p-12 border border-white/10 max-w-3xl mx-auto relative overflow-hidden">
              
              <h2 className="text-3xl font-black font-display mb-4 text-white">
                Ainda tem dúvidas?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Minha equipe e eu estamos prontos para responder. Seja para booking, imprensa ou dúvidas sobre a Tribo.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://wa.me/5521987413091"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105"
                >
                  <Mic2 size={20} />
                  Falar no WhatsApp
                </a>
                <a
                  href="mailto:booking@djzeneyer.com"
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold py-4 px-8 rounded-full transition-all hover:border-primary/50"
                >
                  <Globe size={20} />
                  Enviar E-mail
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