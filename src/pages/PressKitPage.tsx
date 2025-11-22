// src/pages/PressKitPage.tsx
// ============================================================================
// PRESS KIT PAGE - VERSÃO DEFINITIVA (RICH CONTENT + SSG + I18N)
// ============================================================================
// 🎨 Design: Layout rico aprovado (Mensa, Cremosidade, Contato Detalhado)
// 🌍 i18n: Conteúdo bilíngue (PT/EN) com switch automático
// ⚡ Performance: Imagens com lazy-loading e prevenção de CLS
// 🔍 SEO: Schema.org dinâmico e Meta Tags corretas
// ============================================================================

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
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
  Mail,
  Instagram,
  Calendar,
  MapPin,
  Sparkles,
  PlayCircle,
  Radio,
  Database,
  ExternalLink
} from 'lucide-react';

// ============================================================================
// CONTEÚDO BILÍNGUE (PT/EN)
// ============================================================================

const CONTENT_PT = {
  hero: {
    tag: "Press Kit Oficial",
    subtitle: "Sets cremosos, emocionais e conectados à dança",
    description: "DJ brasileiro bicampeão mundial de Zouk Brasileiro"
  },
  stats: [
    { number: "11+", label: "Países", icon: <Globe size={32} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { number: "50K+", label: "Pessoas impactadas", icon: <Users size={32} />, color: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { number: "500K+", label: "Streams globais", icon: <Music2 size={32} />, color: "bg-gradient-to-br from-pink-500 to-pink-700" },
    { number: "10+", label: "Anos de carreira", icon: <Award size={32} />, color: "bg-gradient-to-br from-green-500 to-green-700" }
  ],
  bio: {
    title: "Sobre Zen Eyer",
    p1_start: "Zen Eyer (Marcelo Eyer Fernandes) é um ",
    p1_strong1: "DJ brasileiro especializado em Zouk Brasileiro",
    p1_mid: ", bicampeão mundial no gênero (2022) e membro da Mensa International. Seu estilo único, chamado de ",
    p1_strong2: "\"cremosidade\"",
    p1_end: ", combina técnica apurada com emoção profunda, criando sets que são verdadeiras jornadas musicais para os dançarinos.",
    p2: "Com mais de 10 anos de carreira, Zen Eyer já se apresentou em 100+ eventos em 11 países, incluindo Holanda, Espanha, República Tcheca e Alemanha. Seu repertório é 100% focado no Zouk Brasileiro, com influências de kizomba, lambada e black music, sempre priorizando a conexão emocional com a dança.",
    p3: "Como produtor musical, Zen Eyer cria remixes exclusivos e edições especiais para o floor de Zouk, com mais de 500.000 streams globais. É criador do evento reZENha e da comunidade Tribo Zen, que oferece conteúdo exclusivo para amantes do Zouk Brasileiro.",
    quickStats: [
      { title: "Cremosidade", desc: "Sets fluidos e emocionais", icon: <Star size={20} className="text-primary" /> },
      { title: "Repertório", desc: "Zouk, Kizomba, Lambada", icon: <Music2 size={20} className="text-accent" /> },
      { title: "Conexão", desc: "Foco na dança", icon: <Users size={20} className="text-success" /> },
      { title: "Global", desc: "Presença internacional", icon: <Globe size={20} className="text-purple-400" /> }
    ]
  },
  media: {
    title: "Material para Imprensa",
    subtitle: "Tudo que você precisa para divulgação e marketing",
    items: [
      { title: "Fotos para Imprensa", desc: "Fotos em alta resolução (300dpi)", path: "/media/dj-zen-eyer-photos.zip", icon: <ImageIcon size={32} /> },
      { title: "Biografia Completa", desc: "PDF com Bio e Rider Técnico", path: "/media/dj-zen-eyer-epk.pdf", icon: <FileText size={32} /> },
      { title: "Logos e Branding", desc: "Logos oficiais em PNG/SVG", path: "/media/dj-zen-eyer-logos.zip", icon: <Music2 size={32} /> }
    ]
  },
  gallery: {
    title: "Fotos para Imprensa",
    subtitle: "Imagens em alta resolução para uso promocional",
    cta: "Ver Galeria Completa"
  },
  contact: {
    title: "Vamos Criar Algo Incrível",
    subtitle: "Pronto para elevar seu evento? Entre em contato para discutir bookings ou colaborações.",
    baseTitle: "Baseado em",
    baseValue: "Niterói, RJ - Brasil",
    availabilityTitle: "Disponibilidade",
    availabilityValue: "Bookings internacionais",
    genreTitle: "Gênero",
    genreValue: "Zouk Brasileiro",
    linksTitle: "Links Oficiais"
  }
};

const CONTENT_EN = {
  hero: {
    tag: "Official Press Kit",
    subtitle: "Creamy sets, emotional journeys, and dance connection",
    description: "2x World Champion Brazilian Zouk DJ & Producer"
  },
  stats: [
    { number: "11+", label: "Countries", icon: <Globe size={32} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { number: "50K+", label: "People impacted", icon: <Users size={32} />, color: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { number: "500K+", label: "Global streams", icon: <Music2 size={32} />, color: "bg-gradient-to-br from-pink-500 to-pink-700" },
    { number: "10+", label: "Years active", icon: <Award size={32} />, color: "bg-gradient-to-br from-green-500 to-green-700" }
  ],
  bio: {
    title: "About Zen Eyer",
    p1_start: "Zen Eyer (Marcelo Eyer Fernandes) is a ",
    p1_strong1: "Brazilian Zouk DJ specialized in the genre",
    p1_mid: ", 2x World Champion (2022), and member of Mensa International. His unique style, known as ",
    p1_strong2: "\"creaminess\" (cremosidade)",
    p1_end: ", combines precise technique with deep emotion, creating sets that are true musical journeys for dancers.",
    p2: "With over 10 years of career, Zen Eyer has performed at 100+ events in 11 countries, including the Netherlands, Spain, Czech Republic, and Germany. His repertoire is 100% focused on Brazilian Zouk, with influences from Kizomba, Lambada, and Black Music, always prioritizing the emotional connection with the dance.",
    p3: "As a music producer, Zen Eyer creates exclusive remixes and special edits for the Zouk floor, with over 500,000 global streams. He is the creator of the reZENha event and the Tribo Zen community.",
    quickStats: [
      { title: "Creaminess", desc: "Fluid and emotional sets", icon: <Star size={20} className="text-primary" /> },
      { title: "Repertoire", desc: "Zouk, Kizomba, Lambada", icon: <Music2 size={20} className="text-accent" /> },
      { title: "Connection", desc: "Dance-focused", icon: <Users size={20} className="text-success" /> },
      { title: "Global", desc: "International presence", icon: <Globe size={20} className="text-purple-400" /> }
    ]
  },
  media: {
    title: "Press Materials",
    subtitle: "Everything you need for promotion and marketing",
    items: [
      { title: "Press Photos", desc: "High-res photos (300dpi)", path: "/media/dj-zen-eyer-photos.zip", icon: <ImageIcon size={32} /> },
      { title: "Full Biography", desc: "PDF with Bio and Tech Rider", path: "/media/dj-zen-eyer-epk.pdf", icon: <FileText size={32} /> },
      { title: "Logos & Branding", desc: "Official logos in PNG/SVG", path: "/media/dj-zen-eyer-logos.zip", icon: <Music2 size={32} /> }
    ]
  },
  gallery: {
    title: "Press Photos",
    subtitle: "High-resolution images for promotional use",
    cta: "View Full Gallery"
  },
  contact: {
    title: "Let's Create Magic",
    subtitle: "Ready to elevate your event? Get in touch to discuss bookings or collaborations.",
    baseTitle: "Based in",
    baseValue: "Niterói, RJ - Brazil",
    availabilityTitle: "Availability",
    availabilityValue: "International Bookings",
    genreTitle: "Genre",
    genreValue: "Brazilian Zouk",
    linksTitle: "Official Links"
  }
};

const WHATSAPP_CONFIG = {
  number: '5521987413091',
  message: "Olá Zen Eyer! Gostaria de conversar sobre uma possível colaboração ou booking."
};
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.message)}`;

const RELEVANT_LINKS = [
  { name: "Instagram", url: "https://instagram.com/djzeneyer", icon: <Instagram size={20} /> },
  { name: "YouTube", url: "https://www.youtube.com/@djzeneyer", icon: <Radio size={20} /> },
  { name: "Spotify", url: "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw", icon: <PlayCircle size={20} /> },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/zen-eyer/1439280950", icon: <PlayCircle size={20} /> },
  { name: "Resident Advisor", url: "https://pt-br.ra.co/dj/djzeneyer", icon: <ExternalLink size={20} /> }
];

// ============================================================================
// COMPONENTES AUXILIARES (MEMOIZADOS)
// ============================================================================

const StatCard = memo<{ icon: React.ReactNode; number: string; label: string; color: string; }>(({ icon, number, label, color }) => (
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

const MediaKitCard = memo<{ icon: React.ReactNode; title: string; description: string; path: string; }>(({ icon, title, description, path }) => (
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

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const PressKitPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('pt') ? 'pt' : 'en';
  const content = lang === 'pt' ? CONTENT_PT : CONTENT_EN;

  const currentPath = '/press-kit';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  // Schema Schema.org Dinâmico
  const PERSON_SCHEMA = {
    "@type": "Person",
    "@id": "https://djzeneyer.com/#artist",
    "name": "DJ Zen Eyer",
    "jobTitle": lang === 'pt' ? "DJ e Produtor Musical de Zouk Brasileiro" : "Brazilian Zouk DJ & Producer",
    "description": content.hero.description,
    "url": "https://djzeneyer.com",
    "image": "https://djzeneyer.com/images/zen-eyer-presskit-photo.jpg",
    "sameAs": RELEVANT_LINKS.map(l => l.url),
    "memberOf": { "@type": "Organization", "name": "Mensa International" }
  };

  return (
    <>
      <HeadlessSEO
        title={`Press Kit - Zen Eyer | ${content.hero.description}`}
        description={content.bio.p1_start + content.bio.p1_strong1 + "..."}
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-presskit-cover.jpg"
        ogType="profile"
        schema={{ "@context": "https://schema.org", "@graph": [PERSON_SCHEMA] }}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">

        {/* ====================================================================== */}
        {/* HERO SECTION */}
        {/* ====================================================================== */}
        <div className="relative pt-24 pb-16 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-block mb-4">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  {content.hero.tag}
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                Zen <span className="text-primary">Eyer</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                {content.hero.description}
                <br />
                <span className="text-primary font-semibold">{content.hero.subtitle}</span>
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              {content.stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* ====================================================================== */}
        {/* BIO SECTION (VISUAL RICO) */}
        {/* ====================================================================== */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Imagem Bio com suporte a lazy loading e decoding */}
                <motion.div className="relative" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl">
                    <img
                      src="https://djzeneyer.com/images/zen-eyer-presskit-photo.jpg"
                      alt="Zen Eyer - DJ Brasileiro de Zouk Brasileiro"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="600"
                    />
                  </div>
                </motion.div>

                <div>
                  <h2 className="text-4xl font-black font-display mb-6 flex items-center gap-3">
                    <Music2 className="text-primary" size={36} />
                    {content.bio.title}
                  </h2>

                  <div className="space-y-4 text-lg text-white/80 leading-relaxed">
                    <p>
                      {content.bio.p1_start}
                      <strong className="text-white">{content.bio.p1_strong1}</strong>
                      {content.bio.p1_mid}
                      <strong className="text-primary italic">{content.bio.p1_strong2}</strong>
                      {content.bio.p1_end}
                    </p>
                    <p>{content.bio.p2}</p>
                    <p>{content.bio.p3}</p>
                  </div>

                  {/* Quick Stats (Visual Rico) */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {content.bio.quickStats.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">{item.icon}</div>
                        <div>
                          <div className="font-bold text-white">{item.title}</div>
                          <div className="text-sm text-white/60">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* MEDIA KIT DOWNLOADS */}
        {/* ====================================================================== */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">{content.media.title}</h2>
                <p className="text-xl text-white/70">{content.media.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {content.media.items.map((item, index) => (
                  <MediaKitCard key={index} icon={item.icon} title={item.title} description={item.desc} path={item.path} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* GALLERY */}
        {/* ====================================================================== */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">{content.gallery.title}</h2>
                <p className="text-xl text-white/70">{content.gallery.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer" whileHover={{ scale: 1.05 }}>
                    <img
                      src={`https://djzeneyer.com/images/press-photo-${i}.jpg`}
                      alt={`Zen Eyer Press Photo ${i}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="400"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <a href="https://photos.app.goo.gl/bDdjActE3wrd6fx78" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg inline-flex items-center gap-2">
                  <ImageIcon size={20} />
                  {content.gallery.cta}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* CONTACT CTA & DETAILS */}
        {/* ====================================================================== */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
                <h2 className="text-4xl md:text-5xl font-black font-display mb-6">
                  {content.contact.title}
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  {content.contact.subtitle}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg inline-flex items-center gap-3">
                    <Phone size={20} /> WhatsApp
                  </a>
                  <a href="mailto:booking@djzeneyer.com" className="btn btn-outline btn-lg inline-flex items-center gap-3">
                    <Mail size={20} /> Email
                  </a>
                  <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg inline-flex items-center gap-3">
                    <Instagram size={20} /> Instagram
                  </a>
                </div>

                {/* Contact Details Grid */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">{content.contact.baseTitle}</div>
                        <div className="text-white/70">{content.contact.baseValue}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">{content.contact.availabilityTitle}</div>
                        <div className="text-white/70">{content.contact.availabilityValue}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Music2 className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">{content.contact.genreTitle}</div>
                        <div className="text-white/70">{content.contact.genreValue}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Links */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-center">{content.contact.linksTitle}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {RELEVANT_LINKS.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-surface/50 p-3 rounded-lg hover:bg-surface/80 transition-colors">
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