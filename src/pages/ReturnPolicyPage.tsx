import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';

const ReturnPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadlessSEO
        title={t('legal.return_policy.page_title')}
        description={t('legal.return_policy.page_meta_desc')}
        isHomepage={false}
      />

      <div className="min-h-screen pt-24 pb-20 bg-background text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <h1 className="font-display text-4xl md:text-5xl mb-8">
              {t('legal.return_policy.h1')}
            </h1>

            <div className="p-6 bg-surface border border-white/10 rounded-xl mb-10 text-white/80">
              <p className="lead">
                {t('legal.return_policy.intro')}
              </p>
            </div>

            <h2>{t('legal.return_policy.digital_title')}</h2>
            <p>
              {t('legal.return_policy.digital_text')}
            </p>

            <h2>{t('legal.return_policy.tickets_title')}</h2>
            <p>
              {t('legal.return_policy.tickets_text')}
            </p>
            <ul>
              <li><strong>{t('legal.return_policy.cancellations_label')}</strong> {t('legal.return_policy.cancellations_text')}</li>
              <li><strong>{t('legal.return_policy.transfers_label')}</strong> {t('legal.return_policy.transfers_text')}</li>
              <li><strong>{t('legal.return_policy.rescheduling_label')}</strong> {t('legal.return_policy.rescheduling_text')}</li>
            </ul>

            <h2>{t('legal.return_policy.merch_title')}</h2>
            <p>
              {t('legal.return_policy.merch_text')}
            </p>
            <ul>
              <li>{t('legal.return_policy.merch_c1')}</li>
              <li>{t('legal.return_policy.merch_c2')}</li>
              <li>{t('legal.return_policy.merch_c3')}</li>
            </ul>

            <h2>{t('legal.return_policy.request_title')}</h2>
            <p>
              {t('legal.return_policy.request_text')} <strong>{ARTIST.contact.email}</strong> {t('legal.return_policy.request_text_2')}
            </p>

            <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50">
              <p>{t('legal.return_policy.last_updated')}: <span className="text-primary font-semibold">{t('legal.return_policy.last_updated_date')}</span></p>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicyPage;
