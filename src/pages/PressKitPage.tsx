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
  PlayCircle,
  Radio,
  Database,
  ExternalLink
} from 'lucide-react';

const PRESS_LINKS = {
  photos: 'https://photos.djzeneyer.com',
  epk: '/media/dj-zen-eyer-bio.pdf',
  logos: '/media/dj-zen-eyer-logos.zip'
};

const WHATSAPP_NUMBER = '5521987413091';

type Festival = (typeof ARTIST.festivals)[number];

const StatCard = memo<{ icon: React.ReactNode; number: string; label: string; color: string }>(
  ({ icon, number, label, color }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${color} rounded-2xl border border-white/20 p-6 text-center shadow-xl backdrop-blur-sm`}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="mb-4 inline-block rounded-full bg-white/10 p-4 text-white">{icon}</div>
      <h3 className="mb-2 text-4xl font-black text-white">{number}</h3>
      <p className="font-semibold text-white/90">{label}</p>
    </motion.div>
  )
);
StatCard.displayName = 'StatCard';

const MediaKitCard = memo<{
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  isExternal?: boolean;
  t: (key: string) => string;
}>(({ icon, title, description, path, isExternal, t }) => (
  <motion.a
    href={path}
    download={!isExternal}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/50 p-8 backdrop-blur-sm transition-all hover:border-primary hover:bg-surface/80"
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="mx-auto mb-4 inline-block rounded-full bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
    <p className="mb-4 flex-grow text-white/70">{description}</p>
    <div className="mt-auto flex items-center justify-center gap-2 font-semibold text-primary">
      {isExternal ? <ExternalLink size={20} /> : <Download size={20} />}
      <span>{isExternal ? t('presskit.media.access') : t('presskit.media.download')}</span>
    </div>
  </motion.a>
));
MediaKitCard.displayName = 'MediaKitCard';

const PressKitPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentUrl = `https://djzeneyer.com${currentPath}`;

  const relevantLinks = useMemo(
    () => [
      { name: t('social.instagram'), url: ARTIST.social.instagram.url, icon: <Instagram size={20} /> },
      { name: t('social.youtube'), url: ARTIST.social.youtube.url, icon: <Radio size={20} /> },
      { name: t('social.spotify'), url: ARTIST.social.spotify.url, icon: <PlayCircle size={20} /> },
      { name: t('social.apple_music'), url: ARTIST.social.appleMusic.url, icon: <PlayCircle size={20} /> },
      {
        name: t('social.musicbrainz'),
        url: 'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
        icon: <Database size={20} />
      },
      { name: t('social.wikidata'), url: 'https://www.wikidata.org/wiki/Q136551855', icon: <Globe size={20} /> },
      { name: t('social.discogs'), url: 'https://www.discogs.com/artist/16872046', icon: <Database size={20} /> },
      { name: t('social.resident_advisor'), url: 'https://pt-br.ra.co/dj/djzeneyer', icon: <ExternalLink size={20} /> }
    ],
    [t]
  );

  const whatsappUrl = useMemo(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('presskit.contact.whatsapp_message'))}`,
    [t]
  );

  const stats = useMemo(
    () => [
      {
        number: ARTIST.stats.countriesPlayed.toString(),
        label: t('presskit.stats.countries'),
        icon: <Globe size={32} />,
        color: 'bg-gradient-to-br from-blue-500/80 to-blue-700/80'
      },
      {
        number: `${ARTIST.stats.yearsActive}+`,
        label: t('presskit.stats.years'),
        icon: <Calendar size={32} />,
        color: 'bg-gradient-to-br from-purple-500/80 to-purple-700/80'
      },
      {
        number: '2',
        label: t('presskit.stats.titles'),
        icon: <Award size={32} />,
        color: 'bg-gradient-to-br from-pink-500/80 to-pink-700/80'
      },
      {
        number: 'Mensa',
        label: t('presskit.stats.mensa'),
        icon: <Star size={32} />,
        color: 'bg-gradient-to-br from-green-500/80 to-green-700/80'
      }
    ],
    [t]
  );

  const quickStatsItems = useMemo(
    () => [
      {
        title: t('presskit.bio.quickStats.cremosidade'),
        desc: t('presskit.bio.quickStats.cremosidade_desc'),
        icon: <Star size={20} className="text-primary" />
      },
      {
        title: t('presskit.bio.quickStats.repertoire'),
        desc: t('presskit.bio.quickStats.repertoire_desc'),
        icon: <Music2 size={20} className="text-accent" />
      },
      {
        title: t('presskit.bio.quickStats.connection'),
        desc: t('presskit.bio.quickStats.connection_desc'),
        icon: <Users size={20} className="text-success" />
      },
      {
        title: t('presskit.bio.quickStats.global'),
        desc: t('presskit.bio.quickStats.global_desc'),
        icon: <Globe size={20} className="text-purple-400" />
      }
    ],
    [t]
  );

  const mediaItems = useMemo(
    () => [
      {
        title: t('presskit.media.photos'),
        desc: t('presskit.media.photos_desc'),
        path: PRESS_LINKS.photos,
        icon: <ImageIcon size={32} />,
        isExternal: true
      },
      {
        title: t('presskit.media.bio'),
        desc: t('presskit.media.bio_desc'),
        path: PRESS_LINKS.epk,
        icon: <FileText size={32} />,
        isExternal: false
      },
      {
        title: t('presskit.media.logos'),
        desc: t('presskit.media.logos_desc'),
        path: PRESS_LINKS.logos,
        icon: <Music2 size={32} />,
        isExternal: false
      }
    ],
    [t]
  );

  return (
    <>
      <HeadlessSEO
        title={t('presskit.page_title')}
        description={t('presskit.page_meta_desc')}
        url={currentUrl}
        image={`${ARTIST.site.baseUrl}/images/artist/dj-zen-eyer-official-hero.jpg`}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="pt-32 pb-14">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                {t('presskit.tag')}
              </div>
              <h1 className="mt-6 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                {t('presskit.title_prefix')} <span className="text-primary">{t('presskit.title_suffix')}</span>
              </h1>
              <p className="mt-5 text-lg text-white/70 md:text-xl">{t('presskit.role')}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/50 md:text-base">
                {t('presskit.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </motion.div>
        </div>

        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mx-auto max-w-6xl"
            >
              <div className="grid items-center gap-20 lg:grid-cols-2">
                <div className="relative">
                  <motion.div
                    className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src="/images/artist/dj-zen-eyer-smiling-at-deck.jpg"
                      alt="DJ Zen Eyer"
                      className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">World Champion 2022</span>
                      <h3 className="text-2xl font-bold">DJ & Producer</h3>
                    </div>
                  </motion.div>
                </div>

                <div>
                  <h2 className="mb-8 flex items-center gap-4 text-5xl font-black">
                    <Music2 className="text-primary" size={48} />
                    {t('presskit.bio.title')}
                  </h2>

                  <div className="space-y-6 text-justify text-lg leading-relaxed text-white/70">
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p1')) }} />
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p2')) }} />
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('presskit.bio.p3')) }} />
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-6 rounded-3xl border border-white/5 bg-surface/50 p-8">
                    {quickStatsItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">{item.icon}</div>
                        <div>
                          <div className="text-base font-bold leading-tight text-white">{item.title}</div>
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

        <section className="bg-[#0d0d0d] py-32">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-6xl">
              <div className="mb-16 px-4 text-center">
                <h2 className="mb-6 text-5xl font-black uppercase tracking-tighter">
                  Line-ups <span className="text-primary">Internacionais</span>
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-white/50">
                  Alguns dos palcos onde o Brazilian Zouk encontrou flow sem pressa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ARTIST.festivals.slice(0, 9).map((festival: Festival, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-surface/40 p-5 transition-all hover:border-primary/30"
                  >
                    <div className="text-3xl grayscale transition-all group-hover:grayscale-0">{festival.flag}</div>
                    <div className="flex-1 text-left">
                      <div className="text-lg font-bold leading-tight text-white">{festival.name}</div>
                      <div className="mt-1 text-sm uppercase tracking-widest text-white/40">
                        {festival.country} • {new Date(festival.date).getFullYear()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 px-4 text-center">
                <p className="text-lg italic text-white/30">+ tour mundial contínua cobrindo Américas, Europa e Oceania.</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="media-kit" className="py-32">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-6 text-5xl font-black">{t('presskit.media.title')}</h2>
                <p className="mx-auto max-w-2xl text-xl text-white/50">{t('presskit.media.subtitle')}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {mediaItems.map((item, index) => (
                  <MediaKitCard key={index} {...item} t={t} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-6 text-5xl font-black uppercase tracking-tighter">
                  Galeria de <span className="text-primary">Imprensa</span>
                </h2>
                <p className="text-xl text-white/50">{t('presskit.gallery.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[
                  { src: '/images/artist/brazilian-zouk-dance-embrace.jpg', alt: 'Brazilian Zouk Dance Embrace' },
                  { src: '/images/artist/dj-zen-eyer-performing-live.jpg', alt: 'DJ Zen Eyer Performing Live' },
                  { src: '/images/artist/dj-zen-eyer-club-performance.jpg', alt: 'DJ Zen Eyer Club Performance' },
                  { src: '/images/artist/dj-zen-eyer-winner-trophy.jpg', alt: 'DJ Zen Eyer Winner Trophy' },
                  { src: '/images/artist/dj-zen-eyer-beach-brazilian-zouk.png', alt: 'DJ Zen Eyer Beach Zouk' },
                  { src: '/images/artist/dj-zen-eyer-nature-portrait.jpg', alt: 'DJ Zen Eyer Nature Portrait' }
                ].map((photo, index) => (
                  <motion.div
                    key={index}
                    className="group aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-all hover:border-primary/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a
                  href={PRESS_LINKS.photos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg inline-flex items-center gap-2 px-10"
                >
                  <ImageIcon size={20} />
                  Acessar Todas as Fotos
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-primary/10 via-surface/50 to-accent/10 p-16 shadow-3xl">
                <h2 className="mb-8 text-5xl font-black uppercase tracking-tighter md:text-6xl">{t('presskit.contact.title')}</h2>
                <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-white/60">{t('presskit.contact.subtitle')}</p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg flex items-center justify-center gap-3">
                    <Phone size={20} /> WhatsApp
                  </a>
                  <a href={`mailto:${ARTIST.contact.email}`} className="btn btn-outline btn-lg flex items-center justify-center gap-3">
                    <Mail size={20} /> Email
                  </a>
                  <a href={ARTIST.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg flex items-center justify-center gap-3">
                    <Instagram size={20} /> Instagram
                  </a>
                </div>

                <div className="mt-16 border-t border-white/10 pt-10">
                  <div className="mb-12 grid gap-10 text-left md:grid-cols-3">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <MapPin className="text-primary" size={24} />
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white">{t('presskit.contact.base')}</div>
                        <div className="text-white/60">Rio de Janeiro / Niterói</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <Calendar className="text-primary" size={24} />
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white">{t('presskit.contact.availability')}</div>
                        <div className="text-white/60">{t('presskit.contact.availability_value')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <Globe className="text-primary" size={24} />
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white">Booking</div>
                        <div className="text-white/60">Worldwide</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-8">
                    <h3 className="mb-6 text-sm uppercase tracking-widest text-white/40">{t('presskit.contact.links')}</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {relevantLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 transition-all duration-300 hover:bg-primary/20 hover:text-primary"
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

