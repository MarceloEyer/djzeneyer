import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';

const ReturnPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadlessSEO
        title={t('return_policy_title', 'Return & Refund Policy')}
        description={t('return_policy_desc', 'Our policy on returns and refunds for products and tickets.')}
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
              {t('return_policy_h1', 'Return & Refund Policy')}
            </h1>

            <div className="p-6 bg-surface border border-white/10 rounded-xl mb-10 text-white/80">
              <p className="lead">
                {t('return_policy_intro', "At DJ Zen Eyer, we want you to be completely satisfied with your purchase. However, we understand that sometimes things don't work out. Please read our policy below regarding returns and refunds.")}
              </p>
            </div>

            <h2>{t('return_policy_digital_title', '1. Digital Products')}</h2>
            <p>
              {t('return_policy_digital_text', 'Due to the nature of digital products (music downloads, sample packs, presets), all sales are final. Once a file has been downloaded, we cannot offer a refund. If you have technical issues with a file, please contact support.')}
            </p>

            <h2>{t('return_policy_tickets_title', '2. Event Tickets')}</h2>
            <p>
              {t('return_policy_tickets_text', 'Tickets for events are generally non-refundable unless the event is cancelled or significantly rescheduled.')}
            </p>
            <ul>
              <li><strong>{t('return_policy_cancellations_label', 'Cancellations:')}</strong> {t('return_policy_cancellations_text', 'If an event is cancelled, you will receive a full refund automatically.')}</li>
              <li><strong>{t('return_policy_transfers_label', 'Transfers:')}</strong> {t('return_policy_transfers_text', 'You may transfer your ticket to another person up to 24 hours before the event starts. Please contact us to process the name change.')}</li>
              <li><strong>{t('return_policy_rescheduling_label', 'Rescheduling:')}</strong> {t('return_policy_rescheduling_text', 'If an event is rescheduled, your ticket will be valid for the new date. If you cannot attend the new date, you may request a refund within 14 days of the announcement.')}</li>
            </ul>

            <h2>{t('return_policy_merch_title', '3. Physical Merchandise')}</h2>
            <p>
              {t('return_policy_merch_text', 'For physical items (t-shirts, hoodies, accessories), we accept returns within 30 days of delivery.')}
            </p>
            <ul>
              <li>{t('return_policy_merch_c1', 'Items must be unworn, unwashed, and in their original condition.')}</li>
              <li>{t('return_policy_merch_c2', 'You are responsible for return shipping costs unless the item arrived damaged or incorrect.')}</li>
              <li>{t('return_policy_merch_c3', 'Refunds are processed to the original payment method within 5-10 business days after we receive the return.')}</li>
            </ul>

            <h2>{t('return_policy_request_title', '4. How to Request a Refund')}</h2>
            <p>
              {t('return_policy_request_text', 'To initiate a return or refund request, please email us at')} <strong>support@djzeneyer.com</strong> {t('return_policy_request_text_2', 'with your order number and details of the issue.')}
            </p>

            <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50">
              <p>{t('return_policy_last_updated', 'Last updated: January 2024')}</p>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicyPage;
