import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Home, Music, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <div className="inline-block p-6 rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M9.1 4c-.5 0-.4.5-.4.5 0 .3.4.5.4.5l13.4 8c.4.3.6.8.3 1.1-.1.2-.3.3-.3.3l-13.1 8s-.7.5-1.2.2c-.5-.3-.5-.8-.5-.8V5.3s-.4-1.3.9-1.3h.5Z"></path>
                <path d="M6.1 4c-.5 0-.4.5-.4.5 0 .3.4.5.4.5l13.4 8c.4.3.6.8.3 1.1-.1.2-.3.3-.3.3l-13.1 8s-.7.5-1.2.2c-.5-.3-.5-.8-.5-.8V5.3s-.4-1.3.9-1.3h.5Z" opacity=".5"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
            {t('not_found.title')}
          </h2>
          <p className="text-xl text-white/70 mb-8">
            {t('not_found.text')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link
              to={getLocalizedRoute('', currentLang)}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Home className="text-primary mb-2" size={24} />
                <span>{t('not_found.home')}</span>
              </div>
            </Link>

            <Link
              to={getLocalizedRoute('music', currentLang)}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Music className="text-secondary mb-2" size={24} />
                <span>{t('not_found.music')}</span>
              </div>
            </Link>

            <Link
              to={getLocalizedRoute('events', currentLang)}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Calendar className="text-accent mb-2" size={24} />
                <span>{t('not_found.events')}</span>
              </div>
            </Link>

            <Link
              to={getLocalizedRoute('zentribe', currentLang)}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Users className="text-success mb-2" size={24} />
                <span>{t('not_found.tribe')}</span>
              </div>
            </Link>
          </div>

          <Link to={getLocalizedRoute('', currentLang)} className="btn btn-primary px-8 py-3">
            {t('not_found.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;