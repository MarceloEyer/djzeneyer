// src/pages/ZenLinkPage.tsx
// v2.0 — Premium link-in-bio redesign (glassmorphism + smart music card)

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube, Calendar, ShoppingBag, Mail, Phone,
  Headphones, ChevronDown, ExternalLink,
} from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST, getWhatsAppUrl } from '../data/artistData';

// --- SVG Icons for music platforms ---
const SpotifyIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.248C19.1.1 18.48.04 17.86.007 17.46-.01 13.54 0 12 0S6.54-.01 6.14.007C5.52.04 4.9.1 4.3.248A5.02 5.02 0 002.426.891C1.308 1.624.563 2.624.246 3.934a9.23 9.23 0 00-.24 2.19C-.01 6.544 0 10.46 0 12s-.01 5.46.007 5.876c.033.62.093 1.24.24 1.85.317 1.31 1.062 2.31 2.18 3.043a5.02 5.02 0 001.874.643c.6.148 1.22.208 1.84.241.4.017 4.32.007 5.86.007s5.46.01 5.86-.007c.62-.033 1.24-.093 1.84-.241a5.022 5.022 0 001.874-.643c1.118-.733 1.863-1.733 2.18-3.043.147-.61.207-1.23.24-1.85.017-.416.007-4.336.007-5.876s.01-5.456-.007-5.876zM17.8 17.013c0 .353-.103.626-.31.823-.206.196-.47.296-.79.296-.16 0-.346-.04-.556-.122l-7.86-3.19a1.57 1.57 0 01-.54-.353.874.874 0 01-.195-.583V7.99c0-.353.103-.627.31-.823.206-.196.47-.296.79-.296.16 0 .346.04.556.122l7.86 3.19c.217.088.397.205.54.353a.874.874 0 01.195.583v5.894z" />
  </svg>
);

const SoundCloudIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.04-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.308c.013.06.045.094.09.094.051 0 .089-.037.104-.09l.2-1.308-.2-1.334c-.016-.06-.053-.09-.091-.09m1.833-1.681c-.065 0-.107.054-.114.12l-.229 2.986.229 2.802c.007.066.049.12.114.12.063 0 .108-.054.116-.12l.26-2.802-.26-2.986c-.008-.066-.053-.12-.116-.12m.867-.463c-.074 0-.124.06-.131.134l-.217 3.449.217 2.938c.007.074.057.134.131.134.07 0 .124-.06.131-.134l.245-2.938-.245-3.449c-.007-.074-.06-.134-.131-.134m.885-.139c-.084 0-.138.07-.145.15l-.195 3.588.195 2.963c.007.083.06.15.145.15.08 0 .14-.067.145-.15l.226-2.963-.226-3.588c-.006-.08-.066-.15-.145-.15m.912-.216c-.094 0-.148.078-.155.168l-.182 3.804.182 2.965c.007.09.061.168.155.168.09 0 .15-.078.157-.168l.21-2.965-.21-3.804c-.008-.09-.067-.168-.157-.168m.919-.076c-.104 0-.162.086-.168.186l-.17 3.88.17 2.956c.006.1.064.186.168.186.1 0 .164-.086.17-.186l.197-2.956-.196-3.88c-.007-.1-.071-.186-.171-.186m.928.057c-.081 0-.168.094-.175.2l-.156 3.823.156 2.93c.007.11.094.2.175.2.084 0 .168-.09.178-.2l.18-2.93-.18-3.823c-.01-.106-.094-.2-.178-.2m.93.124c-.09 0-.178.103-.184.215l-.144 3.7.144 2.894c.006.116.094.215.184.215.094 0 .178-.099.188-.215l.168-2.894-.168-3.7c-.01-.112-.094-.215-.188-.215m.93-.004c-.098 0-.186.105-.19.224l-.136 3.704.135 2.855c.005.12.093.224.19.224.1 0 .186-.105.194-.224l.156-2.855-.156-3.704c-.008-.12-.094-.224-.194-.224m4.088-.66c-.239 0-.47.024-.694.066A5.612 5.612 0 0012.2 7.594c-.253-.104-.462-.11-.55-.055-.087.054-.131.169-.131.34v9.474c0 .18.102.335.268.384.022.007.045.013.068.016h5.52c1.92 0 3.476-1.52 3.476-3.394 0-1.874-1.556-3.394-3.476-3.394" />
  </svg>
);

const DeezerIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.03h5.19V8.38H6.27zm12.54 0v3.03H24V8.38h-5.19zM6.27 12.59v3.03h5.19v-3.03H6.27zm6.27 0v3.03h5.19v-3.03h-5.19zm6.27 0v3.03H24v-3.03h-5.19zM0 16.81v3.03h5.19v-3.03H0zm6.27 0v3.03h5.19v-3.03H6.27zm6.27 0v3.03h5.19v-3.03h-5.19zm6.27 0v3.03H24v-3.03h-5.19z" />
  </svg>
);

const BandcampIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" />
  </svg>
);

// --- Animation variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// --- Music platforms for smart card ---
const MUSIC_PLATFORMS = [
  { name: 'Spotify', icon: <SpotifyIcon />, url: ARTIST.social.spotify.url, color: '#1DB954' },
  { name: 'Apple Music', icon: <AppleMusicIcon />, url: ARTIST.social.appleMusic.url, color: '#FA243C' },
  { name: 'SoundCloud', icon: <SoundCloudIcon />, url: ARTIST.social.soundcloud.url, color: '#FF5500' },
  { name: 'Deezer', icon: <DeezerIcon />, url: ARTIST.social.deezer.url, color: '#A238FF' },
  { name: 'Bandcamp', icon: <BandcampIcon />, url: ARTIST.social.bandcamp.url, color: '#1DA0C3' },
];

// --- Main links ---
interface LinkItemBase {
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
  gradient: string;
}

interface ExternalLink extends LinkItemBase { type: 'external'; url: string; }
interface InternalLink extends LinkItemBase { type: 'internal'; to: string; }
type LinkItem = ExternalLink | InternalLink;

const LINKS: LinkItem[] = [
  {
    type: 'external',
    titleKey: 'nav_music', // existing key "Música"
    subtitleKey: 'zenlink.soundcloud_subtitle',
    url: ARTIST.social.soundcloud.url,
    icon: <SoundCloudIcon />,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    type: 'external',
    titleKey: 'social.youtube',
    subtitleKey: 'zenlink.youtube_subtitle',
    url: ARTIST.social.youtube.url,
    icon: <Youtube className="w-5 h-5" />,
    gradient: 'from-red-600 to-red-700',
  },
  {
    type: 'internal',
    titleKey: 'zenlink.book_title',
    subtitleKey: 'zenlink.book_subtitle',
    to: '/work-with-me',
    icon: <Calendar className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    type: 'internal',
    titleKey: 'nav_shop',
    subtitleKey: 'zenlink.shop_subtitle',
    to: '/shop',
    icon: <ShoppingBag className="w-5 h-5" />,
    gradient: 'from-amber-500 to-orange-600',
  },
];

// --- Smart Music Card Component ---
const SmartMusicCard = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={itemVariants} className="w-full">
      {/* Main button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full relative overflow-hidden rounded-2xl
          p-[2px] bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500
          shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30
          transition-shadow duration-300
        `}
      >
        <div className="flex items-center justify-between bg-gray-900/95 backdrop-blur-xl rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">{t('zenlink.listen_now')}</h3>
              <p className="text-gray-400 text-sm">{t('zenlink.choose_platform')}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded platforms */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {MUSIC_PLATFORMS.map((platform) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex items-center justify-between
                    bg-white/5 backdrop-blur-sm border border-white/10
                    rounded-xl p-4
                    hover:bg-white/10 transition-colors duration-200
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <span style={{ color: platform.color }}>{platform.icon}</span>
                    </div>
                    <span className="text-white font-medium">{platform.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Link Card Component ---
const LinkCard = ({ link }: { link: LinkItem }) => {
  const { t } = useTranslation();
  const inner = (
    <div className="flex items-center gap-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-5">
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${link.gradient}`}>
        {link.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-lg truncate">{t(link.titleKey)}</h3>
        <p className="text-gray-400 text-sm truncate">{t(link.subtitleKey)}</p>
      </div>
      <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  const className = `
    block w-full relative overflow-hidden rounded-2xl
    p-[1px] bg-gradient-to-r ${link.gradient}
    shadow-lg hover:shadow-xl transition-shadow duration-300
    opacity-90 hover:opacity-100
  `;

  if (link.type === 'internal') {
    return (
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
        <Link to={link.to} className={className}>{inner}</Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>
    </motion.div>
  );
};

// --- Main Page ---
export const ZenLinkPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadlessSEO
        title={`ZenLink — All Links | ${ARTIST.identity.stageName}`}
        description={t('zenlink.seo_description')}
        canonicalUrl={`${ARTIST.site.baseUrl}/zenlink`}
      />

      {/* Animated background */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 py-12 px-4 max-w-lg mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            {/* Avatar with glow ring */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative w-28 h-28 mx-auto mb-5"
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-[3px] rounded-full bg-gray-950" />
              <div className="absolute inset-[4px] rounded-full overflow-hidden">
                <img
                  src={`${ARTIST.site.baseUrl}/images/zen-eyer-profile.jpg`}
                  alt={ARTIST.identity.stageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`;
                  }}
                />
              </div>
            </motion.div>

            {/* Name */}
            <h1 className="text-3xl font-display font-black text-white mb-1.5 tracking-tight">
              {ARTIST.identity.stageName}
            </h1>

            {/* Title */}
            <p className="text-sm text-purple-300/80 font-medium mb-4">
              2× World Champion Brazilian Zouk DJ
            </p>

            {/* Slogan badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block bg-white/5 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10"
            >
              <p className="text-xs text-purple-200/70 italic">
                "{ARTIST.philosophy.slogan}"
              </p>
            </motion.div>
          </motion.div>

          {/* Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {/* Smart Music Card */}
            <SmartMusicCard />

            {/* Regular links */}
            {LINKS.map((link, i) => (
              <LinkCard key={i} link={link} />
            ))}

            {/* Contact row */}
            <motion.div variants={itemVariants} className="flex gap-3 pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-1 flex items-center justify-center gap-2
                  bg-white/5 backdrop-blur-sm border border-white/10
                  rounded-xl py-3.5 px-4
                  text-white font-medium text-sm
                  hover:bg-white/10 transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                "
              >
                <Phone className="w-4 h-4 text-green-400" />
                WhatsApp
              </a>
              <a
                href={`mailto:${ARTIST.contact.email}`}
                className="
                  flex-1 flex items-center justify-center gap-2
                  bg-white/5 backdrop-blur-sm border border-white/10
                  rounded-xl py-3.5 px-4
                  text-white font-medium text-sm
                  hover:bg-white/10 transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                "
              >
                <Mail className="w-4 h-4 text-blue-400" />
                Email
              </a>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-10"
          >
            <a
              href={ARTIST.site.baseUrl}
              className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
            >
              djzeneyer.com →
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};
