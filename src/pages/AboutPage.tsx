// src/pages/AboutPage.tsx - VERSÃO FINAL CORRIGIDA
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Award,
  Music2,
  Globe,
  Heart,
  Brain,
  Trophy,
  PlayCircle,
  Radio,
  Database,
  ExternalLink,
  Users,
  Star,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

const AboutPage: React.FC = () => {
  // Schema.org otimizado para bots de busca e IA
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Zen Eyer",
    "alternateName": ["DJ Zen Eyer", "Marcelo Eyer Fernandes"],
    "jobTitle": "DJ e Produtor Musical Especializado em Zouk Brasileiro",
    "description": "DJ brasileiro bicampeão mundial de Zouk Brasileiro, produtor musical e membro da Mensa International. Especializado em criar sets 'cremosos' que unem emoção, técnica e conexão com a dança. Mais de 100 apresentações em 11 países e 500K+ streams globais.",
    "url": "https://djzeneyer.com/about",
    "image": "https://djzeneyer.com/images/zen-eyer-about.jpg",
    "sameAs": [
      "https://www.wikidata.org/wiki/Q136551855",
      "https://instagram.com/djzeneyer",
      "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
      "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
      "https://www.discogs.com/artist/16872046",
      "https://www.songkick.com/artists/8815204"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Mensa International",
      "url": "https://www.mensa.org"
    },
    "award": [
      {
        "@type": "Award",
        "name": "Bicampeão Mundial - Melhor Remix de Zouk",
        "description": "Vencedor na categoria Melhor Remix no Campeonato Mundial de Zouk Brasileiro (2022)",
        "datePublished": "2022"
      },
      {
        "@type": "Award",
        "name": "Bicampeão Mundial - Performance Artística",
        "description": "Vencedor na categoria Melhor Performance no Campeonato Mundial de Zouk Brasileiro (2022)",
        "datePublished": "2022"
      }
    ],
    "knowsAbout": [
      "Brazilian Zouk",
      "Kizomba",
      "Lambada",
      "DJ Performance",
      "Music Production",
      "Dance Music Curation",
      "Emotional Connection in Music"
    ],
    "performerIn": {
      "@type": "MusicEvent",
      "name": "Eventos Internacionais de Zouk Brasileiro",
      "location": {
        "@type": "Place",
        "name": "11+ países incluindo Brasil, Espanha, República Tcheca, Alemanha, Holanda"
      }
    }
  };

  // Dados para a timeline (marcos da carreira)
  const milestones = [
    {
      year: "2022",
      title: "Bicampeão Mundial",
      description: "Conquistou dois campeonatos mundiais nas categorias Melhor Remix e Melhor Performance no Campeonato Mundial de Zouk Brasileiro.",
      icon: <Trophy className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-yellow-500 to-amber-600"
    },
    {
      year: "2020-2025",
      title: "Carreira Internacional",
      description: "Mais de 100 apresentações em 11 países, incluindo Brasil, Espanha, República Tcheca, Alemanha e Holanda.",
      icon: <Globe className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      year: "2015-Presente",
      title: "Especialista em Zouk Brasileiro",
      description: "Dedicado exclusivamente à música Zouk Brasileira, criando remixes únicos e sets que priorizam a conexão emocional com a dança.",
      icon: <Music2 className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-fuchsia-600"
    },
    {
      year: "2023",
      title: "Membro da Mensa International",
      description: "Aceito na Mensa International, combinando pensamento analítico com criatividade artística na produção musical.",
      icon: <Brain className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600"
    }
  ];

  // Estatísticas principais
  const achievements = [
    { label: "Países", value: "11+", icon: <Globe className="w-8 h-8 mx-auto mb-4 text-primary" /> },
    { label: "Eventos", value: "100+", icon: <Award className="w-8 h-8 mx-auto mb-4 text-primary" /> },
    { label: "Streams", value: "500K+", icon: <PlayCircle className="w-8 h-8 mx-auto mb-4 text-primary" /> },
    { label: "Anos", value: "10+", icon: <Heart className="w-8 h-8 mx-auto mb-4 text-primary" /> }
  ];

  return (
    <>
      <Helmet>
        {/* Meta tags otimizadas para SEO */}
        <title>Sobre Zen Eyer | DJ Brasileiro de Zouk Brasileiro e Membro da Mensa</title>
        <meta name="description" content="Conheça a história de Zen Eyer, DJ brasileiro bicampeão mundial de Zouk Brasileiro, membro da Mensa International e referência global no gênero." />
        <meta name="keywords" content="Zen Eyer, DJ Zen Eyer, Zouk Brasileiro, Brazilian Zouk, Mensa DJ, História Zen Eyer, Carreira Zen Eyer, Prêmios Zen Eyer" />

        {/* Open Graph para redes sociais */}
        <meta property="og:title" content="Sobre Zen Eyer | DJ Brasileiro de Zouk Brasileiro" />
        <meta property="og:description" content="Conheça a trajetória de Zen Eyer, bicampeão mundial de Zouk Brasileiro e membro da Mensa International." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://djzeneyer.com/about" />
        <meta property="og:image" content="https://djzeneyer.com/images/zen-eyer-about-og.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sobre Zen Eyer | DJ Brasileiro de Zouk Brasileiro" />
        <meta name="twitter:description" content="A história de Zen Eyer, bicampeão mundial de Zouk Brasileiro e membro da Mensa International." />
        <meta name="twitter:image" content="https://djzeneyer.com/images/zen-eyer-about-og.jpg" />

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        {/* Hero Section - Mantendo o visual que você ama */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl" />
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
                  SOBRE MIM
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                Zen <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text">Eyer</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                DJ brasileiro bicampeão mundial de Zouk Brasileiro e membro da Mensa International
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Dados atualizados */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface/50 p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all"
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

        {/* Story Section - Conteúdo 100% alinhado com o que conversamos */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-white/80 leading-relaxed"
            >
              <p>
                <strong className="text-white">Zen Eyer</strong> (Marcelo Eyer Fernandes) é um <strong>DJ brasileiro especializado em Zouk Brasileiro</strong>, bicampeão mundial no gênero e membro da <strong>Mensa International</strong>. Sua carreira é marcada pela capacidade única de unir <strong>técnica, emoção e conexão humana</strong> através da música.
              </p>

              <p>
                Em <strong>2022</strong>, Zen Eyer conquistou o <strong>bicampeonato mundial</strong> no Campeonato Mundial de Zouk Brasileiro, vencendo nas categorias <strong>Melhor Remix</strong> e <strong>Melhor Performance</strong>. Esses prêmios consolidaram seu lugar como um dos principais nomes do zouk brasileiro global, conhecido por seu estilo "<strong>cremoso</strong>" - uma mistura de fluidez, emoção e técnica que cria uma experiência imersiva para os dançarinos.
              </p>

              <p>
                Como <strong>membro da Mensa International</strong> (associação para pessoas com QI elevado), Zen Eyer traz uma abordagem <strong>analítica e inovadora</strong> para a produção musical. Essa combinação única entre <strong>intelecto e sensibilidade artística</strong> permite que ele crie sets que vão além do ritmo, tocando profundamente as emoções de quem dança.
              </p>

              <p>
                Seu repertório é <strong>100% focado no Zouk Brasileiro</strong>, com influências de kizomba, lambada e black music, sempre priorizando a <strong>conexão emocional</strong> entre os dançarinos. Com mais de <strong>100 apresentações em 11 países</strong> (incluindo Brasil, Espanha, República Tcheca, Alemanha e Holanda), Zen Eyer se estabeleceu como um <strong>embaixador global do Zouk Brasileiro</strong>, com mais de <strong>500.000 streams</strong> em plataformas como Spotify, SoundCloud e YouTube.
              </p>

              <p>
                Além das apresentações, Zen Eyer é criador do <strong>reZENha</strong> - um evento itinerante que leva a experiência do Zouk Brasileiro para diferentes cidades, combinando música, dança e comunidade de forma única. Também é fundador da <strong>Tribo Zen</strong>, uma comunidade de assinatura onde compartilha conteúdo exclusivo, remixes e interação direta com seus seguidores.
              </p>

              <p className="text-primary font-semibold">
                Sua filosofia é simples: "<em>A música não é apenas sobre ritmo e melodia — é sobre criar momentos onde as pessoas se conectam profundamente consigo mesmas, com seus parceiros e com o momento presente</em>".
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section - Marcos da carreira */}
        <section className="py-20 px-4 bg-surface/30">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              Marcos da <span className="text-gradient">Carreira</span>
            </motion.h2>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
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

        {/* Philosophy Section - Mantendo o visual que você ama */}
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
                A <span className="text-gradient">Filosofia</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed italic">
                "A música não é apenas sobre ritmo e melodia — é sobre criar momentos onde as pessoas se conectam profundamente consigo mesmas, com seus parceiros e com o momento presente. O Zouk Brasileiro é a linguagem da emoção, e como DJ, sou o tradutor que ajuda os dançarinos a expressar o que as palavras não conseguem."
              </p>
              <div className="mt-8 text-white/60 font-semibold">— Zen Eyer</div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Convite para entrar em contato */}
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
                Vamos <span className="text-gradient">Criar Algo Incrível</span>
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Interessado em contratar Zen Eyer para um evento, colaboração ou entrevista? Entre em contato para conversarmos sobre como podemos trabalhar juntos.
              </p>
              <motion.a
                href="/contact"
                className="btn btn-primary btn-lg inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                Entre em Contato
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};
export default AboutPage;
