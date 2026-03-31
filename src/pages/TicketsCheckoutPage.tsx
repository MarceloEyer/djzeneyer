import React from 'react';
import CheckoutPage from './CheckoutPage';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useTranslation } from 'react-i18next';

const TicketsCheckoutPage: React.FC = () => {
  const { t } = useTranslation();

  // We reuse the main checkout logic but override the SEO title
  return (
    <>
      <HeadlessSEO
        title={t('common.checkout.tickets_title')}
        description={t('common.checkout.description')}
        noindex
        isHomepage={false}
      />
      {/*
        Reusing the CheckoutPage component.
        In a real app, we might pass a prop like `type="ticket"` to hide shipping fields.
      */}
      <CheckoutPage />
    </>
  );
};

export default React.memo(TicketsCheckoutPage);
