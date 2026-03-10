import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ARTIST } from '../data/artistData';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { sanitizeHtml } from '../utils/sanitize';
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

const MediaKitCard = memo<{ icon: React.ReactNode; title: string; description: string; path: string; isExternal?: boolean; t: (key: string) => string }>(({ icon, title, description, path, isExternal, t }) => (
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
  const { t } = useTranslation();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentUrl = `https://djzeneyer.com${currentPath}`;

  const handleDownloadPDF = () => {
    window.print();
  };

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

  const stats = useMemo(() => [
    { number: ARTIST.stats.countriesPlayed.toString(), label: t('presskit.stats.countries'), icon: <Globe size={32} />, color: "bg-gradient-to-br from-blue-500/80 to-blue-700/80" },
    { number: `${ARTIST.stats.yearsActive}+`, label: t('presskit.stats.years'), icon: <Calendar size={32} />, color: "bg-gradient-to-br from-purple-500/80 to-purple-700/80" },
    { number: "2", label: t('presskit.stats.titles'), icon: <Award size={32} />, color: "bg-gradient-to-br from-pink-500/80 to-pink-700/80" },
    { number: "Mensa", label: t('presskit.stats.mensa'), icon: <Star size={32} />, color: "bg-gradient-to-br from-green-500/80 to-green-700/80" }
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

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-surface, .bg-gradient-to-br { background: #f8f8f8 !important; border: 1px solid #eee !important; color: black !important; }
          .text-white { color: black !important; }
          .text-primary { color: #8b5cf6 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          .rounded-3xl, .rounded-2xl { border-radius: 8px !important; }
          .shadow-2xl, .shadow-xl { shadow: none !important; }
        }
      `}} />

      <div className="min-h-screen bg-[#0a0a0a] text-white">

        {/* Hero Section with Background Photo */}
        <div className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
               src="/images/artist/dj-zen-eyer-official-hero.jpg" 
               alt="" 
               className="w-full h-full object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/60 to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-20">
            <motion.div 
               initial={{ opacity: 0, x: -50 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ duration: 1 }}
               className="max-w-3xl"
            >
              <div className="inline-block mb-6">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>{t('presskit.tag')}</span>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-black font-display mb-8 uppercase leading-[0.9] tracking-tighter">
                EPK <span className="text-primary">Oficial</span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl opacity-80">Zen Eyer</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-10 leading-relaxed font-light">
                {t('presskit.role')} 
                <span className="block text-white font-semibold mt-2">{t('presskit.subtitle')}</span>
              </p>

              <div className="flex flex-wrap gap-4 no-print">
                 <button 
                   onClick={handleDownloadPDF} 
                   className="btn btn-primary btn-lg flex items-center gap-3 px-8"
                 >
                   <Download size={20} /> {t('presskit.media.download')} EPK
                 </button>
                 <a href="#media-kit" className="btn btn-outline btn-lg px-8">
                   Downloads
                 </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section - Floating */}
        <div className="container mx-auto px-4 relative z-20 -mt-20">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </motion.div>
        </div>

        {/* Bio Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                
                <div className="relative">
                  <motion.div 
                    className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src="/images/artist/dj-zen-eyer-smiling-at-deck.jpg"
                      alt="DJ Zen Eyer"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="text-xs uppercase tracking-widest text-primary font-bold">World Champion 2022</span>
                       <h3 className="text-2xl font-bold">DJ & Producer</h3>
                    </div>
                  </motion.div>
                </div>

                <div>
                  <h2 className="text-5xl font-black font-display mb-8 flex items-center gap-4">
                    <Music2 className="text-primary" size={48} />
                    {t('presskit.bio.title')}
                  </h2>

                  <div className="space-y-6 text-lg text-white/70 leading-relaxed text-justify">
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p1')) }} />
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p2')) }} />
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p3')) }} />
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-6 p-8 bg-surface/50 rounded-3xl border border-white/5">
                    {quickStatsItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">{item.icon}</div>
                        <div>
                          <div className="font-bold text-white text-base leading-tight">{item.title}</div>
                          <div className="text-sm text-white/50">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Festivals & Global Footprint */}
        <section className="py-32 bg-[#0d0d0d]">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-16 px-4">
                <h2 className="text-5xl font-black font-display mb-6 uppercase tracking-tighter">Line-ups <span className="text-primary">Internacionais</span></h2>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">Alguns dos palcos onde o Zouk Brasileiro encontrou o flow sem pressa.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ARTIST.festivals.slice(0, 9).map((festival: any, index: number) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-5 bg-surface/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                  >
                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{festival.flag}</div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-white text-lg leading-tight">{festival.name}</div>
                      <div className="text-sm text-white/40 uppercase tracking-widest mt-1">
                        {festival.country} • {new Date(festival.date).getFullYear()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12 px-4">
                <p className="text-white/30 font-display italic text-lg">+ tour mundial contínua cobrindo Américas, Europa e Oceania.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Media Kit Downloads */}
        <section id="media-kit" className="py-32">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black font-display mb-6">{t('presskit.media.title')}</h2>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">{t('presskit.media.subtitle')}</p>
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
        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black font-display mb-6 uppercase tracking-tighter">Galeria de <span className="text-primary">Imprensa</span></h2>
                <p className="text-xl text-white/50">{t('presskit.gallery.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { src: '/images/artist/brazilian-zouk-dance-embrace.jpg', alt: 'Brazilian Zouk Dance Embrace' },
                  { src: '/images/artist/dj-zen-eyer-performing-live.jpg', alt: 'DJ Zen Eyer Performing Live' },
                  { src: '/images/artist/dj-zen-eyer-club-performance.jpg', alt: 'DJ Zen Eyer Club Performance' },
                  { src: '/images/artist/dj-zen-eyer-winner-trophy.jpg', alt: 'DJ Zen Eyer Winner Trophy' },
                  { src: '/images/artist/dj-zen-eyer-beach-brazilian-zouk.png', alt: 'DJ Zen Eyer Beach Zouk' },
                  { src: '/images/artist/dj-zen-eyer-nature-portrait.jpg', alt: 'DJ Zen Eyer Nature Portrait' }
                ].map((photo, i) => (
                  <motion.div 
                    key={i} 
                    className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12 no-print">
                <a href={PRESS_LINKS.photos} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg inline-flex items-center gap-2 px-10">
                  <ImageIcon size={20} />
                  Acessar Todas as Fotos
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      {/* Contact CTA */}
      <section className="py-32 no-print">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/10 via-surface/50 to-accent/10 rounded-[3rem] p-16 border border-white/10 shadow-3xl">
              <h2 className="text-5xl md:text-6xl font-black font-display mb-8 uppercase tracking-tighter">{t('presskit.contact.title')}</h2>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">{t('presskit.contact.subtitle')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg flex items-center justify-center gap-3"><Phone size={20} /> WhatsApp</a>
                <a href={`mailto:${ARTIST.contact.email}`} className="btn btn-outline btn-lg flex items-center justify-center gap-3"><Mail size={20} /> Email</a>
                <a href={ARTIST.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg flex items-center justify-center gap-3"><Instagram size={20} /> Instagram</a>
              </div>

              <div className="mt-16 pt-10 border-t border-white/10">
                <div className="grid md:grid-cols-3 gap-10 text-left mb-12">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg"><MapPin className="text-primary" size={24} /></div>
                    <div>
                      <div className="font-bold text-white mb-1 uppercase tracking-wider text-xs">{t('presskit.contact.base')}</div>
                      <div className="text-white/60">Rio de Janeiro / Niterói</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg"><Calendar className="text-primary" size={24} /></div>
                    <div>
                      <div className="font-bold text-white mb-1 uppercase tracking-wider text-xs">{t('presskit.contact.availability')}</div>
                      <div className="text-white/60">{t('presskit.contact.availability_value')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg"><Globe className="text-primary" size={24} /></div>
                    <div>
                      <div className="font-bold text-white mb-1 uppercase tracking-wider text-xs">Booking</div>
                      <div className="text-white/60">Worldwide</div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-sm uppercase tracking-widest text-white/40 mb-6">{t('presskit.contact.links')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {RELEVANT_LINKS.map((link, index) => (
                      <a 
                         key={index} 
                         href={link.url} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="flex items-center justify-center gap-2 bg-white/5 py-3 px-4 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300"
                      >
                        {link.icon}
                        <span className="text-sm font-semibold">{link.name}</span>
                      </a>
                    ))}
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
