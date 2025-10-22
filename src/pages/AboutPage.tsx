// src/pages/AboutPage.tsx - About DJ Zen Eyer

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Music, Award, Globe, Brain, Users, Target, 
  TrendingUp, Heart, Zap, Star, MapPin, Calendar 
} from 'lucide-react';

const AboutPage: React.FC = () => {

  // ✅ Stats Data
  const stats = [
    { icon: <Globe size={28} />, value: '11+', label: 'Countries', color: 'from-primary to-accent' },
    { icon: <Users size={28} />, value: '100+', label: 'Live Performances', color: 'from-accent to-primary' },
    { icon: <Award size={28} />, value: '2x', label: 'World Champion', color: 'from-primary to-purple-500' },
    { icon: <Music size={28} />, value: '500K+', label: 'Streams Worldwide', color: 'from-purple-500 to-primary' }
  ];

  // ✅ Career Timeline
  const timeline = [
    {
      year: '2012',
      title: 'The Beginning',
      description: 'Started DJ journey exploring electronic music and discovering the passion for Brazilian Zouk',
      icon: <Zap size={20} />
    },
    {
      year: '2015',
      title: 'International Debut',
      description: 'First international performance, bringing Brazilian Zouk music to European dance floors',
      icon: <Globe size={20} />
    },
    {
      year: '2020',
      title: 'Music Producer',
      description: 'Launched music production career, creating exclusive tracks and remixes for Brazilian Zouk community',
      icon: <Music size={20} />
    },
    {
      year: '2022',
      title: 'World Champion',
      description: 'Achieved world champion titles in Performance Art and Remix categories at Brazilian Zouk DJ Championship',
      icon: <Award size={20} />
    },
    {
      year: '2024',
      title: 'Mensa Member',
      description: 'Joined Mensa International, combining high IQ analytical thinking with artistic creativity',
      icon: <Brain size={20} />
    },
    {
      year: '2025',
      title: 'Global Presence',
      description: 'Performing at major festivals worldwide, reaching 500K+ streams and building the Zen Tribe community',
      icon: <TrendingUp size={20} />
    }
  ];

  // ✅ Core Values
  const values = [
    {
      icon: <Heart size={24} />,
      title: 'Passion',
      description: 'Deep love for Brazilian Zouk music and culture drives every performance and production'
    },
    {
      icon: <Brain size={24} />,
      title: 'Intelligence',
      description: 'Mensa member applying analytical thinking to musical composition and strategic performance'
    },
    {
      icon: <Target size={24} />,
      title: 'Excellence',
      description: 'World champion mindset focused on continuous improvement and delivering unforgettable experiences'
    },
    {
      icon: <Users size={24} />,
      title: 'Community',
      description: 'Building the Zen Tribe global family connecting Brazilian Zouk enthusiasts worldwide'
    }
  ];

  // ✅ Schema.org Person
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "DJ Zen Eyer",
    "alternateName": ["Marcelo Fernandes", "Zen Eyer", "DJ Zen", "Zeneyer"],
    "url": "https://djzeneyer.com",
    "image": "https://djzeneyer.com/images/dj-zen-eyer-photo.jpg",
    "sameAs": [
      "https://www.wikidata.org/wiki/Q136551855",
      "https://member.mensa.org/users/121342",
      "https://instagram.com/djzeneyer",
      "https://soundcloud.com/djzeneyer",
      "https://youtube.com/channel/UCJ_5oAEFTG18jga_JFxG00w"
    ],
    "jobTitle": "Brazilian Zouk DJ and Music Producer",
    "description": "Two-time world champion Brazilian Zouk DJ, music producer, and Mensa International member. Performed at 100+ international events across 11 countries with 500K+ global streams.",
    "nationality": {
      "@type": "Country",
      "name": "Brazil"
    },
    "homeLocation": {
      "@type": "City",
      "name": "Niterói",
      "containedIn": {
        "@type": "State",
        "name": "Rio de Janeiro"
      }
    },
    "awards": [
      "Brazilian Zouk DJ World Champion 2022 - Performance Art",
      "Brazilian Zouk DJ World Champion 2022 - Remix"
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Mensa International",
        "url": "https://www.mensa.org"
      }
    ],
    "knowsAbout": ["Brazilian Zouk", "DJ Performance", "Music Production", "Electronic Music", "Dance Music"],
    "performerIn": {
      "@type": "MusicGroup",
      "name": "Brazilian Zouk Scene"
    }
  };

  return (
    <>
      <Helmet>
        <title>About DJ Zen Eyer | World Champion Brazilian Zouk DJ & Mensa Member</title>
        <meta name="description" content="Meet DJ Zen Eyer: Two-time world champion Brazilian Zouk DJ, music producer, and Mensa International member. 100+ international performances across 11 countries. Learn about the journey from Niterói, Brazil to global stages." />
        
        {/* ✅ KEYWORDS */}
        <meta name="keywords" content="DJ Zen Eyer, about DJ Zen Eyer, Brazilian Zouk DJ, world champion DJ, Mensa DJ, music producer, DJ biography, Brazilian DJ, Zouk music, international DJ" />
        
        {/* ✅ ROBOTS */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* ✅ CANONICAL */}
        <link rel="canonical" href="https://djzeneyer.com/about" />
        
        {/* ✅ Open Graph */}
        <meta property="og:title" content="About DJ Zen Eyer | World Champion Brazilian Zouk DJ" />
        <meta property="og:description" content="Two-time world champion Brazilian Zouk DJ and Mensa member. 100+ international performances. Discover the story." />
        <meta property="og:url" content="https://djzeneyer.com/about" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://djzeneyer.com/images/dj-zen-eyer-about.jpg" />
        
        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About DJ Zen Eyer | World Champion Brazilian Zouk DJ" />
        <meta name="twitter:description" content="Meet the world champion Brazilian Zouk DJ and Mensa member" />
        <meta name="twitter:image" content="https://djzeneyer.com/images/dj-zen-eyer-twitter.jpg" />
        
        {/* ✅ Schema.org Person */}
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <motion.div 
            className="max-w-5xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <Star className="inline-block mr-2" size={16} />
                World Champion DJ & Mensa Member
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
              Meet <span className="text-primary">DJ Zen Eyer</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/80 mb-8 leading-relaxed">
              Where <span className="text-primary font-bold">High IQ Intelligence</span> Meets <span className="text-accent font-bold">Musical Excellence</span>
            </p>

            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Two-time world champion Brazilian Zouk DJ, music producer, and Mensa International member combining analytical precision with artistic passion to create unforgettable musical experiences across global stages
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-surface/40 border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all hover:scale-105"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-black font-display text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-white/60 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* The Story */}
          <div className="max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-4xl font-black font-display mb-8 text-center">
                The <span className="text-primary">Story</span>
              </h2>

              <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                <p>
                  Born in Niterói, Rio de Janeiro, Brazil, <strong className="text-white">Marcelo Fernandes</strong> (DJ Zen Eyer) discovered his passion for music and electronic beats at an early age. What started as a love for Brazilian Zouk dance evolved into a mission to share this unique musical style with the world.
                </p>

                <p>
                  With over a decade of experience, DJ Zen Eyer has performed at <strong className="text-primary">100+ international events</strong> across <strong className="text-primary">11 countries</strong> including Netherlands, United States, Australia, Czech Republic, Germany, and Spain. His performances have reached <strong className="text-primary">500,000+ streams</strong> globally, establishing him as one of the leading Brazilian Zouk DJs worldwide.
                </p>

                <p>
                  In 2022, DJ Zen Eyer achieved the ultimate recognition by winning <strong className="text-primary">world champion titles</strong> in both <em>Performance Art</em> and <em>Remix</em> categories at the Brazilian Zouk DJ Championship, competing against elite DJs from around the globe.
                </p>

                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-l-4 border-primary rounded-r-xl p-6 my-8">
                  <div className="flex items-start gap-4">
                    <Brain className="text-primary flex-shrink-0 mt-1" size={32} />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">The Mensa Difference</h3>
                      <p className="text-white/80">
                        As a verified member of <a href="https://member.mensa.org/users/121342" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Mensa International</a> (membership #121342), the world's oldest and largest high IQ society, DJ Zen Eyer brings a unique analytical approach to music. This rare combination of high intelligence with artistic creativity allows him to:
                      </p>
                      <ul className="mt-3 space-y-2 text-white/70">
                        <li>• Apply strategic thinking to DJ set programming</li>
                        <li>• Understand crowd psychology at a deeper level</li>
                        <li>• Create mathematically precise yet emotionally powerful mixes</li>
                        <li>• Innovate new approaches to Brazilian Zouk production</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p>
                  Beyond DJing, DJ Zen Eyer is a professional <strong className="text-white">music producer</strong>, crafting exclusive tracks and remixes specifically designed for the Brazilian Zouk dance floor. His insider perspective as both DJ and producer creates a unique synergy that dancers feel in every beat.
                </p>

                <p>
                  Today, DJ Zen Eyer continues to push boundaries while honoring the Brazilian roots of Zouk, building the <strong className="text-accent">Zen Tribe</strong> community that connects Brazilian Zouk enthusiasts worldwide through music, events, and shared passion for this beautiful dance.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl font-black font-display mb-12 text-center">
              The <span className="text-primary">Journey</span>
            </h2>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative flex items-start gap-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                  >
                    {/* Icon Circle */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center border-4 border-background z-10">
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-grow bg-surface/40 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all">
                      <div className="text-primary font-black text-2xl mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-4xl font-black font-display mb-12 text-center">
              Core <span className="text-primary">Values</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-surface/40 border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/20 rounded-lg text-primary">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-black font-display">{value.title}</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <motion.div
            className="max-w-4xl mx-auto mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 rounded-3xl p-12 text-center">
              <Music className="mx-auto mb-6 text-primary" size={48} />
              <h2 className="text-3xl font-black font-display mb-6">Musical Philosophy</h2>
              <blockquote className="text-2xl md:text-3xl font-display text-white/90 leading-relaxed italic">
                "Music is not just sound — it's emotion, connection, and mathematics combined. Every beat tells a story, every mix creates a journey."
              </blockquote>
              <p className="mt-6 text-white/60">— DJ Zen Eyer</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="bg-surface/40 border border-white/10 rounded-3xl p-12">
              <h2 className="text-3xl font-black font-display mb-4">
                Ready to Experience the Zen Tribe?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join the global community or book DJ Zen Eyer for your next event
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/zentribe" className="btn btn-primary btn-lg">
                  Join Zen Tribe
                </a>
                <a href="/work-with-me" className="btn btn-outline btn-lg">
                  Book DJ Zen Eyer
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default AboutPage;
