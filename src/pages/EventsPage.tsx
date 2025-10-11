// src/pages/EventsPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Award, TrendingUp, Gift, Clock } from 'lucide-react';

// --- Subcomponente Reutilizável para Achievement Items ---
const AchievementItem: React.FC<{ 
  icon: React.ReactNode; 
  bgColor: string;
  iconColor: string;
  title: string; 
  description: string;
}> = ({ icon, bgColor, iconColor, title, description }) => (
  <div className="flex items-start group transition-all duration-300 hover:bg-white/5 p-2 rounded-lg">
    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  </div>
);

const EventsPage: React.FC = () => {
  const { t } = useTranslation();

  // --- Array de Dados para os Achievement Items ---
  const achievements = [
    { 
      id: 'xp', 
      icon: <TrendingUp size={20} />, 
      bgColor: 'bg-primary/20',
      iconColor: 'text-primary',
      titleKey: 'events_achievement_xp_title', 
      descKey: 'events_achievement_xp_desc' 
    },
    { 
      id: 'badges', 
      icon: <Award size={20} />, 
      bgColor: 'bg-secondary/20',
      iconColor: 'text-secondary',
      titleKey: 'events_achievement_badges_title', 
      descKey: 'events_achievement_badges_desc' 
    },
    { 
      id: 'rewards', 
      icon: <Gift size={20} />, 
      bgColor: 'bg-accent/20',
      iconColor: 'text-accent',
      titleKey: 'events_achievement_rewards_title', 
      descKey: 'events_achievement_rewards_desc' 
    },
    { 
      id: 'streaks', 
      icon: <Clock size={20} />, 
      bgColor: 'bg-success/20',
      iconColor: 'text-success',
      titleKey: 'events_achievement_streaks_title', 
      descKey: 'events_achievement_streaks_desc' 
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('events_page_title')}</title>
        <meta name="description" content={t('events_page_meta_desc')} />
      </Helmet>

      <div className="pt-24 min-h-screen">
        {/* Page Header */}
        <div className="bg-surface py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                {t('events_header_title')}
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                {t('events_header_subtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Calendar Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="rounded-lg overflow-hidden shadow-lg bg-surface p-4">
              <div className="relative pb-[75%] md:pb-[56.25%] h-0">
                <iframe 
                  src="https://calendar.google.com/calendar/embed?src=eyer.marcelo%40gmail.com&ctz=America%2FSao_Paulo" 
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  style={{ border: 0 }}
                  frameBorder="0" 
                  scrolling="no"
                  title={t('events_calendar_iframe_title')}
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement System */}
        <section className="py-16 bg-surface">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                  {t('events_achievement_section_title')}
                </h2>
                <p className="text-lg md:text-xl text-white/70 mb-6">
                  {t('events_achievement_section_subtitle')}
                </p>
                
                <div className="space-y-4 mb-8">
                  {achievements.map(achievement => (
                    <AchievementItem
                      key={achievement.id}
                      icon={achievement.icon}
                      bgColor={achievement.bgColor}
                      iconColor={achievement.iconColor}
                      title={t(achievement.titleKey as any)}
                      description={t(achievement.descKey as any)}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EventsPage;
