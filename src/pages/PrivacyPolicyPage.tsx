import React from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';;
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Database,
      title: t('privacy_page.sections.collection.title'),
      content: t('privacy_page.sections.collection.items', { returnObjects: true }) as string[]
    },
    {
      icon: Eye,
      title: t('privacy_page.sections.usage.title'),
      content: t('privacy_page.sections.usage.items', { returnObjects: true }) as string[]
    },
    {
      icon: Lock,
      title: t('privacy_page.sections.security.title'),
      content: t('privacy_page.sections.security.items', { returnObjects: true }) as string[]
    },
    {
      icon: Shield,
      title: t('privacy_page.sections.sharing.title'),
      content: t('privacy_page.sections.sharing.items', { returnObjects: true }) as string[]
    },
    {
      icon: Mail,
      title: t('privacy_page.sections.rights.title'),
      content: t('privacy_page.sections.rights.items', { returnObjects: true }) as string[]
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('privacy_page.seo.title')}</title>
        <meta name="description" content={t('privacy_page.seo.description')} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <Shield size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('privacy_page.title').split(' ')[0]} <span className="text-primary">{t('privacy_page.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-white/70">
              {t('privacy_page.last_updated')}: <span className="text-primary font-semibold">{t('privacy_page.last_updated_date')}</span>
            </p>
          </m.div>

          {/* Introduction */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-8 mb-8"
          >
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              {t('privacy_page.intro_p1')}
            </p>
            <p className="text-white/70 leading-relaxed">
              {t('privacy_page.intro_p2')}
            </p>
          </m.div>

          {/* Sections */}
          {sections.map((section, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card p-8 mb-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <section.icon size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mt-1">{section.title}</h2>
              </div>
              <ul className="space-y-3 ml-16">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-white/70 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </m.div>
          ))}

          {/* Cookies */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('privacy_page.cookies_title')}</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {t('privacy_page.cookies_p1')}
            </p>
            <p className="text-white/70 leading-relaxed">
              {t('privacy_page.cookies_p2')}
            </p>
          </m.div>

          {/* Third-Party Services */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('privacy_page.third_party_title')}</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {t('privacy_page.third_party_p1')}
            </p>
            <div className="space-y-2">
              <p className="text-white/80"><strong>{t('privacy_page.third_party_analytics').split(':')[0]}:</strong>{t('privacy_page.third_party_analytics').split(':')[1]}</p>
              <p className="text-white/80"><strong>{t('privacy_page.third_party_payments').split(':')[0]}:</strong>{t('privacy_page.third_party_payments').split(':')[1]}</p>
              <p className="text-white/80"><strong>{t('privacy_page.third_party_email').split(':')[0]}:</strong>{t('privacy_page.third_party_email').split(':')[1]}</p>
            </div>
          </m.div>

          {/* LGPD Compliance */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="card p-8 mb-6 border-l-4 border-primary"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('privacy_page.lgpd_title')}</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {t('privacy_page.lgpd_p1')}
            </p>
            <ul className="space-y-2 text-white/70">
              {(t('privacy_page.lgpd_items', { returnObjects: true }) as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </m.div>

          {/* Changes to Policy */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('privacy_page.changes_title')}</h2>
            <p className="text-white/70 leading-relaxed">
              {t('privacy_page.changes_p1')}
            </p>
          </m.div>

          {/* Contact */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent"
          >
            <h2 className="text-2xl font-display font-bold mb-4">{t('privacy_page.contact_title')}</h2>
            <p className="text-white/70 mb-6">
              {t('privacy_page.contact_p1')}
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>{t('common.legal_name')}</strong></p>
              <p>{t('privacy_page.contact_name')}</p>
              <p>{t('media_page.cnpj')}: {t('common.cnpj')}</p>
              <p>{t('privacy_page.contact_location')}</p>
              <a
                href="mailto:contact@djzeneyer.com"
                className="text-primary hover:underline inline-block mt-2"
              >
                contact@djzeneyer.com
              </a>
            </div>
          </m.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
