// src/components/common/Footer.tsx - Restored to Original Design (Simplified)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Music, Instagram, Youtube, Music2, MessageCircle, Facebook, SendHorizontal } from 'lucide-react';
import { ARTIST } from '../../data/artistData';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';
import { useSubscriptionMutation } from '../../hooks/useQueries';


const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const currentLang = normalizeLanguage(i18n.language);

  const { mutate: subscribe, isPending: isSubmitting } = useSubscriptionMutation();

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
    <footer className="bg-background pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* 1. Logo, Bio & Social Icons */}
          <div className="lg:col-span-1">
            <Link to={getLocalizedRoute('', currentLang)} className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity" aria-label="Voltar para Home">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <span className="text-xl font-display font-bold tracking-wide">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </Link>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              {t('footer_bio')}
            </p>
            <div className="flex space-x-4">
              <a href={ARTIST.social.instagram.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={22} />
              </a>
              <a href={ARTIST.social.soundcloud.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="SoundCloud">
                <Music2 size={22} />
              </a>
              <a href={ARTIST.social.youtube.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Youtube">
                <Youtube size={22} />
              </a>
              <a href={ARTIST.social.facebook.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={22} />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-white">{t('footer_quick_links')}</h3>
            <ul className="space-y-2.5">
              <li><Link to={getLocalizedRoute('events', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.events')}</Link></li>
              <li><Link to={getLocalizedRoute('music', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.music')}</Link></li>
              <li><Link to={getLocalizedRoute('shop', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.shop')}</Link></li>
              <li><Link to={getLocalizedRoute('zentribe', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.tribe')}</Link></li>
              <li><Link to={getLocalizedRoute('booking', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.booking')}</Link></li>
            </ul>
          </div>

          {/* 3. Discover More */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-white">{t('footer_discover_more')}</h3>
            <ul className="space-y-2.5">
              <li><Link to={getLocalizedRoute('about', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.about')}</Link></li>
              <li><Link to={getLocalizedRoute('news', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('news.label')}</Link></li>
              <li><Link to={getLocalizedRoute('philosophy', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('philosophy.page_title')}</Link></li>
              <li><Link to={getLocalizedRoute('media', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('nav.media')}</Link></li>
              <li><Link to={getLocalizedRoute('faq', currentLang)} className="text-white/70 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to={getLocalizedRoute('conduct', currentLang)} className="text-white/70 hover:text-primary transition-colors">{t('conduct_page.title')}</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-display font-semibold mb-4 text-white">{t('footer_join_newsletter')}</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                id="footer_newsletter_email"
                name="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder={t('footer_email_placeholder')}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
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
              <p className={`mt-3 text-sm ${submitSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {submitMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar - Simplified */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>{t('footer_copyright', { year: currentYear })}</p>

          <div className="flex justify-center gap-4 mt-2 text-xs uppercase tracking-wider">
            <Link to={getLocalizedRoute('privacy', currentLang)} className="hover:text-primary transition-colors">{t('common.footer_privacy')}</Link>
            <span>&bull;</span>
            <Link to={getLocalizedRoute('terms', currentLang)} className="hover:text-primary transition-colors">{t('common.footer_terms')}</Link>
          </div>

          <div className="mt-4 text-xs opacity-30 flex justify-center gap-4">
            <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Wikidata
            </a>
            <a href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              MusicBrainz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

