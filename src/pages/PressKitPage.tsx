// src/pages/PressKitPage.tsx - VERSÃO CORRIGIDA
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Download,
  Phone,
  FileText,
  ImageIcon,
  Music2,
  Award,
  Globe,
  Users,
  Star,
  TrendingUp,
  Mail,
  Instagram,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink, // Alternativa para links externos
  PlayCircle,   // Alternativa para Spotify/Apple Music
  Radio,        // Alternativa para YouTube
  Database      // Alternativa para MusicBrainz/Discogs
} from 'lucide-react';

// Componentes memoizados (sem alterações)
const StatCard = memo(({ icon, number, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className={`${color} p-6 rounded-2xl text-center backdrop-blur-sm border border-white/20 shadow-xl`}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-white inline-block p-4 bg-white/10 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="font-black text-4xl text-white mb-2">{number}</h3>
    <p className="text-white/90 font-semibold">{label}</p>
  </motion.div>
));
StatCard.displayName = 'StatCard';

const MediaKitCard = memo(({ icon, title, description, path }) => (
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
));
MediaKitCard.displayName = 'MediaKitCard';

const PressKitPage: React.FC = () => {
  const whatsappNumber = '5521987413091';
  const whatsappMessage = "Olá Zen Eyer! Gostaria de conversar sobre uma possível colaboração ou booking. Como podemos prosseguir?";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Schema.org (sem alterações)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Zen Eyer",
    "alternateName": ["DJ Zen Eyer", "Marcelo Eyer Fernandes"],
    "jobTitle": "DJ e Produtor Musical",
    "description": "DJ brasileiro bicampeão mundial de Zouk Brasileiro, produtor musical e referência global no gênero.",
    "url": "https://djzeneyer.com",
    "image": "https://djzeneyer.com/images/zen-eyer-presskit-cover.jpg",
    "sameAs": [
      "https://instagram.com/djzeneyer",
      "https://www.youtube.com/@djzeneyer",
      "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
      "https://music.apple.com/us/artist/zen-eyer/1439280950",
      "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
      "https://www.wikidata.org/wiki/Q136551855",
      "https://www.discogs.com/artist/16872046"
    ],
    // ... (restante do schema sem alterações)
  };

  // Dados (sem alterações)
  const stats = [
    { icon: <Globe size={32} />, number: "11+", label: "Países", color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { icon: <Users size={32} />, number: "50K+", label: "Pessoas impactadas", color: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { icon: <Music2 size={32} />, number: "500K+", label: "Streams globais", color: "bg-gradient-to-br from-pink-500 to-pink-700" },
    { icon: <Award size={32} />, number: "10+", label: "Anos de carreira", color: "bg-gradient-to-br from-green-500 to-green-700" }
  ];

  const mediaKitItems = [
    { icon: <ImageIcon size={32} />, title: "Fotos para Imprensa", description: "Fotos em alta resolução (300dpi)", path: "/media/dj-zen-eyer-photos.zip" },
    { icon: <FileText size={32} />, title: "Biografia Completa", description: "Biografia detalhada e rider técnico", path: "/media/dj-zen-eyer-epk.pdf" },
    { icon: <Music2 size={32} />, title: "Logos e Branding", description: "Logos em PNG/SVG", path: "/media/dj-zen-eyer-logos.zip" }
  ];

  // Links relevantes (CORRIGIDO: ícones substituídos)
  const relevantLinks = [
    { name: "Instagram", url: "https://instagram.com/djzeneyer", icon: <Instagram size={20} /> },
    { name: "YouTube", url: "https://www.youtube.com/@djzeneyer", icon: <Radio size={20} /> },  // Substituído
    { name: "Spotify", url: "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw", icon: <PlayCircle size={20} /> },  // Substituído
    { name: "Apple Music", url: "https://music.apple.com/us/artist/zen-eyer/1439280950", icon: <PlayCircle size={20} /> },  // Substituído
    { name: "MusicBrainz", url: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154", icon: <Database size={20} /> },  // Substituído
    { name: "Wikidata", url: "https://www.wikidata.org/wiki/Q136551855", icon: <Globe size={20} /> },
    { name: "Discogs", url: "https://www.discogs.com/artist/16872046", icon: <Database size={20} /> },  // Substituído
    { name: "Resident Advisor", url: "https://pt-br.ra.co/dj/djzeneyer", icon: <ExternalLink size={20} /> }  // Substituído
  ];

  const featuredFestivals = [
    { name: "ZoukFest Europe", location: "Amsterdam, NL", emoji: "🇳🇱" },
    { name: "Brazilian Zouk Congress", location: "Barcelona, ES", emoji: "🇪🇸" },
    { name: "Zouk Summer Fest", location: "Berlin, DE", emoji: "🇩🇪" },
    { name: "International Zouk Week", location: "Prague, CZ", emoji: "🇨🇿" },
    { name: "Festival de Zouk", location: "Lisbon, PT", emoji: "🇵🇹" },
    { name: "Zouk Connection", location: "Paris, FR", emoji: "🇫🇷" }
  ];

  return (
    <>
      <Helmet>
        {/* Meta tags (sem alterações) */}
        <title>Press Kit Oficial - Zen Eyer | DJ Brasileiro de Zouk Brasileiro</title>
        <meta name="description" content="Press Kit oficial de Zen Eyer, DJ brasileiro bicampeão mundial de Zouk Brasileiro." />
        {/* ... (restante das meta tags) */}
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      {/* Restante do código (SEM ALTERAÇÕES) */}
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        {/* Hero Section (sem alterações) */}
        {/* ... */}
        {/* Contact CTA - Links corrigidos */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
                {/* ... (restante do conteúdo) */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-center">Links Oficiais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relevantLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-surface/50 p-3 rounded-lg hover:bg-surface/80 transition-colors"
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </a>
                    ))}
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
