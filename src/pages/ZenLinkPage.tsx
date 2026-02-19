// src/pages/ZenLinkPage.tsx
import { motion } from 'framer-motion';
import { Music, Instagram, Youtube, Calendar, ShoppingBag, Trophy, Mail, Phone } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST, getWhatsAppUrl } from '../data/artistData';

interface LinkItem {
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
  gradient: string;
  isPrimary?: boolean;
}

const LINKS: LinkItem[] = [
  {
    title: 'Listen on Spotify',
    subtitle: 'My latest tracks & remixes',
    url: ARTIST.social.spotify.url,
    icon: <Music className="w-6 h-6" />,
    gradient: 'from-green-500 to-green-600',
    isPrimary: true,
  },
  {
    title: 'Book Me',
    subtitle: 'Festivals, congresses & private events',
    url: `${ARTIST.site.baseUrl}/work-with-me`,
    icon: <Calendar className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500',
    isPrimary: true,
  },
  {
    title: 'Instagram',
    subtitle: '@djzeneyer - Behind the scenes',
    url: ARTIST.social.instagram.url,
    icon: <Instagram className="w-6 h-6" />,
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
  },
  {
    title: 'YouTube',
    subtitle: 'Live sets & tutorials',
    url: ARTIST.social.youtube.url,
    icon: <Youtube className="w-6 h-6" />,
    gradient: 'from-red-600 to-red-700',
  },
  {
    title: 'Shop',
    subtitle: 'Exclusive merch & tracks',
    url: `${ARTIST.site.baseUrl}/shop`,
    icon: <ShoppingBag className="w-6 h-6" />,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'World Champion Story',
    subtitle: '2× Ilha do Zouk winner',
    url: ARTIST.titles.eventUrl,
    icon: <Trophy className="w-6 h-6" />,
    gradient: 'from-yellow-400 to-yellow-600',
  },
  {
    title: 'WhatsApp',
    subtitle: 'Direct booking inquiries',
    url: getWhatsAppUrl(),
    icon: <Phone className="w-6 h-6" />,
    gradient: 'from-green-400 to-green-600',
  },
  {
    title: 'Email',
    subtitle: 'booking@djzeneyer.com',
    url: `mailto:${ARTIST.contact.email}`,
    icon: <Mail className="w-6 h-6" />,
    gradient: 'from-blue-500 to-blue-600',
  },
];

export const ZenLinkPage = () => {
  return (
    <>
      <HeadlessSEO
        title="ZenLink - All Links | DJ Zen Eyer"
        description="Connect with DJ Zen Eyer - 2× World Champion Brazilian Zouk DJ. Listen, book, and follow the cremosidade!"
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
            className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gradient shadow-2xl"
            style={{
              borderImage: 'linear-gradient(135deg, #8B5CF6, #EC4899) 1',
            }}
          >
            <img
              src={`${ARTIST.site.baseUrl}/images/zen-eyer-profile.jpg`}
              alt={ARTIST.identity.stageName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default image if profile pic doesn't exist
                e.currentTarget.src = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.png`;
              }}
            />
          </motion.div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            {ARTIST.identity.stageName}
          </h1>

          {/* Title */}
          <p className="text-lg text-purple-300 mb-3">
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

        {/* Links Grid */}
        <div className="max-w-2xl mx-auto space-y-4">
          {LINKS.map((link, index) => (
            <motion.a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                block relative overflow-hidden rounded-2xl 
                ${link.isPrimary ? 'p-[2px]' : 'p-[1px]'}
                bg-gradient-to-r ${link.gradient}
                shadow-lg hover:shadow-2xl transition-all duration-300
              `}
            >
              {/* Inner content */}
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
                  <h3 className="text-white font-semibold text-lg mb-0.5 truncate">
                    {link.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">{link.subtitle}</p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-6 h-6 text-gray-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.a>
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
