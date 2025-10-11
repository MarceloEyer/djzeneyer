// src/pages/PressKitPage.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Download, 
  Phone, 
  FileText, 
  ImageIcon, 
  Music, 
  Award, 
  Globe, 
  Users,
  Star,
  TrendingUp,
  Mail,
  Instagram,
  Music2,
  Calendar,
  MapPin,
  Sparkles,
  Zap
} from 'lucide-react';

// Card de Estatística animado
const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  number: string; 
  label: string;
  color: string;
}> = ({ icon, number, label, color }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }}
    className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-center backdrop-blur-sm border border-white/20 shadow-xl`}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-white inline-block p-4 bg-white/10 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="font-black text-4xl text-white mb-2">{number}</h3>
    <p className="text-white/90 font-semibold">{label}</p>
  </motion.div>
);

// Card de Download de Media Kit
const MediaKitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}> = ({ icon, title, description, path }) => (
  <motion.a
    href={path}
    download
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-surface/50 p-8 rounded-2xl backdrop-blur-sm border border-white/10 transition-all hover:border-primary hover:bg-surface/80"
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-primary mx-auto mb-4 p-4 bg-primary/10 rounded-full inline-block group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
    <p className="text-white/70 mb-4">{description}</p>
    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
      <Download size={20} />
      <span>Download</span>
    </div>
  </motion.a>
);

const PressKitPage: React.FC = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<string[]>([]);

  // Busca fotos do Google Photos (você precisará configurar a API)
  // Por enquanto, vou usar URLs estáticas como exemplo
  useEffect(() => {
    // TODO: Implementar integração com Google Photos API
    // Por enquanto, fotos de exemplo
    const examplePhotos = [
      'https://lh3.googleusercontent.com/pw/ABLVV85...', // Substituir pelas suas fotos
      'https://lh3.googleusercontent.com/pw/ABLVV85...',
      'https://lh3.googleusercontent.com/pw/ABLVV85...',
    ];
    setPhotos(examplePhotos);
  }, []);

  // Estatísticas
  const stats = [
    { 
      icon: <Globe size={32} />, 
      number: "11+", 
      label: "Países Alcançados",
      color: "from-blue-500 to-blue-700"
    },
    { 
      icon: <Users size={32} />, 
      number: "50K+", 
      label: "Pessoas Impactadas",
      color: "from-purple-500 to-purple-700"
    },
    { 
      icon: <Music2 size={32} />, 
      number: "500K+", 
      label: "Streams Totais",
      color: "from-pink-500 to-pink-700"
    },
    { 
      icon: <Award size={32} />, 
      number: "10+", 
      label: "Anos de Carreira",
      color: "from-green-500 to-green-700"
    }
  ];

  // Media Kit items
  const mediaKitItems = [
    {
      icon: <ImageIcon size={32} />,
      title: "Press Photos",
      description: "High-resolution photos for promotional use",
      path: "/media/dj-zen-eyer-photos.zip"
    },
    {
      icon: <Music size={32} />,
      title: "EPK & Biography",
      description: "Complete electronic press kit with bio and rider",
      path: "/media/dj-zen-eyer-epk.pdf"
    },
    {
      icon: <FileText size={32} />,
      title: "Logos & Brand Assets",
      description: "Official logos in PNG and SVG formats",
      path: "/media/dj-zen-eyer-logos.zip"
    }
  ];

  // Contact info
  const whatsappNumber = '5531999999999';
  const whatsappMessage = "Hi Zen Eyer! I'm interested in booking you for an event. Let's talk!";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <Helmet>
        <title>Work With Me - DJ Zen Eyer | Press Kit & Booking</title>
        <meta name="description" content="Official press kit, biography, and booking information for DJ Zen Eyer - Brazilian Zouk music producer and global DJ." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
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
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  Professional Press Kit
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                Work With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-success">
                  DJ Zen Eyer
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Brazilian Zouk Producer & International DJ
                <br />
                <span className="text-primary font-semibold">Transforming Events Into Unforgettable Experiences</span>
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Photo */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl">
                    <img 
                      src="https://placehold.co/600x600/101418/6366F1?text=DJ+Zen+Eyer"
                      alt="DJ Zen Eyer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary to-accent p-6 rounded-2xl shadow-2xl">
                    <TrendingUp size={40} className="text-white" />
                  </div>
                </motion.div>

                {/* Bio Text */}
                <div>
                  <h2 className="text-4xl font-black font-display mb-6 flex items-center gap-3">
                    <Music className="text-primary" size={36} />
                    About Zen Eyer
                  </h2>
                  <div className="space-y-4 text-lg text-white/80 leading-relaxed">
                    <p>
                      <strong className="text-white">DJ Zen Eyer</strong> is a Brazilian Zouk music producer and international DJ who has been shaping the global dance scene for over a decade.
                    </p>
                    <p>
                      With a unique approach that combines technical precision with emotional storytelling, Zen Eyer creates immersive musical journeys that resonate with audiences worldwide.
                    </p>
                    <p>
                      From intimate dance floors in São Paulo to international festivals across Europe and Asia, his sets are known for their carefully curated selection, seamless mixing, and ability to create unforgettable moments.
                    </p>
                    <p className="text-primary font-semibold">
                      As a music producer, Zen Eyer brings an insider's perspective to DJing, crafting exclusive edits and remixes that elevate every performance.
                    </p>
                  </div>

                  {/* Key Points */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Zap className="text-primary" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white">Energy</div>
                        <div className="text-sm text-white/60">High-impact sets</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Music2 className="text-accent" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white">Selection</div>
                        <div className="text-sm text-white/60">Curated perfection</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-success/20 rounded-lg">
                        <Users className="text-success" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white">Connection</div>
                        <div className="text-sm text-white/60">Audience-focused</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Globe className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white">Global</div>
                        <div className="text-sm text-white/60">International reach</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Media Kit Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">
                  Media Kit & Assets
                </h2>
                <p className="text-xl text-white/70">
                  Everything you need for promotion and marketing
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {mediaKitItems.map((item, index) => (
                  <MediaKitCard key={index} {...item} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Press Photos Gallery (Google Photos Integration) */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">
                  Press Photos
                </h2>
                <p className="text-xl text-white/70">
                  High-resolution images for media and promotional use
                </p>
              </div>

              {/* TODO: Integrar com Google Photos API */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div 
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={`https://placehold.co/400x400/101418/6366F1?text=Photo+${i}`}
                      alt={`DJ Zen Eyer Press Photo ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <a 
                  href="https://photos.app.goo.gl/bDdjActE3wrd6fx78" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg inline-flex items-center gap-2"
                >
                  <ImageIcon size={20} />
                  View Full Gallery
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
                <h2 className="text-4xl md:text-5xl font-black font-display mb-6">
                  Let's Create Something Amazing
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Ready to elevate your event? Get in touch to discuss booking, collaborations, or media inquiries.
                </p>

                {/* Contact buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href={whatsappUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg inline-flex items-center gap-3"
                  >
                    <Phone size={20} />
                    WhatsApp Booking
                  </a>
                  <a 
                    href="mailto:booking@djzeneyer.com"
                    className="btn btn-outline btn-lg inline-flex items-center gap-3"
                  >
                    <Mail size={20} />
                    Email
                  </a>
                  <a 
                    href="https://instagram.com/djzeneyer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-lg inline-flex items-center gap-3"
                  >
                    <Instagram size={20} />
                    Instagram
                  </a>
                </div>

                {/* Quick info */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">Based in</div>
                        <div className="text-white/70">São Paulo, Brazil</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">Availability</div>
                        <div className="text-white/70">Worldwide bookings</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Music2 className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">Genres</div>
                        <div className="text-white/70">Brazilian Zouk, Electronic</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PressKitPage;
