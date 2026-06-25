// src/components/common/Footer.tsx - Restored to Original Design (Simplified)
import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Music, Music2, MessageCircle, SendHorizontal, Heart } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YouTubeIcon } from '../icons/BrandIcons';
import { ARTIST, CURRENT_YEAR } from '../../data/artistData';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';
import { useSubscriptionMutation } from '../../hooks/useQueries';
import { safeUrl } from '../../utils/sanitize';


const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const currentLang = normalizeLanguage(i18n.language);
  const location = useLocation();
  const footerSignatures = [t('footer_signature_cremosidade'), t('footer_signature_terror')];
  const footerSignature = footerSignatures[location.pathname.length % footerSignatures.length];

  const { mutate: subscribe, isPending: isSubmitting } = useSubscriptionMutation();

  // This avoids recalculating static footer hrefs on every render cycle.
  const routes = useMemo(() => ({
    home: getLocalizedRoute('', currentLang),
    support: getLocalizedRoute('support', currentLang),
    events: getLocalizedRoute('events', currentLang),
    music: getLocalizedRoute('music', currentLang),
    shop: getLocalizedRoute('shop', currentLang),
    zentribe: getLocalizedRoute('zentribe', currentLang),
    booking: getLocalizedRoute('booking', currentLang),
    about: getLocalizedRoute('about', currentLang),
    news: getLocalizedRoute('news', currentLang),
    faq: getLocalizedRoute('faq', currentLang),
    encyclopedia: getLocalizedRoute('encyclopedia', currentLang),
    media: getLocalizedRoute('media', currentLang),
    privacy: getLocalizedRoute('privacy', currentLang),
    terms: getLocalizedRoute('terms', currentLang),
  }), [currentLang]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitSuccess(null);

    if (!email) {
      setSubmitMessage(t('auth.errors.invalidEmail'));
      setSubmitSuccess(false);
      return;
    }

    subscribe(email, {
      onSuccess: (data) => {
        setSubmitMessage(data.message || t('footer_subscribe_success'));
        setSubmitSuccess(true);
        setEmail('');
      },
      onError: (err: unknown) => {
        const error = err as Error;
        setSubmitMessage(error.message || t('footer_subscribe_error'));
        setSubmitSuccess(false);
      },
    });
  };

  const whatsappLink = `https://wa.me/${ARTIST.contact.whatsapp.number}`;

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* 1. Logo, Bio & Social Icons */}
          <div className="lg:col-span-1">
            <Link to={routes.home} className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity" aria-label={`DJ Zen Eyer - ${t('footer_home')}`}>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <span className="text-xl font-display font-bold tracking-wide">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </Link>
            <p className="text-text/75 mb-4 text-sm leading-relaxed">
              {t('footer_bio')}
            </p>
            <div className="flex space-x-4">
              <a href={safeUrl(ARTIST.social.instagram.url, '/')} target="_blank" rel="noopener noreferrer" className="text-text/75 hover:text-primary transition-colors" aria-label={t('social.instagram')}>
                <InstagramIcon size={22} />
              </a>
              <a href={safeUrl(ARTIST.social.soundcloud.url, '/')} target="_blank" rel="noopener noreferrer" className="text-text/75 hover:text-primary transition-colors" aria-label={t('social.soundcloud')}>
                <Music2 size={22} />
              </a>
              <a href={safeUrl(ARTIST.social.YouTube.url, '/')} target="_blank" rel="noopener noreferrer" className="text-text/75 hover:text-primary transition-colors" aria-label={t('social.YouTube')}>
                <YouTubeIcon size={22} />
              </a>
              <a href={safeUrl(ARTIST.social.facebook.url, '/')} target="_blank" rel="noopener noreferrer" className="text-text/75 hover:text-primary transition-colors" aria-label={t('social.facebook')}>
                <FacebookIcon size={22} />
              </a>
              <a href={safeUrl(whatsappLink, '/')} target="_blank" rel="noopener noreferrer" className="text-text/75 hover:text-primary transition-colors" aria-label={t('social.whatsapp')}>
                <MessageCircle size={22} />
              </a>
            </div>
            <div className="mt-5">
              <Link to={routes.support} className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold text-sm">
                <Heart size={13} />
                {t('footer_support_artist')}
              </Link>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-text">{t('footer_quick_links')}</h3>
            <ul className="space-y-2.5">
              <li><Link to={routes.events} className="text-text/75 hover:text-primary transition-colors">{t('nav.events')}</Link></li>
              <li><Link to={routes.music} className="text-text/75 hover:text-primary transition-colors">{t('nav.music')}</Link></li>
              <li><Link to={routes.shop} className="text-text/75 hover:text-primary transition-colors">{t('nav.shop')}</Link></li>
              <li><Link to={routes.zentribe} className="text-text/75 hover:text-primary transition-colors">{t('nav.tribe')}</Link></li>
              <li><Link to={routes.booking} className="text-text/75 hover:text-primary transition-colors">{t('nav.booking')}</Link></li>
            </ul>
          </div>

          {/* 3. Discover More */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-text">{t('footer_discover_more')}</h3>
            <ul className="space-y-2.5">
              <li><Link to={routes.about} className="text-text/75 hover:text-primary transition-colors">{t('nav.about')}</Link></li>
              <li><Link to={routes.news} className="text-text/75 hover:text-primary transition-colors">{t('news.label')}</Link></li>
              <li><Link to={routes.faq} className="text-text/75 hover:text-primary transition-colors">{t('nav.faq')}</Link></li>
              <li><Link to={routes.encyclopedia} className="text-text/75 hover:text-primary transition-colors">{t('encyclopedia.nav_label')}</Link></li>
              <li><Link to={routes.media} className="text-text/75 hover:text-primary transition-colors">{t('nav.media')}</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-display font-semibold mb-4 text-text">{t('footer_join_newsletter')}</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                id="footer_newsletter_email"
                name="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder={t('footer_email_placeholder')}
                className="w-full px-4 py-2.5 bg-text/5 border border-border/10 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-text/40"
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
              <button
                type="submit"
                className="w-full btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <SendHorizontal size={16} />
                <span>{isSubmitting ? t('loading') : t('footer_subscribe')}</span>
              </button>
            </form>
            {submitMessage && (
              <p className={`mt-3 text-sm ${submitSuccess ? 'text-success' : 'text-error'}`}>
                {submitMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar - Simplified */}
        <div className="mt-10 pt-8 border-t border-border/10 text-center text-text/75 text-sm">
          <p>{t('footer_copyright', { year: CURRENT_YEAR })} <span className="mx-1">&bull;</span> {footerSignature}</p>

          <div className="flex justify-center gap-4 mt-2 text-xs uppercase tracking-wider">
            <Link to={routes.privacy} className="hover:text-primary transition-colors">{t('common.footer_privacy')}</Link>
            <span>&bull;</span>
            <Link to={routes.terms} className="hover:text-primary transition-colors">{t('common.footer_terms')}</Link>
          </div>

          <div className="mt-4 text-xs flex justify-center gap-4">
            <a href={safeUrl(ARTIST.identifiers.wikidataUrl, '/')} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Wikidata
            </a>
            <a href={safeUrl(ARTIST.identifiers.musicbrainzUrl, '/')} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              MusicBrainz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

