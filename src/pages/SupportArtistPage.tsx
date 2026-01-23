import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, Share2, ShoppingBag, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
} as const;

const SupportArtistPage: React.FC = () => {
  const { t } = useTranslation();

  const supportOptions = [
    {
      icon: <ShoppingBag size={32} />,
      title: t('support_merch_title', 'Merch Store'),
      desc: t('support_merch_desc', 'Buy exclusive t-shirts, hoodies and accessories. Wear the vibe.'),
      action: t('support_merch_action', 'Visit Shop'),
      link: '/shop',
      color: 'text-primary'
    },
    {
      icon: <Calendar size={32} />,
      title: t('support_booking_title', 'Book a Gig'),
      desc: t('support_booking_desc', 'Want the Zen Experience at your event? Let\'s make it happen.'),
      action: t('support_booking_action', 'Book Now'),
      link: '/work-with-me',
      color: 'text-yellow-500'
    },
    {
      icon: <Share2 size={32} />,
      title: t('support_share_title', 'Share the Music'),
      desc: t('support_share_desc', 'The biggest help is free. Share my tracks and sets with your friends.'),
      action: t('support_share_action', 'Press Kit'),
      link: '/work-with-me', // Using press kit page for sharing assets
      color: 'text-blue-400'
    },
    {
      icon: <Music size={32} />,
      title: t('support_spotify_title', 'Stream on Spotify'),
      desc: t('support_spotify_desc', 'Follow and listen on Spotify. Every stream counts.'),
      action: t('support_spotify_action', 'Listen'),
      link: ARTIST.social.spotify.url,
      color: 'text-green-500'
    }
  ];

  return (
    <>
      <HeadlessSEO
        title={t('support_title', 'Support the Artist')}
        description={t('support_desc', 'Ways to support DJ Zen Eyer and his music.')}
        isHomepage={false}
      />

      <div className="min-h-screen pt-24 pb-20 bg-background text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex p-4 bg-primary/10 rounded-full text-primary mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Music size={48} />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              {t('support_hero_title', 'Support the Art')}
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              {t('support_hero_text', 'Independent artists rely on community support. Your contribution allows me to continue producing high-quality music and events without compromise.')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {supportOptions.map((option, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-surface p-8 rounded-xl border border-white/10 flex flex-col items-center text-center hover:bg-white/5 transition-colors"
              >
                <div className={`mb-4 ${option.color} bg-white/5 p-4 rounded-full`}>
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{option.title}</h3>
                <p className="text-white/60 mb-8 flex-grow">{option.desc}</p>

                {option.link.startsWith('/') ? (
                  <Link to={option.link} className="btn btn-outline w-full max-w-[200px]">
                    {option.action}
                  </Link>
                ) : (
                  <a href={option.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full max-w-[200px]">
                    {option.action}
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 p-8 md:p-12 bg-gradient-to-r from-primary/20 to-purple-900/20 rounded-2xl border border-primary/20 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 font-display">{t('support_tribe_title', 'Join the Zen Tribe')}</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {t('support_tribe_desc', 'Become a VIP member to get exclusive access to unreleased tracks, early bird tickets, and behind-the-scenes content.')}
            </p>
            <Link to="/zentribe" className="btn btn-primary btn-lg">
              {t('support_tribe_action', 'Join Now')}
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SupportArtistPage;
