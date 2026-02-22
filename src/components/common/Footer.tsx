// src/components/common/Footer.tsx - i18n Route Fix
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Music, Instagram, Youtube, Music2, MessageCircle, Send } from 'lucide-react';
import { ARTIST, getWhatsAppUrl } from '../../data/artistData';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

const FacebookIcon: React.FC<{ size?: number, className?: string }> = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const whatsappLink = getWhatsAppUrl('Hello DJ Zen Eyer!');
  const currentLang = normalizeLanguage(i18n.language);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitSuccess(null);

    if (!email) {
      setSubmitMessage(t('auth.errors.invalidEmail'));
      setSubmitSuccess(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message || t('footer_subscribe_success'));
        setSubmitSuccess(true);
        setEmail('');
      } else {
        const errorMessage = data.message || t('footer_subscribe_error');
        setSubmitMessage(errorMessage);
        setSubmitSuccess(false);
      }
    } catch (err: any) {
      setSubmitMessage(err.message || t('footer_subscribe_error'));
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-12">

          {/* 1. Brand Logo */}
          <Link
            to={getLocalizedRoute('', currentLang)}
            className="flex flex-col items-center group"
          >
            <div className="h-16 w-16 mb-6 flex items-center justify-center rounded-full bg-primary/5 border border-primary/10 group-hover:border-primary/30 transition-all duration-500">
              <Music size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-display font-black tracking-tighter uppercase italic">
              <span className="text-primary italic">DJ</span> Zen Eyer
            </h2>
          </Link>

          {/* 2. Standard Artist Navigation */}
          <nav>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-widest text-white/50">
              <li><Link to={getLocalizedRoute('music', currentLang)} className="hover:text-primary transition-colors">{t('footer_music')}</Link></li>
              <li><Link to={getLocalizedRoute('events', currentLang)} className="hover:text-primary transition-colors">{t('footer_events')}</Link></li>
              <li><Link to={getLocalizedRoute('work-with-me', currentLang)} className="hover:text-primary transition-colors">{t('footer_work_with_me', 'Booking')}</Link></li>
              <li><Link to={getLocalizedRoute('shop', currentLang)} className="hover:text-primary transition-colors">{t('footer_shop', 'Shop')}</Link></li>
              <li><Link to={getLocalizedRoute('media', currentLang)} className="hover:text-primary transition-colors">{t('footer_media', 'Press')}</Link></li>
            </ul>
          </nav>

          {/* 3. Social Media - Premium Style */}
          <div className="flex items-center gap-8">
            <a href={ARTIST.social.instagram.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href={ARTIST.social.soundcloud.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110" aria-label="SoundCloud">
              <Music2 size={24} />
            </a>
            <a href={ARTIST.social.youtube.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110" aria-label="Youtube">
              <Youtube size={24} />
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all transform hover:scale-110" aria-label="WhatsApp">
              <MessageCircle size={24} />
            </a>
          </div>

          {/* 4. Minimal Legal & Copyright */}
          <div className="pt-12 w-full border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/20">
            <div className="flex items-center gap-4">
              <p>{t('footer_copyright', { year: currentYear })}</p>
              <span className="hidden md:block opacity-30">•</span>
              <p className="hidden md:block italic tracking-widest opacity-40">{t('footer_tagline')}</p>
            </div>

            <div className="flex items-center gap-6">
              <Link to={getLocalizedRoute('privacy-policy', currentLang)} className="hover:text-white transition-colors">{t('footer_privacy_policy')}</Link>
              <Link to={getLocalizedRoute('terms', currentLang)} className="hover:text-white transition-colors">{t('footer_terms_of_use')}</Link>
              <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Authority (Q136551855)
              </a>
            </div>
          </div>

          {/* Extremely Discrete Legal Info (Only for Compliance/SEO) */}
          <div className="text-[9px] text-white/10 flex flex-wrap justify-center gap-x-4 gap-y-1 max-w-2xl px-4 font-mono uppercase">
            <span>{t('footer_legal_name')}</span>
            <span>CNPJ: 44.063.765/0001-46</span>
            <span>ISNI: 0000000528931015</span>
            <span>{t('footer_location')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
