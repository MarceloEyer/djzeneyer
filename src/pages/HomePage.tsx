// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { PlayCircle, Calendar, Users, Music, Award } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

// --- Subcomponente Reutilizável ---
const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  variants: any; 
}> = ({ icon, title, description, variants }) => (
  <motion.div className="card p-8 text-center" variants={variants}>
    <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
);

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { t } = useTranslation();

  // --- Array de Dados para os Cards ---
  const features = [
    { 
      id: 'music', 
      icon: <Music size={32} />, 
      titleKey: 'home_feat_exclusive_title', 
      descKey: 'home_feat_exclusive_desc' 
    },
    { 
      id: 'achievements', 
      icon: <Award size={32} />, 
      titleKey: 'home_feat_achievements_title', 
      descKey: 'home_feat_achievements_desc' 
    },
    { 
      id: 'community', 
      icon: <Users size={32} />, 
      titleKey: 'home_feat_community_title', 
      descKey: 'home_feat_community_desc' 
    },
  ];

  const handlePlayFeatured = () => {
    if (queue && queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('home_page_title')}</title>
        <meta name="description" content={t('home_page_meta_desc')} />
        
        {/* ✅ SCHEMA EXPANDIDO - OTIMIZADO PARA IAs */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": "DJ Zen Eyer",
            "alternateName": ["Zen Eyer", "DJ Zen", "Zeneyer", "DJ Zen Eyer Brazilian Zouk"],
            
            // ✅ DESCRIÇÃO LONGA PARA IAs (CRÍTICO!)
            "description": "DJ Zen Eyer is a world-renowned Brazilian Zouk DJ and music producer. Two-time World Champion (2023, 2024), he is recognized as one of the top Brazilian Zouk DJs globally. Specializing in bootleg remixes and original productions available on SoundCloud, YouTube, and Mixcloud, he has performed at major international festivals across Europe, USA, and South America. His unique style blends traditional Brazilian Zouk with modern electronic elements, creating immersive dance floor experiences. With over 500,000 streams across platforms and 50,000+ social media followers, DJ Zen Eyer is a leading figure in the global Brazilian Zouk community and international touring artist based in Niterói, Brazil.",
            
            "genre": ["Brazilian Zouk", "Electronic Music", "Dance Music", "Zouk", "Zouk Music"],
            "url": "https://djzeneyer.com",
            "image": "https://djzeneyer.com/images/zen-eyer-profile.jpg",
            "logo": "https://djzeneyer.com/images/zen-eyer-logo.png",
            
            // ✅ WIKIDATA LINK (IAs ADORAM!)
            "sameAs": [
              "https://instagram.com/djzeneyer",
              "https://soundcloud.com/djzeneyer",
              "https://youtube.com/@djzeneyer",
              "https://mixcloud.com/djzeneyer",
              "https://tiktok.com/@djzeneyer",
              "https://www.wikidata.org/wiki/Q136551855"
            ],
            
            "member": {
              "@type": "Person",
              "name": "Zen Eyer",
              "jobTitle": "DJ and Music Producer",
              "description": "World Champion Brazilian Zouk DJ (2023, 2024). Professional DJ and music producer specializing in Brazilian Zouk with over 10 years of experience. Based in Niterói, Brazil, performing internationally at major festivals across Europe, USA, and South America.",
              
              // ✅ KNOWS ABOUT (IAs USAM ISSO!)
              "knowsAbout": [
                "Brazilian Zouk Music",
                "DJ Performance",
                "Music Production",
                "Electronic Music",
                "Dance Music",
                "Zouk Music",
                "International Festivals",
                "Bootleg Production",
                "Remix Production",
                "Brazilian Zouk Dance Culture",
                "Music Mixing Techniques",
                "DJ Techniques"
              ],
              
              "award": [
                "World Champion Brazilian Zouk DJ 2024",
                "World Champion Brazilian Zouk DJ 2023"
              ],
              
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Niterói",
                "addressRegion": "RJ",
                "addressCountry": "BR"
              }
            },
            
            "foundingDate": "2014",
            "foundingLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Niterói",
                "addressRegion": "Rio de Janeiro",
                "addressCountry": "Brazil"
              }
            },
            
            // ✅ EVENTOS
            "event": [
              {
                "@type": "MusicEvent",
                "name": "ZoukFest Europe",
                "location": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Amsterdam",
                    "addressCountry": "Netherlands"
                  }
                }
              },
              {
                "@type": "MusicEvent",
                "name": "Brazilian Zouk Congress",
                "location": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Barcelona",
                    "addressCountry": "Spain"
                  }
                }
              },
              {
                "@type": "MusicEvent",
                "name": "International Zouk Festivals",
                "location": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "Various Countries"
                  }
                }
              }
            ],
            
            // ✅ AWARDS ESTRUTURADOS
            "award": [
              {
                "@type": "Award",
                "name": "World Champion Brazilian Zouk DJ",
                "dateAwarded": "2024",
                "description": "First place in the global Brazilian Zouk DJ competition"
              },
              {
                "@type": "Award",
                "name": "World Champion Brazilian Zouk DJ",
                "dateAwarded": "2023",
                "description": "First place in the global Brazilian Zouk DJ competition"
              }
            ],
            
            // ✅ KNOWS ABOUT (NÍVEL GRUPO)
            "knowsAbout": [
              "Brazilian Zouk Music",
              "DJ Techniques",
              "Music Production",
              "Electronic Music Production",
              "Zouk Dance Culture",
              "International Music Festivals",
              "Bootleg Production",
              "Remix Creation",
              "Music for Dance",
              "Brazilian Music Culture"
            ],
            
            // ✅ CREDENTIALS (IAs VALORIZAM!)
            "hasCredential": [
              {
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "professional certification",
                "name": "World Champion Brazilian Zouk DJ",
                "description": "Recognized globally as a top-tier Brazilian Zouk DJ through international competition victories"
              }
            ],
            
            // ✅ SOCIAL PROOF
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/ListenAction",
                "userInteractionCount": 500000,
                "description": "Total streams across all platforms (SoundCloud, YouTube, Mixcloud)"
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/FollowAction",
                "userInteractionCount": 50000,
                "description": "Total social media followers across all platforms"
              }
            ],
            
            // ✅ AGGREGATE RATING
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "50",
              "bestRating": "5"
            }
          })}
        </script>

        {/* ✅ BREADCRUMB LIST */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
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
                "name": "Music",
                "item": "https://djzeneyer.com/music"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Events",
                "item": "https://djzeneyer.com/events"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Work With Me",
                "item": "https://djzeneyer.com/work-with-me"
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <motion.div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: "url('/images/hero-background.webp')" }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white [text-shadow:_2px_2px_10px_rgba(0,0,0,0.7)]">
              <Trans i18nKey="home_headline">
                Experience the <span className="text-primary">Zen</span> in Brazilian Zouk
              </Trans>
            </h1>
            
            <p className="text-xl md:text-2xl mt-6 max-w-2xl mx-auto text-white/90 [text-shadow:_1px_1px_5px_rgba(0,0,0,0.8)]">
              {t('home_subheadline')}
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handlePlayFeatured} 
                className="btn btn-primary btn-lg flex items-center gap-2" 
                disabled={!queue || queue.length === 0}
              >
                <PlayCircle size={22} />
                <span>{t('play_featured_mix')}</span>
              </button>
              <Link to="/events" className="btn btn-outline btn-lg flex items-center gap-2">
                <Calendar size={22} />
                <span>{t('upcoming_events')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }} 
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              {t('home_features_title')}
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              {t('home_features_subtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map(feature => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={t(feature.titleKey as any)}
                description={t(feature.descKey as any)}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-28 bg-background">
        <motion.div 
          className="container mx-auto px-4 text-center" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
            <Trans i18nKey="home_cta_title">
              Ready to Join the <span className="text-primary">Zen Tribe</span>?
            </Trans>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            {t('home_cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/zentribe" className="btn btn-primary btn-lg">
              {t('join_now_button')}
            </Link>
            <Link to="/music" className="btn btn-outline btn-lg">
              {t('explore_music_button')}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
