import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Music, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const NotFoundPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const homeRoute = getLocalizedRoute('', currentLang);
  const musicRoute = getLocalizedRoute('music', currentLang);
  const eventsRoute = getLocalizedRoute('events', currentLang);
  const zenTribeRoute = getLocalizedRoute('zentribe', currentLang);

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
            Beat Not Found
          </h2>
          <p className="text-xl text-white/70 mb-8">
            The track you're looking for seems to have been remixed or moved to another frequency.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link 
              to={homeRoute}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Home className="text-primary mb-2" size={24} />
                <span>Home</span>
              </div>
            </Link>
            
            <Link
              to={musicRoute}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Music className="text-secondary mb-2" size={24} />
                <span>Music</span>
              </div>
            </Link>

            <Link
              to={eventsRoute}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Calendar className="text-accent mb-2" size={24} />
                <span>Events</span>
              </div>
            </Link>

            <Link
              to={zenTribeRoute}
              className="card p-4 text-center hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Users className="text-success mb-2" size={24} />
                <span>Zen Tribe</span>
              </div>
            </Link>
          </div>
          
          <Link to={homeRoute} className="btn btn-primary px-8 py-3">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
