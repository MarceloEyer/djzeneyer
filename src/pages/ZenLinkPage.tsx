// src/pages/ZenLinkPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Instagram, Youtube, Calendar, ShoppingBag, Trophy, Mail, Phone } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST, getWhatsAppUrl } from '../data/artistData';

// ícone TikTok (Lucide não tem, usamos SVG inline)
const TikTokIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.78a8.18 8.18 0 004.79 1.53V6.86a4.85 4.85 0 01-1.02-.17z" />
  </svg>
);

interface ExternalLinkItem {
  type: 'external';
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
  gradient: string;
  isPrimary?: boolean;
}

interface InternalLinkItem {
  type: 'internal';
  title: string;
  subtitle: string;
  to: string;
  icon: React.ReactNode;
  gradient: string;
  isPrimary?: boolean;
}

type LinkItem = ExternalLinkItem | InternalLinkItem;

const LINKS: LinkItem[] = [
  {
    type: 'external',
    title: 'Listen on Spotify',
    subtitle: 'My latest tracks & remixes',
    url: ARTIST.social.spotify.url,
    icon: <Music className="w-6 h-6" />,
    gradient: 'from-green-500 to-green-600',
    isPrimary: true,
  },
  {
    type: 'internal',
    title: 'Book Me',
    subtitle: 'Festivals, congresses & private events',
    to: '/work-with-me',
    icon: <Calendar className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500',
    isPrimary: true,
  },
  {
    type: 'external',
    title: 'TikTok',
    subtitle: ARTIST.social.tiktok.handle ?? '@djzeneyer',
    url: ARTIST.social.tiktok.url,
    icon: <TikTokIcon />,
    gradient: 'from-black via-gray-800 to-pink-600',
  },
  {
    type: 'external',
    title: 'Instagram',
    subtitle: ARTIST.social.instagram.handle + ' — Behind the scenes',
    url: ARTIST.social.instagram.url,
    icon: <Instagram className="w-6 h-6" />,
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
  },
  {
    type: 'external',
    title: 'YouTube',
    subtitle: 'Live sets & tutorials',
    url: ARTIST.social.youtube.url,
    icon: <Youtube className="w-6 h-6" />,
    gradient: 'from-red-600 to-red-700',
  },
  {
    type: 'internal',
    title: 'Shop',
    subtitle: 'Exclusive merch & tracks',
    to: '/shop',
    icon: <ShoppingBag className="w-6 h-6" />,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    type: 'external',
    title: 'World Champion Story',
    subtitle: '2× Ilha do Zouk winner',
    url: ARTIST.titles.eventUrl,
    icon: <Trophy className="w-6 h-6" />,
    gradient: 'from-yellow-400 to-yellow-600',
  },
  {
    type: 'external',
    title: 'WhatsApp',
    subtitle: 'Direct booking inquiries',
    url: getWhatsAppUrl(),
    icon: <Phone className="w-6 h-6" />,
    gradient: 'from-green-400 to-green-600',
  },
  {
    type: 'external',
    title: 'Email',
    subtitle: ARTIST.contact.email,
    url: `mailto:${ARTIST.contact.email}`,
    icon: <Mail className="w-6 h-6" />,
    gradient: 'from-blue-500 to-blue-600',
  },
];

const LinkCard = ({ link, index }: { link: LinkItem; index: number }) => {
  const inner = (
    <div
      className={`
        flex items-center gap-4
        ${link.isPrimary ? 'bg-gray-900/90 p-6' : 'bg-gray-900/95 p-5'}
        rounded-2xl backdrop-blur-sm
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
          bg-gradient-to-br ${link.gradient}
        `}
      >
        {link.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-lg mb-0.5 truncate">{link.title}</h3>
        <p className="text-gray-400 text-sm truncate">{link.subtitle}</p>
      </div>

      {/* Arrow */}
      <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  const motionProps = {
    key: link.type === 'external' ? link.url : link.to,
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: index * 0.08, duration: 0.4 },
    whileHover: { scale: 1.03, x: 5 },
    whileTap: { scale: 0.98 },
    className: `
      block relative overflow-hidden rounded-2xl
      ${link.isPrimary ? 'p-[2px]' : 'p-[1px]'}
      bg-gradient-to-r ${link.gradient}
      shadow-lg hover:shadow-2xl transition-shadow duration-300
    `,
  };

  if (link.type === 'internal') {
    return (
      <motion.div {...motionProps}>
        <Link to={link.to}>{inner}</Link>
      </motion.div>
    );
  }

  return (
    <motion.a
      {...motionProps}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {inner}
    </motion.a>
  );
};

export const ZenLinkPage = () => {
  return (
    <>
      <HeadlessSEO
        title="ZenLink — All Links | DJ Zen Eyer"
        description="Connect with DJ Zen Eyer — 2× World Champion Brazilian Zouk DJ. Listen, book, and follow the cremosidade!"
        canonicalUrl={`${ARTIST.site.baseUrl}/zenlink`}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-purple-500/60 shadow-2xl shadow-purple-500/30"
          >
            <img
              src={`${ARTIST.site.baseUrl}/images/zen-eyer-profile.jpg`}
              alt={ARTIST.identity.stageName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`;
              }}
            />
          </motion.div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            {ARTIST.identity.stageName}
          </h1>

          {/* Title */}
          <p className="text-lg text-purple-300 mb-4">
            2× World Champion Brazilian Zouk DJ
          </p>

          {/* Philosophy Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-2 rounded-full border border-purple-500/30"
          >
            <p className="text-sm text-purple-200 italic">
              "{ARTIST.philosophy.slogan}"
            </p>
          </motion.div>
        </motion.div>

        {/* Links */}
        <div className="max-w-2xl mx-auto space-y-4">
          {LINKS.map((link, index) => (
            <LinkCard key={index} link={link} index={index} />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>Made with ❤️ and 🎶 by the Zen Tribe</p>
          <p className="mt-2">
            <a
              href={ARTIST.site.baseUrl}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Visit Full Website →
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
};
