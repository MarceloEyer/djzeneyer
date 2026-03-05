import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ARTIST } from '../data/artistData';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getHrefLangUrls } from '../utils/seo';
import { sanitizeHtml } from '../utils/sanitize';
import { getLocalizedRoute } from '../config/routes';
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
// 1. CONFIGURAÇÃO DE LINKS
// ============================================================================
const PRESS_LINKS = {
  photos: "https://photos.djzeneyer.com",
  epk: "/media/dj-zen-eyer-epk.pdf",
  logos: "/media/dj-zen-eyer-logos.zip"
};

const WHATSAPP_NUMBER = '5521987413091';

// ============================================================================
// 2. COMPONENTES AUXILIARES
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

const MediaKitCard = memo<{ icon: React.ReactNode; title: string; description: string; path: string; isExternal?: boolean; t: any }>(({ icon, title, description, path, isExternal, t }) => (
  <motion.a
    href={path}
    download={!isExternal}
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-surface/50 p-8 rounded-2xl backdrop-blur-sm border border-white/10 transition-all hover:border-primary hover:bg-surface/80 flex flex-col h-full"
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-primary mx-auto mb-4 p-4 bg-primary/10 rounded-full inline-block group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
    <p className="text-white/70 mb-4 flex-grow">{description}</p>
    <div className="flex items-center justify-center gap-2 text-primary font-semibold mt-auto">
      {isExternal ? <ExternalLink size={20} /> : <Download size={20} />}
      <span>{isExternal ? t('presskit.media.access') : t('presskit.media.download')}</span>
    </div>
  </motion.a>
));
MediaKitCard.displayName = 'MediaKitCard';

// ============================================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================================
const PressKitPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  const currentPath = location.pathname;
  const currentUrl = `https://djzeneyer.com${currentPath}`;

  const RELEVANT_LINKS = useMemo(() => [
    { name: t('social.instagram'), url: ARTIST.social.instagram.url, icon: <Instagram size={20} /> },
    { name: t('social.youtube'), url: ARTIST.social.youtube.url, icon: <Radio size={20} /> },
    { name: t('social.spotify'), url: ARTIST.social.spotify.url, icon: <PlayCircle size={20} /> },
    { name: t('social.apple_music'), url: ARTIST.social.appleMusic.url, icon: <PlayCircle size={20} /> },
    { name: t('social.musicbrainz'), url: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154", icon: <Database size={20} /> },
    { name: t('social.wikidata'), url: "https://www.wikidata.org/wiki/Q136551855", icon: <Globe size={20} /> },
    { name: t('social.discogs'), url: "https://www.discogs.com/artist/16872046", icon: <Database size={20} /> },
    { name: t('social.resident_advisor'), url: "https://pt-br.ra.co/dj/djzeneyer", icon: <ExternalLink size={20} /> }
  ], [t]);

  const WHATSAPP_URL = useMemo(() =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('presskit.contact.whatsapp_message'))}`,
    [t]);

  const PERSON_SCHEMA = useMemo(() => ({
    "@type": "Person",
    "@id": "https://djzeneyer.com/#artist",
    "name": "DJ Zen Eyer",
    "alternateName": ["Zen Eyer", "Marcelo Eyer Fernandes"],
    "jobTitle": t('presskit.role'),
    "description": t('presskit.page_meta_desc'),
    "url": "https://djzeneyer.com",
    "image": "https://djzeneyer.com/wp-content/uploads/2025/12/ZenEyer-2026.png",
    "sameAs": RELEVANT_LINKS.map(l => l.url),
    "memberOf": { "@type": "Organization", "name": "Mensa International" },
    "award": [
      { "@type": "Award", "name": "World Champion DJ (Ilha do Zouk 2022)", "datePublished": "2022" },
      { "@type": "Award", "name": "Best Remix (Ilha do Zouk 2022)", "datePublished": "2022" }
    ]
  }), [t, RELEVANT_LINKS]);

  const stats = useMemo(() => [
    { number: "11+", label: t('presskit.stats.countries'), icon: <Globe size={32} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { number: "50K+", label: t('presskit.stats.people'), icon: <Users size={32} />, color: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { number: "500K+", label: t('presskit.stats.streams'), icon: <Music2 size={32} />, color: "bg-gradient-to-br from-pink-500 to-pink-700" },
    { number: "10+", label: t('presskit.stats.years'), icon: <Award size={32} />, color: "bg-gradient-to-br from-green-500 to-green-700" }
  ], [t]);

  const quickStatsItems = useMemo(() => [
    { title: t('presskit.bio.quickStats.cremosidade'), desc: t('presskit.bio.quickStats.cremosidade_desc'), icon: <Star size={20} className="text-primary" /> },
    { title: t('presskit.bio.quickStats.repertoire'), desc: t('presskit.bio.quickStats.repertoire_desc'), icon: <Music2 size={20} className="text-accent" /> },
    { title: t('presskit.bio.quickStats.connection'), desc: t('presskit.bio.quickStats.connection_desc'), icon: <Users size={20} className="text-success" /> },
    { title: t('presskit.bio.quickStats.global'), desc: t('presskit.bio.quickStats.global_desc'), icon: <Globe size={20} className="text-purple-400" /> }
  ], [t]);

  const mediaItems = useMemo(() => [
    { title: t('presskit.media.photos'), desc: t('presskit.media.photos_desc'), path: PRESS_LINKS.photos, icon: <ImageIcon size={32} />, isExternal: true },
    { title: t('presskit.media.bio'), desc: t('presskit.media.bio_desc'), path: PRESS_LINKS.epk, icon: <FileText size={32} />, isExternal: false },
    { title: t('presskit.media.logos'), desc: t('presskit.media.logos_desc'), path: PRESS_LINKS.logos, icon: <Music2 size={32} />, isExternal: false }
  ], [t]);

  return (
    <>
      <HeadlessSEO
        title={t('presskit.page_title')}
        description={t('presskit.page_meta_desc')}
        url={currentUrl}
        image={`${ARTIST.site.baseUrl}/images/artist/dj-zen-eyer-official-hero.jpg`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">

        {/* Hero Section */}
        <div className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-block mb-4">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  {t('presskit.tag')}
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                Sobre Zen Eyer <span className="text-primary">- EPK Oficial</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                {t('presskit.role')}
                <br />
                <span className="text-primary font-semibold">{t('presskit.subtitle')}</span>
              </p>
            </motion.div>

            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">

                <motion.div className="relative" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl">
                    <img
                      src="/images/artist/dj-zen-eyer-smiling-at-deck.jpg"
                      alt="DJ Zen Eyer - World Champion Brazilian Zouk DJ"
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
                    {t('presskit.bio.title')}
                  </h2>

                  <div className="space-y-4 text-lg text-white/80 leading-relaxed">
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p1')) }} />
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p2')) }} />
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p3')) }} />
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {quickStatsItems.map((item, i) => (
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

        {/* Media Kit Downloads */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">{t('presskit.media.title')}</h2>
                <p className="text-xl text-white/70">{t('presskit.media.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {mediaItems.map((item, index) => (
                  <MediaKitCard key={index} {...item} t={t} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Press Photos Gallery */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">{t('presskit.gallery.title')}</h2>
                <p className="text-xl text-white/70">{t('presskit.gallery.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer" whileHover={{ scale: 1.05 }}>
                    <img
                      src={`/images/press-photo-${i}.svg`}
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
                <a href={PRESS_LINKS.photos} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg inline-flex items-center gap-2">
                  <ImageIcon size={20} />
                  {t('presskit.gallery.cta')}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
                <h2 className="text-4xl md:text-5xl font-black font-display mb-6">{t('presskit.contact.title')}</h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">{t('presskit.contact.subtitle')}</p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg inline-flex items-center gap-3"><Phone size={20} /> WhatsApp</a>
                  <a href={`mailto:${ARTIST.contact.email}`} className="btn btn-outline btn-lg inline-flex items-center gap-3"><Mail size={20} /> Email</a>
                  <a href={ARTIST.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg inline-flex items-center gap-3"><Instagram size={20} /> Instagram</a>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">{t('presskit.contact.base')}</div>
                        <div className="text-white/70">Niterói, RJ - Brasil</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">{t('presskit.contact.availability')}</div>
                        <div className="text-white/70">{t('presskit.contact.availability_value')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Music2 className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">{t('presskit.contact.genre')}</div>
                        <div className="text-white/70">Brazilian Zouk</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-center">{t('presskit.contact.links')}</h3>
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