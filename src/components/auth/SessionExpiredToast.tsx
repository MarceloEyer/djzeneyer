import React from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from '../common/Toast';
import { useUser } from '../../contexts/UserContext';

// Rendered by MainLayout only after a silent token renewal failed and the
// session was ended (see lib/tokenRefresh.ts). Lazy-loaded on purpose: it,
// and the Toast it pulls in, stay out of the initial JS bundle.
const SessionExpiredToast: React.FC = () => {
  const { t } = useTranslation();
  const { dismissSessionExpired } = useUser();

  return (
    <Toast
      message={t('auth.sessionExpired')}
      isVisible
      variant="warning"
      duration={8000}
      onClose={dismissSessionExpired}
    />
  );
};

export default SessionExpiredToast;
