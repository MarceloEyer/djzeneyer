import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, AlertCircle, Scale, Ban, CheckCircle } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';



const TermsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['translation', 'legal']);
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const canonicalUrl = useMemo(
    () => `https://djzeneyer.com/${getLocalizedRoute('terms', currentLang).replace(/^\//, '')}`,
    [currentLang]
  );

  // ⚡ Bolt: Wrapped static content objects dependent on context with useMemo
  // to prevent unnecessary re-allocations on every render cycle.
  const sections = useMemo(() => [
    {
      icon: CheckCircle,
      title: t('legal.terms_page.acceptance'),
      content: t('legal.terms_page.acceptance_desc')
    },
    {
      icon: Scale,
      title: t('legal.terms_page.license'),
      content: t('legal.terms_page.license_desc')
    },
    {
      icon: AlertCircle,
      title: t('legal.terms_page.disclaimer'),
      content: t('legal.terms_page.disclaimer_desc')
    },
    {
      icon: Ban,
      title: t('legal.terms_page.limitations'),
      content: t('legal.terms_page.limitations_desc')
    }
  ], [t]);

  // ⚡ Bolt: Wrapped static content objects dependent on context with useMemo
  // to prevent unnecessary re-allocations on every render cycle.
  const additionalTerms = useMemo(() => [
    {
      title: t('legal.terms_page.intellectual_property'),
      points: [
        t('legal.terms_page.ip_content'),
        t('legal.terms_page.ip_protected'),
        t('legal.terms_page.ip_unauthorized'),
        t('legal.terms_page.ip_reproduce')
      ]
    },
    {
      title: t('legal.terms_page.user_conduct'),
      points: [
        t('legal.terms_page.conduct_lawful'),
        t('legal.terms_page.conduct_access'),
        t('legal.terms_page.conduct_bots'),
        t('legal.terms_page.conduct_malware'),
        t('legal.terms_page.conduct_respect')
      ]
    },
    {
      title: t('legal.terms_page.purchases'),
      points: [
        t('legal.terms_page.purchases_availability'),
        t('legal.terms_page.purchases_prices'),
        t('legal.terms_page.purchases_cancel'),
        t('legal.terms_page.purchases_processing'),
        t('legal.terms_page.purchases_refunds')
      ]
    },
    {
      title: t('legal.terms_page.accounts'),
      points: [
        t('legal.terms_page.accounts_confidential'),
        t('legal.terms_page.accounts_responsibility'),
        t('legal.terms_page.accounts_accurate'),
        t('legal.terms_page.accounts_suspend'),
        t('legal.terms_page.accounts_notify')
      ]
    },
    {
      title: t('legal.terms_page.third_party_links'),
      points: [
        t('legal.terms_page.links_contain'),
        t('legal.terms_page.links_no_control'),
        t('legal.terms_page.links_no_endorsement'),
        t('legal.terms_page.links_risk'),
        t('legal.terms_page.links_review')
      ]
    }
  ], [t]);

  return (
    <>
      <HeadlessSEO
        title={`${t('legal.terms_page.title')} | ${t('common.artist_name')}`}
        description={t('legal.terms_page.subtitle')}
        url={canonicalUrl}
      />

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 motion-safe:animate-fade-up">
            <div className="icon-chip-mediterranean mb-6 h-20 w-20 rounded-full">
              <FileText size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('legal.terms_page.title').split(' ')[0]} <span className="text-primary">{t('legal.terms_page.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-text/70">
              {t('legal.terms_page.last_updated')}: <span className="text-primary font-semibold">{t('legal.terms_page.last_updated_date')}</span>
            </p>
          </div>

          {/* Introduction */}
          <div className="card p-8 mb-8 border-l-4 border-primary motion-safe:animate-fade-up">
            <p className="text-lg text-text/80 leading-relaxed mb-4">
              {t('legal.terms_page.introduction')}
            </p>
            <p className="text-text/70 leading-relaxed">
              {t('legal.terms_page.introduction_agreement')}
            </p>
          </div>

          {/* Main Sections */}
          {sections.map((section, index) => (
            <div key={index} className="card p-8 mb-6 motion-safe:animate-fade-up">
              <div className="flex items-start gap-4 mb-4">
                <div className="icon-chip-mediterranean h-12 w-12 flex-shrink-0 rounded-lg">
                  <section.icon size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold mt-1">{`${index + 1}. ${section.title}`}</h2>
              </div>
              <p className="text-text/70 leading-relaxed ml-16">{section.content}</p>
            </div>
          ))}

          {/* Additional Terms */}
          {additionalTerms.map((term, index) => (
            <div key={index} className="card p-8 mb-6 motion-safe:animate-fade-up">
              <h2 className="text-2xl font-display font-bold mb-4">{`${index + 5}. ${term.title}`}</h2>
              <ul className="space-y-3">
                {term.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-text/70 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Governing Law */}
          <div className="card p-8 mb-6 motion-safe:animate-fade-up">
            <h2 className="text-2xl font-display font-bold mb-4">10. {t('legal.terms_page.governing_law')}</h2>
            <p className="text-text/70 leading-relaxed mb-4">
              {t('legal.terms_page.law_brazil')}
            </p>
            <p className="text-text/70 leading-relaxed">
              {t('legal.terms_page.law_consent')}
            </p>
          </div>

          {/* Modifications */}
          <div className="card p-8 mb-6 motion-safe:animate-fade-up">
            <h2 className="text-2xl font-display font-bold mb-4">11. {t('legal.terms_page.modifications')}</h2>
            <p className="text-text/70 leading-relaxed">
              {t('legal.terms_page.modifications_desc')}
            </p>
          </div>

          {/* Contact */}
          <div className="card bg-gradient-to-br from-[#F3EBDD]/45 to-transparent p-8 text-center motion-safe:animate-fade-up">
            <h2 className="text-2xl font-display font-bold mb-4">{t('legal.terms_page.questions')}</h2>
            <p className="text-text/70 mb-6">
              {t('legal.terms_page.questions_desc')}
            </p>
            <div className="space-y-2 text-text/80">
              <p><strong>{t('common.artist_name')}</strong></p>
              <p>{t('legal.terms_page.contact_company')}</p>
              <p>{t('media_page.cnpj')}: {t('common.cnpj')}</p>
              <p>{t('legal.terms_page.contact_location')}</p>
              <a
                href="mailto:contact@djzeneyer.com"
                className="text-primary hover:underline inline-block mt-2"
              >
                contact@djzeneyer.com
              </a>
            </div>
          </div>

          {/* Acceptance */}
          <div className="text-center text-text/50 text-sm mt-8 motion-safe:animate-fade-up">
            <p>{t('legal.terms_page.acceptance_footer')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(TermsPage);
