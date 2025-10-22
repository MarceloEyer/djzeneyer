// src/pages/AboutPage.tsx - VERSÃO FINAL CORRIGIDA (SEM MÚSICA ELETRÔNICA!)

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Award, Music, Globe, Heart, Brain, Trophy } from 'lucide-react';

const AboutPage: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "DJ Zen Eyer",
    "alternateName": ["Marcelo Fernandes", "Marcelo Eyer Fernandes", "Zen Eyer"],
    "jobTitle": "Brazilian Zouk DJ and Music Producer",
    "description": "Two-time world champion Brazilian Zouk DJ, music producer, and Mensa International member. Specializes exclusively in Brazilian Zouk music, creating remixes and original tracks for the dance community. Performed at 100+ international events across 11 countries with 500K+ global streams.",
    "url": "https://djzeneyer.com",
    "sameAs": [
      "https://www.wikidata.org/wiki/Q136551855",
      "https://instagram.com/djzeneyer",
      "https://soundcloud.com/djzeneyer",
      "https://youtube.com/@djzeneyer",
      "https://facebook.com/djzeneyer",
      "https://www.mixcloud.com/zen-eyer/",
      "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
      "https://www.tiktok.com/@djzeneyer",
      "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
      "https://www.songkick.com/artists/8815204"
    ],
    "image": "https://djzeneyer.com/wp-content/uploads/2024/dj-zen-eyer-profile.jpg",
    "alumniOf": {
      "@type": "Organization",
      "name": "Mensa International",
      "url": "https://www.mensa.org"
    },
    "award": [
      {
        "@type": "Award",
        "name": "World Champion - Best Zouk Remix",
        "description": "World Championship in Best Zouk Remix category",
        "datePublished": "2022"
      },
      {
        "@type": "Award",
        "name": "World Champion - Performance Art",
        "description": "World Championship in Performance Art category",
        "datePublished": "2022"
      }
    ],
    "knowsAbout": [
      "Brazilian Zouk Music",
      "DJing",
      "Music Production",
      "Audio Mixing",
      "Dance Music",
      "Event Performance"
    ],
    "performerIn": {
      "@type": "MusicEvent",
      "name": "International Brazilian Zouk Events",
      "location": {
        "@type": "Place",
        "name": "11+ countries worldwide"
      }
    }
  };

  const milestones = [
    {
      year: "2022",
      title: "Double World Champion",
      description: "Won two world championships in Best Zouk Remix and Performance Art categories at the Brazilian Zouk World Championship.",
      icon: Trophy,
      color: "from-yellow-400 to-orange-500"
    },
    {
      year: "2020-2025",
      title: "International DJ Career",
      description: "Performed at 100+ events across 11 countries, including Brazil, USA, Netherlands, Australia, Czech Republic, and Germany.",
      icon: Globe,
      color: "from-blue-400 to-cyan-500"
    },
    {
      year: "2015-Present",
      title: "Brazilian Zouk Specialist",
      description: "Dedicated exclusively to Brazilian Zouk music, creating unique remixes and original tracks that blend emotion, sensuality, and connection.",
      icon: Music,
      color: "from-purple-400 to-pink-500"
    },
    {
      year: "2023",
      title: "Mensa International Member",
      description: "Accepted into Mensa International, combining analytical thinking with artistic creativity in music production.",
      icon: Brain,
      color: "from-green-400 to-emerald-500"
    }
  ];

  const achievements = [
    { label: "Countries", value: "11+", icon: Globe },
    { label: "Events", value: "100+", icon: Award },
    { label: "Streams", value: "500K+", icon: Music },
    { label: "Years", value: "10+", icon: Heart }
  ];

  return (
    <>
      <Helmet>
        <title>About DJ Zen Eyer - Brazilian Zouk World Champion & Mensa Member</title>
        <meta name="description" content="DJ Zen Eyer is a two-time world champion Brazilian Zouk DJ and music producer, Mensa International member, with 100+ international performances across 11 countries and 500K+ streams." />
        <meta name="keywords" content="DJ Zen Eyer, Brazilian Zouk DJ, World Champion DJ, Mensa DJ, Zouk Music Producer, International DJ, Dance Music" />
        <link rel="canonical" href="https://djzeneyer.com/about" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl" />
          
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                About <span className="text-gradient">DJ Zen Eyer</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                Two-time world champion Brazilian Zouk DJ, music producer, and Mensa International member
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center hover:scale-105 transition-transform"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {item.value}
                  </div>
                  <div className="text-white/60 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-white/80 leading-relaxed"
            >
              <p>
                DJ Zen Eyer (Marcelo Eyer Fernandes) is one of the leading Brazilian Zouk DJs in the world, specializing exclusively in Brazilian Zouk music. Based in Niterói, Brazil, Zen Eyer has dedicated over a decade to perfecting the art of DJing and music production for the Brazilian Zouk dance community.
              </p>
              
              <p>
                In 2022, DJ Zen Eyer achieved the pinnacle of his career by winning two world championships at the Brazilian Zouk World Championship: <strong>Best Zouk Remix</strong> and <strong>Performance Art</strong>. These accolades highlight his unique ability to blend emotion, sensuality, and musical sophistication — the signature [translate:cremosidade] (creaminess) that has become his trademark.
              </p>

              <p>
                As a <strong>Mensa International member</strong>, DJ Zen Eyer brings an analytical and intellectual approach to music production, combining high-level cognitive abilities with artistic creativity. This unique blend allows him to craft sets that not only move the body but also touch the soul.
              </p>

              <p>
                His music is known for creating immersive soundscapes that emphasize connection between dance partners. DJ Zen Eyer's approach focuses on romantic, intense, and emotionally rich tracks that help dancers feel deeply connected to the music and each other.
              </p>

              <p>
                With performances in over <strong>100 international events</strong> across <strong>11 countries</strong> including Brazil, United States, Netherlands, Australia, Czech Republic, and Germany, DJ Zen Eyer has established himself as a global ambassador for Brazilian Zouk music. His tracks have accumulated over <strong>500,000 streams</strong> on platforms like SoundCloud, Spotify, and YouTube.
              </p>

              <p>
                Beyond DJing, Zen Eyer is also the creator of <strong>reZENha</strong>, a transformative Brazilian Zouk party experience that combines music, dance, and community in unique ways.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 bg-surface/30">
          <div className="container-custom max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              Career <span className="text-gradient">Milestones</span>
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
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center`}>
                        <milestone.icon className="w-8 h-8 text-white" />
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

        {/* Philosophy Section */}
        <section className="py-20 px-4">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="card p-8 md:p-12 text-center"
            >
              <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                The <span className="text-gradient">Philosophy</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                "Music is not just about rhythm and melody — it's about creating moments where people connect deeply with themselves, their partners, and the present moment. Brazilian Zouk is the language of emotion, and as a DJ, I'm the translator helping dancers express what words cannot."
              </p>
              <div className="mt-8 text-white/60">— DJ Zen Eyer</div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
