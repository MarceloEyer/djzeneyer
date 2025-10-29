// src/pages/HomePage.tsx - VERSÃO 100% CORRIGIDA

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { PlayCircle, Calendar, Users, Music, Award } from 'lucide-react';
import SEO from '../components/SEO';

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
  const { t } = useTranslation();

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
    console.log('Music player feature coming soon!');
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
      {/* ✅ SEO COMPONENT COM HREFLANG */}
      <SEO
        title={t('home_page_title')}
        description={t('home_page_meta_desc')}
        image="https://djzeneyer.com/images/og-image-home.jpg"
        keywords="DJ Zen Eyer, Brazilian Zouk, Zouk DJ, Brazilian Zouk DJ, World Champion DJ, Electronic Music, Dance Music, Zouk Music, DJ Brazil, International DJ"
      />

      {/* ✅ SCHEMA ESPECÍFICO DA HOME (MusicGroup + Breadcrumb) */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": "DJ Zen Eyer",
            "alternateName": ["Zen Eyer", "DJ Zen", "Zeneyer", "DJ Zen Eyer Brazilian Zouk"],
            
            "description": "DJ Zen Eyer is a world-renowned Brazilian Zouk DJ and music producer. Winner of the 2022 Brazilian Zouk DJ Championship in both Best Performance and Best Remix categories, he is recognized as one of the top Brazilian Zouk DJs globally. Certified by the Brazilian Zouk Council as an official Jack and Jill DJ, he specializes in bootleg remixes and original productions available on SoundCloud, YouTube, and Mixcloud. He has performed at major international festivals across Europe, USA, and South America.",
            
            "genre": ["Brazilian Zouk", "Electronic Music", "Dance Music", "Zouk", "Zouk Music"],
            "url": "https://djzeneyer.com",
            "image": "https://djzeneyer.com/images/zen-eyer-profile.jpg",
            "logo": "https://djzeneyer.com/images/zen-eyer-logo.png",
            
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
              "description": "World Champion Brazilian Zouk DJ (2022). Professional DJ and music producer specializing in Brazilian Zouk with over 10 years of experience.",
              
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
                "Jack and Jill Competition DJing"
              ],
              
              "award": [
                "World Champion Brazilian Zouk DJ 2022 - Best Performance",
                "World Champion Brazilian Zouk DJ 2022 - Best Remix",
                "Brazilian Zouk Council - Certified Jack and Jill DJ"
              ],
              
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR"
              }
            },
            
            "foundingDate": "2014",
            "foundingLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Brazil"
              }
            },
            
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
              }
            ],
            
            "hasCredential":
