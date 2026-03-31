import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, AlertTriangle, Ban, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const CodeOfConductPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const lastUpdated = t('conduct_page.last_updated_date');
  const canonicalUrl = useMemo(
    () => `https://djzeneyer.com/${getLocalizedRoute('conduct', currentLang).replace(/^\//, '')}`,
    [currentLang]
  );

  const principles = [
    {
      icon: Heart,
      title: t('conduct_page.respect_title'),
      description: t('conduct_page.respect_desc'),
      examples: [
        t('conduct_page.respect_inclusive'),
        t('conduct_page.respect_viewpoints'),
        t('conduct_page.respect_welcome'),
        t('conduct_page.respect_celebrate'),
      ]
    },
    {
      icon: Users,
      title: t('conduct_page.community_title'),
      description: t('conduct_page.community_desc'),
      examples: [
        t('conduct_page.community_support'),
        t('conduct_page.community_share'),
        t('conduct_page.community_contribute'),
        t('conduct_page.community_maintain'),
      ]
    },
    {
      icon: Shield,
      title: t('conduct_page.safety_title'),
      description: t('conduct_page.safety_desc'),
      examples: [
        t('conduct_page.safety_ask'),
        t('conduct_page.safety_boundaries'),
        t('conduct_page.safety_speak'),
        t('conduct_page.safety_report'),
      ]
    }
  ];

  const prohibitedBehavior = [
    {
      title: t('conduct_page.harassment_title'),
      items: [
        t('conduct_page.harassment_1'),
        t('conduct_page.harassment_2'),
        t('conduct_page.harassment_3'),
        t('conduct_page.harassment_4'),
      ]
    },
    {
      title: t('conduct_page.disruptive_title'),
      items: [
        t('conduct_page.disruptive_1'),
        t('conduct_page.disruptive_2'),
        t('conduct_page.disruptive_3'),
        t('conduct_page.disruptive_4'),
      ]
    },
    {
      title: t('conduct_page.privacy_title'),
      items: [
        t('conduct_page.privacy_1'),
        t('conduct_page.privacy_2'),
        t('conduct_page.privacy_3'),
        t('conduct_page.privacy_4'),
      ]
    }
  ];

  const consequences = [
    {
      level: t('conduct_page.consequence_first'),
      action: t('conduct_page.consequence_first_action'),
      description: t('conduct_page.consequence_first_desc'),
    },
    {
      level: t('conduct_page.consequence_repeated'),
      action: t('conduct_page.consequence_repeated_action'),
      description: t('conduct_page.consequence_repeated_desc'),
    },
    {
      level: t('conduct_page.consequence_severe'),
      action: t('conduct_page.consequence_severe_action'),
      description: t('conduct_page.consequence_severe_desc'),
    }
  ];

  return (
    <>
      <HeadlessSEO
        title={`${t('conduct_page.title')} | ${t('common.artist_name')}`}
        description={t('conduct_page.subtitle')}
        url={canonicalUrl}
      />

      <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
        {/* Background Decorations - Premium Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-[15%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[25%] right-[-5%] w-[35%] h-[35%] bg-secondary/10 blur-[110px] rounded-full" />
          <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[25%] bg-primary/5 blur-[90px] rounded-full" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <Heart size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6 text-white leading-tight">
              Código de <span className="text-primary">Conduta</span>
            </h1>
            <p className="text-white/70">
              {t('conduct_page.last_updated')}: <span className="text-primary font-semibold">{lastUpdated}</span>
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-8 mb-8 border-l-4 border-primary"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('conduct_page.commitment')}</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              {t('conduct_page.commitment_intro')}
            </p>
            <p className="text-white/70 leading-relaxed">
              {t('conduct_page.commitment_participation')}
            </p>
          </motion.div>

          {/* Core Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-8 text-center">{t('conduct_page.principles')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <principle.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{principle.description}</p>
                  <div className="text-left space-y-2">
                    {principle.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Prohibited Behavior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Ban size={24} className="text-red-400" />
              </div>
              <h2 className="text-3xl font-display font-bold">{t('conduct_page.prohibited')}</h2>
            </div>
            <p className="text-white/70 mb-6">
              {t('conduct_page.prohibited_intro')}
            </p>
            <div className="space-y-6">
              {prohibitedBehavior.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="card p-6 border-l-4 border-red-500/50"
                >
                  <h3 className="text-xl font-bold mb-4 text-red-400">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <span className="text-red-400 mt-1">×</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reporting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="card p-8 mb-8 bg-gradient-to-br from-primary/10 to-transparent"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold">{t('conduct_page.reporting')}</h2>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              {t('conduct_page.reporting_intro')}
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white mb-2">{t('conduct_page.reporting_how')}</h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('conduct_page.reporting_events')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('conduct_page.reporting_online')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('conduct_page.reporting_email')} <a href="mailto:conduct@djzeneyer.com" className="text-primary hover:underline">conduct@djzeneyer.com</a></span>
                  </li>
                </ul>
              </div>
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-bold text-white mb-2">{t('conduct_page.reporting_after')}</h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    <span>{t('conduct_page.reporting_acknowledge')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    <span>{t('conduct_page.reporting_investigate')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    <span>{t('conduct_page.reporting_action')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">4.</span>
                    <span>{t('conduct_page.reporting_followup')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Consequences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-display font-bold mb-6">{t('conduct_page.enforcement')}</h2>
            <p className="text-white/70 mb-6">
              {t('conduct_page.enforcement_intro')}
            </p>
            <div className="space-y-4">
              {consequences.map((consequence, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="card p-6 flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{consequence.level}</h3>
                    <p className="text-primary font-semibold mb-2">{consequence.action}</p>
                    <p className="text-white/70 text-sm">{consequence.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scope */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="card p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('conduct_page.scope')}</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {t('conduct_page.scope_intro')}
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('conduct_page.scope_events')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('conduct_page.scope_online')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('conduct_page.scope_website')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('conduct_page.scope_workshops')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{t('conduct_page.scope_representing')}</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="card p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Mail size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">{t('conduct_page.contact')}</h2>
            <p className="text-white/70 mb-6">
              {t('conduct_page.contact_intro')}
            </p>
            <a
              href="mailto:conduct@djzeneyer.com"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <Mail size={20} />
              {t('conduct_page.contact_button')}
            </a>
          </motion.div>

          {/* Acknowledgment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="text-center text-white/50 text-sm mt-8 space-y-2"
          >
            <p>{t('conduct_page.acknowledgment')}</p>
            <p className="pt-4 text-white/70">{t('conduct_page.together')} 💙</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default React.memo(CodeOfConductPage);
