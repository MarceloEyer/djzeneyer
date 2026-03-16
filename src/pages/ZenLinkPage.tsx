// src/pages/ZenLinkPage.tsx
// v2.0 — Premium link-in-bio redesign (glassmorphism + smart music card)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube, Calendar, Mail,
  Headphones, ChevronDown, ExternalLink as ExternalLinkIcon,
  Instagram, Sparkles, Globe, Trophy, Award, MapPin, Disc3, ArrowUpRight, MessageCircle, Music2
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

const YoutubeMusicIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5zm0-8.5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM9.5 15l5-3-5-3v6z" />
  </svg>
);

// --- Animation variants ---

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

// --- Music platforms for smart card ---
const MUSIC_PLATFORMS = [
  { name: 'Spotify', icon: <SpotifyIcon />, url: ARTIST.social.spotify.url, color: '#1DB954' },
  { name: 'Apple Music', icon: <AppleMusicIcon />, url: ARTIST.social.appleMusic.url, color: '#FA243C' },
  { name: 'YouTube Music', icon: <YoutubeMusicIcon />, url: ARTIST.social.youtubeMusic.url, color: '#FF0000' },
];

const microFacts = [
  {
    icon: <Trophy className="h-4 w-4" />,
    label: '2× campeão mundial',
  },
  {
    icon: <Award className="h-4 w-4" />,
    label: `${ARTIST.titles.event} (${ARTIST.titles.year})`,
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: `${ARTIST.contact.location.city} • ${ARTIST.contact.location.state}`,
  },
  {
    icon: <Disc3 className="h-4 w-4" />,
    label: `${ARTIST.stats.yearsActive}+ anos de pista`,
  },
];

// --- Smart Music Card Component ---
const SmartMusicCard = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={itemVariants} className="w-full">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        className="w-full relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20"
      >
        <div className="flex items-center justify-between bg-gray-900/95 backdrop-blur-xl rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-400 to-indigo-600 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">{t('zenlink.listen_now')}</h3>
              <p className="text-gray-400 text-sm">{t('zenlink.choose_platform')}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {MUSIC_PLATFORMS.map((platform) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${platform.color}20` }}>
                      <span style={{ color: platform.color }}>{platform.icon}</span>
                    </div>
                    <span className="text-white font-medium">{platform.name}</span>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-gray-500" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ZenLinkPage = () => {
  const { t } = useTranslation();

  const MAIN_LINKS = [
    { title: t('zenlink.spotify_title'), subtitle: t('zenlink.spotify_subtitle'), url: ARTIST.social.spotify.url, icon: <Music2 className="h-5 w-5" />, highlight: true },
    { title: t('zenlink.booking_title'), subtitle: t('zenlink.booking_subtitle'), url: `${ARTIST.site.baseUrl}/work-with-me`, icon: <Calendar className="h-5 w-5" />, highlight: true },
    { title: 'Instagram', subtitle: '@djzeneyer • bastidores', url: ARTIST.social.instagram.url, icon: <Instagram className="h-5 w-5" /> },
    { title: 'YouTube', subtitle: 'Sets ao vivo', url: ARTIST.social.youtube.url, icon: <Youtube className="h-5 w-5" /> },
    { title: 'WhatsApp', subtitle: t('zenlink.contact_direct'), url: getWhatsAppUrl('Olá Zen! Vi seu link na bio.'), icon: <MessageCircle className="h-5 w-5" /> },
    { title: 'E-mail', subtitle: ARTIST.contact.email, url: `mailto:${ARTIST.contact.email}`, icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <>
      <HeadlessSEO
        title="Zen Link | DJ Zen Eyer"
        description="Página oficial de links do DJ Zen Eyer para Instagram bio."
        url={`${ARTIST.site.baseUrl}/zenlink`}
      />

      <main className="min-h-screen bg-[#05060A] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-10 pt-8">
          <motion.header
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/10 p-5 shadow-[0_8px_24px_rgba(168,85,247,0.25)] backdrop-blur-xl">
              <div className="absolute -right-2 -top-2 rounded-full border border-fuchsia-400/30 bg-zinc-950/90 px-2.5 py-1 text-[11px] font-medium text-fuchsia-200">
                Link na Bio ⚡
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-indigo-500 animate-pulse blur-sm opacity-50" />
                  <img
                    src={`${ARTIST.site.baseUrl}/images/zen-eyer-profile.jpg`}
                    alt={ARTIST.identity.stageName}
                    className="relative h-20 w-20 rounded-2xl border border-white/20 object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`; }}
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-black tracking-tight text-white uppercase italic">
                    {ARTIST.identity.stageName}
                  </h1>
                  <p className="text-sm text-zinc-200/90">{ARTIST.identity.fullName}</p>
                  <p className="mt-1 text-xs text-fuchsia-200 font-medium">✨ {ARTIST.titles.primary}</p>
                </div>
              </div>

              <p className="mt-4 rounded-xl border border-white/5 bg-black/40 px-3 py-2 text-sm italic text-zinc-300 leading-relaxed font-light">
                “{ARTIST.philosophy.slogan}”
              </p>
            </div>
          </motion.header>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 grid grid-cols-2 gap-2"
          >
            {microFacts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
                <span className="text-fuchsia-400">{fact.icon}</span>
                <span className="truncate">{fact.label}</span>
              </div>
            ))}
          </motion.section>

          <section className="space-y-3">
            <SmartMusicCard />
            {MAIN_LINKS.map((link, index) => (
              <motion.a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileTap={{ scale: 0.98 }}
                className={`group block rounded-2xl border p-4 transition-all duration-300 ${link.highlight
                  ? 'border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 hover:border-fuchsia-500/50'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 border border-white/5 text-fuchsia-300">
                    {link.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-white tracking-tight">{link.title}</p>
                    <p className="truncate text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{link.subtitle}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fuchsia-300" />
                </div>
              </motion.a>
            ))}
          </section>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 space-y-3"
          >
            <a
              href={ARTIST.identifiers.wikidataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs font-medium text-emerald-200/80 hover:bg-emerald-500/10 transition-colors"
            >
              <Globe className="h-4 w-4" />
              Wikidata Certified Profile ({ARTIST.identifiers.wikidata})
            </a>

            <a
              href={ARTIST.site.baseUrl}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-gray-900/50 px-4 py-3 text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Website Oficial: djzeneyer.com
            </a>
          </motion.footer>
        </div>
      </main>
    </>
  );
};
