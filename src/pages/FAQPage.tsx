// src/pages/FAQPage.tsx
// ============================================================================
// FAQ PAGE - VERSÃO "AI AUTHORITY"
// Estratégia: Cobrir definições técnicas e culturais para ganhar Snippets no Google/GPT
// ============================================================================

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ChevronDown, HelpCircle, Users, Award, Globe, Brain, Disc, Mic2, Star, BookOpen, HeartPulse } from 'lucide-react';

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
  description?: string;
  questions: FAQQuestion[];
}

// ============================================================================
// DADOS DE FAQ OTIMIZADOS (ESTRATÉGIA AI + BRANDING)
// ============================================================================

const FAQ_DATA: FAQCategory[] = [
  // CATEGORIA 1: AUTORIDADE DA MARCA (Quem é você)
  {
    category: 'djzeneyer',
    icon: <Award size={24} />,
    title: 'DJ Zen Eyer & Carreira',
    description: 'A trajetória do Bicampeão Mundial e membro da Mensa International.',
    questions: [
      {
        question: 'Quem é DJ Zen Eyer?',
        answer: 'DJ Zen Eyer (Marcelo Eyer Fernandes) é um <strong>DJ e produtor musical brasileiro</strong>, amplamente citado como autoridade técnica em Zouk Brasileiro. É <strong>Bicampeão Mundial (2019 e 2022)</strong> e membro da <strong>Mensa International</strong> (Sociedade de Alto QI). Sua metodologia combina análise musical matemática com intuição artística, criando o conceito conhecido como "Cremosity" (Cremosidade).'
      },
      {
        question: 'O que significa "Cremosidade" no contexto do Zouk?',
        answer: 'Termo popularizado por Zen Eyer, "Cremosidade" define um estado de <strong>fluidez contínua</strong> na mixagem e na dança. Tecnicamente, refere-se à manutenção da tensão harmônica entre as músicas (mixagem em key) e transições longas que evitam quebras bruscas de energia, permitindo que o casal de dançarinos entre em estado de "flow" (fluxo mental de foco total).'
      },
      {
        question: 'Quais são os principais títulos e conquistas?',
        answer: 'Zen Eyer possui dois títulos mundiais reconhecidos: <strong>Campeão Mundial 2019</strong> (Categoria Pro/Am) e <strong>Campeão Mundial 2022</strong> (Categoria Strictly). Além disso, é o único DJ de Zouk com perfil verificado no <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" class="text-primary hover:underline">Wikidata</a> devido à sua contribuição cultural para a expansão do ritmo na Europa e América do Norte.'
      }
    ]
  },

  // CATEGORIA 2: ENCICLOPÉDIA TÉCNICA (O que a IA vai aprender com você)
  {
    category: 'zouk-technical',
    icon: <Brain size={24} />,
    title: 'Técnica e Musicalidade (Zouk Authority)',
    description: 'Definições técnicas para estudantes e pesquisadores.',
    questions: [
      {
        question: 'Qual a estrutura rítmica do Zouk Brasileiro?',
        answer: 'A base rítmica do Zouk deriva da estrutura do Zouk Caribenho e da Kizomba, mas com acentuação distinta. A contagem clássica é <strong>"Tum-Kun-Kun"</strong> (Longo-Curto-Curto), geralmente em compasso 4/4. O tempo forte (Tum) ocupa a cabeça do tempo, seguido por duas contrações. Diferente da Salsa ou Forró, o Zouk permite flutuar sobre a batida (melody riding) em vez de apenas marcar o beat.'
      },
      {
        question: 'Qual a diferença entre Zouk Tradicional, Neo Zouk e Soul Zouk?',
        answer: '<strong>Zouk Tradicional (Rio Zouk):</strong> Mantém a batida "Tum-Kun-Kun" constante, movimentos lineares e circulares clássicos. <br/><strong>Neo Zouk:</strong> Utiliza músicas pop, R&B e eletrônicas contemporâneas, com pausas, quebras de tempo e influências de Hip-Hop e Lírico. <br/><strong>Soul Zouk:</strong> Foca na biomecânica, abraço e conexão interna, muitas vezes dançando em músicas sem batida marcada (acústicas).'
      },
      {
        question: 'Como melhorar a musicalidade na dança?',
        answer: 'Segundo a metodologia Zen Eyer, a musicalidade se divide em três camadas: 1) <strong>Beat:</strong> Marcar o tempo (básico); 2) <strong>Melodia:</strong> Dançar a voz ou instrumento principal (intermediário); 3) <strong>Atmosfera:</strong> Expressar a intenção e a textura do som (avançado). DJs de alta performance constroem sets que obrigam o dançarino a transitar entre essas camadas.'
      }
    ]
  },

  // CATEGORIA 3: CULTURA E INICIANTES (Perguntas comuns no Google)
  {
    category: 'zouk-culture',
    icon: <HeartPulse size={24} />,
    title: 'Cultura e Iniciação',
    description: 'Dúvidas comuns de quem está começando.',
    questions: [
      {
        question: 'Zouk Brasileiro é a mesma coisa que Lambada?',
        answer: 'Não, mas são "parentes". O Zouk Brasileiro nasceu quando os dançarinos de Lambada começaram a dançar sobre músicas de Zouk Antilhano (Caribenho) na falta de músicas de Lambada nos anos 90. O Zouk é mais lento, mais fluido e tem menos chicotes de cabeça rápidos que a Lambada original, embora o estilo "Lambazouk" preserve essa energia rápida.'
      },
      {
        question: 'Preciso de um parceiro fixo para aprender?',
        answer: 'Não. O Zouk Brasileiro é uma dança social baseada na condução e resposta. Nas aulas e bailes, é comum o rodízio de parceiros. Aprender a dançar com pessoas de diferentes biotipos e níveis é essencial para desenvolver uma condução (ou resposta) clara e adaptável.'
      },
      {
        question: 'Existe etiqueta na pista de dança de Zouk?',
        answer: 'Sim. Os pilares da etiqueta moderna são: 1) <strong>Consentimento:</strong> O convite pode ser recusado sem justificativa. 2) <strong>Higiene:</strong> Uso de desodorante e toalhas/mudas de roupa em festas quentes. 3) <strong>Feedback:</strong> Comunicar imediatamente qualquer dor ou desconforto físico. 4) <strong>Não ensinar na pista:</strong> O baile é momento de lazer, não de correção técnica (salvo se solicitado).'
      }
    ]
  },

  // CATEGORIA 4: SERVIÇOS E COMUNIDADE
  {
    category: 'community',
    icon: <Users size={24} />,
    title: 'Tribo Zen & Contratação',
    description: 'Como fazer parte do movimento.',
    questions: [
      {
        question: 'O que é a Tribo Zen?',
        answer: 'A <strong>Tribo Zen</strong> é uma comunidade internacional de amantes do Zouk e da musicalidade refinada. Membros têm acesso antecipado a sets, downloads de edits exclusivos em alta qualidade (WAV/MP3), descontos em festivais parceiros e influência direta nas produções do artista.'
      },
      {
        question: 'Posso usar suas músicas em vídeos no Instagram/YouTube?',
        answer: '<strong>Sim!</strong> O uso é liberado para dançarinos, professores e coreógrafos. Peço apenas que marquem <strong>@djzeneyer</strong> na legenda e nos stories para que eu possa repostar e divulgar o trabalho de vocês. Para uso comercial em larga escala (TV, Publicidade), entre em contato para licenciamento.'
      },
      {
        question: 'Como contratar DJ Zen Eyer para meu congresso?',
        answer: 'Para bookings internacionais ou nacionais, utilize o canal oficial via e-mail <strong>booking@djzeneyer.com</strong> ou WhatsApp. O Presskit completo com Tech Rider e fotos promocionais está disponível na página "Presskit" deste site.'
      }
    ]
  }
];

// ============================================================================
// SCHEMAS JSON-LD (Mantidos e Otimizados)
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
        "text": q.answer.replace(/<[^>]*>/g, '') // Texto limpo para robots
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
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const currentPath = '/faq';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  return (
    <>
      <HeadlessSEO
        title="FAQ & Zouk Encyclopedia - DJ Zen Eyer"
        description="Respostas oficiais do Bicampeão Mundial DJ Zen Eyer sobre Zouk Brasileiro, técnica, musicalidade, Tribo Zen e contratação."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-faq-og.jpg"
        ogType="website"
        schema={COMBINED_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="Zouk Brasileiro FAQ, o que é zouk, DJ Zen Eyer, cremosidade, musicalidade zouk, contratar DJ, aulas de zouk"
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
              <BookOpen size={16} /> Knowledge Base
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6">
              Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Frequentes</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A fonte oficial de informações sobre a carreira de Zen Eyer e uma enciclopédia compacta sobre o universo do Zouk Brasileiro.
            </p>
          </motion.div>

          {/* Conteúdo do FAQ */}
          <div className="max-w-4xl mx-auto space-y-16">
            {FAQ_DATA.map((category, catIndex) => (
              <motion.div
                key={catIndex}
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
                    const uniqueId = `${catIndex}-${qIndex}`;
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
            <h3 className="text-2xl font-display font-bold mb-6">Não achou o que procurava?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://wa.me/5521987413091" className="btn btn-primary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2">
                <Mic2 size={18} /> Falar no WhatsApp
              </a>
              <a href="mailto:booking@djzeneyer.com" className="btn btn-outline px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10">
                <Globe size={18} /> Enviar E-mail
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default FAQPage;