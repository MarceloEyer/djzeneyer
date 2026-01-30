import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Instagram, Music, Globe, Mail, Youtube, Facebook, Play } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { Helmet } from 'react-helmet-async';

// Extended Links Data
const LINKS = [
  {
    id: 'spotify',
    label: 'Listen on Spotify',
    sublabel: 'Latest Releases & Playlists',
    url: ARTIST.social.spotify.url,
    icon: <Music size={24} />,
    color: 'bg-green-600 hover:bg-green-500',
    textColor: 'text-white'
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud Sets',
    sublabel: 'Full DJ Sets & Remixes',
    url: ARTIST.social.soundcloud.url,
    icon: <Play size={24} />,
    color: 'bg-orange-600 hover:bg-orange-500',
    textColor: 'text-white'
  },
  {
    id: 'insta',
    label: 'Instagram',
    sublabel: 'Follow the journey',
    url: ARTIST.social.instagram.url,
    icon: <Instagram size={24} />,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400',
    textColor: 'text-white'
  },
  {
    id: 'youtube',
    label: 'YouTube Channel',
    sublabel: 'Vlogs & Performances',
    url: ARTIST.social.youtube.url,
    icon: <Youtube size={24} />,
    color: 'bg-red-600 hover:bg-red-500',
    textColor: 'text-white'
  },
  {
    id: 'website',
    label: 'Official Website',
    sublabel: 'Tour Dates & Merch',
    url: ARTIST.site.baseUrl,
    icon: <Globe size={24} />,
    color: 'bg-blue-600 hover:bg-blue-500',
    textColor: 'text-white'
  },
  {
    id: 'booking',
    label: 'Bookings & Contact',
    sublabel: 'Hire for your event',
    url: `mailto:${ARTIST.contact.email}`,
    icon: <Mail size={24} />,
    color: 'bg-gray-700 hover:bg-gray-600',
    textColor: 'text-white'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ZenLinkPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Links | {ARTIST.identity.stageName}</title>
        <meta name="description" content={`Connect with ${ARTIST.identity.stageName}. Listen to music, book for events, and follow on social media.`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Particle Effect (CSS only for performance) */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 w-full max-w-md flex flex-col items-center"
        >
          {/* Profile Section */}
          <motion.div variants={itemVariants} className="mb-6 text-center">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-[3px] shadow-2xl shadow-purple-500/20">
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden relative">
                 <img
                   src="/images/zen-eyer-og-image.png"
                   alt={ARTIST.identity.stageName}
                   className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                 />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1 tracking-tight">{ARTIST.identity.stageName}</h1>
            <p className="text-white/60 text-sm font-medium">{ARTIST.philosophy.slogan}</p>
            <p className="text-purple-400 text-xs mt-1 uppercase tracking-widest">{ARTIST.titles.primary.split('(')[0]}</p>
          </motion.div>

          {/* Links List */}
          <div className="w-full space-y-3">
            {LINKS.map((link) => (
              <motion.a
                key={link.id}
                variants={itemVariants}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : "_blank"}
                rel={link.url.startsWith('mailto') ? undefined : "noopener noreferrer"}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center w-full p-4 rounded-xl shadow-lg transition-all duration-200 ${link.color} ${link.textColor} group relative overflow-hidden border border-white/5`}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className="mr-4 p-2 bg-black/20 rounded-full backdrop-blur-sm">
                  {link.icon}
                </div>
                <div className="flex-grow text-left">
                  <span className="block font-bold text-base leading-tight">{link.label}</span>
                  {link.sublabel && <span className="block text-xs opacity-80 mt-0.5">{link.sublabel}</span>}
                </div>
                <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-12 text-center text-white/30 text-xs">
            <p>© {new Date().getFullYear()} {ARTIST.identity.stageName}</p>
            <div className="flex justify-center gap-4 mt-2">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ZenLinkPage;
