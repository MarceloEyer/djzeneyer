// src/pages/AboutPage.tsx - VERSÃO FINAL HEADLESS E OTIMIZADA

import React, { memo } from 'react';
import { motion } from 'framer-motion';
// IMPORTAÇÃO CRÍTICA: Componente SEO centralizado
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import {
  Award,
  Music2,
  Globe,
  Heart,
  Brain,
  Trophy,
  Users,
  Star,
  Sparkles,
  Mail as Envelope // Corrigido: Usando Envelope do lucide-react
} from 'lucide-react';

// ============================================================================
// CONSTANTES DE DADOS (MOVIDAS PARA FORA DO COMPONENTE PRINCIPAL)
// ============================================================================

// 1. SCHEMA.ORG (Person)
const SCHEMA_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Zen Eyer",
  "alternateName": ["DJ Zen Eyer", "Marcelo Eyer Fernandes"],
  "jobTitle": "DJ e Produtor Musical de Zouk Brasileiro",
  "description": "Conheça a história pessoal de Zen Eyer, DJ brasileiro de Zouk Brasileiro, sua jornada artística, filosofia e conexão emocional com a música. Bicampeão mundial (2022) e membro da Mensa International, Zen Eyer compartilha aqui sua visão íntima sobre a arte de criar sets 'cremosos' que tocam a alma dos dançarinos.",
  "url": "https://djzeneyer.com/about",
  "image": "https://djzeneyer.com/images/zen-eyer-about.jpg",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q136551855",
    "https://instagram.com/djzeneyer",
    "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Mensa International",
    "description": "Sociedade para pessoas com QI elevado (top 2% da população).",
    "url": "https://www.mensa.org"
  },
  "award": [
    {
      "@type": "Award",
      "name": "Bicampeão Mundial de Zouk Brasileiro",
      "description": "Vencedor nas categorias Melhor Performance e Melhor Remix (2022).",
      "datePublished": "2022"
    }
  ],
  "knowsAbout": [
    "Brazilian Zouk",
    "Conexão emocional através da música",
    "Produção musical para dança",
    "Filosofia de sets 'cremosos'"
  ]
};

// 2. Dados para timeline (milestones)
const MILESTONES = [
  {
    year: "2005-2010",
    title: "Primeiros Passos",
    description: "Descobriu a paixão pela música aos 15 anos, influenciado pela cultura brasileira e ritmos caribenhos. Começou a explorar equipamentos de DJ e produção musical em Niterói, RJ.",
    icon: <Heart className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-br from-red-500 to-pink-600"
  },
  {
    year: "2012",
    title: "Encontro com o Zouk",
    description: "Teve seu primeiro contato com o Zouk Brasileiro em uma festa local. Foi amor à primeira vista: 'Era como se a música falasse diretamente à minha alma', lembra Zen Eyer.",
    icon: <Music2 className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-br from-purple-500 to-indigo-600"
  },
  {
    year: "2015-2019",
    title: "Dedicação Total",
    description: "Deixou seu emprego corporativo para se dedicar 100% à música. Passou anos estudando técnicas de DJ, produção musical e a psicologia por trás das pistas de dança.",
    icon: <Brain className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600"
  },
  {
    year: "2022",
    title: "Consagração Mundial",
    description: "Conquistou o bicampeonato mundial de Zouk Brasileiro, provando que sua abordagem emocional e técnica era única. 'Foi a realização de um sonho de infância', conta.",
    icon: <Trophy className="w-8 h-8 text-white" />,
    color: "bg-gradient-to-br from-yellow-500 to-amber-600"
  }
];

// 3. Estatísticas
const ACHIEVEMENTS_DATA = [
  { label: "Anos de paixão", value: "15+", icon: <Heart className="w-8 h-8 mx-auto mb-4 text-primary" /> },
  { label: "Eventos íntimos", value: "200+", icon: <Users className="w-8 h-8 mx-auto mb-4 text-primary" /> },
  { label: "Histórias compartilhadas", value: "10K+", icon: <Globe className="w-8 h-8 mx-auto mb-4 text-primary" /> },
  { label: "Sorrisos criados", value: "∞", icon: <Star className="w-8 h-8 mx-auto mb-4 text-primary" /> }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const AboutPage: React.FC = () => {
  // URLs para hrefLang (SSOT)
  const currentPath = '/about';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  return (
    <>
      {/* 🎯 HEADLESSEO: Centraliza SEO, Hreflang e Schema */}
      <HeadlessSEO
        title="Sobre Zen Eyer | A História Por Trás da Música"
        description="Conheça a jornada pessoal de Zen Eyer: de Niterói para o mundo, a filosofia por trás dos sets 'cremosos' e a paixão que move sua música. Uma história de conexão, emoção e dedicação ao Zouk Brasileiro."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-about-emotional.jpg"
        ogType="profile" 
        schema={SCHEMA_DATA} // Schema de Pessoa/Prêmios
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')} // HREFLANG via SSOT
      />

      {/* SEU DESIGN ORIGINAL PRESERVADO */}
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        {/* Hero Section - Contém o H1 */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-surface/10 to-accent/10 blur-3xl" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block mb-4"
              >
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  MINHA HISTÓRIA
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                A <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text">Jornada</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Da paixão pela música à conexão com milhares de almas através do Zouk Brasileiro
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Focado em conexão humana */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ACHIEVEMENTS_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface/50 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all"
                >
                  {item.icon}
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {item.value}
                  </div>
                  <div className="text-white/60 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section - História pessoal e emocional */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-white/80 leading-relaxed"
            >
              <p>
                Tudo começou em <strong>Niterói, RJ</strong>, onde um jovem Marcelo Eyer Fernandes descobriu que a música poderia ser mais do que som: poderia ser <strong>emoção pura</strong>. Aos 15 anos, enquanto seus amigos ouviam rock e pop, ele se perdia nos ritmos caribenhos e brasileiros que encontrava em velhas fitas cassete de seu pai.
              </p>

              <p>
                O encontro com o <strong>Zouk Brasileiro</strong> foi um divisor de águas. 'Lembro como se fosse hoje', conta Zen Eyer. 'Era 2012, uma festa pequena em Copacabana. Quando ouvi aquele som suave mas pulsante, senti que tinha encontrado minha linguagem.' Aquela noite mudou tudo: ele vendeu seu primeiro equipamento de DJ com o dinheiro que juntou trabalhando em um bar.
              </p>

              <p>
                Os anos seguintes foram de <strong>dedicação obsessiva</strong>. Enquanto trabalhava durante o dia, passava noites estudando técnicas de mixagem, teoria musical e, acima de tudo, <strong>como fazer as pessoas sentirem</strong> através da música. 'Não queria ser apenas mais um DJ. Queria criar momentos onde as pessoas se esquecessem de tudo e apenas sentissem', explica.
              </p>

              <p>
                A consagração veio em <strong>2022</strong>, quando se tornou <strong>bicampeão mundial</strong> de Zouk Brasileiro. Mas o que mais o orgulha não são os troféus, e sim as <strong>histórias que coleciona</strong>: o casal que se reconectou em um de seus sets, a jovem que superou a timidez dançando ao som de suas músicas, os amigos que se abraçaram chorando em meio à pista.
              </p>

              <p>
                Hoje, Zen Eyer é conhecido por sua <strong>'cremosidade'</strong> - um estilo que une técnica impecável com uma sensibilidade rara. 'Cada set que faço é como uma conversa íntima com quem está dançando. Quero que saiam da pista sentindo que viveram algo único', confessa.
              </p>

              <p className="text-primary font-semibold">
                Sua missão vai além da música: 'Quero que as pessoas lembre que são capazes de sentir profundamente, de se conectar, de serem vulneráveis. O Zouk Brasileiro é apenas a trilha sonora para isso.'
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section - Marcos pessoais */}
        <section className="py-20 px-4 bg-surface/30">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              Momentos que <span className="text-gradient">Mudaram Tudo</span>
            </motion.h2>

            <div className="space-y-12">
              {MILESTONES.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="card p-6 md:p-8 hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full ${milestone.color} flex items-center justify-center`}>
                        {milestone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-primary font-bold mb-2">{milestone.year}</div>
                        <h3 className="text-2xl font-display font-bold mb-3">{milestone.title}</h3>
                        <p className="text-white/70 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Section - Filosofia íntima */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="card p-8 md:p-12 text-center bg-surface/50 rounded-2xl border border-white/10"
            >
              <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Minha <span className="text-gradient">Filosofia</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed italic">
                "A música é minha forma de criar um espaço seguro onde as pessoas podem ser quem realmente são.
                Não toca só os ouvidos - toca a alma. Cada batida, cada transição, cada silêncio é pensado para
                que alguém na pista sinta: 'Isso é sobre mim. Isso é para mim.'"
              </p>
              <div className="mt-8 text-white/60 font-semibold">— Zen Eyer</div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Convite para conexão */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-10 md:p-12 border border-primary/30 text-center"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Vamos <span className="text-gradient">Conversar?</span>
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Se você se identificou com essa história ou quer saber mais sobre a filosofia por trás da minha música,
                adoro conhecer pessoas que também acreditam no poder da conexão através da arte.
              </p>
              <motion.a
                href="/contact"
                className="btn btn-primary btn-lg inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Envelope className="w-5 h-5" />  {/* Corrigido: Usando Envelope */}
                Compartilhe Sua História
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};
export default AboutPage;